import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const votes = await kv.hgetall('votes');
    const formattedVotes = {};
    
    for (const [key, value] of Object.entries(votes)) {
      const [model, voteType] = key.split('_');
      if (!formattedVotes[model]) {
        formattedVotes[model] = { dumber: [], smart: [] };
      }
      const votes = JSON.parse(value);
      formattedVotes[model][voteType] = votes;
    }
    
    return NextResponse.json(formattedVotes);
  } catch (error) {
    console.error('Failed to fetch votes:', error);
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { model, vote, timestamp } = await request.json();
    if (!model || !vote || !timestamp) {
      return NextResponse.json({ error: 'Missing model, vote, or timestamp' }, { status: 400 });
    }
    
    const key = `${model}_${vote}`;
    const currentVotes = JSON.parse(await kv.hget('votes', key) || '[]');
    currentVotes.push({ timestamp });
    await kv.hset('votes', { [key]: JSON.stringify(currentVotes) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to record vote:', error);
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}