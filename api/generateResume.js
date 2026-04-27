/**
 * API Route: Generate Resume Content from Job Description
 * 
 * This endpoint accepts a job description and returns AI-generated resume content
 * in a structured JSON format. The AI response is validated before returning.
 * 
 * IMPORTANT: OpenAI API key is stored server-side only (in environment variables)
 * and never exposed to the frontend.
 * 
 * @param {Request} req - HTTP request containing jobDescription
 * @param {Response} res - HTTP response with generated resume content
 */

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobDescription } = req.body;

  // Validate input
  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length === 0) {
    return res.status(400).json({ error: 'Job description is required and must be a non-empty string' });
  }

  // Validate that OpenAI API key exists
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not configured');
    return res.status(500).json({ error: 'AI service is not configured' });
  }

  try {
    // Call OpenAI API to generate resume content
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo', // or 'gpt-3.5-turbo' for faster/cheaper responses
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

    // Parse the JSON response from the AI
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

    // Validate the structure of the response
    if (!validateResumeContent(parsedContent)) {
      console.error('Invalid resume content structure:', parsedContent);
      return res.status(500).json({ 
        error: 'Generated content does not match expected format'
      });
    }

    // Return the generated content
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
}

/**
 * Validate that the resume content has the expected structure
 * @param {Object} content - The content to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateResumeContent(content) {
  if (!content || typeof content !== 'object') return false;
  if (typeof content.summary !== 'string' || content.summary.trim().length === 0) return false;
  if (!Array.isArray(content.skills) || content.skills.length === 0) return false;
  if (!Array.isArray(content.experience) || content.experience.length === 0) return false;

  // Validate each experience entry
  for (const exp of content.experience) {
    if (typeof exp.role !== 'string' || exp.role.trim().length === 0) return false;
    if (!Array.isArray(exp.bullets) || exp.bullets.length === 0) return false;
    for (const bullet of exp.bullets) {
      if (typeof bullet !== 'string' || bullet.trim().length === 0) return false;
    }
  }

  return true;
}
