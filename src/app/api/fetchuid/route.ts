import { NextRequest, NextResponse } from 'next/server';

export const GET = (request: NextRequest, response: NextResponse) => {
  try {
    const { FIREBASE_UID } = process.env;
    if (!FIREBASE_UID) {
      return NextResponse.json({ error: 'FIREBASE_UID not found' , status : 500 });
    }
    return NextResponse.json({ FIREBASE_UID ,status : 200});
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error',status : 500 });
  }
};
