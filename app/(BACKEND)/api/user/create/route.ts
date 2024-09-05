import bcrypt from "bcryptjs";
import { CreateSchema } from "@/lib/validators/user/validation";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { requestOTP } from "@/lib/validators/auth/pin_request";
import { NextResponse } from "next/server";
import { Role } from "@/lib/enums/enums";

interface OTP {
  pinId: string;
  pin: string;
}



function isValidRole(value: any): value is Role {
  return Object.values(Role).includes(value);
}

const createUser = async (request: ApiRequest) => {
  const data = await request.json();

  const { error } = CreateSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const { name,email, phone_number, password,role} = data;

  if (isValidRole(role)) {

  } else {
    return NextResponse.json({ message: "invalid role" }, { status: 400 });
  }

  if (!phone_number || !phone_number.startsWith("255")) {
    return NextResponse.json(
      { error: "Enter a valid number starting with 255" },
      { status: 400 }
    );
  }
  try {
    const exists = await db.users.findFirst({
      where: {
        OR: [{ email: email }, { phone_number: phone_number }],
      },
    });

    if (exists)
      return new NextResponse(
        JSON.stringify({ message: "email/phone already exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );

    const hashed_password = await bcrypt.hash(password, 10);



    const result = await db.$transaction(async (prisma) => {
      const newUser = await prisma.users.create({
        data: {
          name,
          email,
          phone_number,
          role,
          password: hashed_password,
          created_by: request?.user?.id ?? "",
          updated_by: request?.user?.id ?? "",
        },
      });

      const response: OTP = await requestOTP(phone_number);
      
      return {newUser,response};
    });

    return NextResponse.json({
      success: true,
      message: 'User successfully created',
      pin_id: result.response.pinId
    }, {
      status: 200,
    });

  } catch (error:any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const POST = authorize(createUser);
