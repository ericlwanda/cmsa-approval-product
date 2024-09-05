import bcrypt from 'bcryptjs';
import { RegisterSchema } from '@/lib/validators/auth/validation';
import db from '@/lib/db';
import ApiRequest from '@/lib/validators/user/api_request';
import { NextResponse } from 'next/server';
import { Role } from '@/lib/enums/enums';

interface OTP {
  pinId: string;
  pin: string;
  error: any;
}

function isValidRole(value: any): value is Role {
  return Object.values(Role).includes(value);
}

export async function POST(request: ApiRequest) {
  const { office_location, address, region, po_box, website,fax,name, email, phone_number, password, confirmPassword } = await request.json();

  const { error } = RegisterSchema.safeParse({
    name,
    email,
    phone_number,
    password,
    confirmPassword,
    office_location,
    address,
    region,
    po_box,
    website,
    fax
  });

  if (password !== confirmPassword) {
    return NextResponse.json({ message: "Passwords don't match" }, { status: 400 });
  }

  if (error) {
    return NextResponse.json({ message: error.formErrors.fieldErrors }, { status: 400 });
  }

  const role: string = "USER";

  if (isValidRole(role)) {
    console.log("Valid role:", Role[role]);
  } else {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  if (!phone_number || !phone_number.startsWith('255')) {
    return NextResponse.json({ error: 'Enter a valid number starting with 255' }, { status: 400 });
  }

  try {
    // Check if company or user already exists
    const existingCompany = await db.company.findFirst({
      where: {
        OR: [
          { email: email },
          { phone_number: phone_number },
        ],
      },
    });

    if (existingCompany) {
      return NextResponse.json({ message: 'Company already exists' }, { status: 400 });
    }

    const existingUser = await db.users.findFirst({
      where: {
        OR: [
          { email: email },
          { phone_number: phone_number },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Create the company and user in a transaction
    const result = await db.$transaction(async (prisma) => {
      // Create the company
      const company = await prisma.company.create({
        data: {
          name: name,
          office_location: office_location,
          address: address,
          region: region,
          po_box: po_box,
          website: website,
          phone_number: phone_number,
          fax: fax,
          email: email,
          created_by: request?.user?.id ?? '',
          updated_by: request?.user?.id ?? '',
        },
      });

      // Hash the user password
      const hashed_password = await bcrypt.hash(password, 10);

      // Create the user
      const user = await prisma.users.create({
        data: {
          name,
          role,
          email,
          phone_number,
          password: hashed_password,
          created_by: request?.user?.id ?? '',
          updated_by: request?.user?.id ?? '',
          company_id: company.id,  // Associate the user with the newly created company
        },
      });

      return { user };
    });

    return NextResponse.json({
      success: true,
      message: 'Company successfully registered. Check SMS for confirmation',
    }, {
      status: 200,
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
