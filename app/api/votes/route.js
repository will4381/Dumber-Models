import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const votes = await kv.hgetall('votes');
      res.status(200).json(votes || {});
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch votes' });
    }
  } else if (req.method === 'POST') {
    const { model, vote } = req.body;
    if (!model || !vote) {
      return res.status(400).json({ error: 'Missing model or vote' });
    }
    try {
      await kv.hincrby('votes', `${model}_${vote}`, 1);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to record vote' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}