import { useState } from 'react';

/**
 * Custom hook for AI-based resume generation
 * 
 * Handles calling the backend API endpoint and managing loading/error states
 * Does NOT auto-merge the response; caller decides how to use it
 * 
 * @returns {Object} - { generateResume, loading, error, response }
 */
export const useResumeGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const generateResume = async (jobDescription) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Call the backend API endpoint
      const res = await fetch('http://localhost:3001/api/generateResume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: jobDescription.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate resume');
      }

      const data = await res.json();
      setResponse(data.content);
      return data.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Resume generation error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateResume,
    loading,
    error,
    response,
  };
};
