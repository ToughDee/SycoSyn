import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const HF_API_KEY = process.env.HF_API_KEY;

// Models
const IMAGE_MODEL = "google/vit-base-patch16-224";
const TEXT_MODEL = "facebook/bart-large-mnli";

export const CAPTION_CANDIDATE_LABELS = [
  // Art types / styles
  "painting", "illustration", "digital art", "sketch", "3d art", "abstract", "photography", "writing", "calligraphy", "collage",
  
  // Subjects / themes
  "nature", "landscape", "architecture", "urban", "cityscape", "people", "animals", "fantasy", "portrait", "still life", "concept art",

  // Styles / moods
  "realistic", "minimalist", "surreal", "cartoon", "anime", "romantic", "moody", "vibrant", "dark", "calm", "dramatic",

  // Lighting / time of day
  "sunset", "sunrise", "night", "daylight", "golden hour", "studio lighting", "ambient",

  // Medium / technique
  "oil painting", "watercolor", "pencil sketch", "ink drawing", "digital painting", "photorealistic"
];

// ---------------- Helper: Call Hugging Face API ----------------
async function queryModel(model, inputs, parameters = {}) {
  const url = `https://api-inference.huggingface.co/models/${model}`;
  const headers = { Authorization: `Bearer ${HF_API_KEY}` };

  try {
    const response = await axios.post(url, { inputs, parameters }, { headers });
    return response.data;
  } catch (err) {
    console.error(`❌ HF API Error (${model}):`, err.response?.data || err.message);
    return [];
  }
}

// ---------------- Image Tags ----------------
async function getImageTags(imageUrl) {
  const result = await queryModel(IMAGE_MODEL, imageUrl);
  if (!Array.isArray(result)) return [];

  // Split comma-separated labels, trim, lowercase
  return result
    .filter(item => item.score > 0.3)
    .flatMap(item =>
      item.label
        .split(",")
        .map(l => l.trim().toLowerCase().replace(/\s+/g, " ")) // normalize spaces
    )
    // sort descending by score
    .sort((a, b) => {
      const scoreA = result.find(r => r.label.includes(a))?.score || 0;
      const scoreB = result.find(r => r.label.includes(b))?.score || 0;
      return scoreB - scoreA;
    });
}

// ---------------- Caption Tags (Semantic) ----------------
async function getCaptionTags(caption) {
  if (!caption) return [];

  const result = await queryModel(TEXT_MODEL, caption, {
    candidate_labels: CAPTION_CANDIDATE_LABELS,
    multi_label: true
  });

  if (!result?.labels || !Array.isArray(result.labels)) return [];

  // Filter by reasonable confidence
  const tags = result.labels
    .map((label, i) => ({ label: label.toLowerCase(), score: result.scores[i] }))
    .filter(t => t.score > 0.8)
    .map(t => t.label);

  return tags;
}

// ---------------- Combine Both ----------------
export async function generateTags({ imageUrl, caption }) {
  const [imageTags, captionTags] = await Promise.all([
    getImageTags(imageUrl),
    getCaptionTags(caption)
  ]);

  const merged = Array.from(new Set([...imageTags, ...captionTags]));

  return merged.slice(0, 15);
}
