const API_URL = 'https://www.omdbapi.com/';

function getApiKey() {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_OMDB_API_KEY. Add it to a .env file.');
  }
  return apiKey;
}

function buildUrl(params) {
  const searchParams = new URLSearchParams(params);
  return `${API_URL}?${searchParams.toString()}`;
}

async function fetchOmdb(params, options = {}) {
  const apiKey = getApiKey();
  const url = buildUrl({ apikey: apiKey, ...params });
  const response = await fetch(url, { signal: options.signal });
  if (!response.ok) {
    throw new Error('Network error while contacting OMDB.');
  }
  const data = await response.json();
  if (data.Response === 'False') {
    throw new Error(data.Error || 'OMDB returned an error.');
  }
  return data;
}

export async function searchMovies(query, page = 1, options = {}) {
  try {
    const data = await fetchOmdb(
      { s: query, type: 'movie', page: String(page) },
      options
    );
    return data.Search ?? [];
  } catch (error) {
    if (error instanceof Error && error.message === 'Movie not found!') {
      return [];
    }
    throw error;
  }
}

export async function getMovieById(imdbID, options = {}) {
  return fetchOmdb({ i: imdbID, plot: 'full' }, options);
}

export async function getMovieByTitle(title, options = {}) {
  return fetchOmdb({ t: title, plot: 'full' }, options);
}
