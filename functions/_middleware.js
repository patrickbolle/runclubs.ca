  export async function onRequest({ request, next }) {
    const url = new URL(request.url);
    const subdomain = url.hostname.split('.')[0];
  
    if (subdomain !== 'www' && subdomain !== 'runclubs' && subdomain !== url.hostname) {
      // Check if the path is already set to the subdomain
      if (!url.pathname.startsWith(`/${subdomain}`)) {
        // Rewrite the URL to include the subdomain as a path
        url.pathname = `/${subdomain}${url.pathname}`;
        return Response.redirect(url.toString(), 301);
      }
    }
  
    return next();
  }
