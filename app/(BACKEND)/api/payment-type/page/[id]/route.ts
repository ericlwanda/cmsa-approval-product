export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { getParam } from "@/lib/utils";

const listPaymentTypePage = async (request: ApiRequest) => {
  const license_type_id = getParam(request.url);
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);
  

  // Build the where condition
  let whereCondition: any = {
    archive: 0,
  };

  // Get the total count of collections
  const totalCount = await database.payment_types.count({
    where: whereCondition,
  });

  whereCondition.license_types = {

        id: license_type_id,

  };

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
const pages = Math.ceil(totalCount / limit);
const currentPage = Math.max(1, Math.min(page, pages)); // Ensure currentPage is at least 1 and not greater than total pages
const skip = (currentPage - 1) * limit;


  // Fetch the collections with pagination
  const list = await database.payment_types.findMany({
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
      amount:true,
      type:true,
      for_company:true
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

export const GET = authorize(listPaymentTypePage);