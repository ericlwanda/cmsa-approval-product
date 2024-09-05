import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";
import { ApplicationStatus, Role } from "@/lib/enums/enums";


const approveApplication = async (request: ApiRequest) => {
  const id = getParam(request.url);
  let role = request?.user?.role ?? "";



  try {
    const status = role === Role.USER ? ApplicationStatus.SUBMITTED : "";

    // Use a transaction to ensure atomicity
    const [application, registry] = await db.$transaction([
      db.applications.findUnique({
        where: {
          id: id,
          archive: 0,
        },
        include: {
          // Include attachments in the query
          attachments: true,
        },
      }),
      db.users.findMany({
        where: {
          role: Role.REGISTRY,
          status: 1,
          archive: 0,
        },
        select:{
          id:true
        }
      }),
    ]);

    if (!application) {
      return new NextResponse(
        JSON.stringify({ message: "Application not found" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if there are no attachments
    if (application.attachments.length === 0) {
      return new NextResponse(
        JSON.stringify({
          message: "Cannot approve application with no attachments",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("registry",registry);

 

    if (registry.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No eligible registry user found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    await db.$transaction(async (prisma) => {
      // Update the application status
      await prisma.applications.update({
        where: { id: id },
        data: {
          status: status,
          updated_at: new Date(),
          updated_by: request?.user?.id ?? "",
        },
      });

      // Remove existing assignees for the application
      await prisma.assignees.deleteMany({
        where: { application_id: id },
      });

      // Create new assignees
     const assigneePromises = registry.map((assignee: { id: any; }) => {
      return prisma.assignees.create({
        data: {
          applications: {
            connect: { id: id },
          },
          users: {
            connect: { id: assignee.id },
          },
          created_by: request?.user?.id ?? "",
          updated_by: request?.user?.id ?? "",
        },
      });
    });

    // Wait for all assignee creation operations to complete
    await Promise.all(assigneePromises);
  })


    return NextResponse.json(
      {
        success: true,
        message: "Application approved and assigned to Registry",
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

export const PUT = authorize(approveApplication);
