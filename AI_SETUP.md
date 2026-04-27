# AI Resume Generator Setup Guide

## Overview
The AI Resume Generator feature allows users to automatically generate professional resume content based on a job description using OpenAI's GPT API.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│  - AIResumeGenerator.jsx: User input & preview component    │
│  - useResumeGenerator.js: API call handler                  │
│  - Home.jsx: Tab navigation & content merge logic           │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP POST /api/generateResume
                 │ { jobDescription: string }
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Express)                      │
│  - server.js: Node.js Express server running on port 3001   │
│  - Validates input and calls OpenAI API                     │
│  - Returns structured JSON: { summary, skills, experience } │
└─────────────────────────────────────────────────────────────┘
                 ↓
        ┌────────────────────┐
        │   OpenAI API       │
        │ (GPT-3.5-turbo)    │
        └────────────────────┘
```

## Prerequisites

1. **OpenAI API Key**
   - Sign up at: https://platform.openai.com/signup
   - Create an API key at: https://platform.openai.com/api-keys
   - Add credits to your OpenAI account (https://platform.openai.com/account/billing/overview)

2. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/

## Installation & Setup

### Step 1: Install Dependencies

```bash
npm install
```

This installs both frontend and backend dependencies:
- Frontend: React, Vite, Tailwind CSS, MUI
- Backend: Express, CORS, dotenv, node-fetch

### Step 2: Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-... (your actual key)
API_PORT=3001
```

**Security Note:** 
- Never commit `.env` to version control
- The API key is stored server-side only
- Frontend never sees the OpenAI API key

### Step 3: Start the Development Environment

#### Option 1: Run Frontend & Backend Separately

```bash
# Terminal 1: Start Frontend (Vite dev server on port 5173)
npm run dev

# Terminal 2: Start Backend API Server (on port 3001)
npm run api-server
```

#### Option 2: Run Both Simultaneously

```bash
npm run dev:full
```

## Usage

### For End Users

1. **Open the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

2. **Switch to AI Generator Tab**
   - Click "🤖 AI Generate" tab in the left panel
   - Paste a job description (any length)

3. **Generate Content**
   - Click "Generate with AI" button
   - Wait for processing (usually 10-30 seconds)
   - Review generated content in preview

4. **Apply to Resume**
   - Click "Apply to Resume" to merge AI content with form
   - Content is merged intelligently (preserves user edits)
   - Switch back to Manual tab to review merged data

5. **Download Resume**
   - Scroll down and click "Preview PDF" button
   - Click "Download PDF" to save the file

### Generated Content Structure

The AI generates the following JSON structure:

```json
{
  "summary": "Professional summary (2-3 sentences)",
  "skills": ["skill1", "skill2", "skill3", ...],
  "experience": [
    {
      "role": "Job title or role name",
      "bullets": ["Achievement 1", "Achievement 2", ...]
    }
  ]
}
```

### Content Merge Logic

When you click "Apply to Resume", the system:
- Preserves: Full Name, Email, Phone, Education, Degree, College
- Updates: Project title, tech stack, project description
- Adds: Professional summary (from AI)
- Adds: Key skills (from AI)

## File Structure

```
src/
├── components/
│   ├── features/
│   │   ├── AIResumeGenerator.jsx        # AI input UI component
│   │   ├── Home.jsx                    # Main container with tab navigation
│   │   ├── Preview.jsx                 # Resume preview (fixed layout)
│   │   └── StudentForm.jsx             # Manual form input
│   └── Hooks/
│       └── useResumeGenerator.js        # API hook for AI generation
│
server.js                               # Express API server
.env                                    # Environment variables (not in git)
.env.example                            # Template for .env
package.json                            # Dependencies & scripts
```

## API Endpoint Documentation

### POST /api/generateResume

Generates resume content from a job description using AI.

**Request:**
```json
{
  "jobDescription": "Job description text here..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "content": {
    "summary": "Professional summary...",
    "skills": ["skill1", "skill2"],
    "experience": [
      {
        "role": "Role name",
        "bullets": ["bullet1", "bullet2"]
      }
    ]
  }
}
```

**Response (Error):**
```json
{
  "error": "Error message",
  "details": "Additional error details (if available)"
}
```

**Error Codes:**
- `400`: Invalid input (missing or empty job description)
- `500`: Server error (API key not configured, OpenAI API error, etc.)

## Troubleshooting

### Issue: "AI service is not configured"
**Solution:** Make sure `OPENAI_API_KEY` is set in `.env` file

### Issue: "Failed to generate resume content"
**Solution:** 
- Check your OpenAI account has credits
- Verify API key is correct
- Check OpenAI API status: https://status.openai.com/

### Issue: API Server not connecting
**Solution:**
- Ensure backend is running: `npm run api-server`
- Check port 3001 is not blocked
- Verify CORS headers are correct

### Issue: Generated content is empty or invalid
**Solution:**
- Try again - API calls can be flaky
- Rephrase the job description more clearly
- Check browser console for detailed error logs

## Performance Considerations

- **API Call Time**: Typically 10-30 seconds depending on job description length
- **Rate Limiting**: OpenAI has usage limits; avoid excessive regeneration
- **Network**: Requires stable internet connection

## Cost Estimation

- **Model Used**: gpt-3.5-turbo (cheaper than gpt-4)
- **Cost per Generation**: ~$0.001-$0.003 USD
- **Monthly Budget Example**: 
  - 1000 generations = ~$1-3 USD
  - 10,000 generations = ~$10-30 USD

## Security Best Practices

✅ **Implemented:**
- API key stored server-side only (in .env)
- Frontend never sees the API key
- CORS configured for frontend origin
- Input validation on all endpoints
- JSON response validation

❌ **NOT Implemented (Future):**
- Rate limiting per user
- API key encryption in database
- User authentication
- Request logging/monitoring

## Extending the Feature

### Change the AI Model
Edit `server.js`, line ~56:
```javascript
model: 'gpt-4-turbo', // Change to 'gpt-4', 'gpt-3.5-turbo', etc.
```

### Adjust Temperature (Creativity)
Edit `server.js`, line ~82:
```javascript
temperature: 0.7, // Range: 0.0 (deterministic) to 2.0 (creative)
```

### Modify the System Prompt
Edit `server.js`, lines ~35-47 to change AI instructions

### Custom Content Merge Logic
Edit `Home.jsx`, function `handleApplyAIContent()` to customize how AI content merges with form data

## Deployment

### Deploy Backend (Recommended Options)

**Option 1: Vercel (Serverless)**
- Create `/api/generateResume.js` as serverless function
- Use `generateResume.js` provided in `/api/` folder
- Set environment variables in Vercel dashboard

**Option 2: Railway/Render (Managed Platform)**
- Upload `server.js` and `package.json`
- Set OPENAI_API_KEY environment variable
- Platform auto-starts `npm run api-server`

**Option 3: AWS Lambda/Azure Functions**
- Convert Express handler to serverless format
- Deploy with environment variables

### Deploy Frontend
- Build: `npm run build` (creates `dist/` folder)
- Deploy to: Vercel, Netlify, Firebase, or any static host
- Update API endpoint in `useResumeGenerator.js` to production server URL

## Testing

### Manual Testing

1. Test with different job descriptions
2. Test with empty/invalid input
3. Test with very long job descriptions
4. Test error handling (disable API key temporarily)

### Automated Testing (Future)
```bash
npm test
```

## Support & Issues

For issues or feature requests, check:
- Browser console (F12) for error details
- Server logs in terminal running `npm run api-server`
- OpenAI API status: https://status.openai.com/

---

**Last Updated**: 2024
**AI Feature Version**: 1.0.0
