import { Router } from 'express';
import {
    deleteArt,
    getAllArts,
    getArtById,
    publishAnArt,
    togglePublishStatus,
    updateArt,
} from "../controllers/art.controllers.js"
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import {upload} from "../middlewares/multer.middlewares.js"

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .get(getAllArts)
    .post(
        upload.fields([
            {
                name: "artFile",
                maxCount: 1,
            }
        ]),
        publishAnArt
    );

router
    .route("/:artId")
    .get(getArtById)
    .delete(deleteArt)
    .patch(upload.single("artFile"), updateArt);

router.route("/toggle/publish/:artId").patch(togglePublishStatus);

export default router