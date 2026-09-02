import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveSelection } from '../../projects/shadow-board-exam/data/curriculum/index.js';
import { resolvePlus3Selection } from '../../projects/shadow-plus3/data/curriculum/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const envFile = join(here, '.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

const port = Number(process.env.PORT || 3002);
const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean);
const allowedCounts = new Set([5, 10, 20, 30, 50]);
const allowedDifficulties = new Set(['basic', 'intermediate', 'advanced', 'expert']);
const allowedTypes = new Set(['mcq', 'assertion-reasoning', 'match-following', 'short-conceptual']);
const boardAiTimeoutMs = Math.max(5_000, Number(process.env.BOARD_AI_TIMEOUT_MS) || 20_000);
const boardAiAttempts = Math.max(1, Number(process.env.BOARD_AI_ATTEMPTS) || 1);
const requestLog = new Map();

class AppError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function send(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && (!allowedOrigins.length || allowedOrigins.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

async function readBody(req, maxBytes = 50_000) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxBytes) throw new AppError(413, 'The request is too large. Please try again.');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new AppError(400, 'The request could not be read. Please check your selections and try again.'); }
}

function validateConfig(config) {
  if (!config || typeof config !== 'object') throw new AppError(400, 'Please provide a valid question configuration.');
  const { classId, subjectId, categoryId, chapterId, topic, difficulty, questionType, count } = config;
  if (![classId, subjectId, categoryId, chapterId, topic].every((value) => typeof value === 'string' && value.trim())) throw new AppError(400, 'Please complete all curriculum selections.');
  if (!allowedDifficulties.has(difficulty) || !allowedTypes.has(questionType) || !allowedCounts.has(Number(count))) throw new AppError(400, 'One or more question settings are not supported.');
  const selection = resolveSelection({ classId, subjectId, categoryId, chapterId, topic });
  if (!selection) throw new AppError(400, 'This curriculum combination is not active. Choose an available class, subject, chapter, and topic.');
  return { ...config, count: Number(count), selection };
}

function rateLimit(req) {
  const ip = req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter((time) => now - time < 60_000);
  if (recent.length >= 12) throw new AppError(429, 'Too many generation requests. Please wait a minute and try again.');
  recent.push(now);
  requestLog.set(ip, recent);
}

const stringField = { type: 'string' };
const responseSchema = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' }, question: stringField, options: { type: 'array', items: stringField }, answer: stringField,
          explanation: stringField, assertion: stringField, reason: stringField,
          matchPairs: { type: 'array', items: { type: 'object', properties: { left: stringField, right: stringField }, required: ['left', 'right'] } },
          numerical: { type: 'object', properties: { given: stringField, required: stringField, formula: stringField, substitution: stringField, calculation: stringField, finalAnswer: stringField }, required: ['given', 'required', 'formula', 'substitution', 'calculation', 'finalAnswer'] }
        },
        required: ['id', 'question', 'options', 'answer', 'explanation', 'assertion', 'reason', 'matchPairs', 'numerical']
      }
    }
  },
  required: ['questions']
};

