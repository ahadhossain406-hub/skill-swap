import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/healthRoutes.js';

const app = express();

// Middleware: protita request ei line-gulo-r moddhe diye jay.
app.use(cors({ origin: env.clientUrl })); // shudhu amader frontend-ke allow
app.use(express.json()); // request body (JSON) pore
app.use(morgan('dev')); // terminal-e log

// Routes
app.use('/api/health', healthRoutes);

// Shob route-er niche: na mile 404, error hole error handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;