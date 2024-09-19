export default {
  async fetch(request) {
    console.log("Middleware function called");
    
    // Only GET requests are allowed
    if (request.method !== "GET") {
      return new Response(`Method ${request.method} not allowed.`, {
        status: 405,
        headers: {
          Allow: "GET",
        },
      });
    }

    const url = new URL(request.url);
    const hostname = url.hostname;
    const subdomain = hostname.split('.')[0];

    // Check if it's a valid subdomain (not www or the main domain)
    if (subdomain !== 'www' && subdomain !== 'runclubs' && hostname !== 'runclubs.ca') {
      // Construct the new URL with the subdomain as a path
      const newUrl = new URL(`https://runclubs.ca/${subdomain}${url.pathname}`);
      
      // Fetch the new URL
      const response = await fetch(newUrl.toString(), request);

      // Return the response
      return response;
    }

    // If it's not a subdomain request, just pass it through
    return fetch(request);
  },
};
