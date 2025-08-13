import { NextResponse } from 'next/server';
import { social } from '../../../lib/mock-data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');

  let filteredSocial = social;

  if (platform) {
    filteredSocial = filteredSocial.filter((item) => item.platform === platform);
  }

  return NextResponse.json(filteredSocial);
}
