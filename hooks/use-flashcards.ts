import { useState, useEffect, useCallback } from 'react';

export interface Flashcard {
  id: number;
  word: string;
  pinyin: string;
  meaning: string;
  level: number;
  stt: number;
  created_at: string;
  example_chinese: string;
  example_pinyin: string;
  example_meaning: string;
}

interface UseFlashcardsOptions {
  level?: number;
  initialQuery?: string;
  debounceTime?: number;
}

export const useFlashcards = ({
  level,
  initialQuery = '',
  debounceTime = 500
}: UseFlashcardsOptions = {}) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceTime);

    return () => {
      clearTimeout(timer);
    };
  }, [query, debounceTime]);

  const fetchFlashcards = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Construct the API URL with query parameters
      let url = `${process.env.NEXT_PUBLIC_URL_API}/flashcards`;
      
      // Add parameters
      const params = new URLSearchParams();
      if (level) {
        params.append('level', level.toString());
      }
      if (debouncedQuery) {
        params.append('query', debouncedQuery);
      }

      // Append parameters to URL if they exist
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching flashcards:', err);
    } finally {
      setIsLoading(false);
    }
  }, [level, debouncedQuery]);

  // Fetch flashcards whenever level or debouncedQuery changes
  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  return {
    flashcards,
    isLoading,
    error,
    query,
    setQuery,
    refetch: fetchFlashcards
  };
}; 