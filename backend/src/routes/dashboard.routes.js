import { Router } from 'express';
import {
    getChannelStats,
    getChannelArts,
} from "../controllers/dashboard.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router.route("/arts").get(getChannelArts);

export default router