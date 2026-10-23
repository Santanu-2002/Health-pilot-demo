import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { listMyAppointments, createAppointment, cancelAppointment } from '../controllers/appointmentController.js';
const router = Router();
router.use(requireAuth);
router.get('/', listMyAppointments);
router.post('/', createAppointment);
router.patch('/:id/cancel', cancelAppointment);
export default router;
