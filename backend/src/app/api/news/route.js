import { NextResponse } from 'next/server';
import { news } from '../../../lib/mock-data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const date = searchParams.get('date');

  let filteredNews = news;

  if (state) {
    filteredNews = filteredNews.filter((article) => article.state === state);
  }

  if (date) {
    filteredNews = filteredNews.filter((article) => article.publishedAt.startsWith(date));
  }

  return NextResponse.json(filteredNews);
}
