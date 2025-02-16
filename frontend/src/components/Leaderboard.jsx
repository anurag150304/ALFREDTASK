import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' or 'achievements'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [leaderboardRes, achievementsRes] = await Promise.all([
                    axios.get('/api/leaderboard'),
                    axios.get('/api/achievements')
                ]);
                setLeaderboardData(leaderboardRes.data);
                setAchievements(achievementsRes.data);
                setError('');
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-600 dark:text-red-400 p-4 text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    className={`flex-1 py-4 px-6 text-sm font-medium ${activeTab === 'leaderboard'
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    onClick={() => setActiveTab('leaderboard')}
                >
                    Leaderboard
                </button>
                <button
                    className={`flex-1 py-4 px-6 text-sm font-medium ${activeTab === 'achievements'
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    onClick={() => setActiveTab('achievements')}
                >
                    Achievements
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'leaderboard' ? (
                    <div className="space-y-4">
                        {leaderboardData.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                                <div className="flex items-center space-x-4">
                                    <span className={`
                                        w-8 h-8 flex items-center justify-center rounded-full
                                        ${index === 0 ? 'bg-yellow-400 text-white' :
                                            index === 1 ? 'bg-gray-400 text-white' :
                                                index === 2 ? 'bg-amber-600 text-white' :
                                                    'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}
                                    `}>
                                        {index + 1}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {user.username}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.score} points
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {user.cardsReviewed} cards reviewed
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-4 rounded-lg border-2 ${achievement.unlocked
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    {achievement.unlocked ? (
                                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    )}
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            {achievement.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {achievement.description}
                                        </p>
                                    </div>
                                </div>
                                {!achievement.unlocked && achievement.progress && (
                                    <div className="mt-3">
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Progress: {achievement.progress.current}/{achievement.progress.required}
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(achievement.progress.current / achievement.progress.required) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 