function buildPrompt(config) {
  const { selection } = config;
  const difficultyInstructions = {
    basic: 'Level 1 Basic: direct recall and straightforward NCERT definitions or examples.',
    intermediate: 'Level 2 Intermediate: conceptual understanding and one-step application.',
    advanced: 'Level 3 Advanced: multi-concept or meaningful application, but still within NCERT Class level.',
    expert: 'Level 4 Expert: challenging analytical reasoning or multi-step NCERT-based application without using out-of-syllabus material.'
  };
  const typeInstructions = {
    mcq: 'Create MCQs with exactly four options, exactly one unambiguous correct option, and a clear explanation. Put the complete correct option text in answer, never only an option letter.',
    'assertion-reasoning': 'Create Assertion and Reason questions. Use exactly these option texts: (A) Both A and R are true, and R is the correct explanation of A. (B) Both A and R are true, but R is not the correct explanation of A. (C) A is true, but R is false. (D) A is false, but R is true. Put the exact correct option text in answer.',
    'match-following': 'Create a valid four-pair match-the-following question. Fill matchPairs with exactly four left/right mappings. Explain all mappings.',
    'short-conceptual': 'Create concise NCERT-based conceptual, reasoning, formula, application, or numerical questions. For numerical questions, fill every numerical field: given, required, formula, substitution, calculation, finalAnswer. For non-numerical questions, leave numerical fields as empty strings. Give a concise markable answer and detailed explanation.'
  };
  return `You are a careful NCERT board-exam question writer. Generate exactly ${config.count} unique questions.\n\nAcademic scope (do not go outside it):\n- Class: ${selection.classEntry.label}\n- Subject: ${selection.subjectEntry.name}\n- Category: ${selection.categoryEntry.name}\n- Chapter: ${selection.chapterEntry.name}\n- Topic: ${selection.topic}\n- Official reference: ${selection.classEntry.source.title} (${selection.classEntry.source.url})\n\n${difficultyInstructions[config.difficulty]}\n${typeInstructions[config.questionType]}\n\nQuality rules:\n- Stay within selected NCERT content and the stated class level.\n- Do not invent NCERT facts, introduce ambiguous wording, or use unrelated advanced material.\n- Verify numerical steps and final answers.\n- Return JSON only.\n- For MCQ and Assertion/Reason, options must contain exactly four strings.\n- For non-option question types, options must be an empty array.\n- For non-Assertion/Reason types, assertion and reason must be empty strings.\n- For non-match types, matchPairs must be an empty array.\n- Include all numerical keys even when their values are empty strings.`;
}

function extractJson(text) {
  const cleaned = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(cleaned); }
  catch { throw new AppError(502, 'The AI returned an invalid question format. Please generate again.'); }
}

function normaliseText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normaliseAnswer(answer, options) {
  const value = normaliseText(answer);
  if (options.includes(value)) return value;
  const optionLetter = value.match(/^(?:option\s*)?([A-D])(?:[).:\-\s]|$)/i)?.[1];
  if (optionLetter) return options[optionLetter.toUpperCase().charCodeAt(0) - 65] || value;
  return options.find((option) => option.toLowerCase() === value.toLowerCase()) || value;
}

function normaliseQuestionSet(payload) {
  if (!payload || !Array.isArray(payload.questions)) return payload;
  const numericalFields = ['given', 'required', 'formula', 'substitution', 'calculation', 'finalAnswer'];
  return {
    ...payload,
    questions: payload.questions.map((source) => {
      const options = Array.isArray(source?.options) ? source.options.map(normaliseText).filter(Boolean) : [];
      const rawNumerical = source?.numerical && typeof source.numerical === 'object' ? source.numerical : {};
      const numerical = Object.fromEntries(numericalFields.map((field) => [field, normaliseText(rawNumerical[field])]));
      const hasPartialNumericalSteps = numericalFields.some((field) => numerical[field]) && numericalFields.some((field) => !numerical[field]);
      return {
        ...source,
        question: normaliseText(source?.question),
        options,
        answer: normaliseAnswer(source?.answer, options),
        explanation: normaliseText(source?.explanation),
        assertion: normaliseText(source?.assertion),
        reason: normaliseText(source?.reason),
        matchPairs: Array.isArray(source?.matchPairs) ? source.matchPairs.map((pair) => ({ left: normaliseText(pair?.left), right: normaliseText(pair?.right) })) : [],
        numerical: hasPartialNumericalSteps ? emptyNumerical() : numerical
      };
    })
  };
}

