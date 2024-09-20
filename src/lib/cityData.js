import vancouver from './data/vancouver.json';
import toronto from './data/toronto.json';
import kitchenerWaterloo from './data/kitchener-waterloo.json';

export const cityData = {
  vancouver,
  toronto,
  'kitchener-waterloo': kitchenerWaterloo,
};

export const cities = Object.keys(cityData);

console.log('City Data:', cityData);