import express from 'express';
import cors from 'cors';
import type { MenuItem, Order } from '@repo/types';
import { formatPrice } from '@repo/utils';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