function validateQuestions(payload, config) {
  if (!payload || !Array.isArray(payload.questions) || payload.questions.length !== config.count) throw new AppError(502, 'The AI did not return the requested number of questions. Please generate again.');
  const hasText = (value) => typeof value === 'string' && value.trim();
  const numericalFields = ['given', 'required', 'formula', 'substitution', 'calculation', 'finalAnswer'];
  const valid = payload.questions.every((question) => {
    if (!hasText(question?.question) || !hasText(question?.answer) || !hasText(question?.explanation)) return false;
    if (!Array.isArray(question.options) || !question.options.every(hasText) || !Array.isArray(question.matchPairs)) return false;
    if (!question.numerical || !numericalFields.every((field) => typeof question.numerical[field] === 'string')) return false;
    const numericalValues = numericalFields.map((field) => question.numerical[field].trim());
    if (numericalValues.some(Boolean) && !numericalValues.every(Boolean)) return false;
    if (config.questionType === 'mcq') return question.options.length === 4 && question.options.includes(question.answer) && question.assertion === '' && question.reason === '' && question.matchPairs.length === 0;
    if (config.questionType === 'assertion-reasoning') return question.options.length === 4 && question.options.includes(question.answer) && hasText(question.assertion) && hasText(question.reason) && question.matchPairs.length === 0;
    if (config.questionType === 'match-following') return question.options.length === 0 && question.assertion === '' && question.reason === '' && question.matchPairs.length === 4 && question.matchPairs.every((pair) => hasText(pair?.left) && hasText(pair?.right));
    return question.options.length === 0 && question.assertion === '' && question.reason === '' && question.matchPairs.length === 0;
  });
  if (!valid) throw new AppError(502, 'The generated question set did not pass quality validation. Please generate again.');
  return payload.questions.map((question, index) => ({ ...question, id: index + 1 }));
}

function emptyNumerical() { return { given: '', required: '', formula: '', substitution: '', calculation: '', finalAnswer: '' }; }

function demoQuestions(config) {
  const { selection } = config;
  const categoryChapters = selection.categoryEntry.chapters.filter((chapter) => chapter.active);
  const distractors = categoryChapters.filter((chapter) => chapter.id !== selection.chapterEntry.id).map((chapter) => chapter.name);
  const fallbackChoices = ['A different active NCERT chapter', 'Another related NCERT concept', 'An unrelated syllabus focus'];
  const availableTopics = [...new Set([...selection.chapterEntry.topics, ...categoryChapters.flatMap((chapter) => chapter.topics)])];
  const questions = Array.from({ length: config.count }, (_, index) => {
    const variation = index + 1;
    if (config.questionType === 'mcq') {
      const answer = selection.chapterEntry.name;
      return { id: variation, question: `Demo ${variation}: Which NCERT chapter contains the topic “${selection.topic}”?`, options: [answer, ...distractors, ...fallbackChoices].slice(0, 4).sort(() => Math.random() - .5), answer, explanation: `Development-mode response: “${selection.topic}” is catalogued under ${answer}. Configure GEMINI_API_KEY for AI-authored practice questions.`, assertion: '', reason: '', matchPairs: [], numerical: emptyNumerical() };
    }
    if (config.questionType === 'assertion-reasoning') {
      const answer = 'Both A and R are true, and R is the correct explanation of A.';
      return { id: variation, question: `Demo ${variation}: Select the correct Assertion–Reason relationship.`, assertion: `“${selection.topic}” is an active topic in ${selection.chapterEntry.name}.`, reason: `The selected NCERT curriculum catalog lists this topic under that chapter.`, options: [answer, 'Both A and R are true, but R is not the correct explanation of A.', 'A is true, but R is false.', 'A is false, but R is true.'], answer, explanation: 'Development-mode response based on the local curriculum catalog. Configure GEMINI_API_KEY for AI-authored questions.', matchPairs: [], numerical: emptyNumerical() };
    }
    if (config.questionType === 'match-following') {
      const pairs = Array.from({ length: 4 }, (_, topicIndex) => ({ left: availableTopics[topicIndex] || `NCERT focus ${topicIndex + 1}`, right: `Active topic ${topicIndex + 1} in ${selection.chapterEntry.name}` }));
      return { id: variation, question: `Demo ${variation}: Match the listed ${selection.chapterEntry.name} topics.`, options: [], answer: pairs.map((pair) => `${pair.left} — ${pair.right}`).join('; '), explanation: 'Development-mode mapping from the active local curriculum catalog. Configure GEMINI_API_KEY for AI-authored matching questions.', assertion: '', reason: '', matchPairs: pairs, numerical: emptyNumerical() };
    }
    return { id: variation, question: `Demo ${variation}: Explain the NCERT concept “${selection.topic}” from ${selection.chapterEntry.name}.`, options: [], answer: `A correct response should explain ${selection.topic} using the NCERT treatment in ${selection.chapterEntry.name}.`, explanation: 'Development-mode prompt only. Configure GEMINI_API_KEY for an AI-authored answer and explanation.', assertion: '', reason: '', matchPairs: [], numerical: emptyNumerical() };
  });
  return { questions, engine: 'demo' };
}

