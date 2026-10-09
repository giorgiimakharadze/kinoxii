// A helper to easily manage recently viewed films in localStorage



const RECENT_KEY = 'kinoxii_recent_movies';
const MAX_RECENT = 10;

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Error reading recently viewed movies:", err);
    return [];
  }
}


export function addRecentlyViewed(movie) {
  if (!movie || !movie.id) return;

  try {
    const current = getRecentlyViewed();

    // remove if already exists so we can move it to the front
    const filtered = current.filter((m) => m.id !== movie.id);
    const updated = [movie, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));

    // dispatch a custom event so other components update immediately
    window.dispatchEvent(new Event('recentlyViewedUpdated'));
  } catch (err) {
    console.error('Error saving recently viewed movie:', err);
  }
}