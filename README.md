# GCSEPrep

An AI-powered GCSE revision app for **Maths, English Language and English Literature**, supporting **AQA, Edexcel (Pearson) and OCR** exam boards.

Built with React 18 + Vite 6 + PHP + MySQL. Questions are generated and marked by an AI provider of your choice (Anthropic Claude by default, or any OpenAI-compatible endpoint); all content data is stored in MySQL and editable through a built-in admin panel.

> Created by Becky Hingston and Simon Rundell, Exeter College Faculty of ITDD.

---

## Features

### Study
- **Topic practice** — AI-generated exam-style questions for every topic, labelled with your board's exact paper reference, marks and assessment objectives
- **Examiner feedback** — answers marked against board-style mark schemes with AO breakdown, improvement tips and a model answer
- **Mock Exam** — a mixed paper across all three subjects
- **Real Paper Mode** — works through the structure of AQA Nov 2024 Foundation Paper 1 (27 slots, 80 marks), generating fresh questions each time
- **Question Bank** — 100+ ready-made practice questions, filterable by topic with self-marking
- **Rich text answers** — all student answer boxes use a TipTap editor with bold, italic, underline, headings, code, subscript, superscript, horizontal rule and undo/redo, so working with indices and powers is straightforward

### Games
- **Flashcards** — flip-card decks from the question bank or AI-generated for any subject
- **Speed Round** — as many questions as possible in 60 seconds
- **Beat the Examiner** — climb the Grade 1 to 9 ladder with multiple-choice questions and 3 lives
- **Word Scramble** — unscramble key GCSE vocabulary
- **Match-Up** — connect terms to definitions
- **Leaderboard** — personal bests stored in the browser

### Video Lessons
Curated links to the best free GCSE YouTube channels (Corbettmaths, Maths Genie, Cognito, Mr Bruff, Mr Salles, and more) with topic chips that jump straight to relevant searches.

### Admin Panel
A protected admin panel at `/admin` provides full CRUD management of all content:
- Question bank entries
- Vocabulary words
- Video channels and topics
- Exam blueprint (Real Paper Mode question slots)
- Board configuration and spec data

Editing niceties: list ordering is drag-and-drop (persisted to the database, no visible sort-order field), channel icons are picked from a Font Awesome dropdown, colours use a picker that resolves to `rgba()` values, and prose fields (video descriptions, word clues) use the same TipTap rich text editor as the student screens.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18 or later |
| npm | 9 or later |
| PHP | 8.1 or later |
| MySQL / MariaDB | 8.0 / 10.6 or later |
| Apache (or nginx) | with PHP-FPM |

> The Vite dev server proxies `/api` requests to Apache on `localhost:80`. Apache must be running alongside `npm run dev`.

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/SimonRundell/gcse-prep.git
cd gcse-prep
npm install
```

### 2. Configure

Copy the example config and fill in your values:

```bash
cp .config.example.json .config.json
```

`.config.json` (never commit this file):

```json
{
  "db": {
    "host": "localhost",
    "name": "gcse_prep",
    "user": "your_db_user",
    "password": "your_db_password"
  },
  "ai": {
    "provider": "anthropic",
    "endpoint": "https://api.anthropic.com/v1/messages",
    "model": "claude-sonnet-4-6",
    "apiKey": "sk-ant-..."
  }
}
```

#### AI provider options

The `ai` block selects which LLM generates and marks questions. No code changes are needed to switch provider:

| Field | Purpose |
|-------|---------|
| `provider` | `"anthropic"` (Messages API) or `"openai"` (chat-completions format, used by OpenAI, OpenRouter, Groq, Mistral, Ollama and most others) |
| `endpoint` | Full URL of the chat endpoint |
| `model` | Model ID as the provider expects it |
| `apiKey` | Sent as `x-api-key` (anthropic) or `Authorization: Bearer` (openai) |

Example for a local Ollama model on the same machine:

```json
"ai": {
  "provider": "openai",
  "endpoint": "http://localhost:11434/v1/chat/completions",
  "model": "llama3.2",
  "apiKey": "ollama"
}
```

Note that question generation relies on the model returning clean JSON; smaller local models do this less reliably than Claude, so expect more "Error generating question" retries with them.

### 3. Create the database

```bash
mysql -u root -p -e "CREATE DATABASE gcse_prep CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p gcse_prep < database/schema.sql
```

> **Upgrading an existing 0.1.x database?** Run the one-off migration, which renames `video_channels.emoji` to `icon` (mapping stored emoji to Font Awesome classes) and widens `boards.color` for rgba values:
>
> ```bash
> mysql -u root -p gcse_prep < database/migrate_video_icons.sql
> ```

Grant your app user access:

```sql
GRANT ALL PRIVILEGES ON gcse_prep.* TO 'your_db_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Seed initial data

