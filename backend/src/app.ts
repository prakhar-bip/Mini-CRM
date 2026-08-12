import path from 'path';
import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import healthRouter from './routes/health.routes';
import authRouter from './routes/auth.routes';
import customerRouter from './routes/customer.routes';
import productRouter from './routes/product.routes';
import challanRouter from './routes/challan.routes';
import dashboardRouter from './routes/dashboard.routes';
import userRouter from './routes/user.routes';
import reportRouter from './routes/report.routes';
import requestRouter from './routes/request.routes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        config.frontendUrl,
        config.frontendUrl.replace(/\/$/, ''),
        'http://localhost:5173',
        'http://localhost:3000',
        'https://mini-crm-pink.vercel.app',
      ];
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/customers', customerRouter);
app.use('/api/products', productRouter);
app.use('/api/challans', challanRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportRouter);
app.use('/api/requests', requestRouter);

app.use(errorHandler);

export default app;

