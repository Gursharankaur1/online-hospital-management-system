import express from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from '../controllers/patientController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.route('/').get(getPatients).post(createPatient);
router.route('/:id').get(getPatientById).put(updatePatient).delete(deletePatient);

export default router;
