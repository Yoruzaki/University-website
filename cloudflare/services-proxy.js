const ORIGIN_HOST = "services-origin.auresnix.com";
const ORIGIN_IP = "41.111.224.82";
const EDX_FRONTENDS = ["authn", "catalog", "learning", "account", "profile", "authoring", "discussions", "admin-console", "communications", "gradebook", "ora-grading", "learner-dashboard", "preferences"];

function replaceAddress(text, from, to) {
  text = text.replaceAll(from.replaceAll("/", "\\/"), to.replaceAll("/", "\\/"));
  for (let depth = 0; depth <= 2; depth++) {
    text = text.replaceAll(from, to);
    from = encodeURIComponent(from);
    to = encodeURIComponent(to);
  }
  return text;
}
const SERVICES = {
  "elearning.auresnix.com": 5002,
  "dspace.auresnix.com": 5004,
  "edx.auresnix.com": 5006,
};

export default {
  async fetch(request) {
    const publicUrl = new URL(request.url);
    const edx = publicUrl.hostname === "edx.auresnix.com";
    const studio = edx && /^\/studio(?:\/|$)/.test(publicUrl.pathname);
    const microfrontend = edx && EDX_FRONTENDS.some(prefix => publicUrl.pathname === "/" + prefix || publicUrl.pathname.startsWith("/" + prefix + "/"));
    const port = studio ? 5007 : microfrontend ? 5008 : SERVICES[publicUrl.hostname];
    if (!port) return new Response("Unknown service.", { status: 404 });
    if (studio && publicUrl.pathname === "/studio") {
      return Response.redirect(publicUrl.origin + "/studio/" + publicUrl.search, 302);
    }

    const publicOrigin = "https://" + publicUrl.hostname;
    const legacyOrigin = "http://" + ORIGIN_IP + ":" + port;
    const upstreamUrl = new URL("http://" + ORIGIN_HOST + ":" + port);
    upstreamUrl.pathname = studio ? publicUrl.pathname.slice("/studio".length) || "/" : publicUrl.pathname;
    upstreamUrl.search = publicUrl.search;
    // Keep registered OAuth callbacks unchanged at the origin, including nested
    // return addresses. Responses are translated back to the public domain.
    if (edx) {
      let query = upstreamUrl.search;
      query = replaceAddress(query, publicOrigin + "/studio", "http://" + ORIGIN_IP + ":5007");
      for (const prefix of EDX_FRONTENDS) {
        query = replaceAddress(query, publicOrigin + "/" + prefix, "http://" + ORIGIN_IP + ":5008/" + prefix);
      }
      upstreamUrl.search = replaceAddress(query, publicOrigin, "http://" + ORIGIN_IP + ":5006");
    }
    const upstreamRequest = new Request(upstreamUrl, request);
    upstreamRequest.headers.set("Host", ORIGIN_IP + ":" + port);
    upstreamRequest.headers.set("X-Forwarded-Host", ORIGIN_IP + ":" + port);
    upstreamRequest.headers.set("X-Forwarded-Proto", "http");
    upstreamRequest.headers.delete("Forwarded");
    if (upstreamRequest.headers.get("Origin") === publicUrl.origin) {
      upstreamRequest.headers.set("Origin", legacyOrigin);
    }
    const referer = upstreamRequest.headers.get("Referer");
    if (referer?.startsWith(publicUrl.origin + "/")) {
      upstreamRequest.headers.set("Referer", studio ? referer.replace(publicUrl.origin + "/studio", legacyOrigin) : referer.replace(publicUrl.origin, legacyOrigin));
    }

    let upstream;
    try {
      upstream = await fetch(upstreamRequest, { redirect: "manual" });
    } catch {
      return new Response("The service could not be reached.", { status: 502 });
    }

    function rewrite(text) {
      if (edx) {
        if (!text.includes(ORIGIN_IP) && !text.includes(ORIGIN_HOST)) {
          return text.replaceAll("http://" + publicUrl.hostname, publicOrigin);
        }
        const replacements = {
          5006: publicOrigin, 5007: publicOrigin + "/studio", 5008: publicOrigin,
          5005: "https://ensf.auresnix.com", 5002: "https://elearning.auresnix.com", 5004: "https://dspace.auresnix.com",
        };
        for (const [sourcePort, target] of Object.entries(replacements)) {
          for (const host of [ORIGIN_IP, ORIGIN_HOST]) {
            for (const protocol of ["http", "https"]) {
              const address = protocol + "://" + host + ":" + sourcePort;
              text = replaceAddress(text, address, target);
            }
          }
        }
        return text.replaceAll("http://" + publicUrl.hostname, publicOrigin);
      }
      const addresses = [
        legacyOrigin,
        "https://" + ORIGIN_IP + ":" + port,
        "http://" + ORIGIN_HOST + ":" + port,
        "http://" + publicUrl.hostname + ":" + port,
        "http://" + publicUrl.hostname,
      ];
      for (const address of addresses) {
        text = text.replaceAll(address, publicOrigin);
        text = text.replaceAll(address.replaceAll("/", "\\/"), publicOrigin.replaceAll("/", "\\/"));
        text = text.replaceAll(encodeURIComponent(address), encodeURIComponent(publicOrigin));
      }
      return text;
    }

    function configureDspace(config) {
      config.ui = { ...config.ui, ssl: true, host: publicUrl.hostname, port: 443, baseUrl: publicOrigin };
      config.rest = { ...config.rest, ssl: true, host: publicUrl.hostname, port: 443, baseUrl: publicOrigin + "/server", nameSpace: "/server" };
      return config;
    }

    const headers = new Headers(upstream.headers);
    const location = headers.get("Location");
    if (location) headers.set("Location", studio && /^\/(?!\/)/.test(location) ? publicOrigin + "/studio" + location : rewrite(location));
    const corsOrigin = headers.get("Access-Control-Allow-Origin");
    if (corsOrigin === legacyOrigin || (edx && /^http:\/\/41\.111\.224\.82:500[678]$/.test(corsOrigin || ""))) headers.set("Access-Control-Allow-Origin", publicOrigin);
    for (const name of ["Content-Security-Policy", "Content-Security-Policy-Report-Only"]) {
      if (edx && headers.has(name)) headers.set(name, rewrite(headers.get(name)));
    }

    const cookies = upstream.headers.getAll("Set-Cookie");
    if (cookies.length) {
      headers.delete("Set-Cookie");
      for (const cookie of cookies) {
        let value = cookie.replace(/;\s*Domain=(?:41\.111\.224\.82|\.?services-origin\.auresnix\.com)(?=;|$)/gi, "");
        if (!/;\s*Secure(?:;|$)/i.test(value)) value += "; Secure";
        headers.append("Set-Cookie", value);
      }
    }

    const contentType = headers.get("Content-Type") ?? "";
    const textual = /text\/|application\/(?:[\w.+-]*json|javascript|x-javascript)|image\/svg\+xml/i.test(contentType);
    if (request.method === "HEAD" || [204, 205, 304].includes(upstream.status) || !textual) {
      return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers });
    }

    let body = await upstream.text();
    if (edx && publicUrl.pathname.replace(/\/$/, "") === "/api/mfe_config/v1" && contentType.includes("application/json") && upstream.ok) {
      const config = JSON.parse(body);
      config.BASE_URL = publicOrigin;
      body = JSON.stringify(config);
    }
    const dspace = publicUrl.hostname === "dspace.auresnix.com";
    if (dspace && /^\/assets\/config(?:\.[a-f0-9]+)?\.json$/i.test(publicUrl.pathname) && upstream.ok) {
      body = JSON.stringify(configureDspace(JSON.parse(body)));
    }
    body = rewrite(body);
    if (studio && contentType.includes("text/html")) {
      body = body.replace(/\b(href|src|action)=(['"])\/(?!\/)/gi, "$1=$2/studio/");
    }
    if (studio && /text\/css/i.test(contentType)) {
      body = body.replace(/url\((['"]?)\/(?!\/)/gi, "url($1/studio/");
    }
    if (dspace && contentType.includes("text/html")) {
      body = body.replace(/(assets\/config\.[a-f0-9]+\.json)(?!\?)/gi, "$1?university-domain=auresnix-v2");
      body = body.replace(/(<script\b[^>]*\bid=["']dspace-angular-state["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (match, opening, json, closing) => {
        const state = JSON.parse(json);
        if (state.APP_CONFIG_STATE) configureDspace(state.APP_CONFIG_STATE);
        return opening + JSON.stringify(state).replace(/</g, "\\u003c") + closing;
      });
    }
    headers.delete("Content-Length");
    headers.delete("Content-Encoding");
    headers.delete("ETag");
    headers.delete("Last-Modified");
    headers.set("Cache-Control", "no-store");
    return new Response(body, { status: upstream.status, statusText: upstream.statusText, headers });
  },
};

