import { NextResponse } from 'next/server';
import { fetchAIResponse } from '../../../ingestion/fetcher';

export async function POST(request) {
  const { question } = await request.json();

  if (!question) {
    return NextResponse.json({ message: 'question is required' }, { status: 400 });
  }

  const aiResponse = await fetchAIResponse(question);
  return NextResponse.json(aiResponse);
}
