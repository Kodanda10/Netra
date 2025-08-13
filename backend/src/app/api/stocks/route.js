import { NextResponse } from 'next/server';
import { stocks } from '../../../lib/mock-data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const exchange = searchParams.get('exchange');

  let filteredStocks = stocks;

  if (exchange) {
    filteredStocks = filteredStocks.filter((stock) => stock.exchange === exchange);
  }

  return NextResponse.json(filteredStocks);
}
