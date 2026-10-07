const API_BASE = 'https://api.kinoxii.redberryinternship.ge/api';

export async function apiFetch(enpoint, options = {}) {
  // read saved login token, if not signed in null
  const token = localStorage.getItem('kinoxii_token');

  // build header
  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  // make request
  const response = await fetch(`${API_BASE}${enpoint}`, {
    ...options,
    headers,
  })
  if (response.status === 204) return null;

  // reading the body
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const moviesApi = {
  getFeatured: () => apiFetch('/movies/featured'),
  search: (query) => apiFetch(`/search?q=${encodeURIComponent(query)}`)
};