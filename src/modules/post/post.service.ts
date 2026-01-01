import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { CreatePostInput } from "./post.schema";
import { createPostInput, Post, PostQueries } from "./post.types";

const fetchAllPosts = async (queries: PostQueries) => {
  const filters: any[] = [];

  /* 🔍 Search */
  if (queries.search) {
    filters.push({
      OR: [
        {
          title: {
            contains: queries.search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: queries.search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: queries.search,
          },
        },
      ],
    });
  }

  /* 🏷️ Tags */
  if (queries.tags && queries.tags.length > 0) {
    filters.push({
      tags: {
        hasEvery: queries.tags,
      },
    });
  }

  /* ⭐ Featured (handle false correctly) */
  if (queries.isFeatured !== undefined) {
    filters.push({
      isFeatured: queries.isFeatured,
    });
  }

  /* 📌 Status */
  if (queries.status) {
    filters.push({
      status: queries.status,
    });
  }

  const result = await prisma.post.findMany({
    include: {
      author: true,
    },
    where: {
      AND: filters,
      author: {
        email: queries.user!,
      },
    },
  });

  return result;
};

const createPostService = async (
  postInputData: Omit<Post, "createdAt" | "id" | "updatedAt" | "authorId">,
  userId: string
): Promise<Post> => {
  try {
    const result = await prisma.post.create({
      data: { ...postInputData, authorId: userId },
    });

    return result;
  } catch (error) {
    throw new AppError("failed to create post");
  }
};

const fetchPostDeatils = async (id: number) => {
  const data = await prisma.post.findUnique({
    where: {
      id: id,
    },
   include: {
      author: true, // Optional: includes user who wrote the post
      comment: {
        where: {
          parentId: null, // Only get top-level comments first
        },
        include: {
          author: true, // Who wrote the comment
          replies: {
            include: {
              author: true, // Who replied
            },
          },
        },
      },
    },
  })
  return data
};


const deletePostById = async (id: number) => {
  await prisma.post.delete({
    where: { id: id },
  });
};
const updatePost = async (id: number,updatedData: Partial<Post>) => {
  await prisma.post.update({
    where:{
      id:id
    },
    data:updatedData
  })
};

const postServices = {
  fetchAllPosts,
  createPostService,
  fetchPostDeatils,
  deletePostById,
  updatePost
};

export default postServices;
