import express, { Router } from "express";
import { isAuthenticate } from "../../middleware/auth-middlewares";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { commentSchemas } from "./comment.schema";
import { commentControllers } from "./comment.controller";

const router: Router = express.Router();

/**
 * @route   POST /api/comments
 * @desc    Create a new comment
 */
router.post(
  "/",
  isAuthenticate(),
  validate(commentSchemas.createComment),
  asyncHandler(commentControllers.createNewComment)
);

/**
 * @route   PATCH /api/comments/:id
 * @desc    Update an existing comment (Partial update)
 */
router.patch(
  "/:id",
  isAuthenticate(),
  // validate(commentSchemas.updateSchema), 
  asyncHandler(commentControllers.updateComment)
);

/**
 * @route   DELETE /api/comments/:id
 * @desc    Remove a comment
 */
router.delete(
  "/:id",
  isAuthenticate(),
  asyncHandler(commentControllers.deleteComment)
);

export default router;