async function generateWithGemini(config) {
  if (!process.env.GEMINI_API_KEY) {
    if (process.env.DEMO_MODE === 'true') return demoQuestions(config);
    throw new AppError(503, 'AI generation is not configured yet. Add GEMINI_API_KEY to backend/shadow-board-exam/.env, then restart the Board Exam backend.');
  }
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
  let lastError;
  for (let attempt = 0; attempt < boardAiAttempts; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: buildPrompt(config) }] }], generationConfig: { temperature: .7 + attempt * .05, responseMimeType: 'application/json', responseSchema } }),
        signal: AbortSignal.timeout(boardAiTimeoutMs)
      });
      if (!response.ok) throw new AppError(response.status === 429 ? 429 : response.status === 503 ? 503 : 502, response.status === 429 ? 'The AI service is busy. Please wait a moment and try again.' : response.status === 503 ? 'The AI service is temporarily unavailable. Please try again in a moment.' : 'The AI service could not generate questions right now.');
      const payload = await response.json();
      const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('');
      const questions = validateQuestions(normaliseQuestionSet(extractJson(text)), config);
      return { questions, engine: 'gemini' };
    } catch (error) {
      lastError = error;
      if (error instanceof AppError && error.status === 429) break;
    }
  }
  throw lastError instanceof AppError ? lastError : new AppError(502, 'Question generation failed. Please try again.');
}

function metadata(config, engine) {
  const { selection } = config;
  return { class: selection.classEntry.id, subject: selection.subjectEntry.name, category: selection.categoryEntry.name, chapter: selection.chapterEntry.name, topic: selection.topic, difficulty: config.difficulty, questionType: config.questionType, count: config.count, ncertReference: selection.classEntry.source.title, lastReviewed: selection.classEntry.lastReviewed, engine };
}

function validatePlusConfig(config) {
  if (!config || typeof config !== 'object') throw new AppError(400, 'Please provide a valid Plus3 question configuration.');
  const keys = ['profileId', 'year', 'semester', 'subjectId', 'courseId', 'categoryId', 'subcategoryId', 'unitId', 'chapterId', 'topicId', 'subtopic'];
  if (keys.some((key) => typeof config[key] !== 'string' || !config[key].trim())) throw new AppError(400, 'Please complete the Plus3 curriculum selection.');
  if (!allowedDifficulties.has(config.difficulty) || !allowedTypes.has(config.questionType) || !allowedCounts.has(Number(config.count))) throw new AppError(400, 'One or more Plus3 question settings are not supported.');
  const selection = resolvePlus3Selection(config);
  if (!selection) throw new AppError(400, 'This Plus3 curriculum combination is not active. Choose an available programme, semester, subject, course and topic.');
  return { ...config, count: Number(config.count), selection };
}

