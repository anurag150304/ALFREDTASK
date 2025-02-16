const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cardCount: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    correctReviews: {
        type: Number,
        default: 0
    },
    lastReviewed: {
        type: Date
    }
}, {
    timestamps: true
});

// Virtual for accuracy percentage
deckSchema.virtual('accuracy').get(function () {
    if (this.totalReviews === 0) return 0;
    return (this.correctReviews / this.totalReviews) * 100;
});

// Method to update deck statistics
deckSchema.methods.updateStats = function (isCorrect) {
    this.totalReviews += 1;
    if (isCorrect) {
        this.correctReviews += 1;
    }
    this.lastReviewed = new Date();
};

module.exports = mongoose.model('Deck', deckSchema); 