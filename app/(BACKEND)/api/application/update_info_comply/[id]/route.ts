import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";
import { ApplicationStatus } from "@/lib/enums/enums";

const updateInfoComply = async (request: ApiRequest) => {
  const id = getParam(request.url);

  try {
  

    // Use a transaction to ensure atomicity
  
      const application = db.applications.findUnique({
        where: {
          id: id,
          archive: 0,
        },
      })
   

    if (!application) {
      return new NextResponse(
        JSON.stringify({ message: "Application not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    await db.$transaction(async (prisma) => {

    await prisma.applications.update({
      where: { id: id },
      data: {
        status: ApplicationStatus.ADDITIONAL_INFO_REQUIRED,
        updated_at: new Date(),
        updated_by: request?.user?.id ?? "",
      },
    });

    await prisma.attachments.updateMany({
      where: { application_id: id,compliance:"not complied" },
      data: {
        file:"",
        updated_at: new Date(),
        updated_by: request?.user?.id ?? "",
      },
    });
  })


    return NextResponse.json(
      {
        success: true,
        message: "Success",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const PUT = authorize(updateInfoComply);
