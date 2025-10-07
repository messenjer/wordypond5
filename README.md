# 🐸 WordyPond5

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

**WordyPond** is a fun and interactive web application designed to help children learn and practice weekly vocabulary words through engaging games and AI-generated sentences.

## ✨ Features

### 📚 Weekly Words Management

- Parents can create vocabulary weeks with 10 words each
- Easy-to-use interface for adding, viewing, and managing vocabulary weeks
- All data stored locally in browser's localStorage (no backend required)
- Delete weeks when no longer needed

### 🎮 Interactive Games & Exercises

Three engaging game modes to help children master their vocabulary:

1. **🔤 Spelling Game**

   - Text-to-speech pronunciation of each word
   - Type the word correctly to earn points
   - Instant feedback on correct/incorrect answers
   - Progress tracking throughout the game

2. **🃏 Memory Game**

   - Classic card-matching game with vocabulary words
   - Match pairs of identical words
   - Visual feedback for matched and unmatched pairs
   - Score tracking

3. **📝 Quiz Game**
   - Multiple-choice questions using vocabulary words
   - Audio pronunciation for each question
   - Immediate feedback on answers
   - Final score summary

### ✨ AI Sentence Generator

- Generates creative example sentences using vocabulary words
- **Demo Mode**: Works out-of-the-box with placeholder sentences
- **AI Mode**: Optional OpenAI API integration for AI-generated sentences
- Text-to-speech to read sentences aloud
- Each sentence uses 2-3 vocabulary words for context

### 🎨 Kid-Friendly Design

- Colorful, playful interface with emojis
- Large, readable text with kid-friendly fonts
- Smooth animations and transitions
- Responsive design for all devices
- Fun frog mascot (🐸)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm installed

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd wordypond6
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser and visit `http://localhost:3000`

## 📖 How to Use

### For Parents

1. **Create a Vocabulary Week**

   - Navigate to the "📚 Weeks" page
   - Click "Add Week" button
   - Enter a week title (e.g., "Week 1", "Animals", "Food Words")
   - Fill in all 10 vocabulary words
   - Click "Create Week"

2. **Manage Weeks**
   - View all created weeks on the Weeks page
   - Delete weeks using the trash icon
   - Access games directly from each week card

### For Children

1. **Play Spelling Game**

   - Click "Play Games" on any week
   - Select "🔤 Spelling" mode
   - Click the speaker button to hear the word
   - Type the word and check your answer
   - Complete all words to see your score

2. **Play Memory Game**

   - Select "🃏 Memory" mode
   - Click cards to flip and find matching pairs
   - Match all 5 pairs to win

3. **Play Quiz Game**

   - Select "📝 Quiz" mode
   - Listen to the word
   - Choose the correct spelling from 4 options
   - Complete all questions to see your score

4. **Read AI Sentences**
   - Click "Sentences" on any week card
   - Read fun sentences using your vocabulary words
   - Click "Read Aloud" to hear each sentence
   - Generate new sentences anytime

## 🔧 Technology Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **UI Library**: [Nuxt UI v4](https://ui.nuxt.com/)
- **State Management**: [VueUse](https://vueuse.org/) with localStorage
- **Styling**: TailwindCSS
- **Icons**: Lucide Icons
- **Optional AI**: OpenAI API (for sentence generation)

## 🎨 Customization

### Adding OpenAI API Key (Optional)

For AI-generated sentences:

1. Visit the Sentences page for any week
2. Click "Add API Key (Optional)"
3. Enter your OpenAI API key (starts with `sk-...`)
4. The app will now generate creative sentences using AI

> **Note**: The app works perfectly in demo mode without an API key!

## 📁 Project Structure

```
wordypond6/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css          # Custom styles & animations
│   ├── components/               # Reusable Vue components
│   ├── composables/
│   │   └── useWeeks.ts          # localStorage data management
│   ├── pages/
│   │   ├── index.vue            # Home page
│   │   ├── weeks.vue            # Weeks management page
│   │   ├── exercises/
│   │   │   └── [weekId].vue     # Games page
│   │   └── sentences/
│   │       └── [weekId].vue     # AI sentences page
│   └── app.vue                  # Root layout
├── nuxt.config.ts               # Nuxt configuration
├── package.json
└── README.md
```

## 🔐 Data Storage

All vocabulary weeks and words are stored locally in your browser using `localStorage`. This means:

- ✅ No backend server required
- ✅ No internet connection needed (except for AI sentences)
- ✅ Privacy-friendly (data never leaves your device)
- ⚠️ Data is tied to your browser (clearing browser data will delete weeks)

## 🚀 Production Deployment

Build the application for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

Deploy to your favorite hosting platform:

- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## 📝 License

MIT License - Feel free to use this project for educational purposes!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Made with ❤️ for learning** • Built with [Nuxt UI](https://ui.nuxt.com)
