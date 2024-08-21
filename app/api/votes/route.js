import { NextResponse } from 'next/server';

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

async function fetchFromKV(method, body = null) {
  const headers = {
    Authorization: `Bearer ${KV_REST_API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  const response = await fetch(`${KV_REST_API_URL}/hgetall/votes`, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function GET() {
  try {
    const votes = await fetchFromKV('GET');
    console.log('Raw votes from KV:', votes);

    const formattedVotes = {};

    for (const [key, value] of Object.entries(votes)) {
      console.log(`Processing key: ${key}, value:`, value);
      const [model, voteType] = key.split('_');
      if (!formattedVotes[model]) {
        formattedVotes[model] = { dumber: [], smart: [] };
      }

      let parsedValue;
      try {
        parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
      } catch (parseError) {
        console.error(`Error parsing value for ${key}:`, parseError);
        parsedValue = [];
      }

      formattedVotes[model][voteType] = Array.isArray(parsedValue) ? parsedValue : [parsedValue];
      console.log(`Formatted votes for ${model} ${voteType}:`, formattedVotes[model][voteType]);
    }

    console.log('Final formatted votes:', formattedVotes);
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
    const currentVotes = await fetchFromKV('GET');
    console.log(`Current votes for ${key}:`, currentVotes[key]);

    let updatedVotes = [];

    if (currentVotes[key]) {
      try {
        updatedVotes = typeof currentVotes[key] === 'string' ? JSON.parse(currentVotes[key]) : currentVotes[key];
      } catch (parseError) {
        console.error(`Error parsing current votes for ${key}:`, parseError);
      }
    }

    if (!Array.isArray(updatedVotes)) {
      updatedVotes = updatedVotes ? [updatedVotes] : [];
    }

    updatedVotes.push({ timestamp });
    console.log(`Updated votes for ${key}:`, updatedVotes);

    await fetchFromKV('POST', { [key]: JSON.stringify(updatedVotes) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to record vote:', error);
    return NextResponse.json({ error: 'Failed to record vote', details: error.message }, { status: 500 });
  }
}