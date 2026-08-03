const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

const api = {
  auth: {
    register: (body) => fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    login: (body) => fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    getMe: () => fetch(`${API_BASE}/auth/me`, { headers: getHeaders() }).then(handleResponse),
    updateProfile: (body) => fetch(`${API_BASE}/auth/profile`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  },
  interview: {
    create: (body) => fetch(`${API_BASE}/interviews`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    getFirstQuestion: (id) => fetch(`${API_BASE}/interviews/${id}/question`, { headers: getHeaders() }).then(handleResponse),
    submitAnswer: (id, body) => fetch(`${API_BASE}/interviews/${id}/answer`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    complete: (id) => fetch(`${API_BASE}/interviews/${id}/complete`, { method: 'POST', headers: getHeaders() }).then(handleResponse),
    getOne: (id) => fetch(`${API_BASE}/interviews/${id}`, { headers: getHeaders() }).then(handleResponse),
    getHistory: () => fetch(`${API_BASE}/interviews/history`, { headers: getHeaders() }).then(handleResponse),
  },
  reports: {
    getAll: () => fetch(`${API_BASE}/reports`, { headers: getHeaders() }).then(handleResponse),
    getOne: (id) => fetch(`${API_BASE}/reports/${id}`, { headers: getHeaders() }).then(handleResponse),
  },
  dashboard: {
    getStats: () => fetch(`${API_BASE}/dashboard/stats`, { headers: getHeaders() }).then(handleResponse),
  }
};

export default api;
