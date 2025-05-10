// src/pages/movies/[id].tsx
"use client";
import { useRouter } from 'next/router';
import Rating from '@/app/components/Rating';
import { Movie, Category } from '@/app/types';  // Assuming you have a Category type defined
import { getMovies, getCategories } from '@/services/api';
import { useEffect, useState } from 'react';

const MoviePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchMovie = async () => {
        const movies: Movie[] = await getMovies();
        const movie = movies.find((m: Movie) => m.id === Number(id));
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

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-page">
      <button onClick={() => router.back()} style={{ marginBottom: '10px' }}>Back to list</button>
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
