const router = require('express').Router();
const Deck = require('../models/Deck');
const Flashcard = require('../models/Flashcard');
const auth = require('../middleware/auth');

// Get all decks for user
router.get('/', auth, async (req, res) => {
    try {
        const decks = await Deck.find({ userId: req.user.id });
        res.json(decks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new deck
router.post('/', auth, async (req, res) => {
    try {
        const { name, description } = req.body;

        const deck = new Deck({
            name,
            description,
            userId: req.user.id
        });

        const savedDeck = await deck.save();
        res.status(201).json(savedDeck);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get deck by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const deck = await Deck.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }

        const flashcards = await Flashcard.find({ deckId: deck._id });
        res.json({ deck, flashcards });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update deck
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, description } = req.body;

        const deck = await Deck.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { name, description },
            { new: true }
        );

        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }

        res.json(deck);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete deck
router.delete('/:id', auth, async (req, res) => {
    try {
        const deck = await Deck.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }

        // Delete all flashcards in the deck
        await Flashcard.deleteMany({ deckId: deck._id });

        res.json({ message: 'Deck deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get due flashcards for a deck
router.get('/:id/due', auth, async (req, res) => {
    try {
        const deck = await Deck.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }

        const flashcards = await Flashcard.find({
            deckId: deck._id,
            nextReview: { $lte: new Date() }
        });

        res.json(flashcards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Import flashcards to deck
router.post('/:id/import', auth, async (req, res) => {
    try {
        const deck = await Deck.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }

        const flashcards = req.body.map(card => ({
            ...card,
            userId: req.user.id,
            deckId: deck._id
        }));

        const savedCards = await Flashcard.insertMany(flashcards);
        deck.cardCount += savedCards.length;
        await deck.save();

        res.status(201).json(savedCards);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Export deck flashcards
router.get('/:id/export', auth, async (req, res) => {
    try {
        const deck = await Deck.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deck) {
            return res.status(404).json({ message: 'Deck not found' });
        }

        const flashcards = await Flashcard.find({ deckId: deck._id })
            .select('question answer');

        res.json(flashcards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 