import React, { useState } from 'react';
import { TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useResumeGenerator } from '../Hooks/useResumeGenerator';

/**
 * AIResumeGenerator Component
 * 
 * Allows users to input a job description and generate AI-powered resume content.
 * The generated content is passed back to the parent via a callback.
 * 
 * Key features:
 * - Input validation for job description
 * - Loading state during API call
 * - Error handling with user-friendly messages
 * - Preview of generated content before applying
 * - Does NOT auto-apply; user must confirm
 */
const AIResumeGenerator = ({ onApplyContent }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const { generateResume, loading, error, response } = useResumeGenerator();

  const handleGenerateClick = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    try {
      await generateResume(jobDescription);
      setShowPreview(true);
    } catch (err) {
      // Error is already set in the hook; UI will display it
    }
  };

  const handleApplyContent = () => {
    if (response && onApplyContent) {
      onApplyContent(response);
      setJobDescription('');
      setShowPreview(false);
    }
  };

  return (
    <Box className="rounded-4xl border border-slate-200/80 bg-white shadow-lg p-8 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-slate-950 mb-4">🤖 AI Resume Generator</h2>
      
      {/* Job Description Input */}
      <div className="mb-6">
        <TextField
          label="Paste Job Description Here"
          multiline
          rows={6}
          fullWidth
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description text here..."
          variant="outlined"
          disabled={loading}
          sx={{
            backgroundColor: '#f8fafc',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              fontSize: '14px',
            },
          }}
        />
        <p className="text-xs text-slate-600 mt-2">
          The AI will analyze this job description and generate relevant resume content including a summary, key skills, and experience bullets.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" className="mb-4">
          <strong>Error:</strong> {error}
        </Alert>
      )}

      {/* Generate Button */}
      <Button
        onClick={handleGenerateClick}
        disabled={loading || !jobDescription.trim()}
        variant="contained"
        size="large"
        fullWidth
        sx={{
          backgroundColor: '#0ea5e9',
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          '&:hover': {
            backgroundColor: '#06b6d4',
          },
          '&:disabled': {
            backgroundColor: '#cbd5e1',
          },
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
            Generating...
          </>
        ) : (
          'Generate with AI'
        )}
      </Button>

      {/* Generated Content Preview */}
      {showPreview && response && !loading && (
        <Box className="mt-8 border-t-2 border-slate-200 pt-6">
          <h3 className="text-lg font-bold text-slate-950 mb-4">Preview Generated Content</h3>
          
          {/* Summary */}
          <div className="mb-4 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs font-semibold text-slate-600 uppercase">Professional Summary</p>
            <p className="text-sm text-slate-800 mt-2">{response.summary}</p>
          </div>

          {/* Skills */}
          <div className="mb-4 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Key Skills</p>
            <div className="flex flex-wrap gap-2">
              {response.skills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-sky-100 text-sky-900 text-xs px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-xs font-semibold text-slate-600 uppercase mb-3">Experience</p>
            {response.experience?.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <p className="font-semibold text-slate-900">{exp.role}</p>
                <ul className="list-disc list-inside text-sm text-slate-700 mt-1 space-y-1">
                  {exp.bullets?.map((bullet, bidx) => (
                    <li key={bidx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleApplyContent}
              variant="contained"
              sx={{
                backgroundColor: '#10b981',
                color: 'white',
                fontWeight: 'bold',
                flex: 1,
                '&:hover': {
                  backgroundColor: '#059669',
                },
              }}
            >
              Apply to Resume
            </Button>
            <Button
              onClick={() => setShowPreview(false)}
              variant="outlined"
              sx={{
                color: '#0ea5e9',
                borderColor: '#0ea5e9',
                fontWeight: 'bold',
                flex: 1,
              }}
            >
              Regenerate
            </Button>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default AIResumeGenerator;
