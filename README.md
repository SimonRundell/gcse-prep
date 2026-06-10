# 🎓 GCSEPrep

An AI-powered GCSE revision app for **Maths, English Language and English Literature**, supporting **AQA, Edexcel (Pearson) and OCR** exam boards — with revision games, video lesson links, and a 100+ question practice bank.

## ✨ Features

### 📚 Study
- **Topic practice** — AI-generated exam-style questions for every topic, labelled with your board's exact paper, question reference, marks and assessment objectives (AOs)
- **Instant examiner feedback** — answers are marked against board-style mark schemes with an AO breakdown, improvement tips and a model answer
- **Mock Exam** — a mixed paper across all three subjects
- **Real Paper Mode** — works through the topic-by-topic structure of AQA's Nov 2024 Foundation Paper 1 (27 question slots, 80 marks), generating fresh questions in each slot's style
- **Question Bank** — 102 original, instantly-available practice questions following that paper structure, filterable by topic with self-marking

### 🎮 Games
- **🃏 Flashcards** — flip-card decks (instant maths deck from the bank, or AI-generated for any subject)
- **⚡ Speed Round** — answer as many questions as you can in 60 seconds
- **🎯 Beat the Examiner** — climb the Grade 1→9 ladder with multiple-choice questions, 3 lives
- **🔤 Word Scramble** — unscramble key GCSE vocabulary
- **🧩 Match-Up** — connect terms/questions to definitions/answers
- **🏆 Leaderboard** — personal bests saved locally in the browser

### 🎬 Video Lessons
Curated links to the best free GCSE YouTube teachers (Corbettmaths, Maths Genie, Cognito, Mr Bruff, Mr Salles and more) with clickable topic chips that jump straight to relevant videos.

## 🚀 Getting Started

### Run locally
Just open `index.html` in a browser — it's a single self-contained file.

> **Note:** the AI question generation and marking call the Anthropic API endpoint used by Claude Artifacts. If you host this outside that environment, you'll need to wire up your own API key / proxy in the `callAI()` function (see [Anthropic API docs](https://docs.claude.com)). The Question Bank, Word Scramble, Match-Up (bank mode), Flashcards (instant deck) and Speed Round (bank mode) all work fully offline with no API.

### Deploy with GitHub Pages
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under "Source", select the `main` branch and `/ (root)` folder
4. Your app will be live at `https://<your-username>.github.io/<repo-name>/`

## 🧰 Tech
- Single-file HTML/CSS/JS — no build step, no dependencies
- LocalStorage for scores and personal bests
- Anthropic Claude API for question generation and marking (optional)

## ⚖️ Content note
All questions in the bank are **original**. The Real Paper Mode and Question Bank follow the *structure* (topics, question order, mark allocations) of a publicly available AQA past paper, but no copyrighted exam questions are reproduced. Past papers themselves are available free from the exam boards' websites:
- [AQA past papers](https://www.aqa.org.uk/find-past-papers-and-mark-schemes)
- [Pearson Edexcel past papers](https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html)
- [OCR past papers](https://www.ocr.org.uk/qualifications/past-paper-finder/)

## 📄 License
MIT — see [LICENSE](LICENSE).
