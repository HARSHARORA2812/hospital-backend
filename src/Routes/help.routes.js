import { Router } from 'express'; 
import { createHelpRequest , getHelpRequests } from '../Controllers/help.controllers.js';

const router = Router();

router.route("/createHelpRequest").post(createHelpRequest);

router.route("/getHelpRequests").get(getHelpRequests);

export default router;  