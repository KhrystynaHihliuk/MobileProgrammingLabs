import { Router } from 'express';
import {
createCity,
deleteCity,
getCities,
getCityById,
updateCity,
} from '../controllers/cityController.js';
const router = Router();
router.get('/', getCities);
router.get('/:id', getCityById);
router.post('/', createCity);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);
export default router;
