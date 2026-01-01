import express, { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import postControllers from "./post.controller";
import { validate } from "../../middleware/validate";
import { createPostSchema } from "./post.schema";
import { isAuthenticate } from "../../middleware/auth-middlewares";


const router = express.Router();


router.get("/all",asyncHandler(postControllers.getAllPosts));
router.get("/all/:postId", asyncHandler(postControllers.getPostDetails));
router.put("/all/:postId/update",isAuthenticate("USER","ADMIN"),asyncHandler(postControllers.updatePost));
router.delete("/all/:postId",isAuthenticate("USER","ADMIN"),asyncHandler(postControllers.deletePost));
router.post("/create-new",isAuthenticate("USER","ADMIN"), validate(createPostSchema),asyncHandler(postControllers.createPost));
const postRouter:Router = router;
export default postRouter