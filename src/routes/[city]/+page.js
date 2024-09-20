import { cityData, cities } from '$lib/cityData.js';

export const load = async ({ params }) => {
  const { city } = params;
  const lowercaseCity = city.toLowerCase();

  if (cities.includes(lowercaseCity)) {
    return { 
      cityData: cityData[lowercaseCity],
      clubs: cityData[lowercaseCity].runClubs
    };
  } else {
    return { cityData: null, clubs: [] };
  }
}

export function entries() {
  return cities.map(city => ({ city }));
}