import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { ComplianceSchema } from "@/lib/validators/application/validation";
import { getParam, uploadFile} from "@/lib/utils";


const updateCompliance = async (request: ApiRequest) => {
  const data = await request.json();
  const attachment_id = getParam(request.url);

  const { error } = ComplianceSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const {complianceStatus} = data;

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
 


  const attach = await db.attachments.update({
    where:{id:attachment_id},
    data: {
      compliance: complianceStatus,
      updated_by: request?.user?.id ?? "",
      updated_at: new Date()
    },
  });


// Return success response
return Response.json(
  { message: "Compliance status changed"},
  { status: 200 }
);


};

export const POST = authorize(updateCompliance);
