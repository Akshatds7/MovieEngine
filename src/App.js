import React, { useState, useEffect } from 'react';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import './App.css';

const API_URL = 'https://omdbapi.com?apikey=fe2f6c44';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('batman');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavs);
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    const isFav = favorites.find((fav) => fav.imdbID === movie.imdbID);
    if (isFav) {
      setFavorites(favorites.filter((fav) => fav.imdbID !== movie.imdbID));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const isFavorite = (id) => {
    return favorites.some((fav) => fav.imdbID === id);
  };

  const searchMovies = async (title, newPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}&s=${title}&page=${newPage}${selectedType ? `&type=${selectedType}` : ''}`
      );
      const data = await response.json();
      if (data.Response === 'True') {
        if (newPage === 1) {
          setMovies(data.Search);
        } else {
          setMovies((prev) => [...prev, ...data.Search]);
        }
        setHasMore(data.Search.length > 0);
      } else {
        if (newPage === 1) setMovies([]);
        setHasMore(false);
        setError(data.Error);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await fetch(`${API_URL}&i=${imdbID}`);
      const data = await response.json();
      if (data.Response === 'True') {
        setSelectedMovie(data);
      }
    } catch (err) {
      console.error('Failed to fetch movie details:', err);
    }
  };

  useEffect(() => {
    searchMovies(searchTerm, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setShowFavorites(false);
    searchMovies(searchTerm, 1);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);

      if (
        window.innerHeight + scrollTop + 100 >= document.documentElement.scrollHeight &&
        !loading &&
        hasMore &&
        !showFavorites
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, showFavorites]);

  useEffect(() => {
    if (page > 1 && !showFavorites) {
      searchMovies(searchTerm, page);
    }
  }, [page, searchTerm, selectedType, showFavorites]);
  useEffect(() => {
  searchMovies();
}, [searchMovies]);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <h1>🎬 Movie Search Engine</h1>

      <form onSubmit={handleSearch} className="search-box">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setPage(1);
            searchMovies(searchTerm, 1);
          }}
          className="type-filter"
        >
          <option value="">All Types</option>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
          <option value="episode">Episode</option>
        </select>

        <button type="submit">🔍 Search</button>
      </form>

      <button
        onClick={() => setShowFavorites(!showFavorites)}
        className="fav-toggle"
      >
        {showFavorites ? '🔙 Back to Search' : '⭐ Show Favorites'}
      </button>

      {error && <p className="info error">{error}</p>}
      {!loading && !error && (showFavorites ? favorites : movies).length === 0 && (
        <p className="info">No results found.</p>
      )}

      <div className="movies-container">
        {(showFavorites ? favorites : movies).map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onClick={() => fetchMovieDetails(movie.imdbID)}
            onToggleFavorite={toggleFavorite}
            isFav={isFavorite(movie.imdbID)}
          />
        ))}
      </div>

      {loading && (
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      )}

      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ⬆
        </button>
      )}

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}

export default App;
