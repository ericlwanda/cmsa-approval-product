import bcrypt from "bcryptjs";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { CreateApplicationSchema } from "@/lib/validators/application/validation";

const createApplication = async (request: ApiRequest) => {
  const data = await request.json();
  const { licenseType, marketValueAmount } = data;

  const generateControlNumber = () => {
    const timestamp = Date.now();
    const randomNumber = Math.floor(Math.random() * 10000);
    return `${timestamp}-${randomNumber}`;
  };

  const generateInvoiceNumber = async () => {
    const year = new Date().getFullYear();
    const lastInvoice = await db.payments.findFirst({
      where: {
        invoice_number: {
          startsWith: `${year}-INV-`,
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    let invoiceCounter = 1;
    if (lastInvoice) {
      const lastInvoiceNumber = lastInvoice.invoice_number;
      const lastCounter = parseInt(lastInvoiceNumber.split("-").pop()!, 10);
      if (!isNaN(lastCounter)) {
        invoiceCounter = lastCounter + 1;
      }
    }
    return `${year}-INV-${invoiceCounter.toString().padStart(6, "0")}`;
  };

  const { error } = CreateApplicationSchema.safeParse(data);
  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  console.log("log",marketValueAmount);

  marketValueAmount

  //exists application with same license

  const exists = await db.applications.findFirst({
    where: { license_type_id: licenseType, archive: 0 },
  });

  if (exists) {
    return NextResponse.json(
      { message: "you can't apply for the same license more than once" },
      { status: 400 }
    );
  }

  const application = await db.applications.create({
    data: {
      trackNumber: `CMSA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      license_types: { connect: { id: licenseType } },
      users: { connect: { id: request.user.id } },
      created_by: request?.user?.id ?? "",
      updated_by: request?.user?.id ?? "",
      marketValue:BigInt(marketValueAmount)
    },
  });

  console.log("log",marketValueAmount);
  console.log("log",application);

  let totalAmount = 0;

  if (marketValueAmount <= 1000000000) {
    totalAmount = 5000000;
  } else if (marketValueAmount > 1000000000 && marketValueAmount <= 5000000000) {
    let excessAmount = marketValueAmount - 1000000000; // Corrected calculation
    excessAmount = excessAmount * (0.2 / 100); // 0.2% of the excess over 1 billion
    totalAmount = 5000000 + excessAmount;
  } else if (marketValueAmount > 5000000000 && marketValueAmount <=10000000000) {
    let excessAmount = marketValueAmount - 5000000000; // Corrected calculation
    excessAmount = excessAmount * (0.1 / 100); // 0.1% of the excess over 5 billion
    totalAmount = 30000000 + excessAmount;
  } else {
    let excessAmount = marketValueAmount - 10000000000; // Corrected calculation
    excessAmount = excessAmount * (0.1 / 100); // 0.1% of the excess over 10 billion
    totalAmount = 50000000 + excessAmount;
  }
  

  const invoiceNumber = await generateInvoiceNumber();

  const payment = await db.payments.create({
    data: {
      invoice_number: invoiceNumber,
      description: "Applications Fees",
      amount: Number(totalAmount),
      created_by: request?.user?.id ?? "",
      updated_by: request?.user?.id ?? "",
    },})


  const controlNumber = generateControlNumber(); // from ega
  // Step 4: Generate and create control number
  const controlNumberRecord = await db.control_numbers.create({
    data: {
      control_number: controlNumber,
      description: "Applications Fees Control number",
      total_amount: Number(totalAmount),
      applications: { connect: { id: application.id } },
      created_by: request?.user?.id ?? "",
      updated_by: request?.user?.id ?? "",
      users: { connect: { id: request.user.id } },
    },
  });

  // Step 5: Update payments with the control number

  await db.payments.update({
    where: {
      id: payment.id,
    },
    data: {
      control_number_id: controlNumberRecord.id,
    },
  });

  const attachmentTypes = await db.attachment_types.findMany({
    where: {
      license_type_id: licenseType
    },
  });

  for (const attachmentType of attachmentTypes) {
    // Create attachments with empty file values
    await db.attachments.create({
      data: {
        attachment_types: {
          connect: { id: attachmentType.id },
        },
        applications: {
          connect: { id: application.id },
        },
        file: "", // Empty file value
        created_by: request?.user?.id ?? "", // Ensure user ID is a string
        updated_by: request?.user?.id ?? "",
      },
    });
  }

  // Return success response
  return Response.json(
    { message: "Application created successfully" },
    { status: 201 }
  );
};

export const POST = authorize(createApplication);
