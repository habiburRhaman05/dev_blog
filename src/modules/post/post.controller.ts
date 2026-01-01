//import the auth client
import { Request, Response } from "express";
import { Controller } from "../../types/controller";
import { sendError, sendSuccess } from "../../utils/apiResponse";
import postServices from "./post.service";

const getAllPosts: Controller = async (req: Request, res: Response) => {
  const { search, tags, isFeatured, status, email } = req.query;

  const finalQuery = {
    search: search as string | undefined,
    user: email as string | undefined,

    tags: typeof tags === "string" ? tags.split(",") : undefined,

    isFeatured:
      typeof isFeatured === "string" ? isFeatured === "true" : undefined,

    status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined,
  };

  const allPosts = await postServices.fetchAllPosts(finalQuery);

  return sendSuccess(res, {
    message: "Fetched all posts successfully",
    data: allPosts,
  });
};

const getPostDetails: Controller = async (req, res) => {
  const postId = req.params.postId;

  if (!postId) {
    return sendError(res, {
      message: "Invalid PostId",
    });
  }

  const postData = await postServices.fetchPostDeatils(parseInt(postId));
  if (!postData) {
    return sendError(res, {
      statusCode: 404,
      message: "post not found",
    });
  }

  return sendSuccess(res, {
    message: "fetch post details successfully",
    data: postData,
  });
};
const deletePost: Controller = async (req, res) => {
  const postId = parseInt(req.params.postId!);

  if (isNaN(postId)) {
    return sendError(res, { message: "Invalid PostId" });
  }

  // Check if post exists first
  const post = await postServices.fetchPostDeatils(postId);

  if (!post) {
    return sendError(res, { message: "Post not found" });
  }

  // Delete the post
  await postServices.deletePostById(postId);

  return sendSuccess(res, { message: "Post deleted successfully" });
};

const createPost: Controller = async (req, res, next) => {
  const userId = req.user?.id;
  console.log("userId", userId, req.user?.email);

  const newPost = await postServices.createPostService(req.body, userId!);
  return sendSuccess(res, {
    statusCode: 201,
    data: newPost,
    message: "post created successfully",
  });
};

const updatePost: Controller = async (req, res) => {
  const postId = parseInt(req.params.postId!);

  const updatedData = req.body;

  if (isNaN(postId)) {
    return sendError(res, { message: "Invalid PostId" });
  }

  // Check if post exists first
  const post = await postServices.fetchPostDeatils(postId);

  if (!post) {
    return sendError(res, { message: "Post not found" });
  }

  // Delete the post
  await postServices.updatePost(postId, updatedData);

  return sendSuccess(res, { message: "Post updated successfully" });
};

const postControllers = {
  getAllPosts,
  createPost,
  getPostDetails,
  deletePost,
  updatePost,
};
export default postControllers;