function plusPrompt(config) {
  const { selection } = config;
  const difficulty = {
    basic: 'Level 1 Basic: definitions, direct concepts, fundamental formulae and simple examples.',
    intermediate: 'Level 2 Intermediate: conceptual application, comparison and moderate calculations.',
    advanced: 'Level 3 Advanced: multi-concept, analytical and application-based university questions.',
    expert: 'Level 4 Expert: challenging undergraduate reasoning, multi-step calculations and research-aware applications within this course context.'
  };
  const format = {
    mcq: 'Create exactly four options and one unambiguous correct answer for each MCQ.',
    'assertion-reasoning': 'Create Assertion and Reason questions using exactly these answers: (A) Both A and R are true, and R is the correct explanation of A. (B) Both A and R are true, but R is not the correct explanation of A. (C) A is true, but R is false. (D) A is false, but R is true.',
    'match-following': 'Create exactly four valid left/right match pairs and explain every mapping.',
    'short-conceptual': 'Create theory, derivation, numerical, formula, application, interpretation or programming questions as appropriate. For numerical questions fill given, required, formula, substitution, calculation and finalAnswer fully. For non-numerical questions keep those numerical fields empty.'
  };
  return `You are Shadow Plus3, a careful B.Sc academic question writer. Generate exactly ${config.count} unique, academically sound questions.\n\nScope:\n- Curriculum mode: ${selection.profile.name}\n- Programme: ${selection.profile.programme}\n- Year / semester: ${selection.year} / ${selection.semester}\n- Subject: ${selection.subject.name}\n- Course: ${selection.course.title} (${selection.course.code})\n- Category: ${selection.category.name}\n- Subcategory: ${selection.subcategory.name}\n- Unit: ${selection.unit.name}\n- Chapter: ${selection.chapter.name}\n- Topic / subtopic: ${selection.topic.name} / ${selection.subtopic}\n\n${difficulty[config.difficulty]}\n${format[config.questionType]}\n\nQuality rules:\n- Use undergraduate-level terminology and stay within the selected configured curriculum context; do not claim this general template is a university-approved syllabus.\n- Verify calculations, equations, code logic and scientific terminology.\n- Avoid ambiguous or duplicated questions.\n- Return JSON only matching the required schema.\n- MCQ and Assertion/Reason must have exactly four options; other formats must use an empty options array.\n- Non-Assertion/Reason questions must have empty assertion and reason strings; non-match questions must have an empty matchPairs array.`;
}

function emptyPlusNumerical() { return { given: '', required: '', formula: '', substitution: '', calculation: '', finalAnswer: '' }; }
function demoPlusQuestions(config) {
  const { selection } = config;
  const chapter = selection.chapter.name;
  const topic = selection.topic.name;
  const fallback = ['A different configured concept', 'A related course unit', 'An unrelated topic'];
  const question = (index) => {
    if (config.questionType === 'mcq') return { id: index, question: `Demo ${index}: Which configured chapter contains “${topic}”?`, options: [chapter, ...fallback].sort(() => Math.random() - .5), answer: chapter, explanation: `Development-mode response: ${topic} is selected under ${chapter}. Add GEMINI_API_KEY for AI-authored Plus3 questions.`, assertion: '', reason: '', matchPairs: [], numerical: emptyPlusNumerical() };
    if (config.questionType === 'assertion-reasoning') { const answer = 'Both A and R are true, and R is the correct explanation of A.'; return { id: index, question: `Demo ${index}: Select the correct Assertion–Reason relationship.`, assertion: `${topic} is an active topic in the selected ${chapter} configuration.`, reason: 'The local Plus3 curriculum layer records this topic under the chosen chapter.', options: [answer, 'Both A and R are true, but R is not the correct explanation of A.', 'A is true, but R is false.', 'A is false, but R is true.'], answer, explanation: 'Development-mode validation response. Configure Gemini for academic question generation.', matchPairs: [], numerical: emptyPlusNumerical() }; }
    if (config.questionType === 'match-following') { const pairs = [topic, selection.subtopic, selection.unit.name, selection.category.name].map((item, pairIndex) => ({ left: item, right: `Configured study focus ${pairIndex + 1}` })); return { id: index, question: `Demo ${index}: Match the selected B.Sc curriculum items.`, options: [], answer: pairs.map((pair) => `${pair.left} — ${pair.right}`).join('; '), explanation: 'Development-mode mapping from the configured Plus3 curriculum. Configure Gemini for AI-authored matching questions.', assertion: '', reason: '', matchPairs: pairs, numerical: emptyPlusNumerical() }; }
    return { id: index, question: `Demo ${index}: Explain ${topic} in the context of ${chapter}.`, options: [], answer: `A correct response should explain ${topic} using the selected ${chapter} course context.`, explanation: 'Development-mode prompt only. Configure Gemini for a complete academic explanation.', assertion: '', reason: '', matchPairs: [], numerical: emptyPlusNumerical() };
  };
  return { questions: Array.from({ length: config.count }, (_, index) => question(index + 1)), engine: 'demo' };
}

