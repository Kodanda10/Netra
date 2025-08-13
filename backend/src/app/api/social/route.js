import { NextResponse } from 'next/server';
import { fetchSocialMediaData } from '../../../ingestion/fetcher';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform');
  const username = searchParams.get('username');

  if (!platform || !username) {
    return NextResponse.json({ message: 'platform and username are required' }, { status: 400 });
  }

  const socialData = await fetchSocialMediaData(platform, username);
  return NextResponse.json(socialData);
}
