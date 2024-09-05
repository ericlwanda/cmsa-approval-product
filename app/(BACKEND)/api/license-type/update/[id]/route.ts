import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { CreateTypeSchema } from "@/lib/validators/license_types/validation";
import { getParam } from "@/lib/utils";



const updateLicenseType = async (request: ApiRequest) => {
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
    const licenseType = await db.license_types.findUnique({
      where: {
         id: id,
      },
    });

    if (!licenseType)
      return new NextResponse(
        JSON.stringify({ message: "license type not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );


      const licenseTypes = await db.license_types.update({
        where:{id:id},
        data: {
          name,
          updated_at: new Date(),
          updated_by: request?.user?.id ?? "",
        },
      });

      if (!licenseTypes)
        return new NextResponse(
          JSON.stringify({ message: "could't update license type" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );


    return NextResponse.json({
      success: true,
      message: 'License  successfully updated',
    }, {
      status: 200,
    });

  } catch (error:any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const PUT = authorize(updateLicenseType);
