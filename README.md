# Leitner System Flashcard Web App

## Overview
This web application allows users to create, review, and progress through flashcards using the **Leitner System**, an effective spaced repetition technique for learning. Users can track their progress and review flashcards at optimal intervals based on their mastery level.

## Tech Stack
- **Frontend:** React, React Hooks, Axios, Tailwind CSS / Bootstrap, Framer Motion (for animations)
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT (for user login / signup & progress tracking)

---

## Features
### **1. Flashcard Management**
- **Add Flashcards:** Users can create flashcards with a question, answer, and an initial review date.
- **Edit Flashcards:** Modify existing flashcards (e.g., correct mistakes, update content).
- **Delete Flashcards:** Remove flashcards permanently.

### **2. Leitner System Implementation**
- **Flashcards start in Box 1.**
- **Correct answers move a flashcard to the next box.**
- **Incorrect answers send the flashcard back to Box 1.**
- **Higher-numbered boxes have longer review intervals.**
- **Fetch flashcards based on their next review date.**

### **3. User Interaction**
- Users can review flashcards one at a time.
- Options to mark responses as:
  - **"Got it right"** → Moves the flashcard to the next level.
  - **"Got it wrong"** → Resets the flashcard to Box 1.
- **Progress Tracking:** Displays stats like "You have X flashcards due today."
- **Animations:** Smooth UI transitions when answering flashcards.

### **4. User Authentication (Bonus Feature)**
- **Signup/Login System:** Users can create accounts & log in securely with JWT authentication.
- **Flashcard Progress Tracking:** Users' flashcard levels and review schedules are stored in their account.

### **5. UI/UX Enhancements**
- **Dark Mode Toggle:** Enhances usability for night-time studying.
- **Minimalist Design:** Focused layout to avoid distractions.
- **Responsive UI:** Mobile and desktop-friendly interface.

---

## API Endpoints
### **Flashcards API**
| Method | Endpoint           | Description |
|--------|-------------------|-------------|
| `POST` | `/flashcards`     | Add a new flashcard |
| `GET`  | `/flashcards`     | Retrieve all flashcards |
| `PUT`  | `/flashcards/:id` | Update a flashcard (e.g., move to next level) |
| `DELETE` | `/flashcards/:id` | Delete a flashcard |

### **Auth API (Bonus Feature)**
| Method | Endpoint       | Description |
|--------|--------------|-------------|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login`  | Authenticate user and return JWT |

---

## Database Schema (MongoDB + Mongoose)
```js
const FlashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  box: { type: Number, default: 1 }, // Leitner System level
  nextReview: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
```
```js
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
```

---

## Frontend Flow (React)
### **1. Flashcard Listing**
- Fetch all flashcards that are **due for review**.
- Display a count: _"You have X flashcards due today."_
- Allow filtering based on box level.

### **2. Flashcard Review Process**
- Show a flashcard with a **"Show Answer"** button.
- After revealing the answer, provide:
  - **"Got it right"** → Moves flashcard to the next level.
  - **"Got it wrong"** → Resets flashcard to Box 1.
- Send API requests to update flashcard status.

### **3. User Authentication**
- Login/signup form using JWT.
- Securely fetch user-specific flashcards.
- Persist login session using localStorage.

### **4. UI Enhancements**
- **Dark Mode Toggle:** Store user preference in localStorage.
- **Animations with Framer Motion:** Smooth transitions when navigating flashcards.

---

## Future Enhancements
- **Leaderboard:** Gamify learning with streaks & badges.
- **Import/Export Flashcards:** Allow users to share or back up flashcards.
- **Multiple Decks:** Users can organize flashcards into categories.

## Conclusion
This flashcard web app leverages the **Leitner System** to optimize learning through spaced repetition. With user authentication, clean UI, and responsive interactions, it provides an efficient and engaging study experience.
