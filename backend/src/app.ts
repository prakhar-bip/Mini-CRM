import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import healthRouter from './routes/health.routes';
import authRouter from './routes/auth.routes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

app.use(
  cors({
    origin: [config.frontendUrl, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', healthRouter);
app.use('/api/auth', authRouter);

app.use(errorHandler);

export default app;
