import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginSchema } from '@/lib/validators/auth/validation';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Return the token and success message
    return NextResponse.json({ success: true}, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
