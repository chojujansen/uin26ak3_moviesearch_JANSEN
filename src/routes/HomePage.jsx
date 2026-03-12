import { useEffect, useMemo, useState } from 'react';
import { searchMovies } from '../api/omdb.js';
import MovieResults from '../components/MovieResults.jsx';

const DEFAULT_QUERY = 'James Bond';
const MIN_CHARS = 3;

function mergeUnique(list) {
  const map = new Map();
  list.forEach((item) => {
    if (item && item.imdbID && !map.has(item.imdbID)) {
      map.set(item.imdbID, item);
    }
  });
  return Array.from(map.values());
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [defaultMovies, setDefaultMovies] = useState([]);
  const [defaultStatus, setDefaultStatus] = useState('loading');
  const [defaultError, setDefaultError] = useState('');
  const [searchMoviesState, setSearchMoviesState] = useState([]);
  const [searchStatus, setSearchStatus] = useState('idle');
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDefault() {
      setDefaultStatus('loading');
      setDefaultError('');
      try {
        const [pageOne, pageTwo] = await Promise.all([
          searchMovies(DEFAULT_QUERY, 1),
          searchMovies(DEFAULT_QUERY, 2),
        ]);
        const merged = mergeUnique([...pageOne, ...pageTwo]);
        const selection = merged.slice(0, 10);
        if (!active) {
          return;
        }
        setDefaultMovies(selection);
        setDefaultStatus('success');
      } catch (error) {
        if (!active) {
          return;
        }
        setDefaultStatus('error');
        setDefaultError(
          error instanceof Error ? error.message : 'Failed to load movies.'
        );
      }
    }

    loadDefault();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_CHARS) {
      setSearchStatus('idle');
      setSearchError('');
      setSearchMoviesState([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setSearchStatus('loading');
      setSearchError('');
      try {
        const results = await searchMovies(trimmed, 1, {
          signal: controller.signal,
        });
        setSearchMoviesState(results);
        setSearchStatus('success');
      } catch (error) {
        if (error?.name === 'AbortError') {
          return;
        }
        setSearchStatus('error');
        setSearchError(
          error instanceof Error ? error.message : 'Search failed.'
        );
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const trimmed = query.trim();
  const showingSearch = trimmed.length >= MIN_CHARS;
  const movies = showingSearch ? searchMoviesState : defaultMovies;
  const status = showingSearch ? searchStatus : defaultStatus;
  const error = showingSearch ? searchError : defaultError;
  const resultsTitle = showingSearch ? 'Search results' : 'James Bond classics';
  const resultsSubtitle = showingSearch
    ? `Results for "${trimmed}".`
    : 'Showing at least 10 James Bond films before you search.';

  const hint = useMemo(() => {
    if (trimmed.length === 0) {
      return 'Type a title to start searching.';
    }
    if (trimmed.length < MIN_CHARS) {
      return `Type at least ${MIN_CHARS} characters to search.`;
    }
    return 'Searching by movie title.';
  }, [trimmed]);

  return (
    <section className="home">
      <header className="hero">
        <h1>Find your next film</h1>
        <p>Search the OMDB catalog and open a title for full details.</p>
      </header>

      <section className="search-panel">
        <form className="search-form" role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="search">Search by title</label>
          <input
            id="search"
            name="search"
            type="search"
            placeholder="Try: Skyfall"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
          <button type="submit">Search</button>
          <p className="search-hint">{hint}</p>
        </form>
      </section>

      <MovieResults
        title={resultsTitle}
        subtitle={resultsSubtitle}
        movies={movies}
        status={status}
        error={error}
      />
    </section>
  );
}
