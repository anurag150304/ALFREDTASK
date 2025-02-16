const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    box: {
        type: Number,
        default: 1,
        min: 1,
        max: 5
    },
    nextReview: {
        type: Date,
        required: true,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deck',
        required: true
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    correctCount: {
        type: Number,
        default: 0
    },
    streak: {
        type: Number,
        default: 0
    },
    lastReviewed: {
        type: Date
    }
}, {
    timestamps: true
});

// Method to calculate next review date based on box number
flashcardSchema.methods.calculateNextReview = function () {
    const intervals = {
        1: 1,     // 1 day
        2: 3,     // 3 days
        3: 7,     // 1 week
        4: 14,    // 2 weeks
        5: 30     // 1 month
    };

    const days = intervals[this.box] || 1;
    this.nextReview = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return this.nextReview;
};

// Method to update review statistics
flashcardSchema.methods.updateStats = function (isCorrect) {
    this.reviewCount += 1;
    if (isCorrect) {
        this.correctCount += 1;
        this.streak += 1;
    } else {
        this.streak = 0;
    }
    this.lastReviewed = new Date();
};

module.exports = mongoose.model('Flashcard', flashcardSchema); 