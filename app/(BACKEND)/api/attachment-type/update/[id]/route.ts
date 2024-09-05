import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { CreateTypeSchema } from "@/lib/validators/attachment_types/validation";
import { getParam } from "@/lib/utils";



const updateAttachmentType = async (request: ApiRequest) => {
  const data = await request.json();
  const id = getParam(request.url);

  const { error } = CreateTypeSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const {name} = data;

  try {
    const AttachmentType = await db.attachment_types.findUnique({
      where: {
         id: id,
      },
    });

    if (!AttachmentType)
      return new NextResponse(
        JSON.stringify({ message: "Attachment type not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );


      const AttachmentTypes = await db.attachment_types.update({
        where:{id:id},
        data: {
          name,
          updated_at: new Date(),
          updated_by: request?.user?.id ?? "",
        },
      });

      if (!AttachmentTypes)
        return new NextResponse(
          JSON.stringify({ message: "could't update Attachment type" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );


    return NextResponse.json({
      success: true,
      message: 'Attachment  successfully updated',
    }, {
      status: 200,
    });

  } catch (error:any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const PUT = authorize(updateAttachmentType);
