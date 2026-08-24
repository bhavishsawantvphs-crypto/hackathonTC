/**
 * Sohrai AI Chat Widget — Public Loader
 * Hosted by the Sohrai Bot Server on /widget.js
 */
(function () {
  if (window.__SOHRAI_WIDGET_INITIALIZED__) return;
  window.__SOHRAI_WIDGET_INITIALIZED__ = true;

  // Configuration & Endpoints
  var thisScript =
    document.currentScript ||
    (function () {
      var all = document.getElementsByTagName("script");
      return all[all.length - 1];
    })();

  var explicitUrl =
    (thisScript && thisScript.getAttribute("data-bot-url")) ||
    (typeof window !== "undefined" && window.SOHRAI_BOT_URL);

  var DEFAULT_API_HOST = "http://localhost:3000";
  var BACKEND_URL = DEFAULT_API_HOST;

  if (explicitUrl) {
    BACKEND_URL = explicitUrl.replace(/\/+$/, "");
  } else if (thisScript && thisScript.src) {
    try {
      var scriptOrigin = new URL(thisScript.src).origin;
      if (scriptOrigin && scriptOrigin !== "null") {
        BACKEND_URL = scriptOrigin;
      }
    } catch (e) {}
  } else if (typeof window !== "undefined" && window.location && window.location.origin && window.location.origin !== "null" && window.location.protocol.startsWith("http")) {
    if (window.location.port === "3000") {
      BACKEND_URL = window.location.origin;
    } else {
      BACKEND_URL = DEFAULT_API_HOST;
    }
  }

  var CHAT_ENDPOINT = BACKEND_URL + "/api/chat";
  var STORAGE_KEY_HISTORY = "sohrai_chat_history_v1";
  var STORAGE_KEY_LANG = "sohrai_chat_lang_v1";
  var STORAGE_KEY_BADGE = "sohrai_chat_badge_dismissed";

  var I18N = {
    en: {
      name: "Sohrai AI",
      tagline: "Jharkhand Tourism Guide",
      greeting: "Namaskar! 🌿 I am Sohrai, your AI guide to Jharkhand's unexplored waterfalls, sacred hills, tribal heritage, and festivals. How can I assist your journey?",
      placeholder: "Ask about waterfalls, Netarhat, culture, safety...",
      send: "Send",
      newChat: "＋ New Chat",
      connecting: "Connecting to AI...",
      serverOffline: "⚠️ AI Server is offline on port 3000. Run 'npm start' in the Bots folder to enable live AI chat.",
      retryBtn: "🔄 Retry Connection",
      suggestions: [
        { label: "🌊 Best Waterfalls", query: "What are the best waterfalls to visit in Jharkhand and how do I reach them?" },
        { label: "⛰️ Hill Stations & Netarhat", query: "Where should I go for a scenic hill station trip in Jharkhand?" },
        { label: "🎨 Tribal Culture & Art", query: "Tell me about Sohrai painting and tribal festivals in Jharkhand" },
        { label: "🗺️ 3-Day Itinerary", query: "Suggest a 3-day eco-tourism itinerary for exploring Jharkhand" }
      ]
    },
    hi: {
      name: "सोहराई AI",
      tagline: "झारखंड पर्यटन गाइड",
      greeting: "नमस्कार! 🌿 मैं सोहराई हूँ, झारखंड के अप्रतिम झरनों, पवित्र पहाड़ियों, आदिवासी संस्कृति और त्योहारों के लिए आपका AI गाइड। आपकी क्या मदद करूँ?",
      placeholder: "झरनों, नेतरहाट, संस्कृति, यात्रा के बारे में पूछें...",
      send: "भेजें",
      newChat: "＋ नई बातचीत",
      connecting: "AI से जुड़ रहे हैं...",
      serverOffline: "⚠️ AI सर्वर पोर्ट 3000 पर बंद है। Bots फोल्डर में 'npm start' चलाएं।",
      retryBtn: "🔄 पुनः प्रयास करें",
      suggestions: [
        { label: "🌊 प्रमुख झरने", query: "झारखंड में घूमने के लिए सबसे अच्छे झरने कौन से हैं?" },
        { label: "⛰️ नेतरहाट और पहाड़ियाँ", query: "झारखंड में पहाड़ी और शांत स्थलों के बारे में बताएं" },
        { label: "🎨 आदिवासी संस्कृति व पर्व", query: "झारखंड की सोहराई चित्रकला और प्रमुख त्योहारों के बारे में बताएं" },
        { label: "🗺️ 3 दिवसीय यात्रा योजना", query: "झारखंड भ्रमण के लिए 3 दिन का यात्रा कार्यक्रम बताएं" }
      ]
    },
    mr: {
      name: "सोहराई AI",
      tagline: "झारखंड पर्यटन मार्गदर्शक",
      greeting: "नमस्कार! 🌿 मी सोहराई आहे, झारखंडमधील निसर्गरम्य धबधबे, टेकड्या, संस्कृती आणि सणांसाठी तुमचा AI मार्गदर्शक. मी तुम्हाला कशी मदत करू शकेन?",
      placeholder: "धबधबे, टेकड्या, संस्कृतीबद्दल विचारा...",
      send: "पाठवा",
      newChat: "＋ नवीन चॅट",
      connecting: "AI शी कनेक्ट करत आहे...",
      serverOffline: "⚠️ AI सर्व्हर पोर्ट 3000 वर सुरू नाही. कृपया Bots फोल्डरमध्ये 'npm start' चालवा.",
      retryBtn: "🔄 पुन्हा प्रयत्न करा",
      suggestions: [
        { label: "🌊 प्रसिद्ध धबधबे", query: "झारखंडमधील सर्वोत्तम धबधबे कोणते आहेत?" },
        { label: "⛰️ नेतरहाट आणि टेकड्या", query: "झारखंडमधील थंड हवेच्या ठिकाणांबद्दल सांगा" },
        { label: "🎨 आदिवासी संस्कृती", query: "झारखंडची सोहराई कला आणि सणांबद्दल माहिती द्या" },
        { label: "🗺️ 3 दिवसांची सहल", query: "झारखंड फिरण्यासाठी 3 दिवसांची सहल योजना सांगा" }
      ]
    }
  };

  // State
  var currentLang = "en";
  try {
    var savedLang = localStorage.getItem(STORAGE_KEY_LANG);
    if (savedLang && I18N[savedLang]) currentLang = savedLang;
  } catch (e) {}

  var history = [];

  function getBotUserStorageKey() {
    var uid = null;
    if (typeof getUserId === "function") {
      uid = getUserId();
    } else if (typeof window !== "undefined" && window.FootprintJH && window.FootprintJH.auth && typeof window.FootprintJH.auth.getUserId === "function") {
      uid = window.FootprintJH.auth.getUserId();
    }
    return uid ? ("sohrai_chat_history_" + uid) : null;
  }

  function loadChatHistory() {
    var key = getBotUserStorageKey();
    if (!key) {
      // GUEST USER: everything is cleared!
      history = [];
      return;
    }
    try {
      var rawHist = localStorage.getItem(key);
      if (rawHist) history = JSON.parse(rawHist);
      if (!Array.isArray(history)) history = [];
    } catch (e) {
      history = [];
    }
  }

  loadChatHistory();

  var isOpen = false;
  var isServerAlive = true;

  // Insert Styles
  var style = document.createElement("style");
  style.id = "sohrai-widget-styles";
  style.textContent = `
    #sohrai-bot-root {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --jh-deep: #143521;
      --jh-forest: #1e4d2b;
      --jh-leaf: #2f6b3c;
      --jh-accent: #4c9a45;
      --jh-gold: #c98a2c;
      --jh-bg: #f8faf4;
      --jh-card: #ffffff;
      --jh-border: rgba(30, 77, 43, 0.15);
      --jh-text: #163b27;
      --jh-muted: #5e7967;
      z-index: 2147483640;
    }

    /* Floating Launcher */
    #sohrai-launcher-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 62px;
      height: 62px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.35);
      background: linear-gradient(135deg, #1e4d2b 0%, #2f6b3c 60%, #4c9a45 100%);
      color: #ffffff;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(20, 53, 33, 0.38), 0 0 0 1px rgba(76, 154, 69, 0.3);
      z-index: 2147483640;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      padding: 0;
      outline: none;
      user-select: none;
    }

    #sohrai-launcher-btn:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 16px 36px rgba(20, 53, 33, 0.48), 0 0 20px rgba(76, 154, 69, 0.4);
    }

    #sohrai-launcher-btn .btn-icon-open,
    #sohrai-launcher-btn .btn-icon-close {
      position: absolute;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #sohrai-launcher-btn .btn-icon-close {
      opacity: 0;
      transform: rotate(-90deg) scale(0.5);
      font-size: 22px;
      font-weight: 700;
    }

    #sohrai-launcher-btn.is-active .btn-icon-open {
      opacity: 0;
      transform: rotate(90deg) scale(0.5);
    }

    #sohrai-launcher-btn.is-active .btn-icon-close {
      opacity: 1;
      transform: rotate(0) scale(1);
    }

    /* Pulsing online badge */
    #sohrai-status-dot {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #10B981;
      border: 2.5px solid #ffffff;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
    }

    /* Welcome Tooltip Callout */
    #sohrai-welcome-pill {
      position: fixed;
      bottom: 96px;
      right: 24px;
      background: #143521;
      color: #F8FAF4;
      padding: 10px 16px;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(76, 154, 69, 0.35);
      z-index: 2147483639;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      animation: sohraiFloat 3s ease-in-out infinite;
      transition: opacity 0.3s ease, transform 0.3s ease;
      max-width: 280px;
    }

    #sohrai-welcome-pill:hover {
      transform: translateY(-2px);
      background: #1e4d2b;
    }

    @keyframes sohraiFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    /* Chat Container Modal */
    #sohrai-chat-modal {
      position: fixed;
      bottom: 98px;
      right: 24px;
      width: 400px;
      max-width: calc(100vw - 32px);
      height: 600px;
      max-height: calc(100vh - 120px);
      background: #f8faf4;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(15, 38, 24, 0.3), 0 0 0 1px rgba(30, 77, 43, 0.15);
      z-index: 2147483640;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(16px) scale(0.96);
      pointer-events: none;
      transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #sohrai-chat-modal.is-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    /* Header */
    .sohrai-header {
      background: linear-gradient(135deg, #143521 0%, #1e4d2b 100%);
      color: #ffffff;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }

    .sohrai-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sohrai-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .sohrai-title-box h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sohrai-title-box p {
      margin: 2px 0 0;
      font-size: 11px;
      color: #a8d5b0;
      font-weight: 500;
    }

    .sohrai-header-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sohrai-btn-pill {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #f8faf4;
      border-radius: 8px;
      padding: 4px 8px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
      font-family: inherit;
    }

    .sohrai-btn-pill:hover {
      background: rgba(255, 255, 255, 0.22);
    }

    .sohrai-lang-select {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
      border-radius: 8px;
      padding: 3px 6px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      outline: none;
    }

    .sohrai-lang-select option {
      background: #143521;
      color: #ffffff;
    }

    /* Offline Alert Banner */
    #sohrai-offline-alert {
      background: #FEF3C7;
      border-bottom: 1px solid #F59E0B;
      color: #92400E;
      padding: 8px 14px;
      font-size: 11.5px;
      font-weight: 500;
      display: none;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    /* Messages Log */
    #sohrai-chat-log {
      flex: 1 1 auto;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8faf4;
      scroll-behavior: smooth;
    }

    .sohrai-msg {
      max-width: 86%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.5;
      word-break: break-word;
      animation: sohraiMsgIn 0.2s ease-out;
    }

    @keyframes sohraiMsgIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .sohrai-msg.user {
      background: linear-gradient(135deg, #1e4d2b 0%, #2f6b3c 100%);
      color: #ffffff;
      align-self: flex-end;
      border-bottom-right-radius: 3px;
      box-shadow: 0 4px 12px rgba(30, 77, 43, 0.2);
    }

    .sohrai-msg.bot {
      background: #ffffff;
      color: #163b27;
      align-self: flex-start;
      border-bottom-left-radius: 3px;
      border: 1px solid rgba(30, 77, 43, 0.12);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .sohrai-msg.bot.thinking {
      color: #5e7967;
      font-style: italic;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sohrai-msg.bot ul {
      margin: 6px 0;
      padding-left: 18px;
    }

    .sohrai-msg.bot li {
      margin: 4px 0;
    }

    .sohrai-msg.bot p {
      margin: 4px 0;
    }

    .sohrai-msg.bot strong {
      color: #143521;
      font-weight: 700;
    }

    /* Suggestions */
    #sohrai-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 14px 10px;
      background: #f8faf4;
      flex-shrink: 0;
    }

    .sohrai-chip {
      background: #ffffff;
      border: 1px solid rgba(30, 77, 43, 0.18);
      color: #1e4d2b;
      border-radius: 20px;
      padding: 5px 11px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .sohrai-chip:hover {
      background: #e9f3e6;
      border-color: #2f6b3c;
      transform: translateY(-1px);
    }

    /* Input Footer */
    #sohrai-chat-form {
      display: flex;
      gap: 8px;
      padding: 12px 14px;
      background: #ffffff;
      border-top: 1px solid rgba(30, 77, 43, 0.12);
      flex-shrink: 0;
    }

    #sohrai-chat-input {
      flex: 1;
      padding: 10px 14px;
      border: 1.5px solid rgba(30, 77, 43, 0.18);
      border-radius: 12px;
      font-size: 13.5px;
      font-family: inherit;
      color: #143521;
      background: #f8faf4;
      outline: none;
      transition: all 0.15s ease;
    }

    #sohrai-chat-input:focus {
      background: #ffffff;
      border-color: #2f6b3c;
      box-shadow: 0 0 0 3px rgba(47, 107, 60, 0.15);
    }

    #sohrai-send-btn {
      background: linear-gradient(135deg, #1e4d2b 0%, #2f6b3c 100%);
      color: #ffffff;
      border: none;
      border-radius: 12px;
      padding: 0 16px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #sohrai-send-btn:hover {
      background: linear-gradient(135deg, #143521 0%, #1e4d2b 100%);
      transform: scale(1.02);
    }

    #sohrai-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    /* Mobile view */
    @media (max-width: 480px) {
      #sohrai-chat-modal {
        bottom: 0;
        right: 0;
        width: 100vw;
        max-width: 100vw;
        height: 100vh;
        max-height: 100vh;
        border-radius: 0;
      }
      #sohrai-launcher-btn {
        bottom: 16px;
        right: 16px;
      }
      #sohrai-welcome-pill {
        bottom: 84px;
        right: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  // Markdown parsing helper
  function escapeHtml(str) {
    return (str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function inlineFormat(line) {
    return escapeHtml(line)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
  }

  function renderMarkdown(text) {
    if (!text) return "";
    var lines = text.split("\n");
    var html = "";
    var inList = false;

    lines.forEach(function (rawLine) {
      var bulletMatch = rawLine.match(/^(\s*)[*-]\s+(.*)$/);
      if (bulletMatch) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += "<li>" + inlineFormat(bulletMatch[2]) + "</li>";
      } else {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        var trimmed = rawLine.trim();
        if (trimmed) {
          html += "<p>" + inlineFormat(rawLine) + "</p>";
        }
      }
    });
    if (inList) html += "</ul>";
    return html;
  }

  // Create Widget Elements
  function createWidgetDOM() {
    if (document.getElementById("sohrai-bot-root")) return;

    var root = document.createElement("div");
    root.id = "sohrai-bot-root";

    // Launcher Button
    var launcher = document.createElement("button");
    launcher.id = "sohrai-launcher-btn";
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Chat with Sohrai Jharkhand Tourism AI Guide");
    launcher.innerHTML = `
      <div class="btn-icon-open">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <path d="M8 9h8" stroke-width="2.5"></path>
          <path d="M8 13h5" stroke-width="2.5"></path>
        </svg>
      </div>
      <div class="btn-icon-close">✕</div>
      <div id="sohrai-status-dot" title="Sohrai AI Online"></div>
    `;

    // Welcome Pill
    var welcomePill = document.createElement("div");
    welcomePill.id = "sohrai-welcome-pill";
    welcomePill.innerHTML = `
      <span>🌿 <strong>Ask Sohrai AI</strong> about Jharkhand!</span>
      <span style="font-size:11px;opacity:0.8;margin-left:4px;">✕</span>
    `;

    var dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY_BADGE) === "1";
    } catch (e) {}

    if (dismissed) {
      welcomePill.style.display = "none";
    }

    welcomePill.addEventListener("click", function (e) {
      if (e.target.textContent.trim() === "✕") {
        welcomePill.style.display = "none";
        try { localStorage.setItem(STORAGE_KEY_BADGE, "1"); } catch (err) {}
      } else {
        toggleWidget(true);
      }
    });

    // Chat Modal
    var modal = document.createElement("div");
    modal.id = "sohrai-chat-modal";
    modal.innerHTML = `
      <div class="sohrai-header">
        <div class="sohrai-header-left">
          <div class="sohrai-avatar">🌿</div>
          <div class="sohrai-title-box">
            <h3 id="sohrai-header-title">Sohrai AI</h3>
            <p id="sohrai-header-tagline">Jharkhand Tourism Guide</p>
          </div>
        </div>
        <div class="sohrai-header-right">
          <button type="button" class="sohrai-btn-pill" id="sohrai-new-chat-btn" title="Start a fresh conversation">＋ New</button>
          <select class="sohrai-lang-select" id="sohrai-lang-select">
            <option value="en">EN</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>
          <button type="button" class="sohrai-btn-pill" id="sohrai-close-btn" style="padding:4px 7px;">✕</button>
        </div>
      </div>
      <div id="sohrai-offline-alert">
        <span id="sohrai-offline-text">⚠️ AI Server Offline on localhost:3000</span>
        <button type="button" class="sohrai-btn-pill" id="sohrai-retry-btn" style="background:#D97706;border:none;color:#fff;">Retry</button>
      </div>
      <div id="sohrai-chat-log"></div>
      <div id="sohrai-suggestions"></div>
      <form id="sohrai-chat-form">
        <input type="text" id="sohrai-chat-input" placeholder="Ask about waterfalls, hills, culture..." autocomplete="off" />
        <button type="submit" id="sohrai-send-btn">Send</button>
      </form>
    `;

    root.appendChild(launcher);
    root.appendChild(welcomePill);
    root.appendChild(modal);
    document.body.appendChild(root);

    // Wire events
    launcher.addEventListener("click", function () {
      toggleWidget();
    });

    document.getElementById("sohrai-close-btn").addEventListener("click", function () {
      toggleWidget(false);
    });

    document.getElementById("sohrai-new-chat-btn").addEventListener("click", function () {
      if (confirm("Start a new chat? This will clear your saved conversation history.")) {
        clearChat();
      }
    });

    var langSelect = document.getElementById("sohrai-lang-select");
    langSelect.value = currentLang;
    langSelect.addEventListener("change", function (e) {
      setLanguage(e.target.value);
    });

    document.getElementById("sohrai-retry-btn").addEventListener("click", function () {
      checkServerHealth(true);
    });

    var form = document.getElementById("sohrai-chat-form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("sohrai-chat-input");
      if (input && input.value.trim()) {
        sendChatMessage(input.value.trim());
        input.value = "";
      }
    });

    renderSuggestions();
    restoreChatHistory();
    checkServerHealth(false);
  }

  function toggleWidget(forceState) {
    isOpen = typeof forceState === "boolean" ? forceState : !isOpen;
    var modal = document.getElementById("sohrai-chat-modal");
    var launcher = document.getElementById("sohrai-launcher-btn");
    var welcomePill = document.getElementById("sohrai-welcome-pill");

    if (modal && launcher) {
      if (isOpen) {
        modal.classList.add("is-open");
        launcher.classList.add("is-active");
        if (welcomePill) welcomePill.style.display = "none";
        try { localStorage.setItem(STORAGE_KEY_BADGE, "1"); } catch (e) {}
        var input = document.getElementById("sohrai-chat-input");
        if (input) setTimeout(function () { input.focus(); }, 150);
        var log = document.getElementById("sohrai-chat-log");
        if (log) log.scrollTop = log.scrollHeight;
      } else {
        modal.classList.remove("is-open");
        launcher.classList.remove("is-active");
      }
    }
  }

  function setLanguage(lang) {
    if (!I18N[lang]) lang = "en";
    currentLang = lang;
    try { localStorage.setItem(STORAGE_KEY_LANG, lang); } catch (e) {}

    var t = I18N[lang];
    var title = document.getElementById("sohrai-header-title");
    var tagline = document.getElementById("sohrai-header-tagline");
    var input = document.getElementById("sohrai-chat-input");
    var sendBtn = document.getElementById("sohrai-send-btn");
    var newBtn = document.getElementById("sohrai-new-chat-btn");

    if (title) title.textContent = t.name;
    if (tagline) tagline.textContent = t.tagline;
    if (input) input.placeholder = t.placeholder;
    if (sendBtn) sendBtn.textContent = t.send;
    if (newBtn) newBtn.textContent = t.newChat;

    renderSuggestions();
  }

  function renderSuggestions() {
    var container = document.getElementById("sohrai-suggestions");
    if (!container) return;
    container.innerHTML = "";

    var t = I18N[currentLang] || I18N.en;
    (t.suggestions || []).forEach(function (s) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "sohrai-chip";
      chip.textContent = s.label;
      chip.addEventListener("click", function () {
        sendChatMessage(s.query);
      });
      container.appendChild(chip);
    });
  }

  function appendMessage(role, text, isHtml) {
    var log = document.getElementById("sohrai-chat-log");
    if (!log) return null;

    var msg = document.createElement("div");
    msg.className = "sohrai-msg " + (role === "user" ? "user" : "bot");
    if (isHtml) {
      msg.innerHTML = text;
    } else {
      msg.textContent = text;
    }
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
    return msg;
  }

  function restoreChatHistory() {
    var log = document.getElementById("sohrai-chat-log");
    if (!log) return;
    log.innerHTML = "";

    loadChatHistory();

    if (history.length > 0) {
      history.forEach(function (item) {
        if (item.role === "user") {
          appendMessage("user", item.content, false);
        } else {
          appendMessage("bot", renderMarkdown(item.content), true);
        }
      });
    } else {
      var t = I18N[currentLang] || I18N.en;
      appendMessage("bot", t.greeting, false);
    }
    log.scrollTop = log.scrollHeight;
  }

  function clearChat() {
    history = [];
    var key = getBotUserStorageKey();
    if (key) {
      try { localStorage.removeItem(key); } catch (e) {}
    }
    try { localStorage.removeItem(STORAGE_KEY_HISTORY); } catch (e) {}
    restoreChatHistory();
  }

  function saveHistory() {
    var key = getBotUserStorageKey();
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(history));
      } catch (e) {}
    }
  }

  // React to user login / logout changes
  document.addEventListener("footprintjh-auth-change", function () {
    loadChatHistory();
    restoreChatHistory();
  });

  async function checkServerHealth(showAlertOnFailure) {
    var alertBox = document.getElementById("sohrai-offline-alert");
    var statusDot = document.getElementById("sohrai-status-dot");
    try {
      var controller = new AbortController();
      var timeoutId = setTimeout(function () { controller.abort(); }, 2500);
      var testRes = await fetch(BACKEND_URL + "/api/auth/stats", {
        method: "GET",
        signal: controller.signal
      }).catch(function () { return null; });
      clearTimeout(timeoutId);

      if (testRes && (testRes.ok || testRes.status < 500)) {
        isServerAlive = true;
        if (alertBox) alertBox.style.display = "none";
        if (statusDot) {
          statusDot.style.background = "#10B981";
          statusDot.title = "Sohrai AI Server Online";
        }
        return true;
      }
    } catch (e) {}

    isServerAlive = false;
    if (statusDot) {
      statusDot.style.background = "#F59E0B";
      statusDot.title = "Sohrai AI Server Offline (Run npm start on port 3000)";
    }
    if (showAlertOnFailure && alertBox) {
      alertBox.style.display = "flex";
    }
    return false;
  }

  async function sendChatMessage(text) {
    if (!text || !text.trim()) return;
    var cleanText = text.trim();

    appendMessage("user", cleanText, false);

    var sendBtn = document.getElementById("sohrai-send-btn");
    if (sendBtn) sendBtn.disabled = true;

    var t = I18N[currentLang] || I18N.en;
    var thinkingEl = appendMessage("bot", "🌿 " + t.connecting, false);
    if (thinkingEl) thinkingEl.classList.add("thinking");

    var botReply = "";
    var receivedChunk = false;

    try {
      var res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanText,
          history: history,
          lang: currentLang
        })
      });

      if (!res.ok || !res.body) {
        var errData = await res.json().catch(function () { return {}; });
        var errMsg = errData.error || ("Server response error (" + res.status + ")");
        if (thinkingEl) {
          thinkingEl.classList.remove("thinking");
          thinkingEl.innerHTML = "⚠️ " + escapeHtml(errMsg);
        }
        checkServerHealth(true);
        return;
      }

      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buffer = "";

      while (true) {
        var chunk = await reader.read();
        if (chunk.done) break;

        buffer += decoder.decode(chunk.value, { stream: true });
        var lines = buffer.split("\n\n");
        buffer = lines.pop();

        for (var i = 0; i < lines.length; i++) {
          var raw = lines[i].trim();
          if (!raw.startsWith("data:")) continue;
          var jsonStr = raw.slice(5).trim();
          if (!jsonStr) continue;

          try {
            var data = JSON.parse(jsonStr);
            if (data.error) {
              if (thinkingEl) {
                thinkingEl.classList.remove("thinking");
                thinkingEl.innerHTML = "⚠️ " + escapeHtml(data.error);
              }
              continue;
            }

            if (data.delta) {
              if (!receivedChunk && thinkingEl) {
                thinkingEl.classList.remove("thinking");
                receivedChunk = true;
              }
              botReply += data.delta;
              if (thinkingEl) {
                thinkingEl.innerHTML = renderMarkdown(botReply);
              }
              var log = document.getElementById("sohrai-chat-log");
              if (log) log.scrollTop = log.scrollHeight;
            }

            if (data.done) {
              botReply = data.reply || botReply;
              if (thinkingEl) {
                thinkingEl.classList.remove("thinking");
                thinkingEl.innerHTML = renderMarkdown(botReply);
              }
              history.push({ role: "user", content: cleanText });
              history.push({ role: "assistant", content: botReply });
              saveHistory();
            }
          } catch (err) {}
        }
      }

      if (botReply && !history.some(function (h) { return h.content === botReply; })) {
        history.push({ role: "user", content: cleanText });
        history.push({ role: "assistant", content: botReply });
        saveHistory();
      }
    } catch (netErr) {
      console.warn("Sohrai chat request failed:", netErr);
      if (thinkingEl) {
        thinkingEl.classList.remove("thinking");
        thinkingEl.innerHTML = `
          <div style="color:#92400E;background:#FEF3C7;padding:8px 10px;border-radius:8px;font-size:12px;line-height:1.4;">
            <strong>⚠️ Cannot reach AI Bot server</strong><br/>
            Make sure the server is running on <code>http://localhost:3000</code>.<br/>
            Run <code>npm start</code> in the <code>Bots</code> folder, or click <strong>Retry</strong> below.
          </div>
        `;
      }
      checkServerHealth(true);
    } finally {
      if (sendBtn) sendBtn.disabled = false;
      var input = document.getElementById("sohrai-chat-input");
      if (input) input.focus();
    }
  }

  // Initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidgetDOM);
  } else {
    createWidgetDOM();
  }

  // Global window API
  window.SohraiWidget = {
    open: function () { toggleWidget(true); },
    close: function () { toggleWidget(false); },
    toggle: function () { toggleWidget(); },
    sendMessage: function (text) { sendChatMessage(text); },
    clearHistory: clearChat,
    checkHealth: checkServerHealth
  };
})();
