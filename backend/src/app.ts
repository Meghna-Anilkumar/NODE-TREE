import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
import nodeRoutes from './routes/node.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { NODE_ROUTES } from './constants/node.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const clientUrl = process.env.CLIENT_URL 
const corsOptions: cors.CorsOptions = {
    origin: clientUrl
};
app.use(cors(corsOptions))
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(`/api${NODE_ROUTES.BASE}`, nodeRoutes);


app.use(errorMiddleware);


const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;