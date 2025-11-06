// backend/controllers/aiController.js


// Do NOT call dotenv.config() here with default path;
// your server.js already loads backend/.env correctly with an explicit path.
// The key point: don't cache API key at module scope!

const ENV_MODEL = (process.env.GEMINI_MODEL || "").trim();
const FALLBACK_MODELS = [
  ...(ENV_MODEL ? [ENV_MODEL] : []),
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-8b-latest",
];

async function callGeminiText(model, prompt) {
  // read at call time so it works regardless of import order
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error(
      "GEMINI_API_KEY missing — add it to backend/.env and restart the server"
    );
  }

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  const json = await r.json();
  if (!r.ok) {
    const err = new Error(json?.error?.message || JSON.stringify(json));
    err.status = r.status;
    err.payload = json;
    throw err;
  }
  return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No content";
}

async function tryModels(prompt) {
  const tried = [];
  for (const m of FALLBACK_MODELS) {
    tried.push(m);
    try {
      const text = await callGeminiText(m, prompt);
      return { text, model: m };
    } catch (e) {
      if (e.status !== 404) throw new Error(`Gemini API error on "${m}": ${e.message}`);
      // 404 => try next model
    }
  }
  throw new Error(`No compatible Gemini model found. Tried: ${tried.join(", ")}`);
}

export const tripPlanner = async (req, res) => {
  try {
    const { destination = "your city", duration, days } = req.body;
    const tripDays = Number(duration ?? days ?? 1);

    const prompt = `Plan a ${tripDays}-day itinerary for ${destination}.
Include day-wise bullets and recommend the best vehicle type at the end.`;

    const { text, model } = await tryModels(prompt);
    res.json({ ok: true, model, message: text });
  } catch (err) {
    res.status(400).json({ ok: false, message: `Gemini API error: ${err.message}` });
  }
};

export const listingGenerator = async (req, res) => {
  try {
    const { facts } = req.body;
    const prompt = `Write a persuasive 5–7 line rental listing for this vehicle:
${typeof facts === "string" ? facts : JSON.stringify(facts, null, 2)}
Tone: friendly, specific, include use-cases. End with a short CTA.`;

    const { text, model } = await tryModels(prompt);
    res.json({ ok: true, model, message: text });
  } catch (err) {
    res.status(400).json({ ok: false, message: `Gemini API error: ${err.message}` });
  }
};

export const reviewSummarizer = async (req, res) => {
  try {
    const { reviews = [] } = req.body;
    const list = reviews.map((r, i) => `- ${i + 1}. ${r}`).join("\n");
    const prompt = `Summarize these reviews into 6–8 bullets with positives, negatives, and red flags:
${list}`;

    const { text, model } = await tryModels(prompt);
    res.json({ ok: true, model, message: text });
  } catch (err) {
    res.status(400).json({ ok: false, message: `Gemini API error: ${err.message}` });
  }
};
