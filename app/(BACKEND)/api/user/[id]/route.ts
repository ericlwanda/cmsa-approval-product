import bcrypt from "bcryptjs";
import { UpdateSchema } from "@/lib/validators/user/validation";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";

const userView = async (request: ApiRequest) => {
  const id = getParam(request.url);

  try {
    const user = await db.users.findUnique({
      where: {
        id: id,
        status: 1,
        archive: 0
      },
    });

    console.log("user", user);

    if (!user)
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    return new NextResponse(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.log(error);

    return Response.json({ message: error.message }, { status: 400 });
  }
};

export const GET = authorize(userView);