Run the seed script to populate all tables from the static data files:

```bash
php database/seed.php
```

This inserts the question bank, vocabulary words, video channels, exam blueprint, and board configuration. It also creates the superadmin account (`simon@rundell.org.uk` — change the password in `database/seed.php` before running if needed).

### 5. Point Apache at the project

Add a virtual host or alias so Apache serves the project root. The simplest approach on a local machine is a symlink:

```bash
sudo ln -s /path/to/gcse-prep /var/www/html/gcse-prep
```

The PHP files must be reachable at `http://localhost/api/*.php` for Vite's proxy to work.

### 6. Start the dev server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Project Structure

```
gcse-prep/
├── api/                    PHP REST API
│   ├── config.php          Reads .config.json, exposes $config globally
│   ├── ai.php              LLM proxy — provider/endpoint/model read from config
│   ├── scores.php          Leaderboard read/write
│   ├── resources.php       CRUD for all content resources (auth-gated writes)
│   └── admin_auth.php      Admin session login / logout / setup
│
├── database/
│   ├── schema.sql          Full table definitions
│   ├── seed.php            Populates tables from static data files
│   ├── migrate_video_icons.sql  One-off 0.1.3 migration (emoji → icon, colour width)
│   └── backup_gcse.sql     Database backup
│
├── src/
│   ├── main.jsx            Entry point — routes /admin to AdminApp, else App
│   ├── App.jsx             Main app shell and screen router
│   ├── styles/main.css     Single stylesheet
│   │
│   ├── context/
│   │   └── AppContext.jsx  Global state — fetches all resources from the API on mount
│   ├── api/
│   │   ├── ai.js           callAI() wrapper for the LLM proxy
│   │   └── resources.js    Axios wrappers for the PHP REST endpoints
│   │
│   ├── components/         Shared UI components
│   │   ├── Header.jsx      Top navigation bar with hover dropdowns
│   │   ├── Sidebar.jsx     Secondary sidebar navigation
│   │   ├── RichTextEditor.jsx  TipTap editor used for answers and admin prose
│   │   ├── IconPicker.jsx  Font Awesome icon dropdown (admin)
│   │   ├── RgbaPicker.jsx  Colour picker resolving to rgba() (admin)
│   │   ├── BoardPickerModal.jsx
│   │   ├── FeedbackCard.jsx
│   │   └── SourceBar.jsx
│   │
│   ├── screens/            Full-page screen components
│   │   ├── HomeScreen.jsx
│   │   ├── PracticeScreen.jsx
│   │   ├── MockScreen.jsx
│   │   ├── RealPaperScreen.jsx
│   │   ├── QuestionBankScreen.jsx
│   │   ├── VideoLessonsScreen.jsx
│   │   └── LeaderboardScreen.jsx
│   │
│   ├── games/              Game components
│   │   ├── GamesHub.jsx
│   │   ├── FlashcardGame.jsx
│   │   ├── SpeedRoundGame.jsx
│   │   ├── BeatTheExaminerGame.jsx
│   │   ├── WordScrambleGame.jsx
│   │   └── MatchUpGame.jsx
│   │
│   ├── admin/              Admin panel (served at /admin)
│   │   ├── AdminApp.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── reorder.js      Drag-and-drop ordering helpers (persist sort_order)
│   │   └── tabs/           One tab component per resource type
│   │       ├── QuestionsTab.jsx
│   │       ├── WordsTab.jsx
│   │       ├── VideosTab.jsx
│   │       ├── BlueprintTab.jsx
│   │       └── BoardsTab.jsx
│   │
│   └── data/               Static seed data (read by database/seed.php)
│       ├── boards.js
│       ├── blueprint.js
│       ├── questionBank.js
│       ├── videos.js
│       └── words.js
│
├── .config.example.json    Config template (safe to commit)
├── .config.json            Live config with secrets (gitignored)
├── index.html              Vite entry HTML
├── vite.config.js          Vite config — proxies /api to localhost:80
└── package.json
```

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `admin_users` | Admin accounts (bcrypt-hashed passwords) |
| `question_bank` | Practice questions with slot, topic, marks, answer |
| `words` | Vocabulary words for Word Scramble |
| `video_channels` | YouTube channel data with topic arrays (JSON) |
| `blueprint` | Real Paper Mode slot definitions |
| `boards` | Board-specific spec and subject data (JSON) |
| `board_config` | Global config values — subject labels, AO descriptions, topic map |
| `scores` | Leaderboard entries with UUID and game scores |

