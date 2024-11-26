import { db } from '$lib/server/db';

export const load = async () => {
  const cities = await db.getCities();
  return {
    cities
  };
}; 