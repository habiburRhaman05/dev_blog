import { constantVariables } from "../../constant";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { CreatePostInput } from "./post.schema";
import { createPostInput, Post, PostQueries } from "./post.types";

const fetchAllPosts = async (queries: PostQueries) => {
  const filters: any[] = [];

  // pagination

  const page = queries.page || 1
  

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


  // const skipData = (page - 1) * constantVariables.postLimit || 0
  const result = await prisma.post.findMany();

  return result;

//  const postsDummyData = [
//   {
//     id: 1,
//     title: "Getting Started with React in 2025",
//     content:
//       "React remains one of the most popular frontend libraries. This article covers setup, best practices, and common pitfalls for beginners.",
//     thumbnail: "https://picsum.photos/seed/react/600/400",
//     isFeatured: true,
//     status: "PUBLISHED",
//     tags: ["react", "frontend", "javascript"],
//     viwes: 1245,
//     authorId: "user_001",
//     createdAt: new Date("2025-12-01T10:15:00Z"),
//     updatedAt: new Date("2025-12-05T08:30:00Z"),
//   },
//   {
//     id: 2,
//     title: "Understanding TypeScript Utility Types",
//     content:
//       "Utility types like Partial, Pick, Omit, and Required help you write safer and more expressive TypeScript code.",
//     thumbnail: null,
//     isFeatured: false,
//     status: "PUBLISHED",
//     tags: ["typescript", "backend", "frontend"],
//     viwes: 860,
//     authorId: "user_002",
//     createdAt: new Date("2025-11-20T14:00:00Z"),
//     updatedAt: new Date("2025-11-22T09:10:00Z"),
//   },
//   {
//     id: 3,
//     title: "Building Secure Authentication with Express",
//     content:
//       "Learn how to implement session-based authentication using Express, Prisma, and modern security practices.",
//     thumbnail: "https://picsum.photos/seed/auth/600/400",
//     isFeatured: false,
//     status: "DRAFT",
//     tags: ["nodejs", "express", "auth"],
//     viwes: 0,
//     authorId: "user_001",
//     createdAt: new Date("2025-12-28T06:45:00Z"),
//     updatedAt: new Date("2025-12-28T06:45:00Z"),
//   },
//   {
//     id: 4,
//     title: "Why DSA Matters for Frontend Developers",
//     content:
//       "Data Structures and Algorithms are not just for backend engineers. This post explains their relevance in frontend interviews.",
//     thumbnail: "https://picsum.photos/seed/dsa/600/400",
//     isFeatured: true,
//     status: "PUBLISHED",
//     tags: ["dsa", "interview", "career"],
//     viwes: 2310,
//     authorId: "user_003",
//     createdAt: new Date("2025-10-10T11:20:00Z"),
//     updatedAt: new Date("2025-10-15T07:50:00Z"),
//   },
//   {
//     id: 5,
//     title: "Archived: Old JavaScript Patterns You Should Avoid",
//     content:
//       "This article discusses outdated JavaScript patterns that are no longer recommended in modern applications.",
//     thumbnail: null,
//     isFeatured: false,
//     status: "ARCHIVED",
//     tags: ["javascript", "legacy"],
//     viwes: 540,
//     authorId: "user_004",
//     createdAt: new Date("2024-06-18T09:00:00Z"),
//     updatedAt: new Date("2024-12-31T16:00:00Z"),
//   },
// ];
// return postsDummyData

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
