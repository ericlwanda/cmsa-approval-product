import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginSchema } from '@/lib/validators/auth/validation';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { username, password } = await request.json();

    // Validate the input
    const { error } = LoginSchema.safeParse({ username, password });
    
    if (error) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }

    // Find the user in the database
    const user = await db.users.findUnique({ where: { email:username } });
    if (!user) {
      return NextResponse.json({ message: 'Account not found' }, { status: 400 });
    }

    // Check if the user account is active
    if (!user.status) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Prepare the user data for the token
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      role:user.role
    };

    // Generate a JWT token
    const token = jwt.sign({ user: userData }, process.env.JWT_SECRET as string, {
      expiresIn: '2h',
    });

    // Return the token and success message
    return NextResponse.json({ success: true, "AccessToken":token,"userInfo":userData }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
