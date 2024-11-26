import { db } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { ADMIN_SECRET } from '$env/static/private';

export const load = async ({ cookies }) => {
  const token = cookies.get('admin_token');
  if (token !== ADMIN_SECRET) {
    throw redirect(303, '/admin/login');
  }

  const submissions = await db.getPendingClubs();
  return { submissions };
}; 