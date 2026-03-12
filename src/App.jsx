import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './routes/HomePage.jsx';
import MoviePage from './routes/MoviePage.jsx';

export default function App() {
  return (
    <section className="app-shell">
      <header className="site-header">
        <section className="brand">
          <Link className="brand-link" to="/">
            Movie Search
          </Link>
          <p className="tagline">Explore films from the OMDB catalog.</p>
        </section>
      </header>
      <main className="site-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:movie" element={<MoviePage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>Data provided by OMDB.</p>
      </footer>
    </section>
  );
}
