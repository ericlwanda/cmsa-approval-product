import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";
import { AssigneeAddSchema } from "@/lib/validators/application/validation";

const assignApplication = async (request: ApiRequest) => {
  const data = await request.json();
  const application_id = getParam(request.url);

  const { error } = AssigneeAddSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const {assignees} = data;

  try {


    const deleteassignee = await db.assignees.deleteMany({
      where: { application_id: application_id },
    });


     // Create new assignees
     const assigneePromises = assignees.map((assignee: { id: any; }) => {
      return db.assignees.create({
        data: {
          applications: {
            connect: { id: application_id },
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

    // Return a successful response
    return NextResponse.json(
      { message: "Assignees added successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const POST = authorize(assignApplication);
