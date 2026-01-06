import express, { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import postControllers from "./post.controller";
import { validate } from "../../middleware/validate";
import { createPostSchema } from "./post.schema";
import { isAuthenticate } from "../../middleware/auth-middlewares";


const router = express.Router();



const auth = isAuthenticate("USER", "ADMIN");


/**
 * @swagger
 * /api/v1/post:
 *   get:
 *     summary: Get all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: All posts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostResponse'
 */
router.route("/").get(asyncHandler(postControllers.getAllPosts))




router.route("/:postId")
  .get(asyncHandler(postControllers.getPostDetails));

/**
 * Protected Routes
 */
router.use(auth); // Apply auth to everything below this line

router.route("/")
  .post(validate(createPostSchema), asyncHandler(postControllers.createPost));

router.route("/:postId")
  .put(asyncHandler(postControllers.updatePost))
  .delete(asyncHandler(postControllers.deletePost));

// User specific posts
router.get("/user/:userId", asyncHandler(postControllers.getAllPostsByUserId));

/**
 * Saved Posts Sub-resource
 */
router.route("/saved/:userId")
  .get(asyncHandler(postControllers.getSavedPostsList))
  .post(asyncHandler(postControllers.createNewSavedPost));

router.delete("/saved/:postId", asyncHandler(postControllers.deleteSavedPost));





const postRouter:Router = router;


export default postRouter
