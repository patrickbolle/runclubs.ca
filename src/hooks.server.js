/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const host = event.request.headers.get('host');
  const subdomain = host.split('.')[0];
  
  if (subdomain !== 'www' && subdomain !== 'runclubs') {
    event.url.pathname = `/${subdomain}${event.url.pathname}`;
  }

  return resolve(event);
}