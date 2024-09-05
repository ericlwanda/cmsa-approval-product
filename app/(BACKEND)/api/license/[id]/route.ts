export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import database from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { getParam } from "@/lib/utils";

const listLicense = async (request: ApiRequest) => {
    const id = getParam(request.url);

  // Build the where condition
  let whereCondition: any = {
    archive: 0,
    id:id
  };



  // Fetch the licenses with pagination, joining with applications and user tables
  const list = await database.license_types.findUnique({
    where: whereCondition,
    include:{
      license:{
        where:{user_id:request.user.id}
      },
      applications:true
    }
  });

  // Return the response
  return NextResponse.json({
    list,
  });
};

export const GET = authorize(listLicense);
