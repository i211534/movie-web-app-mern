'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Movie } from '../types';
import Rating from './Rating';

// Define the props interface
interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const handleMovieClick = (id: number) => {
    router.push(`/movies/${id}`); // Navigate to the movie details page
  };

  const handleSlide = (direction: 'prev' | 'next') => {
    const totalSlides = Math.ceil(movies.length / 3);
    if (direction === 'prev') {
      setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    } else {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="movie-list">
      <div className="carousel">
        <div
          className="carousel-inner"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {[...Array(Math.ceil(movies.length / 3))].map((_, index) => (
            <div className="carousel-item" key={index}>
              <div className="carousel-row">
                {movies.slice(index * 3, index * 3 + 3).map((movie) => (
                  <div className="carousel-col" key={movie.id} onClick={() => handleMovieClick(movie.id)}>
                    <img src={movie.image} alt={movie.title} className="carousel-img" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" onClick={() => handleSlide('prev')}>
          &#9664;
        </button>
        <button className="carousel-control-next" onClick={() => handleSlide('next')}>
          &#9654;
        </button>
      </div>

      <div className="movies-section">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-item"
              onClick={() => handleMovieClick(movie.id)}
            >
              <div className="movie-imagereal">
                <img src={movie.image} alt="movie" className="movie-image" />
              </div>
              <h3>{movie.title}</h3>
              <Rating movieId={movie.id} />
            </div>
          ))
        ) : (
          <p className="no-movies">No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default MovieList;
