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

  const url = method === 'GET' ? `${KV_REST_API_URL}/hgetall/votes` : `${KV_REST_API_URL}/hmset/votes`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Error parsing JSON:', text);
    throw new Error('Invalid JSON response from KV');
  }
}

export async function GET() {
  try {
    const votes = await fetchFromKV('GET');
    console.log('Raw votes from KV:', votes);

    if (typeof votes !== 'object' || votes === null) {
      throw new Error('Invalid data structure received from KV');
    }

    const formattedVotes = {};

    // Handle the specific structure returned by Vercel KV
    if (votes.result && Array.isArray(votes.result)) {
      for (let i = 0; i < votes.result.length; i += 2) {
        const key = votes.result[i];
        const value = votes.result[i + 1];
        const [model, voteType] = key.split('_');
        
        if (!formattedVotes[model]) {
          formattedVotes[model] = { dumber: [], smart: [] };
        }

        let parsedValue;
        try {
          parsedValue = JSON.parse(value);
        } catch (parseError) {
          console.error(`Error parsing value for ${key}:`, parseError);
          parsedValue = isNaN(value) ? [] : Number(value);
        }

        formattedVotes[model][voteType] = Array.isArray(parsedValue) ? parsedValue : [parsedValue];
      }
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
    console.log('Current votes:', currentVotes);

    let updatedVotes = [];
    if (currentVotes.result && Array.isArray(currentVotes.result)) {
      const index = currentVotes.result.indexOf(key);
      if (index !== -1 && index + 1 < currentVotes.result.length) {
        const value = currentVotes.result[index + 1];
        try {
          updatedVotes = JSON.parse(value);
        } catch (parseError) {
          console.error(`Error parsing current votes for ${key}:`, parseError);
          updatedVotes = isNaN(value) ? [] : [Number(value)];
        }
      }
    }

    if (!Array.isArray(updatedVotes)) {
      updatedVotes = updatedVotes ? [updatedVotes] : [];
    }

    updatedVotes.push({ timestamp });
    console.log(`Updated votes for ${key}:`, updatedVotes);

    const updateResult = await fetchFromKV('POST', { [key]: JSON.stringify(updatedVotes) });
    console.log('Update result:', updateResult);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to record vote:', error);
    return NextResponse.json({ error: 'Failed to record vote', details: error.message }, { status: 500 });
  }
}