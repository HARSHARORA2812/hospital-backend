import e, { Router } from 'express';
import { upload } from '../Middleware/multer.middleware.js';
import { RegisterDoctor , LoginDoctor , LogoutDoctor , getCurrentDoctor , updateCurrentDoctor
} from '../Controllers/doctor.controllers.js';

import { verifyDoctorJWT } from '../Middleware/DoctorAuth.middleware.js';

const router = Router();

router.route("/RegisterDoctor").post(RegisterDoctor);
router.route("/LoginDoctor").post(LoginDoctor);
router.route("/LogoutDoctor").post(verifyDoctorJWT,LogoutDoctor);
router.route("/getCurrentDoctor").get(verifyDoctorJWT,getCurrentDoctor);
router.route("/updateCurrentDoctor").patch(verifyDoctorJWT,updateCurrentDoctor);


export default router;