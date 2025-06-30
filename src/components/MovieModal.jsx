import React from 'react';
import './MovieModal.css';

const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>{movie.Title}</h2>
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400'}
          alt={movie.Title}
        />
        <p><strong>Year:</strong> {movie.Year}</p>
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Runtime:</strong> {movie.Runtime}</p>
        <p><strong>Actors:</strong> {movie.Actors}</p>
        <p><strong>Director:</strong> {movie.Director}</p>
        <p><strong>Plot:</strong> {movie.Plot}</p>
        <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
      </div>
    </div>
  );
};

export default MovieModal;
