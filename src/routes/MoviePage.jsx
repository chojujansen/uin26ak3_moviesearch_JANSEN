import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { getMovieById, getMovieByTitle } from '../api/omdb.js';
import { fromSlug } from '../utils/slug.js';

export default function MoviePage() {
  const { movie } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [film, setFilm] = useState(null);

  const imdbIDFromQuery = searchParams.get('id');
  const imdbIDFromState = location.state?.imdbID;
  const imdbID = imdbIDFromQuery || imdbIDFromState || '';
  const titleFromState = location.state?.title;
  const titleFromSlug = movie ? fromSlug(movie) : '';
  const fallbackTitle = titleFromState || titleFromSlug;

  useEffect(() => {
    if (!movie) {
      setStatus('error');
      setError('Missing movie title.');
      return;
    }

    let active = true;
    const controller = new AbortController();

    async function loadDetails() {
      setStatus('loading');
      setError('');
      try {
        const data = imdbID
          ? await getMovieById(imdbID, { signal: controller.signal })
          : await getMovieByTitle(fallbackTitle, { signal: controller.signal });
        if (!active) {
          return;
        }
        setFilm(data);
        setStatus('success');
      } catch (err) {
        if (err?.name === 'AbortError') {
          return;
        }
        if (!active) {
          return;
        }
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Could not load movie.');
      }
    }

    if (!imdbID && !fallbackTitle) {
      setStatus('error');
      setError('No movie title to look up.');
      return;
    }

    loadDetails();

    return () => {
      active = false;
      controller.abort();
    };
  }, [movie, imdbID, fallbackTitle]);

  return (
    <section className="detail-page">
      <header className="detail-header">
        <Link className="back-link" to="/">
          Back to search
        </Link>
      </header>

      {status === 'loading' ? <p className="status">Loading...</p> : null}

      {status === 'error' ? (
        <p className="status" role="alert">
          {error}
        </p>
      ) : null}

      {status === 'success' && film ? (
        <article className="detail-card">
          <header className="detail-title">
            <h1>{film.Title}</h1>
            <p>
              {film.Year} · {film.Runtime} · {film.Rated}
            </p>
          </header>

          <section className="detail-body">
            <figure
              className={`poster large ${
                film.Poster === 'N/A' ? 'placeholder' : ''
              }`}
            >
              {film.Poster === 'N/A' ? (
                <figcaption className="poster-fallback">No poster</figcaption>
              ) : (
                <img src={film.Poster} alt={`${film.Title} poster`} />
              )}
            </figure>

            <section className="detail-info">
              <h2>Overview</h2>
              <p>{film.Plot === 'N/A' ? 'No plot available.' : film.Plot}</p>

              <dl className="detail-list">
                <dt>Genre</dt>
                <dd>{film.Genre}</dd>
                <dt>Director</dt>
                <dd>{film.Director}</dd>
                <dt>Actors</dt>
                <dd>{film.Actors}</dd>
                <dt>Awards</dt>
                <dd>{film.Awards}</dd>
                <dt>IMDB Rating</dt>
                <dd>{film.imdbRating}</dd>
              </dl>
            </section>
          </section>
        </article>
      ) : null}
    </section>
  );
}
