import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { CreateTypeSchema } from "@/lib/validators/attachment_types/validation";



const createAttachmentType = async (request: ApiRequest) => {
  const data = await request.json();

  const { error } = CreateTypeSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const {name,LicenseType} = data;

  try {
    const exists = await db.attachment_types.findFirst({
      where: {
         name: name,
         archive:0
      },
    });

    if (exists)
      return new NextResponse(
        JSON.stringify({ message: "name exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );


      const newType = await db.attachment_types.create({
        data: {
          name,
          license_types: {
            connect: { id: LicenseType },
          },
          created_by: request?.user?.id ?? "",
          updated_by: request?.user?.id ?? "",
        },
      });


    return NextResponse.json({
      success: true,
      message: 'Attachment type successfully created',
    }, {
      status: 200,
    });

  } catch (error:any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const POST = authorize(createAttachmentType);
