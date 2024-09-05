export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { Role } from "@/lib/enums/enums";

const dashboard = async (request: ApiRequest) => {
  // Build the where condition
  let whereCondition: any = {
    archive: 0,
  };

  const role = request?.user?.role ?? "";

  const isUser = role === Role.USER;

  if (isUser) {
    whereCondition.user_id = request?.user?.id;
  }


  const totalCount = await database.applications.count({
    where: {
        ...whereCondition
    },
  });


  // Return the response
  return NextResponse.json(
    {totalCount}
  );
};

export const GET = authorize(dashboard);