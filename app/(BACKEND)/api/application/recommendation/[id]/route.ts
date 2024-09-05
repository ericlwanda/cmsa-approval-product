import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";
import { AssigneeAddSchema, CommentAddSchema, RecommendationAddSchema } from "@/lib/validators/application/validation";

const recommendationApplication = async (request: ApiRequest) => {
  const data = await request.json();
  const application_id = getParam(request.url);

  const { error } = RecommendationAddSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const {recommendation,id} = data;

  try {

const user = await db.users.findUnique({
where:{id:id,archive:0,status:1}
})

if(!user){
    return NextResponse.json(
        { message: "can't add recommendation" },
        { status: 400 }
      );  
}


    await db.$transaction(async (prisma) => {
      const recommendations = await prisma.recommendations.create({
        data: {
            recommendation:recommendation,
          applications: {
            connect: { id: application_id },
          },
          users: {
            connect: { id: id },
          },
          created_by: request?.user?.id ?? "",
          updated_by: request?.user?.id ?? "",
        },
      });

    });

    // Return a successful response
    return NextResponse.json(
      { message: "Recommendation added successfully" },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const POST = authorize(recommendationApplication);
