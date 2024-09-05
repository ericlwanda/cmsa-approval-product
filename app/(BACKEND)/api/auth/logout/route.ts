import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios'

export async function GET(request: NextRequest) {

    if(request.method !== 'GET')
    return NextResponse.json({ error: 'Method is not allowed'}, { status: 504 })

    axios.interceptors.request.use((config) => {
      delete config.headers['authorization'];
      return config;
    });

  return NextResponse.json({ message: 'Logged out' }, { status: 200 });
}