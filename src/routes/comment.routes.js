import {Router} from "express";
import { getVideoComments,addComment,updateComment,deleteComment, } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=new Router();

// apply verifyJWT to all routes of "router" 
router.use(verifyJWT)

router.route(":/VideoId").get(getVideoComments).post(addComment)
router.route("/c/:commentId").delete(deleteComment).patch(updateComment)

export default router;