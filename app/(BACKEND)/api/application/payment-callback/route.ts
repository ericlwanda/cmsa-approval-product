import db from "@/lib/db";
import authorize from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus, PaymentStatus, Role } from "@/lib/enums/enums";
import { PaymentCallbackSchema } from "@/lib/validators/payment/validation";

// Helper function to generate a unique license number
const generateLicenseNumber = async (): Promise<string> => {
  const lastLicense = await db.license.findFirst({
    orderBy: { id: "desc" },
  });

  const nextLicenseNumber = lastLicense
    ? (parseInt(lastLicense.license_number, 10) + 1).toString().padStart(5, "0")
    : "00001";

  return nextLicenseNumber;
};

const paymentCallback = async (request: NextRequest) => { 

  const data = await request.json();
  const { error } = PaymentCallbackSchema.safeParse(data);
  const { control_number } = data;

  
  var status = parseInt(data.status);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  // Find the transaction in control number table
  const transaction = await db.control_numbers.findFirst({
    where: { control_number: control_number,payment_status:PaymentStatus.NOTPAID},
  });

  if (!transaction) {
    return NextResponse.json(
      { message: "Invalid control number" },
      { status: 400 }
    );
  }

  if (status === 1) {
    // Update the transaction status to PAID
    await db.control_numbers.update({
      where: { control_number: control_number },
      data: {
        payment_status: PaymentStatus.PAID,
        payment_time: new Date(),
      },
    });

  
      // Find the application using application_id from the transaction
      const application = await db.applications.findUnique({
        where: { id: transaction.application_id }
      });

      if (!application) {
        return NextResponse.json(
          { message: "Application not found" },
          { status: 404 }
        );
      }

      

      // Generate a unique license number
      const licenseNumber = await generateLicenseNumber();
      const issuedAt = new Date();
      const validUntil = new Date(issuedAt);
      validUntil.setFullYear(validUntil.getFullYear() + 1); // Valid for 1 year

      // Create a license for the company
      await db.license.create({
        data: {
          license_types: { connect: { id: application.license_type_id } },
          issued_at: issuedAt,
          valid_until: validUntil,
          license_number: licenseNumber,
          created_by: "",
          updated_by: "",
          type:1,
          users: { connect: { id: application.user_id } },
          applications: { connect: { id: application.id } },
        },
      });



  } else if (status === 0) {
    // Update the transaction status to FAILED
    await db.control_numbers.update({
      where: { control_number: control_number },
      data: {
        payment_status: PaymentStatus.FAILED,
      },
    });
  }

  return NextResponse.json(
    { success: true, message: "Payment status updated" },
    { status: 200 }
  );

};

export const PUT = paymentCallback;
