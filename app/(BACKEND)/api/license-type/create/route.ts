import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { CreateTypeSchema } from "@/lib/validators/license_types/validation";



const createLicenseType = async (request: ApiRequest) => {
  const data = await request.json();

  const { error } = CreateTypeSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const {name} = data;

  try {
    const exists = await db.license_types.findFirst({
      where: {
         name: name,
      },
    });

    if (exists)
      return new NextResponse(
        JSON.stringify({ message: "name exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );


      const newType = await db.license_types.create({
        data: {
          name,
          created_by: request?.user?.id ?? "",
          updated_by: request?.user?.id ?? "",
        },
      });


    return NextResponse.json({
      success: true,
      message: 'License type successfully created',
    }, {
      status: 200,
    });

  } catch (error:any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const POST = authorize(createLicenseType);
