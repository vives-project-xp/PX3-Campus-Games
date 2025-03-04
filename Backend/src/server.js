import express from 'express'; 
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';
import pool from './db.js';  // Importeer database connectie

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT; // Gebruik PORT in plaats van DB_PORT

app.use(express.json());
app.use('/api', apiRoutes);
app.use(cors({ // Updated CORS configuration for Docker
  origin: '*', // Allow all origins for Docker
}));

app.use((req, res, next) => { // Log alle inkomende requests
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Hello World route
app.get('/', (req, res) => {
  res.send('Hello World!')
});

// Test database verbinding
app.get('/test-db', async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT 1 + 1 AS result');
      res.send(`✅ Database connectie succesvol! Resultaat: ${rows[0].result}`);
  } catch (err) {
      console.error("❌ Database fout:", err);
      res.status(500).send("Database connectie mislukt!");
  }
});

app.listen(port, () => {
  console.log(`🚀 vives-card-game-backend draait op http://localhost:${port}`);
});
