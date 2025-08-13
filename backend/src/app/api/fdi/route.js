import { NextResponse } from 'next/server';
import { fdi } from '../../../lib/mock-data';

export async function GET(request) {
  return NextResponse.json(fdi);
}
