import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import cityRoutes from './routes/cityRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
export const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.get('/api/health', (_req, res) => {
res.status(200).json({
success: true,
message: 'Server is running',
});
});
app.use('/api/cities', cityRoutes);
app.use('/api/weather', weatherRoutes);
app.use((_req, res) => {
res.status(404).json({
success: false,
message: 'Маршрут не знайдено',
});
});
