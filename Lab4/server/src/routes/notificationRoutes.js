import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  registerWebToken,
  sendWebTestNotification,
  checkWeatherAlerts,
} from '../controllers/notificationController.js';

console.log('notificationRoutes LOADED');
const router = Router();
router.get('/debug-route', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'notificationRoutes працює',
  });
});
router.use(requireAuth);

router.post('/register-web-token', registerWebToken);
router.post('/send-web-test', sendWebTestNotification);
router.post('/check-weather-alerts', checkWeatherAlerts);

export default router;