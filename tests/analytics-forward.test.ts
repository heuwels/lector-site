import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import {
  analyticsSiteKey,
  bootSource,
  forwardingOrigin,
  handleAnalytics,
  stampCollectBody,
  websiteId,
} from '../functions/_lib/analytics-forward.ts';

const WEBSITE = 'b59e9c65-ae32-47f1-8400-119fcf4861c4';
const OTHER = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
const ENV = {
  ANALYTICS_FORWARDING_URL: 'https://umami.example/ignored',
  ANALYTICS_WEBSITE_ID: WEBSITE.toUpperCase(),
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('forwarding origin and site key', () => {
  assert.equal(forwardingOrigin(' https://umami.example/script.js?x=1 '), 'https://umami.example');
  assert.equal(forwardingOrigin('https://user:pass@umami.example'), null);
  assert.equal(forwardingOrigin('ftp://umami.example'), null);
  assert.equal(websiteId('lector.dev'), null);
  assert.equal(websiteId(WEBSITE), WEBSITE);
  assert.equal(analyticsSiteKey('www.lector.dev'), 'lector.dev');
  assert.equal(analyticsSiteKey('foo.lector-site-staging.pages.dev'), 'site.sandbox.lector.dev');
  assert.equal(analyticsSiteKey('lector-site-avb.pages.dev'), null);
  assert.equal(analyticsSiteKey('localhost'), null);
});

test('stamp replaces a hostname and rejects a foreign uuid', () => {
  const stamped = stampCollectBody(
    JSON.stringify({ type: 'event', payload: { website: 'www.lector.dev', url: '/' } }),
    WEBSITE,
  );
  assert.equal(stamped.ok, true);
  if (stamped.ok) assert.equal(JSON.parse(stamped.body).payload.website, WEBSITE);
  assert.deepEqual(
    stampCollectBody(JSON.stringify({ payload: { website: OTHER } }), WEBSITE),
    { ok: false, status: 400 },
  );
});

test('boot script sets the website id before the address', () => {
  const source = bootSource(WEBSITE);
  assert.ok(source.indexOf('data-website-id') < source.indexOf('el.src='));
  assert.doesNotThrow(() => new Function(source));
});

test('unknown host and missing env do not load the tracker', async () => {
  const off = await handleAnalytics(new Request('https://lector.dev/a/boot.js'), {});
  assert.match(await off.text(), /analytics off/);
  const preview = await handleAnalytics(new Request('https://preview.lector-site.pages.dev/a/boot.js'), ENV);
  assert.match(await preview.text(), /analytics off/);
});

test('collect forwards the visitor and hides cookies', async () => {
  let called: { url: string; init: RequestInit } | undefined;
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    called = { url: String(url), init: init ?? {} };
    return new Response('{"ok":true}', {
      status: 200,
      headers: { 'content-type': 'application/json', 'x-umami-cache': 'jwt', 'set-cookie': 'nope=1' },
    });
  }) as typeof fetch;

  const sent = await handleAnalytics(
    new Request('https://www.lector.dev/a/api/send', {
      method: 'POST',
      headers: {
        'user-agent': 'TestBrowser/1',
        cookie: 'session=secret',
        'cf-connecting-ip': '203.0.113.8',
        'x-umami-cache': 'prior',
      },
      body: JSON.stringify({ type: 'event', payload: { url: '/', website: 'lector.dev' } }),
    }),
    ENV,
  );
  assert.equal(sent.status, 200);
  assert.equal(sent.headers.get('set-cookie'), null);
  assert.equal(sent.headers.get('x-umami-cache'), 'jwt');
  assert.equal(called?.url, 'https://umami.example/api/send');
  assert.equal(called?.init.redirect, 'manual');
  const headers = called?.init.headers as Headers;
  assert.equal(headers.get('cookie'), null);
  assert.equal(headers.get('user-agent'), 'TestBrowser/1');
  assert.equal(headers.get('x-real-ip'), '203.0.113.8');
  assert.equal(headers.get('x-forwarded-host'), 'www.lector.dev');
  assert.equal(JSON.parse(String(called?.init.body)).payload.website, WEBSITE);
});

test('a redirect from the tracker host is refused', async () => {
  globalThis.fetch = (async () =>
    new Response(null, { status: 302, headers: { location: 'https://evil.example/script.js' } })) as typeof fetch;
  const script = await handleAnalytics(new Request('https://lector.dev/a/script.js'), ENV);
  assert.equal(script.status, 502);
});
