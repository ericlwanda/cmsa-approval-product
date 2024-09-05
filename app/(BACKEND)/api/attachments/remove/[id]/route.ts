import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { getParam, uploadFile} from "@/lib/utils";


const removeAttachment = async (request: ApiRequest) => {

  const attachement_id = getParam(request.url);


// Assuming 'attachments' is an array of attachment objects

  const remove = await db.attachments.update({
    where:{id:attachement_id},
    data:{
      file:""
    }
  });


  //ADD REMOVING IN AWS


// Return success response
return Response.json(
  { message: "Attachement removed successfully"},
  { status: 201 }
);

};
export const PUT = authorize(removeAttachment);
