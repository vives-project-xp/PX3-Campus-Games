import express from 'express'; 
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';

const app = express(); // Create an Express app
dotenv.config() // Load environment variables from .env file

const port = process.env.DB_PORT;

app.use(express.json());
app.use('/api', userRoutes);

// hello world
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`vives-card-game-backend app listening on port ${port}`)
})
// print dotenf file

console.log(process.env.DB_PORT);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
console.log(process.env.DB_DTBS);
console.log(process.env.DB_HOST);
