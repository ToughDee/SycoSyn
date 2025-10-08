import { Router } from 'express';
import {
  toggleFollow,
  getUserFollowers,
  getUserFollowings
} from "../controllers/follow.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/p/:profileId")
    .get(getUserFollowings)
    .post(toggleFollow);

router.route("/u/:profileId").get(getUserFollowers);

export default router