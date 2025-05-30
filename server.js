import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import webhookRoute from './routes/webhook.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ RAW middleware must come BEFORE express.json()
app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoute);

// ✅ Normal middleware for everything else
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send("Lock’d In booking backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
