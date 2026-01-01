import z from "zod";

 const createComment = z.object({
    content:z.string(),
    status:z.enum(["APPROVED","REJECT"]),
    authorId:z.string(),
    postId:z.number(),
    parentId:z.number().optional(),
 })


 export const commentSchemas = {createComment}