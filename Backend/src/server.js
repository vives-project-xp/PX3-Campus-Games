import express from 'express'; 
import dotenv from 'dotenv';

const app = express(); // Create an Express app
dotenv.config() // Load environment variables from .env file

const port = process.env.DB_PORT;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`vives-card-game-backend app listening on port ${port}`)
})