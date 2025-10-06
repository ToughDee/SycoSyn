import { Router } from 'express';
import {
    getLikedArts,
    toggleCommentLike,
    toggleArtLike,
} from "../controllers/like.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/a/:artId").post(toggleArtLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/arts").get(getLikedArts);

export default router