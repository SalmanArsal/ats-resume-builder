// Colleges data for the Resume Builder
const collegesData = [
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

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.status(200).json(collegesData);
  } catch (error) {
    console.error('Error in colleges endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch colleges data' });
  }
};
