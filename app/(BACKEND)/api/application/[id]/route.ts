import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";
import { Role } from "@/lib/enums/enums";

const viewApplication = async (request: ApiRequest) => {
  const id = getParam(request.url);
  const role = request?.user?.role ?? "";

  let whereCondition: any = {
    id,
  };

  if (role !== Role.USER && role !== Role.ADMIN) {
    // For non-admin users, filter by assigned user
    whereCondition.assignees = {
      some: {
        users: {
          id: request?.user?.id,
        },
      },
    };
  } else if (role === Role.USER) {
    whereCondition.user_id = request?.user?.id;
  }

  try {
    // Use `findFirst` if needing additional nested conditions
    const application = await db.applications.findFirst({
      where: whereCondition,
      select: {
        id: true,
        trackNumber: true,
        status: true,
        marketValue: true, // Ensure BigInt handling
        attachments: {
          select: {
            id: true,
            file: true,
            attachment_types: {
              select: {
                name: true,
              },
            },
            compliance: true,
            archive: true,
          },
          where: {
            attachment_types: {
              archive: 0, // Apply filter
            },
          },
        },
        report: {
          select: {
            id: true,
            name: true,
            file: true,
            archive: true,
          },
        },
        license_type_id: true,
        license_types: {
          select: {
            name: true,
            id: true,
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
        license: {},
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
            created_at: "desc",
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
            created_at: "desc",
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
            created_at: "desc",
          },
        },
        control_numbers: {
          select: {
            control_number: true,
            description: true,
            total_amount: true,
            payment_status: true,
            payment_time: true,
            payments: {
              select: {
                invoice_number: true,
                description: true,
                amount: true,
                created_at: true,
              },
              orderBy: {
                created_at: "desc",
              },
            },
          },
        },
      },
    });

    // Serialize BigInt to string if necessary
    const serializedApplication = {
      ...application,
      marketValue: application?.marketValue ? application.marketValue.toString() : null,
    };

    return NextResponse.json(serializedApplication, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error fetching application:", error);

    return NextResponse.json({ message: "Failed to retrieve application." }, { status: 400 });
  }
};

export const GET = authorize(viewApplication);
