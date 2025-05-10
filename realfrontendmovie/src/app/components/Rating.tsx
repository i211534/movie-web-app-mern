import { useState, useEffect } from 'react';
import { rateMovie, getAccessToken, getProfile, getMovieRating } from '@/services/api';
import { getProfilelow } from '@/services/api';

interface RatingProps {
  movieId: number;
}

const Rating: React.FC<RatingProps> = ({ movieId }) => {
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [shouldRenderStars, setShouldRenderStars] = useState(true);
  const [profile, setProfile] = useState<any>({});
  const [error, setError] = useState('');
  const [showUserRating, setShowUserRating] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    
      async function fetchProfile() {
        try {
          const datalow = await getProfilelow();
          setProfile(datalow);
          const data = await getProfile(datalow.userId);
          setProfile(data);
        } catch (error) {
          
        }
      }
      fetchProfile();
    
  }, []);

  useEffect(() => {
    async function fetchMovieRating() {
      try {
        const { avgRating, count } = await getMovieRating(movieId);
        setAverageRating(avgRating);
        setRatingCount(count);
      } catch (error) {
        setError('Failed to fetch movie rating');
      }
    }
    fetchMovieRating();
  }, [movieId]);

  const handleRating = async (newRating: number) => {
    setRating(newRating);
    setShowUserRating(true);
    if (profile.id) {
      try {
        await rateMovie(movieId, newRating, parseInt(profile.id));
        setTimeout(async () => {
          const { avgRating, count } = await getMovieRating(movieId);
          setAverageRating(avgRating);
          setRatingCount(count);
          setShowUserRating(false);
        }, 500); // Show user rating for 1 second
      } catch (error) {
        setError('Failed to rate movie');
      }
    } else {
      setError('Failed to rate movie');
    }
  };

  const renderStars = (currentRating: number) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex' }}>
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              onClick={() => handleRating(index + 1)}
              style={{
                cursor: 'pointer',
                color: index < currentRating ? 'gold' : 'gray',
                fontSize: '24px'
              }}
            >
              ★
            </span>
          ))}
        </div>
        <span style={{ marginLeft: '8px', color: 'white' }}>
          ({averageRating.toFixed(2)})
        </span>
      </div>
    );
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {shouldRenderStars && renderStars(showUserRating ? rating : Math.round(averageRating))}
      <p style={{ color: 'white' }}>{ratingCount} ratings</p>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Rating;
