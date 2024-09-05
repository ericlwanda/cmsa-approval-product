import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { CreateTypeSchema } from "@/lib/validators/payment_types/validation";
import { getParam } from "@/lib/utils";



const updatePaymentType = async (request: ApiRequest) => {
  const data = await request.json();
  const id = getParam(request.url);

  const { error } = CreateTypeSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const {name,type,for_company,amount} = data;

  try {
    const paymentType = await db.payment_types.findUnique({
      where: {
         id: id,
      },
    });

    if (!paymentType)
      return new NextResponse(
        JSON.stringify({ message: "Payment type not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );


      const paymentTypes = await db.payment_types.update({
        where:{id:id},
        data: {
          name,
          updated_at: new Date(),
          updated_by: request?.user?.id ?? "",
          type:type,
          for_company:for_company,
          amount:amount
        },
      });

      if (!paymentTypes)
        return new NextResponse(
          JSON.stringify({ message: "could't update Payment type" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );


    return NextResponse.json({
      success: true,
      message: 'Payment  successfully updated',
    }, {
      status: 200,
    });

  } catch (error:any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const PUT = authorize(updatePaymentType);
