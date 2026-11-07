/**
 * Edge entry for katarinarankovic.fyi.
 *
 * The site itself is static (served from the `ASSETS` binding). The Worker only
 * canonicalises `www.` to the apex and redirects renamed project URLs.
 */
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4)
      return Response.redirect(url.toString(), 301)
    }
    if (/^\/projects\/flat\/?$/.test(url.pathname)) {
      url.pathname = '/projects/unseen'
      return Response.redirect(url.toString(), 301)
    }
    return env.ASSETS.fetch(request)
  },
}
