import e, { Router } from 'express';
import { upload } from '../Middleware/multer.middleware.js';
import { RegisterPatient, LoginPatient
} from '../Controllers/patient.controllers.js';

import { verifyPatientJWT } from '../Middleware/PatientAuth.middleware.js';

const router = Router();

router.route("/registerPatient").post(
  upload.fields({
     name : "avatar",
     maxCount : 1
  }),
  RegisterPatient)


  router.route("/login").post(LoginPatient);

  export default router;