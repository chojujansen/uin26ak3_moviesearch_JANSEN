import { Link } from 'react-router-dom';
import { toSlug } from '../utils/slug.js';

export default function MovieCard({ movie }) {
  const slug = toSlug(movie.Title);
  const linkTarget = `/${slug}?id=${movie.imdbID}`;
  const isMissingPoster = movie.Poster === 'N/A';

  return (
    <li className="movie-card">
      <article className="movie-card-inner">
        <Link
          className="movie-link"
          to={linkTarget}
          state={{ imdbID: movie.imdbID, title: movie.Title }}
        >
          <figure className={`poster ${isMissingPoster ? 'placeholder' : ''}`}>
            {isMissingPoster ? (
              <figcaption className="poster-fallback">No poster</figcaption>
            ) : (
              <img
                src={movie.Poster}
                alt={`${movie.Title} poster`}
                loading="lazy"
              />
            )}
          </figure>
          <header className="movie-meta">
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </header>
        </Link>
      </article>
    </li>
  );
}
