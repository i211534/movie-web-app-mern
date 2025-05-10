# Movie Web App (MERN)

This is a full-stack movie web application built with the MERN stack (MongoDB, Express, React, and Node.js). The application offers the following features:

- **User Authentication**: Secure login and registration system.
- **Dynamic Movie Browsing**: Explore a wide range of movies with an intuitive interface.
- **Search Functionality**: Easily find your favorite movies or discover new ones.
- **Responsive Design**: Optimized for seamless streaming and discovery across different devices.
  
![image](https://github.com/user-attachments/assets/c6babb69-4460-4e51-a761-c999f17d79a3)

![image](https://github.com/user-attachments/assets/5a0cbabc-5709-45d8-8644-3352fc156c7e)

![image](https://github.com/user-attachments/assets/69915747-194c-4fc2-bf58-01a7db5ff67c)

![image](https://github.com/user-attachments/assets/19430d4d-314e-47d0-a0c9-5d18f3e5416b)

![image](https://github.com/user-attachments/assets/314dadc2-4176-417f-84e2-dac4cbc8595c)

# CineMagic - Movie Web App (MERN Stack)

CineMagic is a full-stack movie web application built with the MERN stack (MongoDB, Express, React, and Node.js). The application provides a comprehensive platform for movie enthusiasts to explore, discover, and engage with their favorite films.

![image](https://github.com/user-attachments/assets/5a0cbabc-5709-45d8-8644-3352fc156c7e)

## Features

### User Authentication
- Secure login and registration system
- User profile management
- Password update functionality
- Profile picture customization

### Movie Browsing & Discovery
- Categorized movies by genre (Horror, Fantasy, Action, etc.)
- Featured movie recommendations
- Movie rating system (5-star scale)
- Detailed movie information

### Interactive Experience
- Search functionality for quick movie discovery
- User ratings and reviews
- Responsive design for all devices
- User-friendly interface

## Application Screenshots

### Authentication Page
![image](https://github.com/user-attachments/assets/c6babb69-4460-4e51-a761-c999f17d79a3)
The application features a clean, user-friendly authentication system with login and registration options.

### Movie Gallery
![image](https://github.com/user-attachments/assets/5a0cbabc-5709-45d8-8644-3352fc156c7e)
Browse through a rich collection of movies with rating information, featuring popular titles like Superman, Scream 3, Friday the 13th, and Batman.

### User Profile
![image](https://github.com/user-attachments/assets/19430d4d-314e-47d0-a0c9-5d18f3e5416b)
Users can manage their profile information, update personal details, and customize their experience.

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- CSS/SCSS for styling
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication

### Database Schema
The application uses a comprehensive database structure including:
- User management
- Movie cataloging
- Rating system
- Chat/messaging functionality
- Session handling

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/cinemagic.git
cd cinemagic
```

2. Install dependencies for backend
```bash
cd server
npm install
```

3. Install dependencies for frontend
```bash
cd ../client
npm install
```

4. Configure environment variables
Create `.env` files in both client and server directories with necessary environment variables:

Server:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Client:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Run the application
```bash
# Start backend server
cd server
npm start

# In a new terminal, start frontend
cd client
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update password

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/genre/:genre` - Get movies by genre
- `POST /api/movies/:id/rate` - Rate a movie

### Additional Features

![image](https://github.com/user-attachments/assets/69915747-194c-4fc2-bf58-01a7db5ff67c)

![image](https://github.com/user-attachments/assets/314dadc2-4176-417f-84e2-dac4cbc8595c)

## Future Enhancements

- Watchlist functionality
- Social sharing features
- Advanced recommendation system
- Enhanced user interaction features
- Advanced search with filters

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

Developed by [ Muhammad Zafar ](https://github.com/i211534)



