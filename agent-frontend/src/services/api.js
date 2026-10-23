const API_URL = (
  import.meta.env.VITE_API_URL ||
  'https://health-pilot-demo.onrender.com/api'
).replace(/\/$/, '');

export async function api(path, options = {}) {
  const normalizedPath = path.startsWith('/')
    ? path
    : `/${path}`;

  // Avoid adding /api twice if a caller already includes it.
  const finalPath = normalizedPath.startsWith('/api/')
    ? normalizedPath.slice(4)
    : normalizedPath;

  const response = await fetch(`${API_URL}${finalPath}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(options.headers || {}),
    },
    body:
      options.body && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(
      data?.message || `Request failed (${response.status})`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
