export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { getParam } from "@/lib/utils";

const listAttachmentTypePage = async (request: ApiRequest) => {
  const license_type_id = getParam(request.url);
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);

  console.log("page",page)
  console.log("limit",limit)
  

  // Build the where condition
  let whereCondition: any = {
    archive: 0,
  };

  whereCondition.license_types = {

    id: license_type_id,

};

  // Get the total count of collections
  const totalCount = await database.attachment_types.count({
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
// Calculate pagination details
const pages = Math.ceil(totalCount / limit); // Total number of pages
const currentPage = Math.max(0, page); // Ensure currentPage is at least 0
const currentPageClamped = Math.min(currentPage, pages - 1); // Ensure currentPage is not greater than total pages minus 1

// Calculate skip value
const skip = currentPageClamped * limit; // Since currentPage starts from 0




  // Fetch the collections with pagination
  const list = await database.attachment_types.findMany({
    where: whereCondition,
    select: {
      id: true,
      name: true,
      created_by: true,
      license_types: {
        select: {
          id:true,
          name: true,
        },
      },
    },
    skip,
    take: limit,
  });

  // Return the response
  return NextResponse.json({
    totalCount,
    pages,
    totalCurrentCount: list.length,
    list,
  });
};

export const GET = authorize(listAttachmentTypePage);