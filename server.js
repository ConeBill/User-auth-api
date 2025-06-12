// Feito a partir do zero
import authRoutes from './routes/auth.js';
import documentationRoutes from './routes/documentation.js';

// Já vem pronto
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5000';

const app = express();
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

await mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('DB conected'))
.catch(err => console.error(err));

app.use('/docs', documentationRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ON na porta ${PORT}`);
});
