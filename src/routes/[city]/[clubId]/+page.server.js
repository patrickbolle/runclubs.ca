import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const load = async ({ params }) => {
  const club = await db.getRunClub(params.city, params.clubId);
  if (!club) {
    throw error(404, 'Club not found');
  }
  return { club };
}; 