CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);


CREATE TABLE movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_date DATE,
    description TEXT,
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 10)
);


CREATE TABLE genres (
    genre_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE movies_genres (
    movie_id INTEGER NOT NULL REFERENCES movies(movie_id),
    genre_id INTEGER NOT NULL REFERENCES genres(genre_id),
    PRIMARY KEY (movie_id, genre_id)
);


CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    movie_id INTEGER NOT NULL REFERENCES movies(movie_id),
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    review_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 0 AND rating <= 10)
);


CREATE TABLE watchlist (
    watchlist_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    movie_id INTEGER NOT NULL REFERENCES movies(movie_id),
    UNIQUE (user_id, movie_id)
);