async function generatePlusQuestions(config) {
  if (!process.env.GEMINI_API_KEY) {
    if (process.env.DEMO_MODE === 'true') return demoPlusQuestions(config);
    throw new AppError(503, 'AI generation is not configured yet. Add GEMINI_API_KEY to backend/shadow-board-exam/.env, then restart the shared study backend.');
  }
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: plusPrompt(config) }] }], generationConfig: { temperature: .7 + attempt * .05, responseMimeType: 'application/json', responseSchema } }), signal: AbortSignal.timeout(60_000) });
      if (!response.ok) throw new AppError(response.status === 429 ? 429 : response.status === 503 ? 503 : 502, response.status === 429 ? 'The AI service is busy. Please wait a moment and try again.' : response.status === 503 ? 'The AI service is temporarily unavailable. Please try again in a moment.' : 'The AI service could not generate questions right now.');
      const payload = await response.json();
      const questions = validateQuestions(extractJson(payload?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('')), config);
      return { questions, engine: 'gemini' };
    } catch (error) { lastError = error; if (error instanceof AppError && error.status === 429) break; }
  }
  throw lastError instanceof AppError ? lastError : new AppError(502, 'Question generation failed. Please try again.');
}

const assistantSchema = { type: 'object', properties: { understanding: stringField, concept: stringField, solution: stringField, finalAnswer: stringField, explanation: stringField }, required: ['understanding', 'concept', 'solution', 'finalAnswer', 'explanation'] };
function assistantContext(context) { try { return resolvePlus3Selection(context || {}); } catch { return null; } }
function demoAssistant(prompt, selection) { const focus = selection ? `${selection.subject.name} — ${selection.topic.name}` : 'your selected B.Sc subject'; return { answer: { understanding: `You are asking about ${focus}: ${prompt}`, concept: 'Development-mode response: configure Gemini for a complete academic explanation.', solution: 'Break the problem into known information, the governing concept, and each required calculation or reasoning step.', finalAnswer: 'A Gemini API key is needed for an AI-authored final solution.', explanation: 'This placeholder confirms the assistant pipeline, structured rendering, and safe response validation.' }, engine: 'demo' }; }
async function generateAssistant(body) {
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt || prompt.length > 8000) throw new AppError(400, 'Enter an academic question of up to 8,000 characters.');
  const selection = assistantContext(body.context);
  if (!process.env.GEMINI_API_KEY) { if (process.env.DEMO_MODE === 'true') return { ...demoAssistant(prompt, selection), selection }; throw new AppError(503, 'Shadow AI is not configured yet. Add GEMINI_API_KEY to the shared backend and restart it.'); }
  const scope = selection ? `Subject: ${selection.subject.name}; course: ${selection.course.title}; unit: ${selection.unit.name}; topic: ${selection.topic.name}; subtopic: ${selection.subtopic}.` : 'No complete curriculum selection is available; ask for clarification if the problem lacks academic context.';
  const promptText = `You are Shadow Plus3, a careful B.Sc academic assistant. Study mode: ${body.studyMode || 'explain'}. ${scope}\nStudent question: ${prompt}\nReturn only valid JSON. Explain with appropriate undergraduate theory. For numerical, mathematical, chemistry, physics or programming work, show clear steps, formulae/equations or code logic. Do not invent facts, data, diagrams or a university syllabus.`;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { temperature: .35, responseMimeType: 'application/json', responseSchema: assistantSchema } }), signal: AbortSignal.timeout(60_000) });
    if (!response.ok) throw new AppError(response.status === 429 ? 429 : response.status === 503 ? 503 : 502, response.status === 429 ? 'The AI service is busy. Please wait a moment and try again.' : response.status === 503 ? 'The AI service is temporarily unavailable. Please try again in a moment.' : 'Shadow AI could not prepare a response right now.');
    const answer = extractJson((await response.json())?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join(''));
    if (!['understanding', 'concept', 'solution', 'finalAnswer', 'explanation'].every((key) => typeof answer?.[key] === 'string' && answer[key].trim())) throw new AppError(502, 'The academic response did not pass validation. Please ask again.');
    return { answer, engine: 'gemini', selection };
  } catch (error) { throw error instanceof AppError ? error : new AppError(502, 'Shadow AI could not prepare a response right now.'); }
}

