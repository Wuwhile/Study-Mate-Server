const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/auth');

router.post('/appointment/saveAppointment', authenticateToken, appointmentController.saveAppointment);
router.get('/appointment/list', authenticateToken, appointmentController.getAppointmentList);
router.get('/appointment/listByDoctorId/:doctorId', authenticateToken, appointmentController.getAppointmentByDoctorId);
router.get('/appointment/listByPatientPhone/:patientPhone', authenticateToken, appointmentController.getAppointmentByPatientPhone);
router.get('/appointment/:id', authenticateToken, appointmentController.getAppointmentDetail);
router.put('/appointment', authenticateToken, appointmentController.updateAppointment);
router.delete('/appointment/:id', authenticateToken, appointmentController.deleteAppointment);
router.delete('/appointment/batch', appointmentController.batchDeleteAppointment);
router.get('/appointment/count', appointmentController.getAppointmentCount);

module.exports = router;
