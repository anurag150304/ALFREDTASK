import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useFlashcards } from '../hooks/useFlashcards.js';
import { useAuth } from '../context/AuthContext.jsx';
import EditFlashcard from '../components/EditFlashcard';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { formatRelativeTime } from '../utils/formatRelativeTime';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const {
        flashcards,
        dueFlashcards,
        loading,
        error,
        fetchDueFlashcards,
        createFlashcard,
        deleteFlashcard,
        editFlashcard
    } = useFlashcards();
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [deletingCard, setDeletingCard] = useState(null);
    const [newCard, setNewCard] = useState({ question: '', answer: '', deckId: '' });
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const [decks, setDecks] = useState([]);
    const [loadingDecks, setLoadingDecks] = useState(true);

    const fetchDecks = useCallback(async () => {
        try {
            setLoadingDecks(true);
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/decks`);
            setDecks(response.data);

            // If there are no decks, create a default deck
            if (response.data.length === 0) {
                const defaultDeckResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/decks`, {
                    name: 'Default Deck',
                    description: 'Default deck for flashcards'
                });
                setDecks([defaultDeckResponse.data]);
            }
        } catch (err) {
            showFeedback('Failed to fetch decks', 'error');
        } finally {
            setLoadingDecks(false);
        }
    }, []);

    useEffect(() => {
        fetchDueFlashcards();
    }, [fetchDueFlashcards]);

    useEffect(() => {
        fetchDecks();
    }, [fetchDecks]);

    const showFeedback = (message, type = 'success') => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
    };

    const handleAddCard = async (e) => {
        e.preventDefault();
        if (!newCard.question.trim() || !newCard.answer.trim()) {
            showFeedback('Question and answer are required', 'error');
            return;
        }

        if (!newCard.deckId) {
            showFeedback('Please select a deck', 'error');
            return;
        }

        try {
            const result = await createFlashcard(newCard);
            if (result.success) {
                setNewCard({ question: '', answer: '', deckId: '' });
                setIsAddingCard(false);
                showFeedback('Flashcard created successfully!');
            } else {
                showFeedback(result.error, 'error');
            }
        } catch (err) {
            showFeedback('Failed to add flashcard', 'error');
        }
    };

    const handleEditCard = async (id, editedCard) => {
        try {
            const result = await editFlashcard(id, editedCard);
            if (result.success) {
                setEditingCard(null);
                showFeedback('Flashcard updated successfully!');
            } else {
                showFeedback(result.error, 'error');
            }
        } catch (err) {
            showFeedback('Failed to update flashcard', 'error');
        }
    };

    const handleDeleteCard = async (id) => {
        try {
            const result = await deleteFlashcard(id);
            if (result.success) {
                setDeletingCard(null);
                showFeedback('Flashcard deleted successfully!');
            } else {
                showFeedback(result.error, 'error');
            }
        } catch (err) {
            showFeedback('Failed to delete flashcard', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-[#3b82f6] cursor-pointer">
                                Recallify
                            </h1>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-600 dark:text-gray-300 mr-9 max-[426px]:text-sm max-[426px]:mr-4 text-center">
                                Welcome, {user.username}
                            </span>
                            <button
                                onClick={logout}
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Feedback Message */}
                <AnimatePresence>
                    {feedback.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-4 p-4 rounded ${feedback.type === 'error'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200'
                                : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200'
                                }`}
                        >
                            {feedback.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer opacity-90">
                                Due for Review: {dueFlashcards.length}
                            </h2>
                            {dueFlashcards.length > 0 && (
                                <Link
                                    to="/review"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                >
                                    Start Review
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white opacity-90">
                                Your Flashcards
                            </h2>
                            <button
                                onClick={() => setIsAddingCard(true)}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Add New Card
                            </button>
                        </div>

                        {isAddingCard && (
                            <form onSubmit={handleAddCard} className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                        Deck
                                    </label>
                                    {loadingDecks ? (
                                        <div className="animate-pulse space-y-4">
                                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                        </div>
                                    ) : (
                                        <select
                                            value={newCard.deckId}
                                            onChange={(e) => setNewCard({ ...newCard, deckId: e.target.value })}
                                            className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                            required
                                        >
                                            <option value="">Select a deck</option>
                                            {decks.map(deck => (
                                                <option key={deck._id} value={deck._id}>
                                                    {deck.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                        Question
                                    </label>
                                    <input
                                        type="text"
                                        value={newCard.question}
                                        onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                                        className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                                        Answer
                                    </label>
                                    <input
                                        type="text"
                                        value={newCard.answer}
                                        onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                                        className="w-full p-2 border rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingCard(false)}
                                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                    >
                                        Add Card
                                    </button>
                                </div>
                            </form>
                        )}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <div className="text-lg text-gray-600 dark:text-gray-400">Loading your flashcards...</div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {flashcards.map((card) => (
                                    <motion.div
                                        key={card._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow relative group hover:shadow-lg transition-shadow"
                                    >
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setEditingCard(card)}
                                                className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mr-2"
                                                title="Edit flashcard"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setDeletingCard(card)}
                                                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                                title="Delete flashcard"
                                            >
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Box Level Indicator */}
                                        <div className="flex items-center mb-3 space-x-2">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`w-2 h-2 rounded-full ${level <= card.box
                                                        ? 'bg-indigo-600 dark:bg-indigo-400'
                                                        : 'bg-gray-200 dark:bg-gray-600'
                                                        }`}
                                                    title={`Box ${level}`}
                                                />
                                            ))}
                                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                                Box {card.box}/5
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                            {card.question}
                                        </h3>

                                        {/* Progress Section */}
                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Review Count: {card.reviewCount || 0}
                                                </span>
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    Success Rate: {card.correctCount ? Math.round((card.correctCount / card.reviewCount) * 100) : 0}%
                                                </span>
                                            </div>

                                            {/* Success Rate Progress Bar */}
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                <div
                                                    className="bg-green-500 h-1.5 rounded-full"
                                                    style={{
                                                        width: `${card.correctCount ? Math.round((card.correctCount / card.reviewCount) * 100) : 0}%`
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Review Date with Relative Time */}
                                        <div className="mt-4 text-sm">
                                            <p className={`${new Date(card.nextReview) <= new Date()
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                {new Date(card.nextReview) <= new Date()
                                                    ? 'Due for review'
                                                    : `Next review: ${formatRelativeTime(card.nextReview)}`}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                <AnimatePresence>
                    {editingCard && (
                        <EditFlashcard
                            flashcard={editingCard}
                            onSave={handleEditCard}
                            onCancel={() => setEditingCard(null)}
                        />
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {deletingCard && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Delete Flashcard
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Are you sure you want to delete this flashcard? This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setDeletingCard(null)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCard(deletingCard._id)}
                                        className="btn-primary bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
} 