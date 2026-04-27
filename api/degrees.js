import db from '../db.json' assert { type: 'json' };

export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return degrees data from db.json
    res.status(200).json(db.degrees);
  } catch (error) {
    console.error('Error fetching degrees:', error);
    res.status(500).json({ error: 'Failed to fetch degrees data' });
  }
}
