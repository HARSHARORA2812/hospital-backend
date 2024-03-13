import e, { Router } from 'express';
import { upload } from '../Middleware/multer.middleware.js';
import { RegisterPatient, LoginPatient , LogoutPatient , getCurrentPatient , updateCurrentPatient , updatePatientAvatar
} from '../Controllers/patient.controllers.js';

import { verifyPatientJWT } from '../Middleware/PatientAuth.middleware.js';

const router = Router();

router.route("/registerPatient").post(RegisterPatient)
router.route("/loginPatient").post(LoginPatient);
router.route("/LogoutPatient").post(verifyPatientJWT,LogoutPatient);
router.route("/currentPatient").get(verifyPatientJWT,getCurrentPatient);
router.route("/updatePatient").patch(verifyPatientJWT,updateCurrentPatient);
router.route("/updatePatientAvatar").patch(verifyPatientJWT,upload.single("avatar"),updatePatientAvatar);

  export default router;