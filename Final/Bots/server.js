// server.js
// A minimal backend that powers the chat widget.
// It receives a user message, adds the Jharkhand Tourism facts as "context",
// and asks the Gemini model to answer using ONLY that context.
//
// This context-stuffing approach ("put the facts straight in the prompt")
// is the fastest way to build a knowledge-grounded AI for a hackathon.
// For a bigger knowledge base later, look up "RAG" (Retrieval Augmented Generation).

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  createUser,
  findUserByEmail,
  verifyUserPassword,
  createSession,
  getSessionUser,
  deleteSession,
  getUserCount,
  purgeExpiredSessions,
} from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from server directory first, and fallback to cwd
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config();

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for any external frontend clients / team websites
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-session-token"],
  })
);
app.use(express.json());

// Default root route serves the main HOME page (home.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "home.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "home.html"));
});

app.get(["/auth", "/auth.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "auth.html"));
});

app.get("/Database/auth.html", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Database", "auth.html"));
});

app.get("/explore", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.get(["/scheduler", "/scheduler.html", "/trip-plan"], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "scheduler.html"));
});

app.get(["/festivals", "/jhar.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "jhar.html"));
});

app.get(["/mining", "/mining.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "mining.html"));
});

app.get(["/waterfalls", "/waterfalls.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "hidden-waterfalls-jharkhand", "dist", "index.html"));
});

app.get(["/profile", "/profile.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "profile.html"));
});

app.get(["/feedback", "/feedback.html", "/reviews"], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "feedback.html"));
});

