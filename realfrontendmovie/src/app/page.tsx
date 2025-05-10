"use client";

import { useEffect, useState } from 'react';
import { getMovies, getMoviesByCategory, getAccessToken, getProfile } from '../services/api';
import Header from './components/newHeader';
import { getProfilelow } from '../services/api';
import MovieCategories from './components/moviecategories';
import MovieList from './components/MovieList';
import RecommendedMovies from './components/RecommendedMovies';
import { usePathname } from 'next/navigation';
import './globals.css'; // Ensure your global styles are imported

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [profile, setProfile] = useState<any>({});
  const [error, setError] = useState('');
  const pathname = usePathname() || '/'; // Provide a default value in case pathname is null

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      async function fetchProfile() {
        try {
          const datalow = await getProfilelow();
          setProfile(datalow);
          console.log("In profile", datalow.userId);
  
          // Then fetch using getProfile with userId from the first fetch
          const data = await getProfile(datalow.userId);
          setProfile(data);
        } catch (error) {
          setError('Failed to fetch profile');
        }
      }
      fetchProfile();
    } else {
     // setError('Please log in first.');
    }
  

    const fetchMovies = async () => {
      const data = selectedCategory
        ? await getMoviesByCategory(selectedCategory)
        : await getMovies();
      setMovies(data);
    };

    fetchMovies();
  }, [selectedCategory]);

  return (
    <div className="home-page">
      <Header currentPage={pathname} movies={movies}/>
      <MovieCategories setSelectedCategory={setSelectedCategory} />
      <div className="movie-section">
        <MovieList movies={movies} />
      </div>
      {getAccessToken() && profile.id && (
        <div className="recommend-movies">
          <h2 className="recommendmoviemainheading">Recommended Movies</h2>
          <RecommendedMovies />
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default HomePage;
