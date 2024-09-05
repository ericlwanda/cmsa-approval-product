import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { CreateTypeSchema } from "@/lib/validators/license_types/validation";
import { getParam } from "@/lib/utils";



const deleteApplication = async (request: ApiRequest) => {
  
  const id = getParam(request.url);

  try {
    const applications = await db.applications.findUnique({
      where: {
         id: id,
      },
    });

    if (!applications)
      return new NextResponse(
        JSON.stringify({ message: "application not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );


      const application = await db.applications.update({
        where:{id:id},
        data: {
          archive:1,
          updated_at: new Date(),
          updated_by: request?.user?.id ?? "",
        },
      });

      if (!application)
        return new NextResponse(
          JSON.stringify({ message: "could not delete application" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );


    return NextResponse.json({
      success: true,
      message: 'Application deleted',
    }, {
      status: 200,
    });

  } catch (error:any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const DELETE = authorize(deleteApplication);
