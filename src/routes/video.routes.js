import { Router } from "express";
import { upload } from "../middlewares/multer.minddleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishVideo,
  togglePublishStatus,
  updateVideoDetails,
  updateVideoThumbnail,
} from "../controllers/video.controller.js";

const router = new Router();
router.use(verifyJWT);

router
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      { name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }
    ]),
    publishVideo
  );

router.route("/:videoId").get(getVideoById).delete(deleteVideo);

router
  .route("/update/thumbnail/:videoId")
  .patch(upload.single("thumbnail"), updateVideoThumbnail);

router.route("/update/details/:videoId").patch(updateVideoDetails);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
