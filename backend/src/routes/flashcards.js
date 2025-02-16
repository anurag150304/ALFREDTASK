const router = require('express').Router();
const Flashcard = require('../models/Flashcard');
const auth = require('../middleware/auth');
const Deck = require('../models/Deck');

// Get all flashcards for user
router.get('/', auth, async (req, res) => {
    try {
        const flashcards = await Flashcard.find({ userId: req.user.id });
        res.json(flashcards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get due flashcards
router.get('/due', auth, async (req, res) => {
    try {
        const flashcards = await Flashcard.find({
            userId: req.user.id,
            nextReview: { $lte: new Date() }
        });
        res.json(flashcards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new flashcard
router.post('/', auth, async (req, res) => {
    try {
        const { question, answer, deckId } = req.body;

        // Validate required fields
        if (!question || !answer || !deckId) {
            return res.status(400).json({ message: 'Question, answer, and deck are required' });
        }

        const flashcard = new Flashcard({
            question,
            answer,
            deckId,
            userId: req.user.id
        });

        flashcard.calculateNextReview();
        const savedFlashcard = await flashcard.save();

        // Update deck card count
        await Deck.findByIdAndUpdate(deckId, { $inc: { cardCount: 1 } });

        res.status(201).json(savedFlashcard);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update flashcard
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { isCorrect } = req.body;

        const flashcard = await Flashcard.findOne({
            _id: id,
            userId: req.user.id
        });

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        if (isCorrect) {
            flashcard.box = Math.min(flashcard.box + 1, 5);
        } else {
            flashcard.box = 1;
        }

        flashcard.calculateNextReview();
        const updatedFlashcard = await flashcard.save();
        res.json(updatedFlashcard);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Edit flashcard content
router.put('/:id/edit', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;

        // Validate required fields
        if (!question || !answer) {
            return res.status(400).json({ message: 'Question and answer are required' });
        }

        const flashcard = await Flashcard.findOne({
            _id: id,
            userId: req.user.id
        });

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        flashcard.question = question;
        flashcard.answer = answer;

        const updatedFlashcard = await flashcard.save();
        res.json(updatedFlashcard);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete flashcard
router.delete('/:id', auth, async (req, res) => {
    try {
        const flashcard = await Flashcard.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }

        res.json({ message: 'Flashcard deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 