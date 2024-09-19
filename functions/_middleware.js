

  export async function onRequest({ request, env, next }) {
    const url = new URL(request.url);
    const subdomain = url.hostname.split('.')[0];
  
    if (subdomain !== 'www' && subdomain !== url.hostname) {
      // Rewrite the URL to include the subdomain as a path
      url.pathname = `/${subdomain}${url.pathname}`;
      return next({
        request: new Request(url.toString(), request)
      });
    }
  
    return next();
  }
  