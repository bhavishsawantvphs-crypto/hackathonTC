// i18n.js
// Translation dictionaries for the static UI text.
// To add a language: copy one block, translate the values, add an <option>
// to the <select id="lang-select"> in index.html, and add the language name
// to LANGUAGE_NAMES in server.js (so the AI knows what to reply in).

const I18N = {
  en: {
    eyebrow: "Hackathon demo",
    title: "Ask Sohrai about Jharkhand",
    subtitle:
      "A small AI guide that only answers from a fixed set of Jharkhand tourism facts — waterfalls, hills, wildlife, and festivals.",
    greeting:
      "Namaskar! I'm Sohrai, a demo guide for Jharkhand Tourism. Ask me about waterfalls, hill stations, wildlife, or festivals.",
    placeholder: "Ask about waterfalls, hills, wildlife…",
    send: "Send",
    footer: "Frontend + backend demo · answers are grounded in data/jharkhand-info.md",
    languageLabel: "Language",
    switchNote: "Language set to English. New replies will be in English.",
    suggestions: [
      { label: "Best waterfall?", query: "What's the best waterfall to visit and when?" },
      { label: "Hill stations", query: "Where should I go for a cool hill station trip?" },
      { label: "Tribal culture", query: "Tell me about tribal culture and festivals in Jharkhand" },
    ],
  },

  hi: {
    eyebrow: "हैकाथॉन डेमो",
    title: "झारखंड के बारे में सोहराई से पूछें",
    subtitle:
      "एक छोटा AI गाइड जो केवल झारखंड पर्यटन से जुड़े तय तथ्यों — झरने, पहाड़ी क्षेत्र, वन्यजीव और त्योहारों — के आधार पर जवाब देता है।",
    greeting:
      "नमस्कार! मैं सोहराई हूं, झारखंड पर्यटन का एक डेमो गाइड। मुझसे झरनों, पहाड़ी स्थलों, वन्यजीवों या त्योहारों के बारे में पूछें।",
    placeholder: "झरनों, पहाड़ों, वन्यजीवों के बारे में पूछें…",
    send: "भेजें",
    footer: "फ्रंटएंड + बैकएंड डेमो · जवाब data/jharkhand-info.md पर आधारित हैं",
    languageLabel: "भाषा",
    switchNote: "भाषा हिंदी पर सेट की गई। नए जवाब हिंदी में होंगे।",
    suggestions: [
      { label: "सबसे अच्छा झरना?", query: "घूमने के लिए सबसे अच्छा झरना कौन सा है और कब जाना चाहिए?" },
      { label: "पहाड़ी क्षेत्र", query: "ठंडी पहाड़ी यात्रा के लिए मुझे कहां जाना चाहिए?" },
      { label: "आदिवासी संस्कृति", query: "झारखंड की आदिवासी संस्कृति और त्योहारों के बारे में बताएं" },
    ],
  },

  mr: {
    eyebrow: "हॅकाथॉन डेमो",
    title: "झारखंडबद्दल सोहराईला विचारा",
    subtitle:
      "एक छोटा AI मार्गदर्शक जो फक्त झारखंड पर्यटनाच्या ठराविक माहितीवर आधारित उत्तर देतो — धबधबे, डोंगराळ भाग, वन्यजीव आणि सण.",
    greeting:
      "नमस्कार! मी सोहराई आहे, झारखंड पर्यटनाचा डेमो मार्गदर्शक. मला धबधबे, थंड हवेची ठिकाणे, वन्यजीव किंवा सणांबद्दल विचारा.",
    placeholder: "धबधबे, डोंगर, वन्यजीव याबद्दल विचारा…",
    send: "पाठवा",
    footer: "फ्रंटएंड + बॅकएंड डेमो · उत्तरे data/jharkhand-info.md वर आधारित आहेत",
    languageLabel: "भाषा",
    switchNote: "भाषा मराठी वर सेट केली. नवीन उत्तरे मराठीत असतील.",
    suggestions: [
      { label: "सर्वोत्तम धबधबा?", query: "भेट देण्यासाठी सर्वोत्तम धबधबा कोणता आणि कधी जावे?" },
      { label: "थंड हवेची ठिकाणे", query: "थंड हवेच्या ठिकाणी सहलीसाठी मी कुठे जावे?" },
      { label: "आदिवासी संस्कृती", query: "झारखंडमधील आदिवासी संस्कृती आणि सणांबद्दल सांगा" },
    ],
  },
};
