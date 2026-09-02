/**
 * Edge entry for katarinarankovic.fyi.
 *
 * The site itself is static (served from the `ASSETS` binding). The Worker only
 * exists to canonicalise `www.` to the apex, which static-asset `_redirects`
 * cannot express because they only allow relative targets.
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
    return env.ASSETS.fetch(request)
  },
}
