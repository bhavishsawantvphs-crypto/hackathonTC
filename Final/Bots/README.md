# 🌿 Sohrai — Jharkhand Tourism AI Guide & Bot

A production-ready, autonomous AI tourism guide for Jharkhand powered by **Google Gemini** with real-time streaming, automated model fallback, multilingual support, and **persistent conversation history** across browser refreshes and site navigation.

---

## 🚀 Key Features

1. **Persistent Conversation History**:
   - History is stored safely in browser `localStorage`.
   - **Refreshing the page (F5) or navigating across pages NEVER deletes the chat.**
   - Users can intentionally start a fresh session using the `＋ New` chat button.
2. **Streaming AI Responses**:
   - Server-Sent Events (SSE) stream answers token-by-token for an ultra-responsive user experience.
3. **Automated Model Fallback Chain**:
   - Primary: `gemini-3.6-flash`
   - Quota fallback: `gemini-3.5-flash-lite`
4. **Multilingual (English, Hindi, Marathi)**:
   - Dynamic prompt adaptation and localized UI dictionaries (`public/i18n.js`).
5. **Grounded Knowledge Base**:
   - Strictly restricted to verified Jharkhand tourism facts in `data/jharkhand-info.md`.
6. **Easy Team Website Integration**:
   - 1-line `<script>` drop-in widget (`public/widget.js`).
   - Iframe embed (`public/embed.html`).
   - Direct REST API (`/api/chat`).

---

## 📦 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Ensure your `.env` contains your Google Gemini API Key:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Start the Server
```bash
npm start
```

Once running, access:
- **Standalone Bot UI**: `http://localhost:3000/`
- **Widget Embed Window**: `http://localhost:3000/embed.html`
- **Team Integration Simulation**: `http://localhost:3000/team-demo.html`
- **Widget Loader**: `http://localhost:3000/widget.js`
- **Chat API**: `POST http://localhost:3000/api/chat`

---

## 🤝 Linking to Your Team's Website

Your team can integrate the bot into any website in seconds:

### Option A: 1-Line Drop-in Widget (Recommended)
Add this before `</body>` on any webpage:
```html
<script src="http://localhost:3000/widget.js" defer></script>
```

### Option B: Inline Iframe
```html
<iframe src="http://localhost:3000/embed.html" style="width:100%;height:600px;border:none;border-radius:12px;"></iframe>
```

For full API and custom frontend integration examples, check out [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md).

---

## 📁 Project Structure

```
SIH_BOT_2_Main _Copy_TE/
├── data/
│   ├── jharkhand-info.md     # Grounded facts about Jharkhand tourism
│   └── users.db              # SQLite database (optional account & session store)
├── public/
│   ├── chat-widget.js        # Core client chat logic & localStorage persistence
│   ├── embed.html            # Embeddable widget interface
│   ├── i18n.js               # Multi-language translation dictionaries
│   ├── index.html            # Full-page standalone chat UI
│   ├── team-demo.html        # Team integration simulation demo
│   └── widget.js             # 1-line launcher script for external websites
├── .env                      # API keys & configuration
├── .env.example              # Example environment configuration
├── db.js                     # SQLite database models & sessions
├── INTEGRATION_GUIDE.md      # Step-by-step guide for your team
├── package.json              # Project dependencies
├── README.md                 # Documentation
└── server.js                 # Express server, Gemini streaming & CORS
```
