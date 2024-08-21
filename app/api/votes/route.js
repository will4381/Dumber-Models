import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const votes = await kv.hgetall('votes');
    return NextResponse.json(votes || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { model, vote } = await request.json();
    if (!model || !vote) {
      return NextResponse.json({ error: 'Missing model or vote' }, { status: 400 });
    }
    await kv.hincrby('votes', `${model}_${vote}`, 1);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}