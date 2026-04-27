import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Hardcoded data as fallback if db.json cannot be read
const fallbackData = [
  { id: 1, name: "IIT Bombay", city: "Visakhapatnam", state: "Andhra Pradesh" },
  { id: 2, name: "IIT Delhi", city: "Kakinada", state: "Andhra Pradesh" },
  { id: 3, name: "Jawaharlal Nehru Technological University Anantapur", city: "Anantapur", state: "Andhra Pradesh" },
  { id: 4, name: "Sri Venkateswara University", city: "Tirupati", state: "Andhra Pradesh" },
  { id: 5, name: "Acharya Nagarjuna University", city: "Guntur", state: "Andhra Pradesh" },
  { id: 6, name: "GITAM University", city: "Visakhapatnam", state: "Andhra Pradesh" },
  { id: 7, name: "KL University", city: "Guntur", state: "Andhra Pradesh" },
  { id: 8, name: "SRM University AP", city: "Amaravati", state: "Andhra Pradesh" },
  { id: 9, name: "Vignan's Foundation for Science Technology and Research", city: "Guntur", state: "Andhra Pradesh" },
  { id: 10, name: "Gayatri Vidya Parishad College of Engineering", city: "Visakhapatnam", state: "Andhra Pradesh" }
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
        data = db.colleges;
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
    console.error('Error in colleges endpoint:', error.message);
    // Return fallback data on error
    res.status(200).json(fallbackData);
  }
}
