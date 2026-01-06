//import the auth client
import { Request, Response } from "express";
import { Controller } from "../../types/controller";
import { sendError, sendSuccess } from "../../utils/apiResponse";
import postServices from "./post.service";

const getAllPosts: Controller = async (req: Request, res: Response) => {
  const { search, tags, isFeatured, status } = req.query;
  const { page } = req.params;

  const finalQuery = {
    search: search as string | undefined,

    page: parseInt(page || "1"),
    tags: typeof tags === "string" ? tags.split(",") : undefined,

    isFeatured:
      typeof isFeatured === "string" ? isFeatured === "true" : undefined,

    status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" | undefined,
  };

  const allPosts: any = await postServices.fetchAllPosts(finalQuery);

  return sendSuccess(res, {
    message:
      allPosts.data.length > 0 ? "Fetched all posts successfully" : "No posts found",
    data: allPosts.data || [],
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

const getSavedPostsList: Controller = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return sendError(res, {
      message: "userId not Found IN URL",
    });
  }

  if (req.user?.id !== userId) {
    return sendError(res, {
      message: "you don't have access to get other user saved posts",
    });
  }

  const postsList = await postServices.getSavedPostsByUserId(userId!);

  const message =
    postsList.length === 0
      ? "no saved posts found"
      : "fetch saved posts successfully";

  return sendSuccess(res, { message, data: postsList });
};
const createNewSavedPost: Controller = async (req, res) => {
  const { userId, postId } = req.body;

  if (!userId) {
    return sendError(res, {
      message: "userId not Found in Body data",
    });
  }
  if (!postId) {
    return sendError(res, {
      message: "postId not Found in Body data",
    });
  }

  if (req.user?.id !== userId) {
    return sendError(res, {
      message: "you don't have access!",
    });
  }

  const post = await postServices.fetchPostDeatils(postId)

    if (!post) {
    return sendError(res, {
      message: "post id not a valid try another",
    });
  }

  const newSavedPost = await postServices.createSavedPost({
    userId,
    postId,
  });

  const message = newSavedPost.id
    ? "post saved successfully"
    : "failed to saved post";

  return sendSuccess(res, { statusCode: 201, message, data: newSavedPost });
};
const deleteSavedPost: Controller = async (req, res) => {
  const { userId } = req.body;
  const {postId} = req.params

  if (!userId) {
    return sendError(res, {
      message: "userId not Found in Body data",
    });
  }
  if (!postId) {
    return sendError(res, {
      message: "postId not Found in Body data",
    });
  }

  if (req.user?.id !== userId) {
    return sendError(res, {
      message: "you don't have access!",
    });
  }

  const post = await postServices.fetchPostDeatils(parseInt(postId))

    if (!post) {
    return sendError(res, {
      message: "post id not a valid try another",
    });
  }

  const deletedPost = await postServices.deleteSavedPost({
    userId,
    postId:parseInt(postId)
  });

  const message = deletedPost
    ? "post unSaved successfully"
    : "failed to unSaved post";

  return sendSuccess(res, { statusCode: 200, message });
};
const getAllPostsByUserId: Controller = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return sendError(res, {
      message: "userId not Found in Body data",
    });
  }

  if (req.user?.id !== userId) {
    return sendError(res, {
      message: "you don't have access!",
    });
  }

 


  const userPostsList = await postServices.fetchPostsListByUserId(userId);

  const message = userPostsList.length > 0
    ? "fetch posts successfully"
    : "failed to fetch posts";

  return sendSuccess(res, { statusCode: 200, message ,data:userPostsList});
};

const postControllers = {
  getAllPosts,
  createPost,
  getPostDetails,
  deletePost,
  updatePost,
  getSavedPostsList,
  createNewSavedPost,
  deleteSavedPost,
  getAllPostsByUserId
};
export default postControllers;
