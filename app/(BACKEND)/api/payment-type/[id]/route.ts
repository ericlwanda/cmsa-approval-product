import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { CreateTypeSchema } from "@/lib/validators/license_types/validation";
import { getParam } from "@/lib/utils";

const viewApplication = async (request: ApiRequest) => {
  const id = getParam(request.url);
   let role = request?.user?.role ?? ""

   let whereCondition: any = {
    id,
  };
  if (role !== "USER" && role !== "ADMIN") {
    // For non-admin users, filter by assigned user
    whereCondition.assignees = {
      some: {
        users: {
          id: request?.user?.id,
        },
      },
    };
  }else if(role === "USER"){
    whereCondition.user_id=request?.user?.id
  }


  try {

    const applications = await db.applications.findUnique({
      where:whereCondition,
      select: {
        id: true,
        trackNumber: true,
        status: true,
        attachments: {
          select: {
            id: true,
            file: true,
            attachment_types: {
              select: {
                name: true,
              },
            },
          },
        },
        license_type_id: true,
        license_types: {
          select: {
            name: true,
          },
        },
        assignees: {
          select: {
            users: {
              select: {
                name: true,
                role: true,
              },
            },
          },
        },
        comments: {
          select: {
            comment: true,
            users: {
              select: {
                name: true,
                role: true,
              },
            },
          },
          orderBy: {
            created_at: "desc", // Order recommendations by created_at descending
          },
        },
        recommendations: {
          select: {
            recommendation: true,
            users: {
              select: {
                name: true,
                role: true,
              },
            },
          },
          orderBy: {
            created_at: "desc", // Order recommendations by created_at descending
          },
        },
        additionals: {
          where: {
            archive: 0,
          },
          select: {
            info: true,
            users: {
              select: {
                name: true,
                role: true,
              },
            },
          },
          orderBy: {
            created_at: "desc", // Order recommendations by created_at descending
          },
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
                payment_types: {
                  select: {
                    name: true,
                    type:true
                  },
                },
              },
              orderBy: {
                created_at: "desc", // Order recommendations by created_at descending
              },
            },

          }
        }
      },
    });


    return NextResponse.json(applications, {
      status: 200,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const GET = authorize(viewApplication);
