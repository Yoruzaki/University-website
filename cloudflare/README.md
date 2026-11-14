# University service domains

`services-proxy.js` is the source for the Cloudflare Worker `university-services-proxy`.

The `elearning`, `dspace`, and `edx` subdomains have proxied A records pointing to `41.111.224.82` and corresponding Worker routes (`<subdomain>.auresnix.com/*`). The Worker fetches through the DNS-only `services-origin.auresnix.com` record. Browser connections use HTTPS; the existing origin services use HTTP.

| Public address | Origin port |
| --- | --- |
| `elearning.auresnix.com` | 5002 |
| `dspace.auresnix.com` | 5004 |
| `edx.auresnix.com` (LMS, courses, dashboard, admin, APIs) | 5006 |
| `edx.auresnix.com/studio/` | 5007, with `/studio` removed before forwarding |
| Open edX frontend paths such as `/authn/`, `/catalog/`, `/learning/`, `/authoring/` | 5008 |

Open edX's `/login` entry on the LMS redirects to `/authn/login` on the same public domain. `/admin/` keeps its normal authentication requirement. Studio links and static assets remain under `/studio/`. Existing application authentication and permissions are retained.

The Worker rewrites origin URLs in responses, redirects and runtime configuration. It also preserves the existing DSpace runtime configuration correction.

Run the routing regression checks with:

```sh
node --test cloudflare/services-proxy.test.mjs
```

After changing the Worker source, deploy that file through the Cloudflare Worker editor. Git pushes alone do not deploy this Worker.
