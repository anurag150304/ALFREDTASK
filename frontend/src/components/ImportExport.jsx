import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ImportExport({ onImport, onClose }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/json') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a valid JSON file');
            setFile(null);
        }
    };

    const handleImport = async () => {
        if (!file) {
            setError('Please select a file to import');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const flashcards = JSON.parse(e.target.result);
                    await onImport(flashcards);
                    onClose();
                } catch (err) {
                    setError('Invalid JSON format');
                }
            };
            reader.readAsText(file);
        } catch (err) {
            setError('Failed to read file');
        }
    };

    const handleExport = () => {
        const flashcardsJson = localStorage.getItem('flashcards') || '[]';
        const blob = new Blob([flashcardsJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'flashcards.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4"
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Import/Export Flashcards
                </h3>

                {error && (
                    <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Import Flashcards
                        </label>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-medium
                                file:bg-indigo-50 file:text-indigo-700
                                dark:file:bg-indigo-900/50 dark:file:text-indigo-300
                                hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900"
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={handleExport}
                            className="btn-secondary"
                        >
                            Export Flashcards
                        </button>
                        <div className="space-x-3">
                            <button
                                onClick={onClose}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!file}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Import
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 