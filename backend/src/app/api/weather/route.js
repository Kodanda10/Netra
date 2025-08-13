import { NextResponse } from 'next/server';
import { fetchWeatherData } from '../../../ingestion/fetcher';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json({ message: 'city is required' }, { status: 400 });
  }

  const weatherData = await fetchWeatherData(city);
  return NextResponse.json(weatherData);
}
