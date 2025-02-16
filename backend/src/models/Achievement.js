const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['cards_created', 'cards_reviewed', 'streak', 'accuracy', 'decks_created'],
        required: true
    },
    requirement: {
        type: Number,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// User Achievement Progress Schema
const userAchievementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    achievementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement',
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    unlocked: {
        type: Boolean,
        default: false
    },
    unlockedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Create a compound index to ensure unique user-achievement combinations
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

const Achievement = mongoose.model('Achievement', achievementSchema);
const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);

module.exports = {
    Achievement,
    UserAchievement
}; 