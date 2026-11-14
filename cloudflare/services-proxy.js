const ORIGIN_HOST = "services-origin.auresnix.com";
const ORIGIN_IP = "41.111.224.82";
const SERVICES = {
  "elearning.auresnix.com": 5002,
  "dspace.auresnix.com": 5004,
};

export default {
  async fetch(request) {
    const publicUrl = new URL(request.url);
    const port = SERVICES[publicUrl.hostname];
    if (!port) return new Response("Unknown service.", { status: 404 });

    const publicOrigin = "https://" + publicUrl.hostname;
    const legacyOrigin = "http://" + ORIGIN_IP + ":" + port;
    const upstreamUrl = new URL("http://" + ORIGIN_HOST + ":" + port);
    upstreamUrl.pathname = publicUrl.pathname;
    upstreamUrl.search = publicUrl.search;
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
      upstreamRequest.headers.set("Referer", referer.replace(publicUrl.origin, legacyOrigin));
    }

    let upstream;
    try {
      upstream = await fetch(upstreamRequest, { redirect: "manual" });
    } catch {
      return new Response("The service could not be reached.", { status: 502 });
    }

    function rewrite(text) {
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
    if (location) headers.set("Location", rewrite(location));
    const corsOrigin = headers.get("Access-Control-Allow-Origin");
    if (corsOrigin === legacyOrigin) headers.set("Access-Control-Allow-Origin", publicOrigin);

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
    const dspace = publicUrl.hostname === "dspace.auresnix.com";
    if (dspace && /^\/assets\/config(?:\.[a-f0-9]+)?\.json$/i.test(publicUrl.pathname) && upstream.ok) {
      body = JSON.stringify(configureDspace(JSON.parse(body)));
    }
    body = rewrite(body);
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

