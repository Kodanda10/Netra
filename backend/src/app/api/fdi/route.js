import { NextResponse } from 'next/server';
import { fetchFDIData } from '../../../ingestion/fetcher';

export async function GET(request) {
  const fdiData = await fetchFDIData();
  return NextResponse.json(fdiData);
}
