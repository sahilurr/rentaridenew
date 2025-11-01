import { errorHandler } from "../utils/error.js";


/*
 * AI Controller
 *
 * This controller exposes three endpoints for generative AI features:
 * 1. tripPlanner – Generates a suggested itinerary and vehicle recommendation
 *    given a destination and trip duration.
 * 2. listingGenerator – Generates a persuasive listing description for a
 *    vehicle based on basic facts supplied by the vendor.
 * 3. reviewSummarizer – Summarizes all reviews for a particular vendor.
 *
 * These endpoints call the Google Generative AI API (Gemini 1.0) via
 * HTTP POST requests. You must set the GEMINI_API_KEY environment
 * variable in your .env file for these calls to succeed.
 */

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent';

/**
 * Helper to invoke Gemini with a free‑form prompt. Returns the first
 * candidate text or throws an error.
 * @param {string} prompt
 */
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${text}`);
  }
  const data = await res.json();
  const candidates = data.candidates || [];
  if (!candidates.length) {
    throw new Error('No content returned from Gemini');
  }
  const content = candidates[0].content;
  if (!content || !content.parts || !content.parts.length) {
    throw new Error('Malformed Gemini response');
  }
  return content.parts[0].text;
}

/**
 * POST /api/ai/trip-planner
 *
 * Body: { destination: string, duration: number }
 *
 * Responds with a JSON object containing an itinerary suggestion and
 * a recommended vehicle type.
 */
export const tripPlanner = async (req, res, next) => {
  try {
    const { destination, duration } = req.body;
    if (!destination || !duration) {
      return next(errorHandler(400, 'Destination and duration are required'));
    }
    const prompt =
      `I am planning a ${duration}-day trip to ${destination}. ` +
      `Please provide a detailed day-by-day itinerary including major attractions, dining recommendations, and approximate driving distances. ` +
      `Also recommend the best type of vehicle for this trip (e.g., convertible, SUV, sedan).`;
    const result = await callGemini(prompt);
    res.status(200).json({ message: result });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

/**
 * POST /api/ai/listing-generator
 *
 * Body: {
 *   brand: string,
 *   model: string,
 *   year: number,
 *   fuel: string,
 *   seats: number,
 *   transmission: string
 * }
 *
 * Responds with a JSON object containing a persuasive description.
 */
export const listingGenerator = async (req, res, next) => {
  try {
    const { brand, model, year, fuel, seats, transmission } = req.body;
    if (!brand || !model || !year) {
      return next(errorHandler(400, 'Brand, model and year are required'));
    }
    const prompt =
      `Write a persuasive and friendly description for a rental vehicle given the following facts:\n` +
      `Brand: ${brand}\nModel: ${model}\nYear: ${year}\nFuel: ${fuel || 'N/A'}\nSeats: ${seats || 'N/A'}\nTransmission: ${transmission || 'N/A'}\n` +
      `Highlight unique selling points, comfort features, and why a renter would love to choose this vehicle. Keep it under 150 words.`;
    const description = await callGemini(prompt);
    res.status(200).json({ description });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

/**
 * POST /api/ai/review-summarizer
 *
 * Body: { vendorId: string, reviews: string[] }
 *
 * If reviews are not provided, the controller should fetch them from the
 * database. For simplicity, the current implementation expects
 * an array of review texts. It returns a concise summary highlighting
 * the overall sentiment, key praises, and concerns.
 */
export const reviewSummarizer = async (req, res, next) => {
  try {
    const { vendorId, reviews } = req.body;
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return next(errorHandler(400, 'No reviews provided'));
    }
    const concatenated = reviews.join('\n');
    const prompt =
      `Summarize the following rental vehicle reviews for vendor ${vendorId}:\n` +
      `${concatenated}\n` +
      `Provide an overall sentiment score (positive, neutral, or negative) and highlight recurring themes in a short paragraph.`;
    const summary = await callGemini(prompt);
    res.status(200).json({ summary });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};