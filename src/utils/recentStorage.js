const RECENT_KEY = 'kinoxii_recent_movies';
const MAX_RECENT = 10;

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const validMovies = parsed.filter(
      (m) =>
        m &&
        m.id &&
        m.slug &&
        m.posterUrl !== 'https://image.tmdb.org/t/p/w200/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg'
    );

    if (validMovies.length !== parsed.length) {
      localStorage.setItem(RECENT_KEY, JSON.stringify(validMovies));
    }

    return validMovies;
  } catch (err) {
    console.error("Error reading recently viewed movies:", err);
    return [];
  }
}

export function addRecentlyViewed(movie) {
  if (!movie || !movie.id || !movie.slug) return;

  try {
    const current = getRecentlyViewed();

    const normalizedMovie = {
      id: movie.id,
      title: movie.title,
      slug: movie.slug,
      posterUrl: movie.posterUrl || movie.backdropUrl || '',
      backdropUrl: movie.backdropUrl || '',
      genres: Array.isArray(movie.genres) ? movie.genres : [],
      runtimeMinutes: movie.runtimeMinutes || null,
      ageRating: movie.ageRating || null,
    };

    const filtered = current.filter((m) => m.id !== movie.id && m.slug !== movie.slug);
    const updated = [normalizedMovie, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));

    window.dispatchEvent(new Event('recentlyViewedUpdated'));
  } catch (err) {
    console.error('Error saving recently viewed movie:', err);
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(RECENT_KEY);
    window.dispatchEvent(new Event('recentlyViewedUpdated'));
  } catch (err) {
    console.error('Error clearing recently viewed movie:', err);
  }
}
