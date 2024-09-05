export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";

const listLicense = async (request: ApiRequest) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);

  // Build the where condition
  let whereCondition: any = {
    archive: 0,
  };



  // Get the total count of licenses
  const totalCount = await database.license_types.count({
    where: whereCondition,
  });

  if (totalCount === 0) {
    // If the table is empty, return an empty result set
    return NextResponse.json({
      totalCount: 0,
      pages: 0,
      totalCurrentCount: 0,
      list: [],
    });
  }

  // Calculate pagination details
  const pages = Math.ceil(totalCount / limit); // Total number of pages
  const currentPage = Math.max(0, page); // Ensure currentPage is at least 0
  const currentPageClamped = Math.min(currentPage, pages - 1); // Ensure currentPage is not greater than total pages minus 1

  // Calculate skip value
  const skip = currentPageClamped * limit; // Since currentPage starts from 0

  // Fetch the licenses with pagination, joining with applications and user tables
  const list = await database.license_types.findMany({
    where: {
      ...whereCondition,
      license: {
        some: { user_id: request.user.id, archive: 0 }, // Ensures that the license array is not empty
      },
    },
    include:{
      license:{
        where:{user_id:request.user.id,archive:0}
      },
      applications:{
        where:{user_id:request.user.id,archive:0}
      }
    },
    skip,
    take: limit,
  });

// Convert BigInt fields to strings before returning the response
const listWithBigIntAsString = list.map((licenseType) => ({
  ...licenseType,
  applications: licenseType.applications.map((app) => ({
    ...app,
    marketValue: app.marketValue ? app.marketValue.toString() : null, // Convert BigInt to string
  })),
}));

  // Return the response
  return NextResponse.json({
    totalCount,
    pages,
    totalCurrentCount: listWithBigIntAsString.length,
    list:listWithBigIntAsString,
  });
};

export const GET = authorize(listLicense);
