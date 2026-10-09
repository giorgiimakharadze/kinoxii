// fetches GET /filter-options once at boot and caches it in memory

import { moviesApi } from './api';

let cachedOptions = null;
let optionsPromise = null;

export async function getCachedFilterOptions() {
  if (cachedOptions) {
    return cachedOptions;
  }
  if (!optionsPromise) {
    optionsPromise = moviesApi.getFilterOptions()
      .then((res) => {
        cachedOptions = res?.data || null;
        return cachedOptions;
      })
      .catch((err) => {
        optionsPromise = null; // reset so retry is possible
        throw err;
      });
  }
  return optionsPromise;
}

// synchronous getter once resolved
export function getFilterConfig() {
  return cachedOptions;
}
