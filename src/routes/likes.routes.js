import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getLikedVideo, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router=new Router();
router.use(verifyJWT)

router.route("/toggle/v/:videoId").patch(toggleVideoLike)
router.route("/toggle/c/:commentId").patch(toggleCommentLike)
router.route("/toggle/t/:tweetId").patch(toggleTweetLike)
router.route("/videos").get(getLikedVideo)

export default router