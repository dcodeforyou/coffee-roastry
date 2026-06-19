import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  return NextResponse.json({ ok: true, route: params?.path ?? [] });
}

export async function POST(request) {
  return NextResponse.json({ ok: true });
}
