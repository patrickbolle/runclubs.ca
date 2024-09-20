import { error } from '@sveltejs/kit';
import { cityData } from '$lib/cityData.js';

export function load({ params }) {
  const city = params.city.toLowerCase();
  const data = cityData[city];

  if (data) {
    return {
      city,
      ...data
    };
  }

  throw error(404, 'City not found');
}