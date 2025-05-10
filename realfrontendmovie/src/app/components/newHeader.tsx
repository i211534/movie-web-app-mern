'use client';
import { getAccessToken, getCategories, getMovies, getProfile, getProfilelow, removeAccessToken } from '@/services/api';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Category, Movie } from '../types'; // Import Movie type
import Link from 'next/link';
import Chat from './chat/Chat';

interface HeaderProps {
  currentPage: string;
  movies: Movie[];
}

const Header: React.FC<HeaderProps> = ({ currentPage, movies }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const router = useRouter();
  const pathname = usePathname() || '/';

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);
    console.log("Token in chatlist",token)
    if (token) {
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
    } else {
      setProfile(null);
    }
  }, []);

  const handleLogout = () => {
    removeAccessToken();
    setIsLoggedIn(false);
    router.push('/login');
  };

  const toggleMenu = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setMenuVisible(!menuVisible);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0 && movies) {
      const results = movies.filter(m =>
        m.title.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleMovieClick = (id: number) => {
    router.push(`/movies/${id}`);
  };

  useEffect(() => {
    const closeMenu = () => {
      setMenuVisible(false);
    };

    if (menuVisible) {
      window.addEventListener('click', closeMenu);
    } else {
      window.removeEventListener('click', closeMenu);
    }

    return () => {
      window.removeEventListener('click', closeMenu);
    };
  }, [menuVisible]);

  const handleProfileClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent Bootstrap or other elements from interfering with this event
  };

  const handleUpdateProfile = () => {
    router.push('/profile');
  };

  const profileImageUrl = profile && profile.image ? `http://localhost:3000${profile.image}` : '';

  return (
    <header className="header" onClick={handleProfileClick}>
      <div className="logo">CineMagic</div>
      <nav>
        <ul className="nav-links">
        <Chat />
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for movies"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(movie => (
                  <div
                    key={movie.id}
                    className="search-result-item"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    {movie.title}
                  </div>
                ))}
              </div>
            )}
          </div>
          <li>
            <Link href="/">Home</Link>
          </li>
          {!isLoggedIn && pathname !== '/login' && (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}
          {isLoggedIn  && (
            <li className="profile-menu">
              <img
                src={profileImageUrl}
                alt="Profile"
                className="profile-image"
                onClick={toggleMenu}
              />
              {menuVisible && (
                <div className="dropdown-menu">
                  <button onClick={handleUpdateProfile}>Update Profile</button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>
      {error && <p className="error-message">{error}</p>}
      <style jsx>{`
        .logo {
          font-size: 24px;
          font-weight: bold;
        }
        .nav-links {
          display: flex;
          align-items: center;
          list-style: none;
        }
        .nav-links li {
          margin: 0 10px;
        }
        .nav-links a,
        .nav-links button {
          color: white;
          text-decoration: none;
          font-size: 18px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-links li:hover {
          color: #e50914;
        }
        .profile-menu {
          position: relative;
          display: flex;
          align-items: center;
        }
        .profile-image {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-left: 10px;
        }
        .dropdown-menu {
          position: absolute;
          top: 50px;
          right: 0;
          background-color: #444;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          overflow: hidden;
          z-index: 1000;
        }
        .dropdown-menu button {
          display: block;
          width: 100%;
          padding: 10px 20px;
          background-color: #444;
          color: white;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .dropdown-menu button:hover {
          background-color: #555;
        }
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          margin-left: 20px;
        }
        .search-input {
          padding: 5px 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 200px;
        }
        .search-results {
          position: absolute;
          top: 35px;
          left: 0;
          background-color: black;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
          max-height: 200px;
          overflow-y: auto;
          z-index: 1000;
        }
        .search-result-item {
          padding: 10px;
          cursor: pointer;
        }
        .search-result-item:hover {
          background-color: #f0f0f0;
        }
        .error-message {
          color: red;
          margin-top: 10px;
        }
      `}</style>
    </header>
  );
};

export default Header;
