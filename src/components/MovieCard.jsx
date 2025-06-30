import React from 'react';
 // Optional, if you have styles

const MovieCard = ({ movie, onClick, onToggleFavorite, isFav }) => {
  return (
    <div className="movie-card" onClick={onClick}>
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400'}
        alt={movie.Title}
      />
      <div className="movie-info">
        <h2>{movie.Title}</h2>
        <p>{movie.Year}</p>
        <p>{movie.Type}</p>

        <button
          className="fav-btn"
          onClick={(e) => {
            e.stopPropagation(); // prevents opening modal when clicking favorite
            onToggleFavorite(movie);
          }}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;

