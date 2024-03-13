import { Router } from 'express'; 
import { GetDoctorAppointments, GetPatientAppointments } from '../Controllers/appointment.controllers.js';

import { verifyPatientJWT } from '../Middleware/PatientAuth.middleware.js';

const router = Router();


router.route("/GetDoctorAppointments").get(verifyPatientJWT ,GetDoctorAppointments);

router.route("/GetPatientAppointments").get(verifyPatientJWT ,GetPatientAppointments);

export default router;