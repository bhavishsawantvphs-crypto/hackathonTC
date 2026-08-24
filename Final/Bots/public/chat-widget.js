// chat-widget.js
// Client-side chat logic with persistent conversation history via localStorage.
// History is retained across page reloads, browser restarts, and website navigation.

(function () {
  const STORAGE_KEY_HISTORY = "sohrai_chat_history_v1";
  const STORAGE_KEY_LANG = "sohrai_chat_lang_v1";

  const log = document.getElementById("chat-log");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const langSelect = document.getElementById("lang-select");
  const suggestionBtns = document.querySelectorAll("#suggestions button");
  const clearBtn = document.getElementById("new-chat-btn") || document.getElementById("clear-btn");

  // Conversation history sent to backend for AI contextual memory
  let history = [];
  let currentLang = "en";

  // ---- Storage Helpers --------------------------------------------------
  function loadSavedHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("Failed to load chat history from localStorage:", e);
      return [];
    }
  }

  function saveHistory(hist) {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(hist));
    } catch (e) {
      console.warn("Failed to save chat history to localStorage:", e);
    }
  }

  function clearHistory() {
    history = [];
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {}
    if (log) {
      log.innerHTML = "";
      const t = (typeof I18N !== "undefined" && I18N[currentLang]) ? I18N[currentLang] : (window.I18N?.en || {});
      addMessage("bot", t.greeting || "Namaskar! I am Sohrai, your Jharkhand Tourism AI guide.");
    }
  }

  // ---- Minimal Markdown renderer ---------------------------------------
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
    const lines = text.split("\n");
    let html = "";
    const openIndents = [];

    const closeListsDeeperThan = (level) => {
      while (openIndents.length > 0 && openIndents[openIndents.length - 1] >= level) {
        html += "</ul>";
        openIndents.pop();
      }
    };

    lines.forEach((rawLine) => {
      const bulletMatch = rawLine.match(/^(\s*)[*-]\s+(.*)$/);

      if (bulletMatch) {
        const indent = Math.floor(bulletMatch[1].length / 2);
        const content = inlineFormat(bulletMatch[2]);

        if (openIndents.length === 0 || indent > openIndents[openIndents.length - 1]) {
          html += "<ul>";
          openIndents.push(indent);
        } else if (indent < openIndents[openIndents.length - 1]) {
          closeListsDeeperThan(indent + 1);
        }
        html += `<li>${content}</li>`;
      } else {
        closeListsDeeperThan(0);
        const trimmed = rawLine.trim();
        if (trimmed !== "") {
          html += `<p>${inlineFormat(rawLine)}</p>`;
        }
      }
    });

    closeListsDeeperThan(0);
    return html;
  }

  // ---- Message Rendering ------------------------------------------------
  function addMessage(role, text, { asHtml = false, skipScroll = false } = {}) {
    if (!log) return null;
    const el = document.createElement("div");
    el.className = "msg " + (role === "user" ? "user" : "bot");

    if (asHtml) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }

    log.appendChild(el);

    if (!skipScroll) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          log.scrollTop = log.scrollHeight;
        });
      });
    }

    return el;
  }

  // ---- Multi-Language Support -------------------------------------------
  function applyLanguage(lang, { announce = false } = {}) {
    const t = (typeof I18N !== "undefined" && I18N[lang]) ? I18N[lang] : (window.I18N?.en || {});
    currentLang = lang;

    const eyebrowEl = document.getElementById("eyebrow");
    const titleEl = document.getElementById("title");
    const subtitleEl = document.getElementById("subtitle");
    const langLabelEl = document.getElementById("lang-label");
    const footerEl = document.getElementById("footer-text");

    if (eyebrowEl && t.eyebrow) eyebrowEl.textContent = t.eyebrow;
    if (titleEl && t.title) titleEl.textContent = t.title;
    if (subtitleEl && t.subtitle) subtitleEl.textContent = t.subtitle;
    if (langLabelEl && t.languageLabel) langLabelEl.textContent = "🌐 " + t.languageLabel;
    if (footerEl && t.footer) footerEl.textContent = t.footer;
    if (sendBtn && t.send) sendBtn.textContent = t.send;
    if (input && t.placeholder) input.placeholder = t.placeholder;

    if (t.suggestions && suggestionBtns.length > 0) {
      t.suggestions.forEach((s, i) => {
        if (suggestionBtns[i]) {
          suggestionBtns[i].textContent = s.label;
          suggestionBtns[i].dataset.q = s.query;
        }
      });
    }

    if (announce) {
      addMessage("bot", t.switchNote || `Language switched to ${lang}.`);
    }
  }

  // ---- Initialize UI & Restore History -----------------------------------
  function init() {
    // 1. Restore Language
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang && (savedLang === "en" || savedLang === "hi" || savedLang === "mr")) {
        currentLang = savedLang;
      }
    } catch (e) {}

    if (langSelect) {
      langSelect.value = currentLang;
      langSelect.addEventListener("change", (e) => {
        const newLang = e.target.value;
        try {
          localStorage.setItem(STORAGE_KEY_LANG, newLang);
        } catch (err) {}
        applyLanguage(newLang, { announce: true });
      });
    }

    applyLanguage(currentLang);

    // 2. Restore Conversation History from localStorage
    history = loadSavedHistory();

    if (log) {
      log.innerHTML = "";
      if (history.length > 0) {
        // Render saved conversation
        history.forEach((msg) => {
          if (msg.role === "user") {
            addMessage("user", msg.content, { skipScroll: true });
          } else if (msg.role === "assistant") {
            addMessage("bot", renderMarkdown(msg.content), { asHtml: true, skipScroll: true });
          }
        });
        // Scroll to the bottom of the restored chat
        requestAnimationFrame(() => {
          log.scrollTop = log.scrollHeight;
        });
      } else {
        // No saved conversation -> Show welcoming greeting
        const t = (typeof I18N !== "undefined" && I18N[currentLang]) ? I18N[currentLang] : (window.I18N?.en || {});
        addMessage("bot", t.greeting || "Namaskar! I am Sohrai, your Jharkhand Tourism AI guide.");
      }
    }

    // 3. Setup New Chat / Clear Button
    if (clearBtn) {
      clearBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Start a new chat? This will clear your current conversation history.")) {
          clearHistory();
        }
      });
    }
  }

  // ---- Send Message Handler ---------------------------------------------
  async function sendMessage(text) {
    if (!text || !text.trim()) return;
    const cleanText = text.trim();

    addMessage("user", cleanText);
    if (input) input.value = "";
    if (sendBtn) sendBtn.disabled = true;

    // Start with thinking indicator
    const botEl = addMessage("bot", "…");
    if (botEl) botEl.classList.add("thinking");

    let botText = "";
    let receivedFirstChunk = false;
    let turnCompleted = false;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: cleanText,
          history: history,
          lang: currentLang,
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        if (botEl) {
          botEl.classList.remove("thinking");
          botEl.textContent = "Error: " + (data.error || "something went wrong.");
        }
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop();

        for (const rawEvent of events) {
          const line = rawEvent.trim();
          if (!line.startsWith("data:")) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;

          let payload;
          try {
            payload = JSON.parse(jsonStr);
          } catch {
            continue;
          }

          if (payload.error) {
            if (botEl) {
              botEl.classList.remove("thinking");
              botEl.textContent = "Error: " + payload.error;
            }
            continue;
          }

          if (payload.delta) {
            if (!receivedFirstChunk && botEl) {
              botEl.classList.remove("thinking");
              receivedFirstChunk = true;
            }
            botText += payload.delta;
            if (botEl) {
              botEl.innerHTML = renderMarkdown(botText);
            }
            if (log) log.scrollTop = log.scrollHeight;
          }

          if (payload.done) {
            turnCompleted = true;
            botText = payload.reply ?? botText;
            if (botEl) {
              botEl.innerHTML = renderMarkdown(botText);
            }
            // Append to history and persist immediately to localStorage
            history.push({ role: "user", content: cleanText });
            history.push({ role: "assistant", content: botText });
            saveHistory(history);
          }
        }
      }

      // If stream ended without explicit done event but we received text
      if (!turnCompleted && botText) {
        if (botEl) {
          botEl.classList.remove("thinking");
          botEl.innerHTML = renderMarkdown(botText);
        }
        history.push({ role: "user", content: cleanText });
        history.push({ role: "assistant", content: botText });
        saveHistory(history);
      }
    } catch (err) {
      console.error("Chat request failed:", err);
      if (botEl) {
        botEl.classList.remove("thinking");
        botEl.textContent = "Network error — is the server running on http://localhost:3000?";
      }
    } finally {
      if (sendBtn) sendBtn.disabled = false;
      if (input) input.focus();
    }
  }

  // ---- Form Submission & Suggestions ------------------------------------
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (input) sendMessage(input.value);
    });
  }

  if (suggestionBtns && suggestionBtns.length > 0) {
    suggestionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.q) sendMessage(btn.dataset.q);
      });
    });
  }

  // Run initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose helper on window for programmatic interactions if needed
  window.SohraiChat = {
    sendMessage: sendMessage,
    clearHistory: clearHistory,
    getHistory: () => [...history],
  };
})();
