import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const source = await fs.readFile(new URL('./services-proxy.js', import.meta.url), 'utf8');
const { default: worker } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));

async function proxy(path, upstreamBody = 'OK', options = {}, requestOptions) {
  const originalFetch = globalThis.fetch;
  let upstreamRequest;
  globalThis.fetch = async request => {
    upstreamRequest = request;
    const response = new Response(upstreamBody, options);
    response.headers.getAll = name => name.toLowerCase() === 'set-cookie' ? response.headers.getSetCookie() : [];
    return response;
  };
  try {
    const response = await worker.fetch(new Request('https://edx.auresnix.com' + path, requestOptions));
    return { response, upstreamRequest };
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('LMS, admin, login and dashboard use port 5006', async () => {
  for (const path of ['/', '/courses', '/admin/', '/login', '/dashboard', '/api/mfe_config/v1?mfe=authn']) {
    const { upstreamRequest } = await proxy(path);
    assert.equal(new URL(upstreamRequest.url).port, '5006');
    assert.equal(new URL(upstreamRequest.url).pathname, path.split('?')[0]);
  }
});

test('microfrontend pages and their assets use port 5008', async () => {
  for (const path of ['/authn/login', '/catalog/', '/catalog/app.js', '/learning/course/abc', '/authoring/']) {
    const { upstreamRequest } = await proxy(path);
    assert.equal(new URL(upstreamRequest.url).port, '5008');
    assert.equal(new URL(upstreamRequest.url).pathname, path);
  }
});

test('Studio strips its public prefix and keeps redirects and assets under /studio', async () => {
  const { upstreamRequest, response } = await proxy('/studio/login/?next=/home/', '<img src="/static/logo.png"><form action="/login/"></form>', {
    headers: { 'Content-Type': 'text/html', Location: '/home/' },
  }, { headers: { Origin: 'https://edx.auresnix.com', Referer: 'https://edx.auresnix.com/studio/home/' } });
  assert.equal(upstreamRequest.url, 'http://services-origin.auresnix.com:5007/login/?next=/home/');
  assert.equal(upstreamRequest.headers.get('Origin'), 'http://41.111.224.82:5007');
  assert.equal(upstreamRequest.headers.get('Referer'), 'http://41.111.224.82:5007/home/');
  assert.equal(response.headers.get('Location'), 'https://edx.auresnix.com/studio/home/');
  const html = await response.text();
  assert.match(html, /src="\/studio\/static\/logo.png"/);
  assert.match(html, /action="\/studio\/login\/"/);
  const redirect = await proxy('/studio');
  assert.equal(redirect.response.headers.get('Location'), 'https://edx.auresnix.com/studio/');
});

test('Open edX configuration and cross-service links use public HTTPS addresses', async () => {
  const { response } = await proxy('/api/mfe_config/v1?mfe=catalog', JSON.stringify({
    BASE_URL: '41.111.224.82:5008', LMS_BASE_URL: 'http://41.111.224.82:5006',
    STUDIO_BASE_URL: 'http://41.111.224.82:5007', LOGIN_URL: 'http://41.111.224.82:5008/authn/login',
    FOOTER_LINKS: ['http://41.111.224.82:5005/fr', 'http://41.111.224.82:5002/', 'http://41.111.224.82:5004/'],
  }), { headers: { 'Content-Type': 'application/json' } });
  const config = await response.json();
  assert.equal(config.BASE_URL, 'https://edx.auresnix.com');
  assert.equal(config.LMS_BASE_URL, 'https://edx.auresnix.com');
  assert.equal(config.STUDIO_BASE_URL, 'https://edx.auresnix.com/studio');
  assert.equal(config.LOGIN_URL, 'https://edx.auresnix.com/authn/login');
  assert.deepEqual(config.FOOTER_LINKS, ['https://ensf.auresnix.com/fr', 'https://elearning.auresnix.com/', 'https://dspace.auresnix.com/']);
});

test('Studio OAuth callback registration is preserved through encoded login return addresses', async () => {
  const callback = 'https://edx.auresnix.com/studio/complete/edx-oauth2/';
  const authorize = '/oauth2/authorize?redirect_uri=' + encodeURIComponent(callback);
  const { upstreamRequest } = await proxy('/login?next=' + encodeURIComponent(authorize));
  const next = new URL(upstreamRequest.url).searchParams.get('next');
  assert.equal(new URL(next, 'http://41.111.224.82:5006').searchParams.get('redirect_uri'), 'http://41.111.224.82:5007/complete/edx-oauth2/');
});

test('redirects, encoded return addresses and cookies remain on the HTTPS domain', async () => {
  const target = 'http://41.111.224.82:5008/authn/login?next=' + encodeURIComponent('http://41.111.224.82:5006/dashboard');
  const { response } = await proxy('/login', '', { status: 302, headers: {
    Location: target, 'Set-Cookie': 'sessionid=test; Domain=41.111.224.82; Path=/; HttpOnly',
  } });
  assert.equal(response.headers.get('Location'), 'https://edx.auresnix.com/authn/login?next=' + encodeURIComponent('https://edx.auresnix.com/dashboard'));
  assert.match(response.headers.get('Set-Cookie'), /; Secure/);
  assert.doesNotMatch(response.headers.get('Set-Cookie'), /Domain=/);
});

test('existing Moodle and DSpace services keep their ports', async () => {
  const originalFetch = globalThis.fetch;
  try {
    const requests = [];
    globalThis.fetch = async request => {
      requests.push(request.url);
      const response = new Response('OK');
      response.headers.getAll = () => [];
      return response;
    };
    await worker.fetch(new Request('https://elearning.auresnix.com/'));
    await worker.fetch(new Request('https://dspace.auresnix.com/'));
    assert.deepEqual(requests, ['http://services-origin.auresnix.com:5002/', 'http://services-origin.auresnix.com:5004/']);
  } finally { globalThis.fetch = originalFetch; }
});
