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
      // Check if value is already an object, if not, try to parse it
      const parsedValue = typeof value === 'object' ? value : JSON.parse(value);
      formattedVotes[model][voteType] = Array.isArray(parsedValue) ? parsedValue : [parsedValue];
    }
    
    return NextResponse.json(formattedVotes);
  } catch (error) {
    console.error('Failed to fetch votes:', error);
    return NextResponse.json({ error: 'Failed to fetch votes', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { model, vote, timestamp } = await request.json();
    if (!model || !vote || !timestamp) {
      return NextResponse.json({ error: 'Missing model, vote, or timestamp' }, { status: 400 });
    }
    
    const key = `${model}_${vote}`;
    const currentVotes = await kv.hget('votes', key);
    let updatedVotes = [];
    
    if (currentVotes) {
      // If currentVotes is a string, parse it; otherwise, use it as is
      updatedVotes = typeof currentVotes === 'string' ? JSON.parse(currentVotes) : currentVotes;
    }
    
    // Ensure updatedVotes is an array
    if (!Array.isArray(updatedVotes)) {
      updatedVotes = [updatedVotes];
    }
    
    updatedVotes.push({ timestamp });
    await kv.hset('votes', { [key]: JSON.stringify(updatedVotes) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to record vote:', error);
    return NextResponse.json({ error: 'Failed to record vote', details: error.message }, { status: 500 });
  }
}