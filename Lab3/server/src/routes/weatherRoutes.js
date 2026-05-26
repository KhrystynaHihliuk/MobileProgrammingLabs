import { Router } from 'express';
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getForecast,
} from '../controllers/weatherController.js';

const router = Router();

router.get('/current', getCurrentWeather);
router.get('/forecast', getForecast);
router.get('/current-by-coords', getCurrentWeatherByCoords);

export default router;