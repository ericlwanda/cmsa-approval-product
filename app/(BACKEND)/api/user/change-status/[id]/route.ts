import bcrypt from "bcryptjs";
import { UpdateSchema } from "@/lib/validators/user/validation";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { requestOTP } from "@/lib/validators/auth/pin_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const changeStatus = async (request: ApiRequest) => {
  const id = getParam(request.url);
  const { searchParams } = new URL(request.url);

  let status = searchParams.get("status");
  let Intstatus = 0;
  if (status) {
    Intstatus = parseInt(status);
  } else {
    return new Response(JSON.stringify({ message: "Status Required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const user = await db.users.findUnique({
      where: {
        id: id,
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
        status: Intstatus,
        updated_at: new Date(),
        updated_by: request?.user?.id ?? "",
      },
    });

    if(!newUser){
        return new Response(JSON.stringify({ message: "Could not update User" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });  
    }

    return Response.json(
      { Success: true, message: "User updated successfully" },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error);

    return Response.json({ message: error.message }, { status: 400 });
  }
};

export const PUT = authorize(changeStatus);
