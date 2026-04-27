/**
 * Development API Server for ATS Resume Builder
 * 
 * This server handles:
 * - AI resume generation (POST /api/generateResume)
 * - Static file serving for the frontend
 * 
 * Start with: npm run api-server
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load db.json
const dbPath = path.join(__dirname, 'db.json');
let db = {};
try {
  const dbContent = fs.readFileSync(dbPath, 'utf-8');
  db = JSON.parse(dbContent);
} catch (error) {
  console.error('Error loading db.json:', error);
}

// Create HTTPS agent that allows self-signed certificates (development only)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * POST /api/generateResume
 * 
 * Generate resume content from a job description using OpenAI
 * 
 * Request body:
 * {
 *   jobDescription: string
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   content: {
 *     summary: string,
 *     skills: string[],
 *     experience: [{
 *       role: string,
 *       bullets: string[]
 *     }]
 *   }
 * }
 */
app.post('/api/generateResume', async (req, res) => {
  const { jobDescription } = req.body;

  // Validation
  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
    return res.status(400).json({ error: 'Job description is required and must be a non-empty string' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not configured in .env');
    return res.status(500).json({ error: 'AI service is not configured. Please set OPENAI_API_KEY in .env' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      agent: httpsAgent,
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert ATS (Applicant Tracking System) resume writer. 
Your task is to generate professional resume content based on a job description.
Always follow these rules:
- Use action verbs (implemented, developed, designed, led, managed, etc.)
- Avoid first-person pronouns (I, me, my)
- Use industry keywords from the job description
- Make content ATS-friendly (no special characters, clean formatting)
- Return ONLY valid JSON with no additional text or markdown

Return your response in this exact JSON format:
{
  "summary": "Professional summary (2-3 sentences)",
  "skills": ["skill1", "skill2", "skill3", ...],
  "experience": [
    {
      "role": "Job title or role name",
      "bullets": ["Achievement bullet point 1", "Achievement bullet point 2", ...]
    }
  ]
}`,
          },
          {
            role: 'user',
            content: `Generate resume content for this job description:\n\n${jobDescription}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return res.status(500).json({
        error: 'Failed to generate resume content',
        details: errorData.error?.message || 'Unknown error'
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content returned from OpenAI');
      return res.status(500).json({ error: 'No content generated' });
    }

    // Parse JSON response
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content);
      return res.status(500).json({
        error: 'Failed to parse generated content',
        details: 'AI response was not valid JSON'
      });
    }

    // Validate structure
    if (!validateResumeContent(parsedContent)) {
      console.error('Invalid resume content structure:', parsedContent);
      return res.status(500).json({
        error: 'Generated content does not match expected format'
      });
    }

    return res.status(200).json({
      success: true,
      content: parsedContent,
    });
  } catch (error) {
    console.error('Resume generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate resume',
      details: error.message
    });
  }
});

/**
 * Validate resume content structure
 */
function validateResumeContent(content) {
  if (!content || typeof content !== 'object') return false;
  if (typeof content.summary !== 'string' || content.summary.trim().length === 0) return false;
  if (!Array.isArray(content.skills) || content.skills.length === 0) return false;
  if (!Array.isArray(content.experience) || content.experience.length === 0) return false;

  for (const exp of content.experience) {
    if (typeof exp.role !== 'string' || exp.role.trim().length === 0) return false;
    if (!Array.isArray(exp.bullets) || exp.bullets.length === 0) return false;
    for (const bullet of exp.bullets) {
      if (typeof bullet !== 'string' || bullet.trim().length === 0) return false;
    }
  }

  return true;
}

// GET /api/colleges - Returns colleges data from db.json
app.get('/api/colleges', (req, res) => {
  if (!db.colleges || db.colleges.length === 0) {
    return res.status(500).json({ error: 'Colleges data not available' });
  }
  res.json(db.colleges);
});

// GET /api/degrees - Returns degrees data from db.json
app.get('/api/degrees', (req, res) => {
  if (!db.degrees || db.degrees.length === 0) {
    return res.status(500).json({ error: 'Degrees data not available' });
  }
  res.json(db.degrees);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📝 AI Resume endpoint: POST http://localhost:${PORT}/api/generateResume`);
  console.log(`❓ OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? '✅ Yes' : '❌ No'}`);
});
