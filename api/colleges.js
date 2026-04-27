import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the directory of the current file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Try multiple possible locations for db.json
    let dbPath = path.join(__dirname, '..', 'db.json');
    if (!fs.existsSync(dbPath)) {
      dbPath = path.join(process.cwd(), 'db.json');
    }
    if (!fs.existsSync(dbPath)) {
      dbPath = path.join('/', 'var', 'task', 'db.json');
    }
    
    const dbContent = fs.readFileSync(dbPath, 'utf-8');
    const db = JSON.parse(dbContent);
    
    // Return colleges data
    res.status(200).json(db.colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    console.error('Current working directory:', process.cwd());
    res.status(500).json({ error: 'Failed to fetch colleges data', details: error.message });
  }
}
