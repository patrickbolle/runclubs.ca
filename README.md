# runclubs.ca
runclubs.ca provides information about running clubs in various Canadian cities. Users can:

- Browse run clubs by city
- View weekly schedules of run club events
- Access detailed information about each run club, including meeting times, locations, and social media links

## Infrastructure and Hosting

The site is built using SvelteKit and hosted on Cloudflare Pages. Here's an overview of the app's infrastructure:

1. **Static Site Generation**: The app is pre-rendered into static HTML, CSS, and JavaScript using SvelteKit's static adapter.

2. **Cloudflare Pages**: The static files are hosted and served through Cloudflare Pages.

3. **Subdomain Routing**: Cloudflare Workers (via the `_middleware.js` file) handle subdomain routing, allowing city-specific subdomains (e.g., vancouver.runclubs.ca).

4. **Data Management**: Run club data is stored in JSON files for now

## Build and Deployment Process

1. **Development**: Run `npm run dev` for local development.

2. **Deployment**: Push changes to the main branch on GitHub. Cloudflare Pages will automatically build and deploy the site.

## Key Files and Their Roles

- `functions/_middleware.js`: Handles subdomain routing.
- `src/routes/[city]/+page.svelte`: City-specific page template.
- `src/routes/[city]/[clubId]/+page.svelte`: Individual run club page template.
- `static/_redirects`: Manages redirects for city pages.
- `svelte.config.js`: Configures SvelteKit and the static adapter.
- `src/lib/data/*.json`: Stores city-specific run club data.
