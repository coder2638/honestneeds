import { NextResponse } from 'next/server';

/**
 * Plain-text keep-alive endpoint for Render.com free tier
 * Prevents instance spin-down - minimal output for cron jobs
 */

export const GET = () => {
  return new NextResponse('ok', { 
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
};

export const HEAD = () => {
  return new NextResponse(null, { status: 200 });
};
