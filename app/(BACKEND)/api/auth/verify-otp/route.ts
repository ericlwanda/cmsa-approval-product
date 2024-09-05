import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/validators/auth/pin_verification';

export async function POST(request: NextRequest) {
  try {
    const { pin_id, pin } = await request.json();

    if (!pin || !pin_id) {
      return NextResponse.json({ error: 'Enter a valid pin' }, { status: 400 });
    }

    const response = await verifyOTP(pin_id, pin);

    if(response.error)
      return Response.json({ error: response.error.data.message }, { status: 400 })

    return NextResponse.json(response);
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