---

## API Endpoints

### Public (no auth required)

| Method | URL | Description |
|--------|-----|-------------|
| `POST` | `/api/ai.php` | Proxy to the configured LLM provider for question generation and marking |
| `GET` | `/api/resources.php?type=<type>` | Fetch content data (questions, words, videos, blueprint, boards) |
| `GET/POST` | `/api/scores.php` | Read and write leaderboard scores |
| `GET` | `/api/admin_auth.php` | Check admin session status and whether an admin account exists |

### Admin (session required for writes)

| Method | URL | Description |
|--------|-----|-------------|
| `POST` | `/api/admin_auth.php` | `action: login` / `logout` / `setup` |
| `POST` | `/api/resources.php?type=<type>` | Create a resource record |
| `PUT` | `/api/resources.php?type=<type>&id=<id>` | Update a resource record |
| `DELETE` | `/api/resources.php?type=<type>&id=<id>` | Delete a resource record |

---

## Admin Panel

Navigate to `/admin` in the browser. On first run, if no admin account exists, you will be prompted to create one. Subsequent visits show a login form.

The admin panel provides tabbed CRUD for: Questions, Words, Videos, Blueprint, and Boards. Board data is edited as raw JSON (the boards table stores complex nested spec and subject data in a JSON column); the board colour has its own picker.

Rows in the Questions, Words, Videos and Blueprint tables are reordered by dragging the grip handle; the new order is saved automatically. In the Questions tab, clear the filter box before dragging (reordering a filtered subset is disabled).

---

## Development

```bash
npm run dev       # Start Vite dev server (localhost:5173)
npm run build     # Production build to /dist
npm run preview   # Preview the production build
npm run doctor    # Run react-doctor code quality checks
```

Icons are served from Font Awesome 6 Free (loaded via cdnjs CDN in `index.html`). No icon library is installed as an npm dependency. All UI iconography uses Font Awesome classes; no raw emoji characters appear in the interface.

Rich text editing uses TipTap 3 (`@tiptap/react`, `@tiptap/starter-kit`, plus the subscript and superscript extensions).

---

## Version History

### 0.1.3
- Improved menu and logo
- Replaced every raw emoji in the UI with Font Awesome 6 icons (buttons, titles, games, board picker, video channel avatars)
- Added a reusable TipTap rich text editor (bold, italic, underline, H1/H2, code, subscript, superscript, horizontal rule, undo/redo) to all student answer boxes; answers are submitted to the marker as HTML so indices and powers are preserved
- Admin: TipTap editing for video descriptions and word clues; Font Awesome icon dropdown; rgba colour pickers (channel background and board colour); drag-and-drop row ordering with the sort-order field hidden
- Moved the AI endpoint into `.config.json` (`ai` block: provider, endpoint, model, apiKey), supporting Anthropic and OpenAI-compatible providers, including local Ollama
- Database migration `migrate_video_icons.sql`: `video_channels.emoji` renamed to `icon` and widened; `boards.color` widened for rgba values
- Accessibility and quality pass with react-doctor: explicit `type="button"` on all buttons, aria labels on reorder controls, reduced wasted re-renders during drags
- Fixed crashes from stale `QUESTION_BANK` and `AQA_1F_BLUEPRINT` references in the Question Bank and Real Paper screens

### 0.1.1
- Web fonts and admin backend (MySQL-backed content with CRUD panel at `/admin`)

### 0.1.0
- Initial release

---

## Content Note

All questions in the question bank are original. The Real Paper Mode and Question Bank follow the *structure* of a publicly available AQA past paper (topics, question order, mark allocations) but no copyrighted exam content is reproduced. Past papers are freely available from the exam boards:

- [AQA past papers](https://www.aqa.org.uk/find-past-papers-and-mark-schemes)
- [Pearson Edexcel past papers](https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html)
- [OCR past papers](https://www.ocr.org.uk/qualifications/past-paper-finder/)

---

## License

Copyright (c) 2026 Becky Hingston and Simon Rundell, Exeter College Faculty of ITDD

This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0). See [LICENSE](LICENSE).

You are free to:
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

Under the following terms:
- **Attribution** — You must give appropriate credit to the original authors (Becky Hingston and Simon Rundell, Exeter College Faculty of ITDD), provide a link to the licence, and indicate if changes were made.
- **NonCommercial** — You may not use the material for commercial purposes.
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same licence as the original.

Full licence text: https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
