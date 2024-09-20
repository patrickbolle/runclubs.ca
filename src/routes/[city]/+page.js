import { cityData, cities } from '$lib/cityData.js';

export function load({ params }) {
  const { city } = params;
  const lowercaseCity = city.toLowerCase();

  if (cities.includes(lowercaseCity)) {
    return { cityData: cityData[lowercaseCity] };
  } else {
    return { cityData: null };
  }
}

export function entries() {
  return cities.map(city => ({ city }));
}