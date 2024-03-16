import {Router} from 'express';
import { GetPatientReport } from '../Controllers/report.controllers.js';
import { verifyPatientJWT } from '../Middleware/PatientAuth.middleware.js';

const router = Router();
const verifyPatient = verifyPatientJWT;


router.route("/GetPatientReport").get( verifyPatient ,GetPatientReport);

export default router;