const shadowAiSchema = {
  type: 'object',
  properties: {
    title: stringField,
    text: stringField,
    visual: {
      type: 'object',
      properties: { kind: stringField, title: stringField, caption: stringField, labels: { type: 'array', items: stringField } },
      required: ['kind', 'title', 'caption', 'labels']
    }
  },
  required: ['title', 'text', 'visual']
};

function shadowAiHistory(history) {
  if (history === undefined) return [];
  if (!Array.isArray(history) || history.length > 10) throw new AppError(400, 'The chat history is not valid. Start a new chat and try again.');
  return history.map((message) => {
    if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string' || !message.content.trim() || message.content.length > 8_000) throw new AppError(400, 'The chat history contains an invalid message.');
    return { role: message.role, content: message.content.trim() };
  });
}

function imageReference(image) {
  if (image === undefined || image === null) return null;
  if (!image || typeof image.dataUrl !== 'string') throw new AppError(400, 'The image reference could not be read. Please choose a PNG, JPEG, or WebP image.');
  const match = image.dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new AppError(400, 'Choose a valid PNG, JPEG, or WebP image reference.');
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > 3 * 1024 * 1024) throw new AppError(413, 'Choose an image smaller than 3 MB.');
  return { mimeType: match[1], data: match[2] };
}

function validateShadowAiAnswer(answer) {
  const validKinds = new Set(['none', 'concept-map', 'process', 'comparison']);
  if (!answer || typeof answer.title !== 'string' || !answer.title.trim() || typeof answer.text !== 'string' || !answer.text.trim() || !answer.visual || typeof answer.visual.title !== 'string' || typeof answer.visual.caption !== 'string' || !Array.isArray(answer.visual.labels) || !answer.visual.labels.every((label) => typeof label === 'string' && label.trim()) || !validKinds.has(answer.visual.kind)) throw new AppError(502, 'The AI response did not pass validation. Please try again.');
  if (answer.visual.kind === 'none' && answer.visual.labels.length !== 0) throw new AppError(502, 'The AI response did not pass validation. Please try again.');
  if (answer.visual.kind !== 'none' && (answer.visual.labels.length < 2 || answer.visual.labels.length > 6)) throw new AppError(502, 'The AI response did not pass validation. Please try again.');
  return answer;
}

function demoShadowAi(message, image) {
  const hasImage = Boolean(image);
  return {
    answer: {
      title: hasImage ? 'Image-reference study response' : 'Study response',
      text: `You asked: ${message}\n\nDevelopment mode is active, so this is a structured placeholder. ${hasImage ? 'Your image reference was accepted by the secure chat pipeline. ' : ''}Add a Gemini API key for an AI-authored explanation, solution, and visual summary.`,
      visual: { kind: 'concept-map', title: 'How to study this', caption: 'A simple study sequence generated in development mode.', labels: ['Identify the question', 'Recall the core concept', 'Work step by step', 'Check the conclusion'] }
    },
    engine: 'demo'
  };
}

