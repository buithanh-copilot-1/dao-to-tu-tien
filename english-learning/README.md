# LinguaLearn

An interactive English learning website built with React, TypeScript, and Vite.

## Features

- **Lessons** — Grammar and reading lessons from beginner to advanced
- **Vocabulary** — Flashcard-style word practice with phonetics and examples
- **Quiz** — Multiple-choice grammar and vocabulary tests with instant feedback
- **Progress** — Track completed lessons, learned words, study streak, and quiz scores
- **Offline-ready** — All progress saved to `localStorage` (no backend required)

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run preview  # preview production build
```

## Tech Stack

- React 19 + TypeScript
- React Router 7
- Vite 8
- Plain CSS (no framework)

## Project Structure

```
src/
├── components/   # Layout, Navbar
├── data/         # Lessons, vocabulary, quiz content
├── hooks/        # useProgress (localStorage)
├── pages/        # Home, Lessons, Vocabulary, Quiz, Progress
├── styles/       # Global CSS
└── types/        # TypeScript interfaces
```

## License

MIT
