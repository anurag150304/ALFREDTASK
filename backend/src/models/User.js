const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    score: {
        type: Number,
        default: 0
    },
    cardsCreated: {
        type: Number,
        default: 0
    },
    cardsReviewed: {
        type: Number,
        default: 0
    },
    correctReviews: {
        type: Number,
        default: 0
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    bestStreak: {
        type: Number,
        default: 0
    },
    lastReviewDate: {
        type: Date
    },
    decksCreated: {
        type: Number,
        default: 0
    },
    achievements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement'
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to update user statistics
userSchema.methods.updateStats = function (isCorrect) {
    this.cardsReviewed += 1;
    if (isCorrect) {
        this.correctReviews += 1;
        this.currentStreak += 1;
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
    } else {
        this.currentStreak = 0;
    }
    this.lastReviewDate = new Date();
};

// Virtual for accuracy percentage
userSchema.virtual('accuracy').get(function () {
    if (this.cardsReviewed === 0) return 0;
    return (this.correctReviews / this.cardsReviewed) * 100;
});

// Method to add points to user's score
userSchema.methods.addPoints = function (points) {
    this.score += points;
};

module.exports = mongoose.model('User', userSchema); 