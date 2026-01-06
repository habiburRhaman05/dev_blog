import { constantVariables } from "../../constant";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { Post, PostQueries } from "./post.types";

const fetchAllPosts = async (queries: PostQueries) => {
  const filters: any = { AND: [] };

  const page = Number(queries.page) || 1;
  const limit = constantVariables.postLimit || 10;

  if (queries.search) {
    filters.AND.push({
      OR: [
        { title: { contains: queries.search, mode: "insensitive" } },
        { content: { contains: queries.search, mode: "insensitive" } },
        { tags: { has: queries.search.toLowerCase() } },
      ],
    });
  }

  if (queries.tags && queries.tags.length > 0) {
    filters.AND.push({
      tags: {
        hasEvery: queries.tags,
      },
    });
  }

  if (queries.isFeatured !== undefined) {
    filters.AND.push({
      isFeatured: queries.isFeatured,
    });
  }

  if (queries.status) {
    filters.AND.push({
      status: queries.status,
    });
  }

  const [posts, totalCount] = await prisma.$transaction([
    prisma.post.findMany({
      where: filters,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { author: true },
    }),
    prisma.post.count({ where: filters }),
  ]);

  return {
   data: posts,
    meta: {
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
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
const fetchPostsListByUserId = async (id: string) => {
  const data = await prisma.post.findMany({
    where: {
     authorId:id
    },
    include:{
      author:true
    }
  })
  return data
};


const getSavedPostsByUserId = async (userId:string)=>{
const savedPosts = await prisma.savedPost.findMany({
    where: {
      userId: userId,
    },
    include: {
      post: {
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: 'desc', // Show newest saves first
    },
  });

  return savedPosts;
}




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




const createSavedPost = async (data:{
  postId:number;
  userId:string;
})=>{
const newSavedPosts = await prisma.savedPost.create({
  data
  });

  return newSavedPosts;
}
const deleteSavedPost = async (data:{
  postId:number;
  userId:string;
})=>{
const newSavedPosts = await prisma.savedPost.delete({
   where:{
   userId_postId:{
    postId:data.postId,
    userId:data.userId
   }
   }
  });

  if(newSavedPosts.id){

    return true;
  }
  return false
}


const postServices = {
  fetchAllPosts,
  createPostService,
  fetchPostDeatils,
  deletePostById,
  updatePost,
  fetchPostsListByUserId,
  getSavedPostsByUserId,
  createSavedPost,
  deleteSavedPost
};

export default postServices;
