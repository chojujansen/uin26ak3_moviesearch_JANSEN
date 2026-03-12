import MovieCard from './MovieCard.jsx';

export default function MovieResults({ title, subtitle, movies, status, error }) {
  return (
    <section className="results" aria-live="polite">
      <header className="results-header">
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      {status === 'loading' ? <p className="status">Loading...</p> : null}
      {status === 'error' ? (
        <p className="status" role="alert">
          {error}
        </p>
      ) : null}
      {status === 'success' && movies.length === 0 ? (
        <p className="status">No results yet.</p>
      ) : null}
      {status === 'success' && movies.length > 0 ? (
        <ul className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </ul>
      ) : null}
    </section>
  );
}
