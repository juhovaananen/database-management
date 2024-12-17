import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const app = express();
const PORT = 3001;


app.use(bodyParser.json());


const pool = new Pool({
    user: 'your_postgres_username', 
    host: 'localhost',
    database: 'movie_api',
    password: 'your_postgres_password', 
    port: 5432,
});


pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the PostgreSQL database');
    }
});


app.post('/users', async (req, res) => {
    const { username, email, password_hash } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password_hash]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/movies', async (req, res) => {
    const { title, release_date, description, rating } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO movies (title, release_date, description, rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, release_date, description, rating]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/movies', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM movies');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM movies WHERE movie_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Genres Endpoints ---

// Create a new genre
app.post('/genres', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query('INSERT INTO genres (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/genres', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM genres');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/reviews', async (req, res) => {
    const { movie_id, user_id, review_text, rating } = req.body;
    if (rating < 0 || rating > 10) {
        return res.status(400).json({ message: 'Rating must be between 0 and 10' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO reviews (movie_id, user_id, review_text, rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [movie_id, user_id, review_text, rating]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/reviews/:movie_id', async (req, res) => {
    const { movie_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM reviews WHERE movie_id = $1', [movie_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/watchlist', async (req, res) => {
    const { user_id, movie_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO watchlist (user_id, movie_id) VALUES ($1, $2) RETURNING *',
            [user_id, movie_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/watchlist/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM watchlist WHERE user_id = $1', [user_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:5432`);
});


