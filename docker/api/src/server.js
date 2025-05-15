import express from 'express'; 
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js';
import pool from './db.js';  // Import your database connection
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import swaggerDocs from './utils/swagger.js';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Use PORT from environment variables

app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  websockets: true, // Allow WebSocket connections
}));

app.use((req, res, next) => { 
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Hello World! from the backend');
});

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.send(`✅ Database connectie succesvol! Resultaat: ${rows[0].result}`);
  } catch (err) {
    console.error("❌ Database fout:", err);
    res.status(500).send("Database connectie mislukt!");
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('Directory:', __dirname);

app.use('/api/Cards', (req, res, next) => {
  console.log(`Serving static file: ${req.url}`);
  next();
}, express.static(path.join(__dirname, 'Cards')));

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO server and allow CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // Allow all origins
  }
});

// Map user IDs to socket IDs for later notifications
const userSockets = {};

io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);
  
  socket.on('register', (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} registered with socket id ${socket.id}`);
  });

  socket.on('joinTradeRoom', (tradeCode) => {
    socket.join(tradeCode);
    console.log(`User joined trade room: ${tradeCode}`);
  });
});

// Export io and userSockets for use in controllers (e.g., TradingController.js)
export { io, userSockets };

// Generate Swagger documentation
swaggerDocs(app, port); 

// Start the server
server.listen(port, () => {
  console.log(`🚀 vives-card-game-backend draait op http://localhost:${port}`);
});


app.use((req, res) => {
  res.status(404).send('Route niet gevonden');
});