// Feedback API: GET list of community reviews
app.get("/api/feedback", (req, res) => {
  try {
    const feedbackFilePath = path.join(__dirname, "..", "Database", "feedbacks.json");
    if (fs.existsSync(feedbackFilePath)) {
      const raw = fs.readFileSync(feedbackFilePath, "utf-8");
      const list = JSON.parse(raw);
      return res.json({ success: true, count: list.length, feedbacks: list });
    }
    return res.json({ success: true, count: 0, feedbacks: [] });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// Feedback API: POST new review
app.post("/api/feedback", (req, res) => {
  try {
    const { name, email, rating, category, description, userId } = req.body;
    if (!name || !rating || !description) {
      return res.status(400).json({ success: false, message: "Name, rating, and description are required." });
    }

    const feedbackFilePath = path.join(__dirname, "..", "Database", "feedbacks.json");
    let list = [];
    if (fs.existsSync(feedbackFilePath)) {
      try {
        list = JSON.parse(fs.readFileSync(feedbackFilePath, "utf-8"));
      } catch (err) {
        list = [];
      }
    }

    const newFeedback = {
      id: "fb_" + Date.now(),
      name: String(name).trim(),
      email: email ? String(email).trim() : null,
      rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
      category: category ? String(category).trim() : "General Experience",
      description: String(description).trim(),
      date: new Date().toISOString(),
      userId: userId || null,
      isVerified: true,
      likes: 1
    };

    // Prepend to top of list
    list.unshift(newFeedback);
    fs.writeFileSync(feedbackFilePath, JSON.stringify(list, null, 2), "utf-8");

    return res.json({ success: true, message: "Thank you for your valuable feedback!", feedback: newFeedback });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

// Dedicated route for standalone bot demo
app.get("/bot", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve root website files (index.html, home.html, jhar.html, mining.html, scheduler.html, assets, src, etc.)
app.use(express.static(path.join(__dirname, "..")));

// Serve bot standalone UI & assets (widget.js, embed.html, chat-widget.js, i18n.js)
app.use(express.static(path.join(__dirname, "public")));

// Load the knowledge base once at startup.
const tourismInfo = fs.readFileSync(
  path.join(__dirname, "data", "jharkhand-info.md"),
  "utf-8"
);

// Language codes must match the <option value="..."> list in index.html
// and the keys in public/i18n.js.
const LANGUAGE_NAMES = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
};

// ---------------------------------------------------------------------------
// Per-IP rate limiting
// ---------------------------------------------------------------------------
// The Gemini free-tier quota (RPM/RPD) is shared by EVERY visitor to the site,
// since the server uses one API key for all of them. Without this, a single
// heavy user (or bot) can burn through the whole day's quota and lock out
// everyone else. This is a simple in-memory sliding window - fine for a
// single server instance. If you ever run multiple instances behind a load
// balancer, swap this for a shared store (e.g. Redis) so the count is
// consistent across instances.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 20; // messages per IP per window

const requestLog = new Map(); // ip -> array of request timestamps

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

// Housekeeping: forget IPs that have been quiet, so this Map doesn't grow
// forever on a long-running server.
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of requestLog.entries()) {
    const fresh = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (fresh.length === 0) requestLog.delete(ip);
    else requestLog.set(ip, fresh);
  }
}, RATE_LIMIT_WINDOW_MS).unref?.();

// ---------------------------------------------------------------------------
// Model fallback chain
// ---------------------------------------------------------------------------
// Try the higher-quality model first. If ITS daily/per-minute quota is used
// up (429), silently fall back to the Lite model, which has a much bigger
// free-tier quota (~25x the daily requests). Most users never notice the
// fallback happened - they just keep getting answers instead of an error.
const MODEL_CHAIN = [
  { name: "gemini-2.5-flash", maxOutputTokens: 500 },
  { name: "gemini-2.0-flash", maxOutputTokens: 500 },
  { name: "gemini-1.5-flash", maxOutputTokens: 500 },
  { name: "gemini-2.5-flash-lite", maxOutputTokens: 500 },
];

function getKnowledgeBaseResponse(query, lang) {
  const q = (query || "").toLowerCase();
  
  if (q.includes("waterfall") || q.includes("falls") || q.includes("झरने") || q.includes("धबधब") || q.includes("sita") || q.includes("mirchaiya") || q.includes("hundru") || q.includes("dassam") || q.includes("jonha") || q.includes("hirni") || q.includes("lodh")) {
    if (lang === "hi") {
      return `झारखंड के प्रमुख और शांत झरने:
• **सीता फॉल्स (राँची):** कांची नदी पर बना बहुस्तरीय शांत जलप्रपात। राँची से 40 किमी, अक्टूबर-फरवरी में घूमने के लिए बेहतरीन।
• **मिरचैया फॉल्स (लातेहार):** गारू के पास बेतला नेशनल पार्क बफर ज़ोन में स्थित शांत व पारिवारिक स्थल (इको-स्कोर: 91/100)।
• **हुंडरू फॉल्स (राँची):** सुवर्णरेखा नदी पर 98 मीटर ऊंचा झारखंड का सबसे प्रसिद्ध और विशाल जलप्रपात।
• **दशम फॉल्स (राँची):** कांची नदी की 10 धाराओं में गिरने वाला मनमोहक झरना।
• **लोध/बूढ़ा घाघ फॉल्स (लातेहार):** 143 मीटर ऊंचाई के साथ झारखंड का सबसे ऊंचा जलप्रपात।
*(वर्तमान मौसम और जलस्तर की जांच अवश्य करें)*`;
    } else if (lang === "mr") {
      return `झारखंडमधील प्रमुख आणि निसर्गरम्य धबधबे:
• **सीता फॉल्स (रांची):** शांत आणि सुंदर बहुस्तरीय धबधबा. ऑक्टोबर ते फेब्रुवारी भेट देण्यासाठी उत्तम काळ.
• **मिरचैया फॉल्स (लातेहार):** बेतला राष्ट्रीय उद्यानाजवळचा कौटुंबिक व सुरक्षित धबधबा (इको-स्कोर: 91/100).
• **हुंडरू फॉल्स (रांची):** सुवर्णरेखा नदीवरील 98 मीटर उंचीचा सर्वात प्रसिद्ध धबधबा.
• **दशम फॉल्स (रांची):** 10 प्रवाहांमध्ये कोसळणारा नयनरम्य धबधबा.
• **लोध फॉल्स (लातेहार):** 143 मीटर उंचीचा झारखंडमधील सर्वोच्च धबधबा.
*(निसर्गाचा आनंद घेताना पावसाळ्यात स्थानिक हवामानाची नोंद घ्या)*`;
    } else {
      return `Top & Lesser-Known Waterfalls in Jharkhand:
• **Sita Falls (Ranchi):** Multi-tier secluded forest terraces on the Kanchi River near Jonha (~40 km from Ranchi). Best: Oct–Feb.
• **Mirchaiya Falls (Latehar):** Twin clear-water streams near Betla National Park corridor; very family-friendly (Eco-Score: 91/100).
• **Hundru Falls (Ranchi):** 98-meter spectacular plunge on the Subarnarekha River; iconic landmark.
• **Dassam Falls (Ranchi):** Kanchi River dividing into 10 picturesque cascades.
• **Lodh / Burha Ghagh Falls (Latehar):** Highest waterfall in Jharkhand at 143 meters in Latehar highland forests.
*(Always verify local rain and water flow conditions before visiting)*`;
    }
  }

  if (q.includes("hill") || q.includes("netarhat") || q.includes("station") || q.includes("पहाड़") || q.includes("नेतरहाट") || q.includes("टेकड") || q.includes("sunset") || q.includes("sunrise") || q.includes("parasnath") || q.includes("tagore")) {
    if (lang === "hi") {
      return `झारखंड के प्रमुख पर्वतीय और शांत स्थल:
• **नेतरहाट (लातेहार):** 'छोटानागपुर की रानी' के नाम से प्रसिद्ध, शानदार सूर्योदय (सनराइज पॉइंट) और सूर्यास्त (मैगनोलिया पॉइंट) के लिए विख्यात।
• **पारसनाथ पहाड़ी (गिरिडीह):** 1,365 मीटर ऊंचाई पर झारखंड की सर्वोच्च चोटी, प्रमुख जैन तीर्थ शिखरजी।
• **टैगोर हिल (राँची):** 300 फीट ऊंची पहाड़ी जहां रवींद्रनाथ टैगोर के बड़े भाई ज्योतिरिंद्रनाथ टैगोर ने साधना की थी।
• **कैनरी हिल (हजारीबाग):** घने जंगलों और 3 झीलों के नयनाभिराम दृश्य वाला वॉचटावर व्यू पॉइंट।`;
    } else if (lang === "mr") {
      return `झारखंडमधील प्रमुख थंड हवेची ठिकाणे आणि टेकड्या:
• **नेतरहाट (लातेहार):** 'छोटानागपूरची राणी', विहंगम सूर्योदय आणि सूर्यास्त (मॅग्नोलिया पॉइंट) साठी प्रसिद्ध.
• **पारसनाथ टेकडी (गिरीडीह):** 1,365 मीटर उंचीवर झारखंडचे सर्वोच्च शिखर, शिखरजी तीर्थक्षेत्र.
• **टॅगोर हिल (रांची):** निसर्गरम्य टेकडी आणि शांत सांस्कृतिक वारसा स्थळ.
• **कॅनरी हिल (हजारीबाग):** हिरवेगार जंगल आणि तलावांचे नयनरम्य दृश्य देणारा निसर्ग परिसर.`;
    } else {
      return `Top Scenic Hills & Highland Escapes in Jharkhand:
• **Netarhat (Latehar):** Known as the 'Queen of Chotanagpur' (~1,128m), famed for Magnolia Sunset Point and pine forests.
• **Parasnath Hill / Shikharji (Giridih):** Highest peak in Jharkhand at 1,365m; supreme Jain pilgrimage site.
• **Tagore Hill (Ranchi):** 300-foot hilltop pavilion tied to the literary heritage of Jyotirindranath Tagore.
• **Canary Hill (Hazaribagh):** Dense sal forest ridge with three lake vistas and a historic watchtower.`;
    }
  }

  if (q.includes("festival") || q.includes("culture") || q.includes("tribal") || q.includes("sohrai") || q.includes("त्योहार") || q.includes("पर्व") || q.includes("कला") || q.includes("सण") || q.includes("संस्कृती") || q.includes("karma") || q.includes("sarhul") || q.includes("manda")) {
    if (lang === "hi") {
      return `झारखंड की समृद्ध आदिवासी संस्कृति और प्रमुख त्योहार:
• **सोहराई कला:** पशुधन और प्रकृति सम्मान में दीवारों पर मिट्टी व प्राकृतिक रंगों से की जाने वाली जीआई-टैग प्राप्त पारंपरिक भित्ति चित्रकला।
• **सरहुल (मार्च-अप्रैल):** साल वृक्ष के फूलों की पूजा के साथ प्रकृति का नववर्ष उत्सव।
• **करमा पूजा (सितंबर):** कर्म वृक्ष की डाली की पूजा, भाई-बहन के प्रेम और प्रकृति आराधना का लोकपर्व।
• **मांडा परब (अप्रैल):** हजारीबाग क्षेत्र का प्रसिद्ध जनजातीय वसंत उत्सव।
• **श्रावणी मेला (देवघर):** बैद्यनाथ ज्योतिर्लिंग धाम का विश्वप्रसिद्ध एक माह का पवित्र श्रावण मेला।`;
    } else if (lang === "mr") {
      return `झारखंडची आदिवासी संस्कृती आणि प्रमुख सण:
• **सोहराई कला:** घरांच्या भिंतींवर नैसर्गिक रंगांनी काढली जाणारी प्रसिद्ध पारंपरिक जीआय-टॅग भित्तिचित्र कला.
• **सरहुल (मार्च-एप्रिल):** सालाच्या फुलांची पूजा करून साजरा केला जाणारा निसर्गाचा नववर्ष सण.
• **करमा पूजा (सप्टेंबर):** करम वृक्षाची पूजा आणि बंधुप्रेमाचा पारंपारिक सण.
• **श्रावणी मेळा (देवघर):** भगवान वैद्यनाथ ज्योतिर्लिंगाची भव्य यात्रा.`;
    } else {
      return `Tribal Heritage & Festivals of Jharkhand:
• **Sohrai & Khovar Art:** GI-tagged indigenous mural art painted with natural pigments celebrating harvest and cattle.
• **Sarhul (Spring):** Welcoming the new year with worship of the blossoming Sacred Sal tree (*Shorea robusta*).
• **Karma Festival (Sept):** Harvest & nature celebration centered around planting and venerating the sacred Karma branch.
• **Shravani Mela (Deoghar):** Historic month-long pilgrimage at Baidyanath Jyotirlinga temple.
• **Manda Parab (Hazaribagh):** Vibrant spring tribal observance celebrating agrarian vitality.`;
    }
  }

  if (q.includes("itinerary") || q.includes("plan") || q.includes("3-day") || q.includes("tour") || q.includes("सहल") || q.includes("यात्रा") || q.includes("योजना")) {
    if (lang === "hi") {
      return `झारखंड 3 दिवसीय इको-टूरिज्म यात्रा योजना:
• **दिन 1 (राँची जलप्रपात सर्किट):** सीता फॉल्स, हुंडरू फॉल्स, पतरातू घाटी सूर्यास्त और धुस्का-चना घुघनी का स्वाद।
• **दिन 2 (नेतरहाट पठार):** राँची से नेतरहाट यात्रा, चीड़ के जंगल, अपर/लोअर घाघरी और मैगनोलिया सनसेट पॉइंट।
• **दिन 3 (बेतला व गारू वन्यजीव):** बेतला नेशनल पार्क जंगल सफारी, मिरचैया फॉल्स (गारू) और पलामू किला भ्रमण।`;
    } else if (lang === "mr") {
      return `झारखंड 3 दिवसांची सहल योजना:
• **दिवस 1 (रांची धबधबे):** सीता फॉल्स, हुंडरू धबधबा, पत्रातू व्हॅली आणि स्थानिक खाद्यसंस्कृती.
• **दिवस 2 (नेतरहाट हिल स्टेशन):** नेतरहाट प्रवास, पाइनचे जंगल, घाघरी धबधबा आणि मॅग्नोलिया पॉईंट सूर्यास्त.
• **दिवस 3 (बेतला राष्ट्रीय उद्यान):** बेतला जंगल सफारी, मिरचैया धबधबा आणि ऐतिहासिक पलामू किल्ला.`;
    } else {
      return `Recommended 3-Day Jharkhand Eco-Itinerary:
• **Day 1 (Ranchi Falls Circuit):** Explore Sita Falls and Hundru Falls, followed by Patratu Valley sunset views and local Dhuska delicacies.
• **Day 2 (Netarhat Highlands):** Drive to Netarhat, visit Pine Forest, Ghaghri waterfalls, and witness sunset at Magnolia Point.
• **Day 3 (Wildlife & Heritage):** Betla National Park morning safari, Mirchaiya Falls in Garu eco-corridor, and Palamau Forts.`;
    }
  }

  if (q.includes("temple") || q.includes("maluti") || q.includes("deoghar") || q.includes("paras") || q.includes("मंदिर") || q.includes("देवघर") || q.includes("मलूटी")) {
    if (lang === "hi") {
      return `झारखंड के प्रमुख ऐतिहासिक एवं धार्मिक धरोहर स्थल:
• **मलूटी मंदिर गाँव (दुमका):** 17वीं-19वीं शताब्दी के 72 अद्वितीय टेराकोटा (पकी मिट्टी) मंदिरों का ऐतिहासिक गाँव (गुप्तकाशी)।
• **बाबा बैद्यनाथ धाम (देवघर):** 12 पावन ज्योतिर्लिंगों में से एक अत्यंत पूज्य तीर्थस्थल।
• **शिखरजी पारसनाथ (गिरिडीह):** 20 जैन तीर्थंकरों की निर्वाण भूमि, सर्वोच्च जैन पावन तीर्थ।
• **बासुकीनाथ धाम (दुमका):** देवघर यात्रा से जुड़ा प्रसिद्ध नागेश शिव मंदिर।
• **भद्रकाली मंदिर (इटखोरी, चतरा):** हिंदू, बौद्ध और जैन तीनों धर्मों का प्राचीन संगम स्थल।`;
    } else if (lang === "mr") {
      return `झारखंडमधील ऐतिहासिक मंदिरे व तीर्थक्षेत्रे:
• **मलूटी टेराकोटा मंदिरे (दुमका):** 17व्या-19व्या शतकातील 72 पुरातन मातीची नक्षीदार मंदिरे (गुप्तकाशी).
• **बाबा वैद्यनाथ धाम (देवघर):** 12 ज्योतिर्लिंगांपैकी एक मुख्य तीर्थक्षेत्र.
• **शिखरजी पारसनाथ (गिरीडीह):** जैन धर्माचे अत्यंत पवित्र तीर्थक्षेत्र.
• **भद्रकाली इटखोरी (चत्रा):** हिंदू, बौद्ध आणि जैन धर्मसंगम स्थळ.`;
    } else {
      return `Sacred Heritage & Historic Temples in Jharkhand:
• **Maluti Terracotta Village (Dumka):** Historic cluster of 72 surviving 17th–19th century terracotta Shiva temples, known as Gupt Kashi.
• **Baidyanath Dham (Deoghar):** One of the sacred 12 Jyotirlingas, focal point of the annual Shravani Mela.
• **Shikharji Parasnath (Giridih):** Holy mountain where 20 of the 24 Jain Tirthankaras attained Moksha.
• **Bhadrakali Temple (Itkhori, Chatra):** Ancient tri-faith confluence of Hindu, Buddhist, and Jain heritage dating back to 9th century.`;
    }
  }

  if (q.includes("mining") || q.includes("geo") || q.includes("dhanbad") || q.includes("jharia") || q.includes("jaduguda") || q.includes("खदान") || q.includes("माइनिंग")) {
    if (lang === "hi") {
      return `झारखंड का खनन एवं भू-पर्यटन (Mining Tourism):
• **झरिया व धनबाद कोलफील्ड्स:** भारत की कोयला राजधानी, जहां शताब्दी पुराना भूमिगत खनन इतिहास और फायर जोन विज्ञान समझा जा सकता है।
• **जादूगुड़ा यूरेनियम माइंस (पूर्वी सिंहभूम):** भारत की पहली वाणिज्यिक यूरेनियम खदान और खनिज भूविज्ञान केंद्र।
• **नोआमुंडी आयरन ओर माइंस (पश्चिमी सिंहभूम):** एशिया की सबसे पुरानी और विशाल लौह अयस्क खुली खदानों में से एक।
• **मांद्रो जीवाश्म पार्क (साहिबगंज):** राजमहल पहाड़ियों में स्थित 10 करोड़ वर्ष पुराने जुरासिक पौधे जीवाश्म।`;
    } else {
      return `Jharkhand Mining & Geo-Heritage Sites:
• **Dhanbad & Jharia Coal Basin:** The coal capital of India with deep mining heritage and industrial rail roots.
• **Jaduguda Uranium Field (East Singhbhum):** India's first commercial uranium complex and atomic mineral belt.
• **Noamundi Iron Ore Mines (West Singhbhum):** One of Asia's oldest and largest open-cast iron mines.
• **Mandro Fossil Park (Sahibganj):** Protected Rajmahal Hills site preserving 100+ million year old Jurassic plant fossils.`;
    }
  }

  // Default general guide overview
  if (lang === "hi") {
    return `झारखंड पर्यटन में आपका स्वागत है:
• **जलप्रपात:** सीता फॉल्स, मिरचैया, हुंडरू, दशम, जोन्हा, लोध जलप्रपात।
• **पहाड़ और प्रकृति:** नेतरहाट, पारसनाथ पहाड़ी, बेतला नेशनल पार्क, दलमा वन्यजीव अभयारण्य।
• **धरोहर व संस्कृति:** सोहराई और खोवर चित्रकला, मलूटी टेराकोटा मंदिर, बैद्यनाथ धाम।
• **पारंपरिक स्वाद:** धुस्का-चना घुघनी, दाल पीठा, मडुआ रोटी, सत्तू पेय, अरसा और अनरसा।
*(आप किसी भी स्थान या यात्रा योजना के बारे में विस्तार से पूछ सकते हैं)*`;
  } else if (lang === "mr") {
    return `झारखंड पर्यटनामध्ये आपले स्वागत आहे:
• **धबधबे:** सीता फॉल्स, मिरचैया, हुंडरू, दशम, लोध धबधबे.
• **निसर्ग व टेकड्या:** नेतरहाट, पारसनाथ टेकडी, बेतला राष्ट्रीय उद्यान.
• **वारसा व संस्कृती:** सोहराई कला, मलूटी टेराकोटा मंदिरे, वैद्यनाथ धाम.
• **स्थानिक खाद्यसंस्कृती:** धुस्का, दाल पिठा, मडुआ भाकरी आणि पारंपरिक पदार्थ.
*(तुम्ही कोणत्याही पर्यटन स्थळाबद्दल अधिक विचारू शकता)*`;
  } else {
    return `Welcome to Jharkhand Tourism:
• **Waterfalls:** Sita Falls, Mirchaiya, Hundru, Dassam, Jonha, and Lodh Falls.
• **Hills & Nature:** Netarhat plateau, Parasnath peak, Betla National Park, Dalma Sanctuary.
• **Heritage & Art:** Sohrai mural paintings, Maluti terracotta temples, Baidyanath Jyotirlinga.
• **Local Flavors:** Dhuska with Ghugni, Dal Pitha, Madua roti, and seasonal tribal delicacies.
*(Feel free to ask about any destination, route, or itinerary)*`;
  }
}

// Google's API occasionally returns 503 ("service unavailable")
async function fetchGeminiWithRetry(url, body, maxRetries = 1) {
  let lastRes;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    lastRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (lastRes.ok || lastRes.status !== 503 || attempt === maxRetries) {
      return lastRes;
    }

    console.warn(`Gemini 503, retrying (attempt ${attempt + 1}/${maxRetries})...`);
    await new Promise((r) => setTimeout(r, 800));
  }
  return lastRes;
}

// Walks MODEL_CHAIN in order.
async function callGeminiWithFallback(systemPrompt, geminiContents) {
  let lastRes = null;

  for (const model of MODEL_CHAIN) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model.name}:streamGenerateContent?alt=sse&key=${process.env.GOOGLE_API_KEY}`;

    try {
      const res = await fetchGeminiWithRetry(url, {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: geminiContents,
        generationConfig: {
          maxOutputTokens: model.maxOutputTokens,
          thinkingConfig: { thinkingLevel: "minimal" },
        },
      });

      if (res.ok) {
        console.log(`Served by ${model.name}`);
        return res;
      }

      lastRes = res;

      if (res.status !== 429) {
        return res;
      }

      console.warn(`${model.name} quota exhausted (429), falling back to next model...`);
    } catch (err) {
      console.warn(`Network error contacting ${model.name}:`, err.message);
      lastRes = null;
    }
  }

  return lastRes;
}

function buildSystemPrompt(lang) {
  const languageName = LANGUAGE_NAMES[lang] || "English";

  return `You are "Sohrai", a friendly AI guide for Jharkhand Tourism.

LANGUAGE:
Always answer entirely in ${languageName}.
Do not mix English with ${languageName}, except for official place names, proper nouns, URLs, or names that are normally written in English.

KNOWLEDGE:
Answer only using the Jharkhand Tourism facts provided below.
Never invent facts, businesses, prices, facilities, safety information, or tourist attractions.

ANSWER STYLE & FORMATTING:
- NEVER use introductory or concluding filler sentences (e.g., skip "Here are the top waterfalls...").
- Get straight to the point and output ONLY the requested facts.
- ALWAYS use short Markdown bullet points for lists and recommendations.
- Each bullet should cover the name, location, AND a useful detail or two that helps a traveler decide - e.g. what makes it worth visiting, best time to go, how to get there, or a standout fact. Aim for roughly 10-20 words per bullet, not just a couple of words.
- Do not write paragraphs.
- Keep the total response under 120 words whenever possible.

IMPORTANT:
The user's selected language is ${languageName}. The answer itself must be written in ${languageName}.

--- JHARKHAND TOURISM FACTS ---
${tourismInfo}
--- END FACTS ---`;
}

async function streamLocalKnowledgeResponse(res, message, lang) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const responseText = getKnowledgeBaseResponse(message, lang);
  const words = responseText.split(" ");

  // Stream in small natural bursts
  for (let i = 0; i < words.length; i += 3) {
    const chunk = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
    res.write(`data: ${JSON.stringify({ delta: chunk })}\n\n`);
    await new Promise((r) => setTimeout(r, 30));
  }

  res.write(`data: ${JSON.stringify({ done: true, reply: responseText })}\n\n`);
  res.end();
}

app.post("/api/chat", async (req, res) => {
  try {
    const clientIp = req.ip;
    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        error: "You're sending messages a little quickly - please wait a moment and try again.",
      });
    }

    const { message, history = [], lang = "en" } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    // If GOOGLE_API_KEY is not set or placeholder, seamlessly use local grounded knowledge base
    const hasValidKey = Boolean(process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.startsWith("AIzaSy"));

    if (!hasValidKey) {
      console.log(`Serving query "${message}" via grounded Jharkhand Knowledge Base (Local Mode)`);
      return streamLocalKnowledgeResponse(res, message, lang);
    }

    const recentHistory = Array.isArray(history) ? history.slice(-12) : [];
    const messages = [...recentHistory, { role: "user", content: message }];

    const geminiContents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const geminiRes = await callGeminiWithFallback(
      buildSystemPrompt(lang),
      geminiContents
    );

    if (!geminiRes || !geminiRes.ok || !geminiRes.body) {
      console.warn("Gemini API unavailable, falling back to local Knowledge Base");
      return streamLocalKnowledgeResponse(res, message, lang);
    }

    // Relay the stream to the browser as Server-Sent Events.
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const reader = geminiRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullReply = "";
    let finishReason = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep the last, possibly-incomplete line for next chunk

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const candidate = parsed.candidates?.[0];
          const chunkText =
            candidate?.content?.parts?.map((p) => p.text || "").join("") || "";

          if (chunkText) {
            fullReply += chunkText;
            res.write(`data: ${JSON.stringify({ delta: chunkText })}\n\n`);
          }
          if (candidate?.finishReason) {
            finishReason = candidate.finishReason;
          }
        } catch {
          // A chunk boundary occasionally splits a JSON object across reads.
          // Safe to skip - the next chunk will complete it.
        }
      }
    }

    console.log("Generated reply:", fullReply);

    let finalReply = fullReply;

    // If the reply got cut off by maxOutputTokens, the last line is almost
    // always a broken mid-word/mid-sentence fragment (e.g. "Buru Bonga
    // (नो"). No maxOutputTokens value is bulletproof against every possible
    // answer, so instead of just hoping the cap is big enough, drop that
    // trailing incomplete line so the user only ever sees complete
    // sentences - a shorter-than-intended answer beats a broken one.
    if (finishReason === "MAX_TOKENS") {
      const lines = finalReply.split("\n");
      if (lines.length > 1) {
        lines.pop();
        finalReply = lines.join("\n").trimEnd();
      }
      console.warn(
        `TRUNCATED reply (lang=${lang}), trimmed to last complete line. Raw: "${fullReply}"`
      );
    }

    if (!finalReply) {
      res.write(
        `data: ${JSON.stringify({ error: "Gemini returned no text response." })}\n\n`
      );
    } else {
      res.write(`data: ${JSON.stringify({ done: true, reply: finalReply })}\n\n`);
    }
    res.end();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Something went wrong on the server." });
    } else {
      res.end();
    }
  }
});

// ---------------------------------------------------------------------------
// User Authentication Database Endpoints
// ---------------------------------------------------------------------------
function getAuthToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  if (req.headers["x-session-token"]) {
    return req.headers["x-session-token"].trim();
  }
  if (req.body && req.body.token) {
    return req.body.token.trim();
  }
  return null;
}

// User registration (Sign Up) -> Stores user in SQLite with bcrypt password hash
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ ok: false, error: "Please enter your name." });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ ok: false, error: "Password must be at least 6 characters." });
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        ok: false,
        error: "An account with this email already exists — try signing in instead.",
      });
    }

    const user = await createUser({ name, email, password });
    const session = createSession(user.id);

    return res.status(201).json({
      ok: true,
      message: "Account created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: session.token,
    });
  } catch (err) {
    console.error("Sign up error:", err);
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        ok: false,
        error: "An account with this email already exists.",
      });
    }
    return res.status(500).json({ ok: false, error: err.message || "Failed to create account." });
  }
});

// User authentication (Log In) -> Verifies email/username & bcrypt password hash in database
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, identifier, username, password } = req.body || {};
    const userIdentifier = (email || identifier || username || "").trim();

    if (!userIdentifier) {
      return res.status(400).json({ ok: false, error: "Please enter your email or username." });
    }
    if (!password) {
      return res.status(400).json({ ok: false, error: "Please enter your password." });
    }

    const result = await verifyUserPassword(userIdentifier, password);
    if (!result.ok) {
      return res.status(401).json({ ok: false, error: result.error });
    }

    const session = createSession(result.user.id);

    return res.json({
      ok: true,
      message: "Signed in successfully.",
      user: result.user,
      token: session.token,
    });
  } catch (err) {
    console.error("Log in error:", err);
    return res.status(500).json({ ok: false, error: "Failed to sign in." });
  }
});

// User session verification (Me)
app.get("/api/auth/me", (req, res) => {
  try {
    const token = getAuthToken(req);
    if (!token) {
      return res.status(401).json({ ok: false, error: "Not authenticated" });
    }

    const user = getSessionUser(token);
    if (!user) {
      return res.status(401).json({ ok: false, error: "Session expired or invalid" });
    }

    return res.json({ ok: true, user });
  } catch (err) {
    console.error("Auth check error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
});

// User logout
app.post("/api/auth/logout", (req, res) => {
  try {
    const token = getAuthToken(req);
    if (token) {
      deleteSession(token);
    }
    return res.json({ ok: true, message: "Signed out successfully." });
  } catch (err) {
    console.error("Log out error:", err);
    return res.status(500).json({ ok: false, error: "Failed to sign out." });
  }
});

// User count / database status stats
app.get("/api/auth/stats", (req, res) => {
  try {
    const count = getUserCount();
    return res.json({ ok: true, totalUsers: count });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "Failed to fetch stats" });
  }
});

// Periodic session cleanup every hour
setInterval(() => {
  try {
    purgeExpiredSessions();
  } catch (e) {
    console.error("Session purge error:", e);
  }
}, 60 * 60 * 1000).unref?.();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Sohrai AI Bot Server running on port ${PORT}`);
  console.log(`   - Standalone Bot UI:   http://localhost:${PORT}/`);
  console.log(`   - Widget Embed UI:       http://localhost:${PORT}/embed.html`);
  console.log(`   - Widget Script:         http://localhost:${PORT}/widget.js`);
  console.log(`   - Chat API Endpoint:     http://localhost:${PORT}/api/chat`);
  console.log(`   - Team Integration Demo: http://localhost:${PORT}/team-demo.html`);
  console.log(`=======================================================`);
});