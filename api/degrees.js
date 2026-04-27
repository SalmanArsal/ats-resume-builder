import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Hardcoded data as fallback if db.json cannot be read
const fallbackData = [
  { id: 1, name: "Bachelor of Technology (B.Tech)", short: "B.Tech", category: "Engineering" },
  { id: 2, name: "Bachelor of Engineering (B.E)", short: "B.E", category: "Engineering" },
  { id: 3, name: "Bachelor of Science (B.Sc)", short: "B.Sc", category: "Science" },
  { id: 4, name: "Bachelor of Commerce (B.Com)", short: "B.Com", category: "Commerce" },
  { id: 5, name: "Bachelor of Arts (B.A)", short: "B.A", category: "Arts" },
  { id: 6, name: "Bachelor of Computer Applications (BCA)", short: "BCA", category: "Computer" },
  { id: 7, name: "Bachelor of Business Administration (BBA)", short: "BBA", category: "Management" },
  { id: 8, name: "Bachelor of Medicine and Bachelor of Surgery (MBBS)", short: "MBBS", category: "Medical" },
  { id: 9, name: "Bachelor of Pharmacy (B.Pharm)", short: "B.Pharm", category: "Pharmacy" },
  { id: 10, name: "Bachelor of Architecture (B.Arch)", short: "B.Arch", category: "Architecture" },
  { id: 11, name: "Master of Technology (M.Tech)", short: "M.Tech", category: "Engineering" },
  { id: 12, name: "Master of Engineering (M.E)", short: "M.E", category: "Engineering" },
  { id: 13, name: "Master of Science (M.Sc)", short: "M.Sc", category: "Science" },
  { id: 14, name: "Master of Commerce (M.Com)", short: "M.Com", category: "Commerce" },
  { id: 15, name: "Master of Arts (M.A)", short: "M.A", category: "Arts" },
  { id: 16, name: "Master of Computer Applications (MCA)", short: "MCA", category: "Computer" },
  { id: 17, name: "Master of Business Administration (MBA)", short: "MBA", category: "Management" },
  { id: 18, name: "Doctor of Philosophy (PhD)", short: "PhD", category: "Doctorate" },
  { id: 19, name: "Diploma in Engineering", short: "Diploma", category: "Diploma" },
  { id: 20, name: "Post Graduate Diploma (PGDM)", short: "PGDM", category: "Management" }
];

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Try to read db.json from multiple locations
    const possiblePaths = [
      path.join(__dirname, '..', 'db.json'),           // ../db.json
      path.join('/var', 'task', 'db.json'),            // Vercel path
      path.join(process.cwd(), 'db.json'),             // Current directory
    ];
    
    let data = null;
    for (const dbPath of possiblePaths) {
      if (fs.existsSync(dbPath)) {
        const dbContent = fs.readFileSync(dbPath, 'utf-8');
        const db = JSON.parse(dbContent);
        data = db.degrees;
        break;
      }
    }
    
    // Use fallback data if file not found
    if (!data) {
      console.warn('db.json not found, using fallback data');
      data = fallbackData;
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in degrees endpoint:', error.message);
    // Return fallback data on error
    res.status(200).json(fallbackData);
  }
}
