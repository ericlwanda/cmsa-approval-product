import bcrypt from "bcryptjs";
import { UpdateSchema } from "@/lib/validators/user/validation";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { requestOTP } from "@/lib/validators/auth/pin_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";



const updateUserInfo = async (request: ApiRequest) => {

  const data = await request.json();
  const id = getParam(request.url);

  const { error } = UpdateSchema.safeParse(data);

  if (error) {
    return Response.json({ message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const { name,phone_number,role} = data;

  if (!phone_number ||!phone_number.startsWith('255')) {
    return NextResponse.json({ error: 'Enter a valid number starting with 255' }, { status: 400 });
  }

  try {
    const user = await db.users.findUnique({
      where: {
        id:id,
        archive:0
      },
    });


    if (!user)
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
  

    const result = await db.$transaction(async (prisma) => {
      const newUser = await prisma.users.update({
        where:{id},
        data: {
          name,
          role,
          phone_number,
          updated_at: new Date(),
          updated_by: request?.user?.id ?? "",
        },
      });

      return newUser;
    });

    return Response.json({ Success: true, 
      message: "User updated successfully" },
      {
        status: 200
      });

  } catch (error:any) {
    console.log(error);

    return Response.json({ message: error.message },{ status: 400});
  }
}

export const PUT = authorize(updateUserInfo);
