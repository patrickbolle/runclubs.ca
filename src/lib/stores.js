import { writable } from 'svelte/store';
import { cityData } from './cityData.js';

export const currentCityStore = writable('');
export const currentCityDataStore = writable({});

export function updateCurrentCity(city) {
    currentCityStore.set(city);
    currentCityDataStore.set(cityData[city] || {});
}