import React, { useState, useEffect } from 'react';
import { Movie } from "../types";
import MoviePage from './MoviePage';  // Import the MoviePage component
import { getRecommendedMovies, getAccessToken, getProfile, getProfilelow } from '@/services/api';
import Rating from './Rating';

const RecommendedMovies: React.FC = () => {
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>({});

  useEffect(() => {
    const fetchProfileAndRecommendedMovies = async () => {
      const token = getAccessToken();
      console.log("Token in recommend movies: ",token)
      if (token) {
        try {
          const datalow = await getProfilelow();
          setProfile(datalow);
          console.log("In profile", datalow.userId);

          if (datalow.userId) {
            console.log("Before recommended movies User asking for recommendation",datalow.userId)
            const recommendedMoviesData = await getRecommendedMovies(datalow.userId);
            console.log("Recommended Movie: ", recommendedMoviesData);
            setRecommendedMovies(recommendedMoviesData);
          } else {
            setError('Failed to get user ID from profile.');
          }
        } catch (error) {
          setError('Failed to fetch profile or recommended movies');
        }
      } else {
        setError('Please log in first.');
      }
    };

    fetchProfileAndRecommendedMovies();
  }, []);

  const handleMovieClick = (id: number) => {
    setSelectedMovieId(id);  // Set the selected movie ID
  };

  const handleBackToList = () => {
    setSelectedMovieId(null);  // Reset selected movie ID to show movie list
  };
  
  return (
    <div className="recommended-movies">
      {selectedMovieId !== null ? (
        <MoviePage id={selectedMovieId} onBack={handleBackToList} />
      ) : (
        <div>
          {recommendedMovies.length === 0 && <p>No recommended movies found.</p>}
          <div className="image-display-real" style = {{display : 'flex',  gap: '2rem'}}>
          {recommendedMovies.map((movie) => (
            <div 
              key={movie.id} 
             
              className="movie-item-recommend" 
              onClick={() =>{ 
                console.log('Clicked movie:', movie);
                handleMovieClick(movie.id)}}
              style={{ cursor: 'pointer' }}
            >
            <div className="recommendation-components">
                <div className="image-display-real">
                  <img src={movie.image} alt="recommendedimagereal" className="recommendedimagereal" />
                </div>
                <h3 >{movie.title}</h3>
                <Rating movieId={movie.id} />
              </div>
             
            </div>
          ))}
          </div>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default RecommendedMovies;
