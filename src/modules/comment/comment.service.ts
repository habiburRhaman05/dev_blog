import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { Comment } from "./comment.type";

type CreateCommentInput = Omit<Comment, "id" | "updatedAt" | "createdAt">;

const createCommentService = async (
  commentData: CreateCommentInput
): Promise<{
  id: number;
  updatedAt: Date;
  createdAt: Date;
  content: string;
  authorId: string;
  postId: number;
  parentId: number | null;
  status: CommentStatus;
}> => {
  // Removed 'undefined' because Prisma throws on failure
  try {
    const result = await prisma.comment.create({
      data: commentData,
    });

    // result is guaranteed to exist if no error was thrown
    return result;
  } catch (error) {
    // Log the actual error for debugging
    console.error(error);
    throw new AppError("Failed to create comment");
  }
};

export const commentServices = {
  createCommentService,
};
