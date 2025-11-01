import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { cloudinaryConfig } from './utils/cloudinaryConfig.js';
import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import adminRoute from './routes/adminRoute.js';
import vendorRoute from './routes/venderRoute.js';
import aiRoutes from './routes/aiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// ---------- GLOBAL MIDDLEWARE (must be BEFORE routes) ----------
const allowedOrigins = [
  'http://localhost:5173',
  'https://rent-a-ride-two.vercel.app',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,                         // allow cookies to be sent
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
}));
app.options('*', cors({ origin: allowedOrigins, credentials: true })); // preflight

app.use(express.json());
app.use(cookieParser());
app.use('*', cloudinaryConfig);

// ------------------ ROUTES ------------------
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/vendor', vendorRoute);
app.use('/api/ai', aiRoutes);               // <- your AI endpoints

// --------------- ERROR HANDLER ---------------
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal server error';
  res.status(statusCode).json({ success: false, message, statusCode });
});

// --------------- START SERVER ---------------
const port = process.env.PORT || 3000;

mongoose.connect(process.env.mongo_uri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => console.log(`Server listening on ${port}`));
  })
  .catch(err => {
    console.error('Mongo connect error:', err);
    process.exit(1);
  });
