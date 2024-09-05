import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";



const deletePaymentType = async (request: ApiRequest) => {
  
  const id = getParam(request.url);

  try {
    const paymentType = await db.payment_types.findUnique({
      where: {
         id: id,
      },
    });

    if (!paymentType)
      return new NextResponse(
        JSON.stringify({ message: "payment type not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );


      const paymentTypes = await db.payment_types.update({
        where:{id:id},
        data: {
          archive:1,
          updated_at: new Date(),
          updated_by: request?.user?.id ?? "",
        },
      });

      if (!paymentTypes)
        return new NextResponse(
          JSON.stringify({ message: "could not delete Payment type" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );


    return NextResponse.json({
      success: true,
      message: 'Payment deleted updated',
    }, {
      status: 200,
    });

  } catch (error:any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const DELETE = authorize(deletePaymentType);
