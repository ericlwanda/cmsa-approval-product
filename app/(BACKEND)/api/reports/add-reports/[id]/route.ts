import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { CreateAttachmentSchema } from "@/lib/validators/application/validation";
import { getParam, uploadFile} from "@/lib/utils";


const addReport = async (request: ApiRequest) => {
  const data = await request.json();
  const application_id = getParam(request.url);

  const { error } = CreateAttachmentSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const {file} = data;
 
  const formResponse = await uploadFile({
    Folder: "report",
    file: file, // assuming the file is a property of the attachment object
  });

  if (!formResponse.success) {
    return Response.json(
      { message: "Failed to upload attachment", error: formResponse.error },
      { status: 500 }
    );
  }
  const attach = await db.reports.create({
    data: {
      name:"Technical team report",
      file: formResponse.url ?? "",
      created_by: request?.user?.id ?? "",
      updated_by: request?.user?.id ?? "",
      applications:{
        connect:{id:application_id}
      }
    },
  });


// Return success response
return Response.json(
  { message: "Report added successfully"},
  { status: 200 }
);


};

export const POST = authorize(addReport);
