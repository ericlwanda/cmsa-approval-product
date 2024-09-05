import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { CreateTypeSchema } from "@/lib/validators/payment_types/validation";



const createPaymentType = async (request: ApiRequest) => {
  const data = await request.json();

  const { error } = CreateTypeSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const {name,LicenseType,amount,type,for_company} = data;

  try {
    const exists = await db.payment_types.findFirst({
      where: {
         name: name,
         archive:0,
         for_company:for_company
      },
    });

    if (exists)
      return new NextResponse(
        JSON.stringify({ message: "payment type exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );


      const newType = await db.payment_types.create({
        data: {
          name,
          license_types: {
            connect: { id: LicenseType },
          },
          amount:amount,
          created_by: request?.user?.id ?? "",
          updated_by: request?.user?.id ?? "",
          type:type, //1 - application 2-annual 3-admission
          for_company:for_company
        },
      });


    return NextResponse.json({
      success: true,
      message: 'Payment type successfully created',
    }, {
      status: 200,
    });

  } catch (error:any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const POST = authorize(createPaymentType);
