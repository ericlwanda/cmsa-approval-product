import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";



const deleteAttachmentType = async (request: ApiRequest) => {
  
  const id = getParam(request.url);
  const AttachmentType = await db.attachment_types.findUnique({
    where: {
       id: id,
    },
  });

  if (!AttachmentType)
    return new NextResponse(
      JSON.stringify({ message: "Attachment type not found" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );

  try {
  
      const AttachmentTypes = await db.attachment_types.update({
        where:{id:id},
        data: {
          archive:1,
          updated_at: new Date(),
          updated_by: request?.user?.id ?? "",
        },
      });

      if (!AttachmentTypes)
        return new NextResponse(
          JSON.stringify({ message: "could not delete Attachment type" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );


    return NextResponse.json({
      success: true,
      message: 'Attachment deleted updated',
    }, {
      status: 200,
    });

  } catch (error:any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const DELETE = authorize(deleteAttachmentType);
