export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";

const listLicenseType = async (request: ApiRequest) => {
  // Build the where condition
  let whereCondition: any = {
    archive: 0,
  };
  // Fetch the collections with pagination
  const list = await database.license_types.findMany({
    where: whereCondition,
    select: {
      id: true,
      name: true,
      created_by: true,
    },
  });

  // Return the response
  return NextResponse.json(
    list,
  );
};

export const GET = authorize(listLicenseType);