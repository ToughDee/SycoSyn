import { Router } from 'express';
import { authCheck, googleAuth } from '../controllers/auth.controllers.js';

const router = Router();

router.route("/check").get(authCheck)
router.route("/google").post(googleAuth)

export default router