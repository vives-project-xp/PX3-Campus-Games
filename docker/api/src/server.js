import express from 'express'; 
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';
import pool from './db.js';  // Importeer database connectie
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerDocs from './utils/swagger.js';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Gebruik PORT in plaats van DB_PORT

app.use(express.json());
app.use(cors({ // Updated CORS configuration for Docker
  origin: '*', // Allow all origins for Docker
}));

app.use((req, res, next) => { // Log alle inkomende requests
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/api', apiRoutes);

// Hello World route
app.get('/', (req, res) => {
  res.send('Hello World! from the backend');
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

// Verkrijg de directorynaam
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('Directory:', __dirname);


// Serveer de Cards map
app.use('/api/Cards', (req, res, next) => {
  console.log(`Serving static file: ${req.url}`);
  next();
}, express.static(path.join(__dirname, 'Cards')));

// Fallback route voor niet-bestaande routes
app.use((req, res) => {
  res.status(404).send('Route niet gevonden');
});

app.listen(port, () => {
  console.log(`🚀 vives-card-game-backend draait op http://localhost:${port}`);

  swaggerDocs(app, port); // Genereer Swagger documentatie
  console.log(`Swagger(API) documentatie beschikbaar op http://localhost:${port}/docs`);
});