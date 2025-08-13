import { NextResponse } from 'next/server';
import { fetchStockData } from '../../../ingestion/fetcher';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const exchange = searchParams.get('exchange');

  if (!symbol || !exchange) {
    return NextResponse.json({ message: 'symbol and exchange are required' }, { status: 400 });
  }

  const stockData = await fetchStockData(symbol, exchange);
  return NextResponse.json(stockData);
}
