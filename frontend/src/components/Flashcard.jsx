import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Flashcard({ card, onAnswer }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleAnswer = (correct) => {
        setIsFlipped(false);
        onAnswer(card._id, correct);
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
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
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Success Rate: {card.correctCount ? Math.round((card.correctCount / card.reviewCount) * 100) : 0}%
                </div>
            </div>

            <div
                className={`relative w-full aspect-[3/2] cursor-pointer perspective-1000`}
                onClick={handleFlip}
            >
                <motion.div
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                    className="w-full h-full preserve-3d"
                >
                    {/* Front of card */}
                    <div className="absolute w-full h-full backface-hidden">
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 flex flex-col justify-center items-center">
                            <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white text-center">
                                Question
                            </h3>
                            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center">
                                {card.question}
                            </p>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Click to flip
                            </p>
                        </div>
                    </div>

                    {/* Back of card */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180">
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 flex flex-col justify-between">
                            <div className="flex-1 flex flex-col justify-center items-center">
                                <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white text-center">
                                    Answer
                                </h3>
                                <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 text-center">
                                    {card.answer}
                                </p>
                            </div>
                            <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAnswer(false);
                                    }}
                                    className="px-4 py-2 text-sm sm:text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <span>Incorrect</span>
                                    <span className="text-xs block mt-1">Back to Box 1</span>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAnswer(true);
                                    }}
                                    className="px-4 py-2 text-sm sm:text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <span>Correct</span>
                                    <span className="text-xs block mt-1">
                                        {card.box < 5 ? `Move to Box ${card.box + 1}` : 'Stay in Box 5'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 