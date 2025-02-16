const router = require('express').Router();
const { Achievement, UserAchievement } = require('../models/Achievement');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all achievements for user
router.get('/', auth, async (req, res) => {
    try {
        const achievements = await Achievement.find();
        const userAchievements = await UserAchievement.find({ userId: req.user.id });

        const achievementsWithProgress = achievements.map(achievement => {
            const userProgress = userAchievements.find(ua =>
                ua.achievementId.toString() === achievement._id.toString()
            );

            return {
                id: achievement._id,
                name: achievement.name,
                description: achievement.description,
                type: achievement.type,
                requirement: achievement.requirement,
                icon: achievement.icon,
                points: achievement.points,
                unlocked: userProgress?.unlocked || false,
                progress: {
                    current: userProgress?.progress || 0,
                    required: achievement.requirement
                }
            };
        });

        res.json(achievementsWithProgress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
    try {
        const users = await User.find()
            .select('username score cardsReviewed correctReviews currentStreak bestStreak')
            .sort('-score')
            .limit(10);

        const leaderboard = users.map(user => ({
            id: user._id,
            username: user.username,
            score: user.score,
            cardsReviewed: user.cardsReviewed,
            accuracy: user.correctReviews / user.cardsReviewed * 100 || 0,
            currentStreak: user.currentStreak,
            bestStreak: user.bestStreak
        }));

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Check and update achievements for a user
router.post('/check', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const achievements = await Achievement.find();
        const userAchievements = await UserAchievement.find({ userId: user._id });

        const unlockedAchievements = [];

        for (const achievement of achievements) {
            let userProgress = userAchievements.find(ua =>
                ua.achievementId.toString() === achievement._id.toString()
            );

            if (!userProgress) {
                userProgress = new UserAchievement({
                    userId: user._id,
                    achievementId: achievement._id,
                    progress: 0,
                    unlocked: false
                });
            }

            let currentProgress = 0;

            switch (achievement.type) {
                case 'cards_created':
                    currentProgress = user.cardsCreated;
                    break;
                case 'cards_reviewed':
                    currentProgress = user.cardsReviewed;
                    break;
                case 'streak':
                    currentProgress = user.currentStreak;
                    break;
                case 'accuracy':
                    currentProgress = (user.correctReviews / user.cardsReviewed * 100) || 0;
                    break;
                case 'decks_created':
                    currentProgress = user.decksCreated;
                    break;
            }

            userProgress.progress = currentProgress;

            if (currentProgress >= achievement.requirement && !userProgress.unlocked) {
                userProgress.unlocked = true;
                userProgress.unlockedAt = new Date();
                user.score += achievement.points;
                unlockedAchievements.push(achievement);
            }

            await userProgress.save();
        }

        if (unlockedAchievements.length > 0) {
            await user.save();
        }

        res.json({
            unlockedAchievements,
            pointsEarned: unlockedAchievements.reduce((sum, a) => sum + a.points, 0)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 