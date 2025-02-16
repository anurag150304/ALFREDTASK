import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashcards } from '../hooks/useFlashcards';
import Flashcard from '../components/Flashcard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Review() {
    const navigate = useNavigate();
    const { dueFlashcards, loading, error, fetchDueFlashcards, updateFlashcard } = useFlashcards();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showComplete, setShowComplete] = useState(false);

    useEffect(() => {
        fetchDueFlashcards();
    }, [fetchDueFlashcards]);

    const handleAnswer = async (cardId, isCorrect) => {
        try {
            await updateFlashcard(cardId, isCorrect);

            if (currentIndex + 1 < dueFlashcards.length) {
                setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                }, 500);
            } else {
                setShowComplete(true);
            }
        } catch (err) {
            console.error('Failed to update flashcard:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    if (dueFlashcards.length === 0 || showComplete) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        All caught up!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        You've completed all your due flashcards.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Review Flashcards
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                            Card {currentIndex + 1} of {dueFlashcards.length}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Exit Review
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-2xl mx-auto"
                    >
                        <Flashcard
                            card={dueFlashcards[currentIndex]}
                            onAnswer={handleAnswer}
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="mt-4 sm:mt-8 max-w-2xl mx-auto">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${((currentIndex + 1) / dueFlashcards.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
} 