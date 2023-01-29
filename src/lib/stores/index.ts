import type { Brewery } from '$lib/types';
import { writable } from 'svelte/store';

export const breweries = writable<Brewery[]>([]);
