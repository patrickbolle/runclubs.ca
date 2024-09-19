export async function onRequest({ request, next, env }) {
    const url = new URL(request.url);
    
    if (url.hostname === 'vancouver.runclubs.ca') {
      url.pathname = '/vancouver' + url.pathname;
      return env.ASSETS.fetch(url);
    }
    
    return next();
  }