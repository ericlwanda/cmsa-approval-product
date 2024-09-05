export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";

const listingUser = async (request: ApiRequest) => {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  // Build the where condition
  let whereCondition: any = {
    archive: 0,
  };

  if (status) {
    whereCondition.status = parseInt(status);
  }


  // Fetch the collections with pagination
  const list = await database.users.findMany({
    where: whereCondition,
    select: {
      id: true,
      name: true,
      status: true,
      created_at: true,
      role:true,
      email:true,
      phone_number:true
    },
  });

  return NextResponse.json(
    list,
  );

 
};

export const GET = authorize(listingUser);