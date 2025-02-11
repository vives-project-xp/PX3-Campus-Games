import express from 'express'; 
import dotenv from 'dotenv';
import cors from 'cors';

const app = express(); // Create an Express app
dotenv.config() // Load environment variables from .env file

const port = process.env.DB_PORT;

const corsOptions = {
    origin: "http://localhost:5173", // Allow requests from the React app
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
    credentials: true, // Allow credentials (e.g., cookies, authorization headers)
};
app.use(cors(corsOptions));

// hello world
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`vives-card-game-backend app listening on port ${port}`)
})