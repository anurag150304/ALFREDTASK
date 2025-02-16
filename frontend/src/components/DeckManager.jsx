import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeckManager({ decks, onCreateDeck, onDeleteDeck, onSelectDeck, currentDeck }) {
    const [isCreating, setIsCreating] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');
    const [error, setError] = useState('');

    const handleCreateDeck = (e) => {
        e.preventDefault();
        if (!newDeckName.trim()) {
            setError('Deck name is required');
            return;
        }

        if (decks.some(deck => deck.name.toLowerCase() === newDeckName.toLowerCase())) {
            setError('A deck with this name already exists');
            return;
        }

        onCreateDeck(newDeckName);
        setNewDeckName('');
        setIsCreating(false);
        setError('');
    };

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Your Decks
                </h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary"
                >
                    Create New Deck
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {decks.map((deck) => (
                    <motion.div
                        key={deck.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-lg shadow cursor-pointer transition-colors ${currentDeck?.id === deck.id
                            ? 'bg-indigo-50 dark:bg-indigo-900/50 border-2 border-indigo-500'
                            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        onClick={() => onSelectDeck(deck)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    {deck.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {deck.cards?.length || 0} cards
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteDeck(deck.id);
                                }}
                                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                                title="Delete deck"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Create New Deck
                            </h3>
                            <form onSubmit={handleCreateDeck}>
                                {error && (
                                    <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                                        {error}
                                    </div>
                                )}
                                <div className="mb-4">
                                    <label
                                        htmlFor="deckName"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Deck Name
                                    </label>
                                    <input
                                        type="text"
                                        id="deckName"
                                        value={newDeckName}
                                        onChange={(e) => setNewDeckName(e.target.value)}
                                        className="input-primary"
                                        placeholder="Enter deck name"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreating(false);
                                            setNewDeckName('');
                                            setError('');
                                        }}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                    >
                                        Create Deck
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 