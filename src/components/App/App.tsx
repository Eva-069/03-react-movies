import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { type Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal.tsx';
import styles from './App.module.css';

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      setError(false);
      setMovies([]); // Очистити попередні результати пошуку
      
      const movieResults = await fetchMovies(query);
      
      if (movieResults.length === 0) {
        toast.error('No movies found for your request.');
      }
      
      setMovies(movieResults);
    } catch (err) {
      setError(true);
      console.error('Помилка завантаження фільмів:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />
      
      <main className={styles.main}>
        {loading && <Loader />}
        {error && <ErrorMessage />}
        {!loading && !error && (
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
        )}
      </main>

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
      
      <Toaster position="top-right" />
    </div>
  );
};

export default App;