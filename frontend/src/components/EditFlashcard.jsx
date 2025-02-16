import { useState } from 'react';
import { motion } from 'framer-motion';

export default function EditFlashcard({ flashcard, onSave, onCancel }) {
    const [editedCard, setEditedCard] = useState({
        question: flashcard.question,
        answer: flashcard.answer
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!editedCard.question.trim() || !editedCard.answer.trim()) {
            setError('Both question and answer are required');
            return;
        }

        try {
            await onSave(flashcard._id, editedCard);
        } catch (err) {
            setError(err.message || 'Failed to update flashcard');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4">
                            Edit Flashcard
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Question
                                </label>
                                <textarea
                                    value={editedCard.question}
                                    onChange={(e) => setEditedCard({ ...editedCard, question: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    placeholder="Enter question"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Answer
                                </label>
                                <textarea
                                    value={editedCard.answer}
                                    onChange={(e) => setEditedCard({ ...editedCard, answer: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    placeholder="Enter answer"
                                    rows={3}
                                />
                            </div>
                            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row-reverse gap-3 sm:gap-2">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 