import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { CreateAttachmentSchema } from "@/lib/validators/application/validation";
import { getParam, uploadFile} from "@/lib/utils";


const createAttachment = async (request: ApiRequest) => {
  const data = await request.json();
  const attachment_id = getParam(request.url);

  const { error } = CreateAttachmentSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const {file} = data;

//exists attachment 

const exists = await db.attachments.findUnique({
  where:{id:attachment_id}
})

if(!exists){
  return NextResponse.json(
    { message: "attachment type not found" },
    { status: 400 }
  ); 
}
 
  const formResponse = await uploadFile({
    Folder: "attachment",
    file: file, // assuming the file is a property of the attachment object
  });

  if (!formResponse.success) {
    return Response.json(
      { message: "Failed to upload attachment", error: formResponse.error },
      { status: 500 }
    );
  }
  const attach = await db.attachments.update({
    where:{id:attachment_id},
    data: {
      file: formResponse.url ?? "",
      updated_by: request?.user?.id ?? "",
      updated_at: new Date()
    },
  });


// Return success response
return Response.json(
  { message: "Attachement added successfully"},
  { status: 200 }
);


};

export const POST = authorize(createAttachment);
