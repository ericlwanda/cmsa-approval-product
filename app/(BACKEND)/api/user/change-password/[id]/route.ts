import bcrypt from "bcryptjs";
import { ChangePasswordSchema } from "@/lib/validators/user/validation";
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { getParam } from "@/lib/utils";
import { NextResponse } from "next/server";

const confirmReset = async (request: ApiRequest) => {
  try {
    const data = await request.json();
    const id = getParam(request.url);

    // Validate incoming data using ChangePasswordSchema
    const { error } = ChangePasswordSchema.safeParse(data);
    if (error) {
      return NextResponse.json({ message: error.formErrors.fieldErrors }, { status: 400 });
    }

    const { oldPassword, newPassword, confirmPassword } = data;

    // Retrieve user from database
    const user = await db.users.findUnique({
      where: { id: id, status: 1, archive: 0 },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if newPassword matches confirmPassword
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    // Validate old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Incorrect old password" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password in the database
    const updatedUser = await db.users.update({
      where: { id },
      data: {
        password: hashedPassword,
        updated_at: new Date(),
        updated_by: request?.user?.id ?? "", // Assuming you have user info in request
      },
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "Failed to change password" }, { status: 400 });
    }

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ message: "An error occurred while processing your request" }, { status: 500 });
  }
};

export const POST = authorize(confirmReset);
