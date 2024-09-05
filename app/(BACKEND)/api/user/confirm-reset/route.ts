import bcrypt from "bcryptjs";
import { UpdateSchema } from "@/lib/validators/user/validation";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { requestOTP } from "@/lib/validators/auth/pin_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";

const confirmReset = async (request: ApiRequest) => {
  const data = await request.json();
  const id = getParam(request.url);

  const { error } = UpdateSchema.safeParse(data);

  if (error) {
    return Response.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const { password } = data;

  const hashed_password = await bcrypt.hash(password, 10);

  try {
    const user = await db.users.findUnique({
      where: {
        id: id,
        status: 1,
        archive: 0,
      },
    });

    if (!user)
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });

    const newUser = await db.users.update({
      where: { id },
      data: {
        password: hashed_password,
        updated_at: new Date(),
        updated_by: request?.user?.id ?? "",
      },
    });

    if (!newUser) {
      return Response.json(
        { Success: true, message: "Failed to change Password" },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      { Success: true, message: "Password updated successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return Response.json({ message: error.message }, { status: 400 });
  }
};

export const POST = confirmReset;