async function generateShadowAi(body) {
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > 8_000) throw new AppError(400, 'Enter a message of up to 8,000 characters.');
  const history = shadowAiHistory(body.history);
  const image = imageReference(body.image);
  if (!process.env.GEMINI_API_KEY) {
    if (process.env.DEMO_MODE === 'true') return demoShadowAi(message, image);
    throw new AppError(503, 'Shadow AI is not configured yet. Add GEMINI_API_KEY to the shared backend and restart it.');
  }
  const priorMessages = history.map((entry) => `${entry.role === 'assistant' ? 'Shadow AI' : 'Student'}: ${entry.content}`).join('\n');
  const imageInstruction = image ? 'An image reference is attached. Use it as context, describe only what can be supported by the image, and ask for a clearer image if it is unreadable.' : 'No image reference is attached.';
  const prompt = `You are Shadow AI, a clear, supportive academic study companion. Help the student understand, solve, revise, or interpret their question.\n\nConversation so far:\n${priorMessages || 'No prior messages.'}\n\nStudent's new message:\n${message}\n\n${imageInstruction}\n\nReturn only JSON matching the schema. Write a concise but useful answer in plain text with short paragraphs and numbered steps when solving a problem. Never invent details from an image. Decide whether a visual study summary would materially help: use visual.kind "none" with an empty labels array when it would not; otherwise choose "concept-map", "process", or "comparison" and provide 2–6 short labels. The visual is a diagram, not a generated photo.`;
  const parts = [{ text: prompt }];
  if (image) parts.push({ inlineData: image });
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts }], generationConfig: { temperature: .45, responseMimeType: 'application/json', responseSchema: shadowAiSchema } }), signal: AbortSignal.timeout(60_000) });
    if (!response.ok) throw new AppError(response.status === 429 ? 429 : response.status === 503 ? 503 : 502, response.status === 429 ? 'The AI service is busy. Please wait a moment and try again.' : response.status === 503 ? 'The AI service is temporarily unavailable. Please try again in a moment.' : 'Shadow AI could not prepare a response right now.');
    const answer = validateShadowAiAnswer(extractJson((await response.json())?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('')));
    return { answer, engine: 'gemini' };
  } catch (error) { throw error instanceof AppError ? error : new AppError(502, 'Shadow AI could not prepare a response right now.'); }
}

function plusMetadata(config, engine) {
  const { selection } = config;
  return { programme: selection.profile.programme, institution: selection.profile.institution, year: selection.year, semester: selection.semester, subject: selection.subject.name, course: selection.course.title, category: selection.category.name, subcategory: selection.subcategory.name, unit: selection.unit.name, chapter: selection.chapter.name, topic: selection.topic.name, subtopic: selection.subtopic, difficulty: config.difficulty, questionType: config.questionType, count: config.count, framework: selection.profile.source.title, engine };
}

const server = http.createServer(async (req, res) => {
  setCors(req, res);
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  if (req.method === 'GET' && req.url === '/health') { send(res, 200, { ok: true, service: 'shadow-study-api', services: ['shadow-board-exam', 'shadow-plus3'], aiConfigured: Boolean(process.env.GEMINI_API_KEY) }); return; }
  if (req.method !== 'POST' || !['/api/questions', '/api/plus3/questions', '/api/plus3/assist', '/api/shadow-ai/chat'].includes(req.url)) { send(res, 404, { message: 'This endpoint was not found.' }); return; }
  try {
    rateLimit(req);
    const body = await readBody(req, req.url === '/api/shadow-ai/chat' ? 4_500_000 : 50_000);
    if (req.url === '/api/questions') {
      const config = validateConfig(body);
      const generated = await generateWithGemini(config);
      send(res, 200, { metadata: metadata(config, generated.engine), questions: generated.questions });
    } else if (req.url === '/api/plus3/questions') {
      const config = validatePlusConfig(body);
      const generated = await generatePlusQuestions(config);
      send(res, 200, { metadata: plusMetadata(config, generated.engine), questions: generated.questions });
    } else if (req.url === '/api/plus3/assist') {
      const generated = await generateAssistant(body);
      send(res, 200, { metadata: { subject: generated.selection?.subject.name || 'B.Sc academic assistant', engine: generated.engine }, answer: generated.answer });
    } else {
      const generated = await generateShadowAi(body);
      send(res, 200, { metadata: { service: 'shadow-ai', engine: generated.engine }, answer: generated.answer });
    }
  } catch (error) {
    const status = error instanceof AppError ? error.status : 500;
    const message = error instanceof AppError ? error.message : 'Something went wrong while generating questions. Please try again.';
    send(res, status, { message });
  }
});

server.listen(port, () => console.log(`Shadow Board Exam backend listening on http://127.0.0.1:${port}`));
