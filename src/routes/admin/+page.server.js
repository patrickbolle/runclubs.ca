import { redirect } from '@sveltejs/kit';
import { ADMIN_SECRET } from '$env/static/private';

export const load = async ({ cookies, url }) => {
  const token = cookies.get('admin_token');
  if (token !== ADMIN_SECRET) {
    throw redirect(303, `/admin/login?redirect=${url.pathname}`);
  }

  return {};
}; 