import { cityData } from './cityData';

export const getClubsForCity = (cityName) => {
  return cityData[cityName]?.runClubs || [];
};