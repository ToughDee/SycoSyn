import { Router } from 'express';
import {
    addCollaborators,
    addArtToBoard,
    createBoard,
    deleteBoard,
    getBoardById,
    getUserBoards,
    removeArtFromBoard,
    updateBoard,
    getBookmarks,
} from "../controllers/board.controllers.js"
import {upload} from '../middlewares/multer.middlewares.js'
import {verifyJWT} from "../middlewares/auth.middlewares.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createBoard)

router.route("/bookmarks").get(getBookmarks)

router
    .route("/:boardId")
    .get(getBoardById)
    .patch(upload.single("coverImage"), updateBoard)
    .delete(deleteBoard)

router.route("/collaborate/:boardId/:username").post(addCollaborators)

router.route("/add/:artId/:boardId").patch(addArtToBoard);
router.route("/remove/:artId/:boardId").patch(removeArtFromBoard);

router.route("/user/:userId").get(getUserBoards);

export default router