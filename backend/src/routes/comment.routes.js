import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getArtComments,
    updateComment,
} from "../controllers/comment.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:artId").get(getArtComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router