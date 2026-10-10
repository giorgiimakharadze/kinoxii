const API_BASE = 'https://api.kinoxii.redberryinternship.ge/api';

export async function apiFetch(enpoint, options = {}) {
  // read saved login token, if not signed in null
  const token = localStorage.getItem('kinoxii_token');

  // build header
  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type'] && options.method && options.method !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

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

  if (response.status === 401 && enpoint !== '/login' && enpoint !== '/me') {
    localStorage.removeItem('kinoxii_token');
    window.dispatchEvent(new CustomEvent('kinoxii_auth_required'));
  }

  if (!response.ok) {
    const error = new Error(data?.message || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const authApi = {
  login: (credentials) => apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (formData) => apiFetch('/register', {
    method: 'POST',
    body: formData,
  }),
  updateProfile: (formData) => apiFetch('/profile', {
    method: 'PUT',
    body: formData,
  }),
  logout: () => apiFetch('/logout', { method: 'POST' }),
  getMe: () => apiFetch('/me'),
};

export const moviesApi = {
  getFeatured: () => apiFetch('/movies/featured'),
  getNowPlaying: (limit) => apiFetch(limit ? `/movies/now-playing?limit=${limit}` : '/movies/now-playing'),
  search: (query) => apiFetch(`/search?q=${encodeURIComponent(query)}`),
  getComingSoon: (limit) => apiFetch(limit ? `/movies/coming-soon?limit=${limit}` : '/movies/coming-soon'),
  notifyComingSoon: (slug) => apiFetch(`/movies/${slug}/notify`, { method: 'POST' }),
  getFilterOptions: () => apiFetch('/filter-options'),
  getSessions: (queryParams = '') => {
    const qs = queryParams ? (queryParams.startsWith('?') ? queryParams : `?${queryParams}`) : '';
    return apiFetch(`/sessions${qs}`);
  },
  getMovieDetails: (slug) => apiFetch(`/movies/${slug}`),
  getMovieSessions: (slug, date) => apiFetch(date ? `/movies/${slug}/sessions?date=${date}` : `/movies/${slug}/sessions`)
};


export const ticketsApi = {
  getTickets: (filter) => apiFetch(filter ? `/tickets?filter=${filter}` : '/tickets'),
  refundOrder: (orderReference) => apiFetch(`/orders/${orderReference}/refund`, {
    method: 'POST',
  }),
};


export const bookingApi = {
  getSeatMap: (sessionId) => apiFetch(`/sessions/${sessionId}/seats`),
  createHold: (sessionId, seats) => apiFetch(`/sessions/${sessionId}/holds`, {
    method: 'POST',
    body: JSON.stringify({ seats }),
  }),
  releaseHold: (holdId) => apiFetch(`/holds/${holdId}`, {
    method: 'DELETE',
  }),
  createOrder: (orderData) => apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
};
