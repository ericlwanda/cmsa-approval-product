import bcrypt from "bcryptjs";
import { CreateSchema, ResetPasswordSchema } from "@/lib/validators/user/validation";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { requestOTP } from "@/lib/validators/auth/pin_request";
import { NextResponse } from "next/server";

interface OTP {
  pinId: string;
  pin: string;
}

const resetPassword = async (request: ApiRequest) => {
  const data = await request.json();

  const { error } = ResetPasswordSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const { phone_number} = data;

  if (!phone_number || !phone_number.startsWith("255")) {
    return NextResponse.json(
      { error: "Enter a valid number starting with 255" },
      { status: 400 }
    );
  }
  try {
    const user = await db.users.findUnique({
      where: {
        phone_number: phone_number ,
        status:1,
        archive:0
      },
    });

    if (!user)
        return new Response(
          JSON.stringify({ message: "User not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      const response: OTP = await requestOTP(phone_number);

      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
        pin_id: response.pinId,
      }, {
        status: 200,
      });


  } catch (error:any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const POST = resetPassword;
