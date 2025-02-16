import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useFlashcards = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [dueFlashcards, setDueFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetchTime, setLastFetchTime] = useState(null);

    const fetchFlashcards = useCallback(async (force = false) => {
        // Check cache validity
        if (!force && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('/api/flashcards', {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            setFlashcards(response.data);
            setLastFetchTime(Date.now());
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch flashcards');
        } finally {
            setLoading(false);
        }
    }, [lastFetchTime]);

    const fetchDueFlashcards = async () => {
        try {
            const response = await axios.get('/api/flashcards/due', {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            setDueFlashcards(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch due flashcards');
        }
    };

    const createFlashcard = async (flashcardData) => {
        try {
            // Ensure deckId is included in the request
            if (!flashcardData.deckId) {
                return {
                    success: false,
                    error: 'A deck must be selected'
                };
            }

            const response = await axios.post('/api/flashcards', {
                question: flashcardData.question,
                answer: flashcardData.answer,
                deckId: flashcardData.deckId
            });

            // Update the flashcards list with the new card
            setFlashcards(prev => [...prev, response.data]);

            // Fetch updated flashcards to ensure consistency
            fetchFlashcards(true);

            return { success: true, flashcard: response.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to create flashcard'
            };
        }
    };

    const updateFlashcard = async (id, isCorrect) => {
        try {
            const response = await axios.put(`/api/flashcards/${id}`, { isCorrect });
            setFlashcards(prev =>
                prev.map(card => card._id === id ? response.data : card)
            );
            setDueFlashcards(prev => prev.filter(card => card._id !== id));
            return { success: true, flashcard: response.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to update flashcard'
            };
        }
    };

    const deleteFlashcard = async (id) => {
        try {
            await axios.delete(`/api/flashcards/${id}`);
            setFlashcards(prev => prev.filter(card => card._id !== id));
            setDueFlashcards(prev => prev.filter(card => card._id !== id));
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to delete flashcard'
            };
        }
    };

    const editFlashcard = async (id, { question, answer }) => {
        try {
            const response = await axios.put(`/api/flashcards/${id}/edit`, { question, answer });
            setFlashcards(prev =>
                prev.map(card => card._id === id ? response.data : card)
            );
            return { success: true, flashcard: response.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to edit flashcard'
            };
        }
    };

    useEffect(() => {
        fetchFlashcards();
    }, [fetchFlashcards]);

    return {
        flashcards,
        dueFlashcards,
        loading,
        error,
        fetchFlashcards,
        fetchDueFlashcards,
        createFlashcard,
        updateFlashcard,
        deleteFlashcard,
        editFlashcard
    };
}; 