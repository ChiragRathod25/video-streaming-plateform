import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  changeCurrentPassword,
  refreshAccessToken,
  getCurrentUser,
  updateUserAvatar,
  updateAccountDetails
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
router.route("/user-details").get(verifyJWT, getCurrentUser);

//secured route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-account").post(verifyJWT,updateAccountDetails);

router
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
