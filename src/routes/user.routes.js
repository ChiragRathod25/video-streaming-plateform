import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updatedUserCoverImage,
  updateAccountDetails,
  getUserChannelProfile,
  getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.minddleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);

//secured route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").patch(verifyJWT, changeCurrentPassword);
router.route("/update-account").patch(verifyJWT,updateAccountDetails);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updatedUserCoverImage);

router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory);




export default router;
