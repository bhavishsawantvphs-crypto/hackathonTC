# 🚀 Sohrai AI Bot — Team Integration Guide

This guide explains how to link the **Sohrai AI Bot** to your team's website in less than 2 minutes.

---

## 🌟 Key Features

- **Never Clears Conversation History**: Stays saved across page reloads (F5), tab switches, and site navigation.
- **Self-Contained Backend**: Fast streaming AI responses powered by Google Gemini with automatic model fallback.
- **Multilingual Support**: Real-time switching between **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)**.
- **Grounded Knowledge Base**: Answers only from verified Jharkhand Tourism facts in `data/jharkhand-info.md`.
- **Zero Configuration CORS**: Can be called from any port, localhost, or production domain.

---

## 🛠️ Step 1: Start the Bot Server

In the bot directory, run:

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Configure .env with your Google Gemini API Key
# Make sure .env has: GOOGLE_API_KEY=your_key_here

# 3. Start the server
npm start
```

The server will start at `http://localhost:3000` (or your configured `PORT`).

---

## 🔌 Step 2: Link to Your Team's Website (Choose Any Method)

### Method A: Floating Chat Widget (Recommended — 1 Line of Code)

Add this single `<script>` tag to the bottom of your team's HTML pages, right before `</body>`:

```html
<!-- Paste before </body> on any page -->
<script src="http://localhost:3000/widget.js" defer></script>
```

*(If hosting on a live domain instead of localhost, replace `http://localhost:3000` with your live URL, e.g. `https://your-bot.onrender.com/widget.js`)*

#### What this gives you:
- A floating chat button (💬) at the bottom-right of your page.
- Clicking opens a responsive chat window.
- Fully mobile-responsive.
- Conversation history is automatically retained across every page the user visits!

---

### Method B: Inline Iframe (Dedicated Chat Page or Sidebar)

If you want the AI chat box embedded directly into a section or full page of your website:

```html
<iframe
  src="http://localhost:3000/embed.html"
  style="width: 100%; max-width: 450px; height: 600px; border: none; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"
  title="Sohrai AI Tourism Guide"
></iframe>
```

---

### Method C: Custom Frontend Integration via REST API

If your team is building a custom UI in React, Next.js, Vue, Angular, or Flutter and wants to call the backend directly:

#### Endpoint:
`POST http://localhost:3000/api/chat`

#### Request Body (JSON):
```json
{
  "message": "What are the best waterfalls to visit in monsoon?",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Namaskar! How can I help you explore Jharkhand?" }
  ],
  "lang": "en"
}
```

#### Response:
Server-Sent Events (SSE) stream returning chunks:
```
data: {"delta":"Hundru Falls is magnificent..."}

data: {"done":true,"reply":"Hundru Falls is magnificent during monsoon..."}
```

---

## 🧪 Testing the Integration

Open `http://localhost:3000/team-demo.html` in your browser to see a live simulation of a team website using the bot widget.

---

## 📁 Bot Directory Structure

```
SIH_BOT_2_Main _Copy_TE/
├── data/
│   └── jharkhand-info.md   # Grounding facts for the AI guide
├── public/
│   ├── chat-widget.js       # Client chat engine with localStorage persistence
│   ├── embed.html           # Widget chat window
│   ├── i18n.js              # Translation dictionaries (en, hi, mr)
│   ├── index.html           # Standalone full-page AI chat
│   ├── team-demo.html       # Team integration test demo
│   └── widget.js            # 1-line widget loader script
├── .env                     # GOOGLE_API_KEY and PORT
├── .env.example             # Example environment file
├── INTEGRATION_GUIDE.md     # This guide for your team
├── package.json             # Dependencies
├── README.md                # General documentation
└── server.js                # Express backend with Gemini streaming & fallback
```
