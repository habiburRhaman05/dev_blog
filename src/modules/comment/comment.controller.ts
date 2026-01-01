import { Controller } from "../../types/controller";
import { sendSuccess } from "../../utils/apiResponse";
import { commentServices } from "./comment.service";

const createNewComment:Controller = async (req,res) =>{
   const {content,status,authorId,postId,parentId} = req.body;
const newComment  = await commentServices.createCommentService({
content,status,authorId,postId,parentId
});

return sendSuccess(res,{
    message:"comment created",
    data:newComment
})

}


export const commentControllers = {

    createNewComment
}