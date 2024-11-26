import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const load = async ({ params }) => {
  const cityData = await db.getCity(params.city);
  if (!cityData) {
    throw error(404, 'City not found');
  }
  return { city: cityData };
}; 