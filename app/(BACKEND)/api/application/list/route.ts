export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";

const listApplication = async (request: ApiRequest) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "10", 10);

  let role = request?.user?.role ?? ""

  // Build the where condition
  let whereCondition: any = {
    archive: 0,
  };


  if (role !== "USER") {
    // For non-admin users, filter by assigned user
    whereCondition = {
      assignees: {
        some: {
          users: {
            id: request?.user?.id,
          },
        },
      },
      status: {
        not: 'COMPLETED', // Exclude "completed" status
      },
    };
  }else if(role === "USER"){
    whereCondition.user_id=request?.user?.id
  }


 
  // Get the total count of collections
  const totalCount = await database.applications.count({
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
 

  // Fetch the collections with pagination
  const list = await database.applications.findMany({
    where: whereCondition,
    select: {
      id: true,
      trackNumber: true,
      status: true,
      marketValue:true,
      license_types: {
        select: {
          name: true
        }
      },
      license_type_id:true,
      assignees: {
        select: {
          users: {
            select: {
              name: true,
              role: true
            }
          }
        }
      },
      comments: {
        select: {
          comment: true,
          users: {
            select: {
              name: true,
              role: true
            }
          }
        },
        orderBy: {
          created_at: 'desc', // Order comments by created_at descending
        },
      },
      recommendations: {
        select: {
          recommendation: true,
          users: {
            select: {
              name: true,
              role: true
            }
          }
        },
        orderBy: {
          created_at: 'desc', // Order recommendations by created_at descending
        },
        
      },
      additionals:{
        where: {
          archive: 0,
        },
        select:{
          info:true,
          users:{
            select:{
              name:true,
              role:true
            }
          }
        }
      },

      control_numbers:{
        select:{
          control_number:true,
          description:true,
          total_amount:true,
          payment_status:true,
          payment_time:true,
          payments: {
            select: {
              invoice_number: true,
              description: true,
              amount: true,
              created_at: true,
            },
            orderBy: {
              created_at: "desc", // Order recommendations by created_at descending
            },
          },

        }
      },

      
      created_by: true,
      updated_at: true
    }, 
    skip,
    take: limit,
  });

    // Convert BigInt fields to strings before returning the response
    const listWithBigIntAsString = list.map((item) => ({
      ...item,
      marketValue: item.marketValue ? item.marketValue.toString() : null, // Convert BigInt to string
    }));

  // Return the response
  return NextResponse.json({
    totalCount,
    pages,
    totalCurrentCount: listWithBigIntAsString.length,
    list:listWithBigIntAsString,
  });
};

export const GET = authorize(listApplication);