"use client";
import Rating from '@/app/components/Rating';
import { Movie, Category } from '@/app/types';  // Assuming you have a Category type defined
import { getMovies, getCategories } from '@/services/api';
import { useEffect, useState } from 'react';

interface MoviePageProps {
  id: number;
  onBack: () => void;
}

const MoviePage: React.FC<MoviePageProps> = ({ id, onBack }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const fetchMovie = async () => {
        const movies: Movie[] = await getMovies();
        const movie = movies.find((m: Movie) => m.id === id);
        console.log("In movies section: ",movie)
        setMovie(movie || null);

        if (movie) {
          const categories: Category[] = await getCategories();
          const category = categories.find((c: Category) => c.id === movie.categoryId);
          setCategoryName(category ? category.name : 'Unknown Category');
        }
      };

      fetchMovie();
    }
  }, [id]);

  useEffect(() => {
    if (selectedCategory !== null) {
      const fetchCategoryName = async () => {
        const categories: Category[] = await getCategories();
        const category = categories.find((c: Category) => c.id === selectedCategory);
        setCategoryName(category ? category.name : 'Unknown Category');
      };

      fetchCategoryName();
    }
  }, [selectedCategory]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-page">
      <button onClick={onBack} style={{ marginBottom: '10px' }}>Back to list</button>
      <div className="movie-content">
        <div className="image-display-real">
          <img src={movie.image} alt="recommendedimagereal" className="recommendedimagereal" />
          <div className="rating-below-image">
            <Rating movieId={movie.id} />
            
          </div>
        </div>
        <div className="movie-details">
          <h1 style={{ color: '#FFFFFF' }}>{movie.title}</h1>
          <p style={{ color: '#FFFFFF' }}>Category: {categoryName}</p>
          <p style={{ color: '#FFFFFF' }}>Description: {movie.description}</p>
        </div>
      </div>
    </div>
  );
}

export default MoviePage;