import {Router} from 'express';
import { getReports } from '../Controllers/report.controllers.js';
import { verifyPatientJWT } from '../Middleware/PatientAuth.middleware.js';

const router = Router();
const verifyPatient = verifyPatientJWT;


router.route("/getReports").get( verifyPatient ,getReports);

export default router;