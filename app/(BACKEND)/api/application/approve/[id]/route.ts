import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";
import { ApplicationStatus, Role } from "@/lib/enums/enums";
import { LoginSchema } from "@/lib/validators/auth/validation";
import { Console } from "console";

// Helper function to generate a control number
const generateControlNumber = (): string => {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 10000);
  return `${timestamp}-${randomNumber}`;
};

// Helper function to generate a unique invoice number
const generateInvoiceNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();

  let invoiceCounter = 1;
  let uniqueInvoiceNumber = `${year}-INV-${invoiceCounter
    .toString()
    .padStart(6, "0")}`;

  // Check if the invoice number already exists in the database
  while (true) {
    const existingInvoice = await db.payments.findFirst({
      where: {
        invoice_number: uniqueInvoiceNumber,
      },
    });

    if (!existingInvoice) {
      // If the invoice number does not exist, return it
      return uniqueInvoiceNumber;
    }

    // Otherwise, increment the counter and try again
    invoiceCounter++;
    uniqueInvoiceNumber = `${year}-INV-${invoiceCounter
      .toString()
      .padStart(6, "0")}`;
  }
};

const approveApplication = async (request: ApiRequest) => {
  const id = getParam(request.url);
  const role = request?.user?.role ?? "";
  const { username, password } = await request.json();

  // Validate login credentials
  const { error } = LoginSchema.safeParse({ username, password });
  if (error) {
    return NextResponse.json({ message: error.errors }, { status: 400 });
  }

  // Find the user and verify password
  const user = await db.users.findUnique({ where: { email: username } });
  if (!user) {
    return NextResponse.json({ message: "Account not found" }, { status: 400 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json({ message: "Invalid password" }, { status: 400 });
  }

  try {
    // Determine the next role and status
    const nextRoleMap: Record<string, Role> = {
      [Role.SPO]: Role.MDD,
      [Role.MDD]: Role.DRPP,
      [Role.DRPP]: Role.CEO,
      [Role.CEO]: Role.REGISTRY,
    };

    const nextRole = nextRoleMap[role];
    if (!nextRole) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const status =
      role === Role.SPO
        ? ApplicationStatus.APPROVED_BY_RT
        : role === Role.MDD
        ? ApplicationStatus.APPROVED_BY_MDD
        : role === Role.DRPP
        ? ApplicationStatus.APPROVED_BY_DRPP
        : role === Role.CEO
        ? ApplicationStatus.APPROVED_BY_CEO
        : "";

    const isCEO = role === Role.CEO;

    // Start a transaction to handle multiple operations
    const [application, assignees] = await db.$transaction([
      db.applications.findUnique({
        where: { id: id, archive: 0 },
      }),
      db.users.findMany({
        where: { role: nextRole, status: 1, archive: 0 },
        select: { id: true },
      }),
    ]);

    if (!application) {
      return NextResponse.json(
        { message: "Application not found" },
        { status: 400 }
      );
    }

    if (assignees.length === 0) {
      return NextResponse.json(
        { message: "No eligible registry user found" },
        { status: 404 }
      );
    }

    if (isCEO) {
      // Update application status to COMPLETED
      await db.applications.update({
        where: { id: application.id },
        data: {
          status: ApplicationStatus.COMPLETED,
          updated_at: new Date(),
          updated_by: "",
        },
      });

      const issuedAt = new Date();
      await db.license.create({
        data: {
          license_types: { connect: { id: application.license_type_id } },
          issued_at: issuedAt,
          created_by: "",
          updated_by: "",
          type:1,
          users: { connect: { id: application.user_id } },
          applications: { connect: { id: application.id } },
        },
      });
    } else {
      await db.applications.update({
        where: { id: id },
        data: {
          status,
          previous_assignee_id: user?.id,
          updated_at: new Date(),
          updated_by: request?.user?.id ?? "",
        },
      });
    }

    // Update application and assignees
    await db.$transaction(async (prisma) => {
      await prisma.assignees.deleteMany({
        where: { application_id: id },
      });
      await Promise.all(
        assignees.map((assignee) => {
          return prisma.assignees.create({
            data: {
              applications: { connect: { id: id } },
              users: { connect: { id: assignee.id } },
              created_by: request?.user?.id ?? "",
              updated_by: request?.user?.id ?? "",
            },
          });
        })
      );
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application approved and assigned to Registry",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const PUT = authorize(approveApplication);
