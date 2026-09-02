import { curriculum, getClassCurriculum, getSubject, getCategory, getChapter } from '../data/curriculum/index.js';

const $ = (selector) => document.querySelector(selector);
const form = $('#generator-form');
const classSelect = $('#class-id');
const subjectSelect = $('#subject-id');
const categorySelect = $('#category-id');
const chapterSelect = $('#chapter-id');
const topicSelect = $('#topic');
const difficultySelect = $('#difficulty');
const typeSelect = $('#question-type');
const countSelect = $('#count');
const summary = $('#selection-summary');
const generateButton = $('#generate-button');
const statusMessage = $('#status-message');
const questionsSection = $('#questions');
const questionList = $('#question-list');
const setTitle = $('#set-title');
const setDescription = $('#set-description');
const quizStatus = $('#quiz-status');
const questionNav = $('#question-nav');
const progressBar = $('#progress-bar');
const progressText = $('#progress-text');
const quizControls = $('#quiz-controls');
const resultCard = $('#result-card');

const labels = {
  basic: 'Level 1 · Basic',
  intermediate: 'Level 2 · Intermediate',
  advanced: 'Level 3 · Advanced',
  expert: 'Level 4 · Expert',
  mcq: 'MCQ',
  'assertion-reasoning': 'Assertion & Reasoning',
  'match-following': 'Match the Following',
  'short-conceptual': 'Short & Conceptual'
};
const letters = ['A', 'B', 'C', 'D'];
let state = { config: null, response: null, mode: 'practice', active: 0, answers: {}, submitted: false };

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const choose = (items) => items[Math.floor(Math.random() * items.length)];
const shuffle = (items) => [...items].sort(() => Math.random() - .5);
const optionText = (select) => select.options[select.selectedIndex]?.text || '';
const currentMode = () => form.querySelector('input[name="mode"]:checked').value;

function clearSelect(select, prompt) {
  select.innerHTML = `<option value="">${prompt}</option>`;
  select.disabled = true;
}

function setOptions(select, items, placeholder, includeRandom = false) {
  select.disabled = false;
  select.innerHTML = `<option value="">${placeholder}</option>${includeRandom ? '<option value="random">Random</option>' : ''}${items.map((item) => `<option value="${escapeHtml(item.id ?? item)}">${escapeHtml(item.name ?? item)}</option>`).join('')}`;
}

function populateClasses() {
  setOptions(classSelect, curriculum.map((entry) => ({ id: entry.id, name: entry.label })), 'Select class');
  clearSelect(subjectSelect, 'Select class first');
  clearSelect(categorySelect, 'Select subject first');
  clearSelect(chapterSelect, 'Select category first');
  clearSelect(topicSelect, 'Select chapter first');
}

function updateSubjects() {
  const entry = getClassCurriculum(classSelect.value);
  clearSelect(categorySelect, 'Select subject first');
  clearSelect(chapterSelect, 'Select category first');
  clearSelect(topicSelect, 'Select chapter first');
  if (!entry) { clearSelect(subjectSelect, 'Select class first'); updateSummary(); return; }
  setOptions(subjectSelect, entry.subjects.filter((item) => item.active), 'Select subject');
  updateSummary();
}

function updateCategories() {
  const entry = getSubject(classSelect.value, subjectSelect.value);
  clearSelect(chapterSelect, 'Select category first');
  clearSelect(topicSelect, 'Select chapter first');
  if (!entry) { clearSelect(categorySelect, 'Select subject first'); updateSummary(); return; }
  setOptions(categorySelect, entry.categories.filter((item) => item.active), 'Select category');
  updateSummary();
}

function updateChapters() {
  const entry = getCategory(classSelect.value, subjectSelect.value, categorySelect.value);
  clearSelect(topicSelect, 'Select chapter first');
  if (!entry) { clearSelect(chapterSelect, 'Select category first'); updateSummary(); return; }
  setOptions(chapterSelect, entry.chapters.filter((item) => item.active), 'Select chapter', true);
  updateSummary();
}

function updateTopics() {
  const entry = getCategory(classSelect.value, subjectSelect.value, categorySelect.value);
  if (!entry) { clearSelect(topicSelect, 'Select chapter first'); updateSummary(); return; }
  if (chapterSelect.value === 'random') {
    setOptions(topicSelect, [], 'Select topic', true);
    topicSelect.value = 'random';
    updateSummary();
    return;
  }
  const chapter = getChapter(classSelect.value, subjectSelect.value, categorySelect.value, chapterSelect.value);
  if (!chapter) { clearSelect(topicSelect, 'Select chapter first'); updateSummary(); return; }
  setOptions(topicSelect, chapter.topics, 'Select topic', true);
  updateSummary();
}

function updateSummary() {
  if (!classSelect.value || !subjectSelect.value || !categorySelect.value || !chapterSelect.value || !topicSelect.value) {
    summary.textContent = 'Select a class, subject, category, chapter, and topic to begin.';
    return;
  }
  const chapterLabel = chapterSelect.value === 'random' ? 'Random active chapter' : optionText(chapterSelect);
  const topicLabel = topicSelect.value === 'random' ? 'Random active topic' : optionText(topicSelect);
  summary.textContent = `${optionText(classSelect)} · ${optionText(subjectSelect)} · ${optionText(categorySelect)} · ${chapterLabel} · ${topicLabel} · ${labels[difficultySelect.value]} · ${labels[typeSelect.value]} · ${countSelect.value} questions`;
}

function resolveRequestConfig() {
  const required = [classSelect.value, subjectSelect.value, categorySelect.value, chapterSelect.value, topicSelect.value];
  if (required.some((value) => !value)) return null;
  const category = getCategory(classSelect.value, subjectSelect.value, categorySelect.value);
  const chapter = chapterSelect.value === 'random' ? choose(category.chapters.filter((item) => item.active)) : getChapter(classSelect.value, subjectSelect.value, categorySelect.value, chapterSelect.value);
  const topic = topicSelect.value === 'random' ? choose(chapter.topics) : topicSelect.value;
  return {
    classId: classSelect.value,
    subjectId: subjectSelect.value,
    categoryId: categorySelect.value,
    chapterId: chapter.id,
    topic,
    difficulty: difficultySelect.value,
    questionType: typeSelect.value,
    count: Number(countSelect.value)
  };
}

function localApiBase() {
  const host = location.hostname;
  const isLoopback = ['localhost', '127.0.0.1', '::1'].includes(host);
  const isPrivateIpv4 = /^(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(host);
  if (!isLoopback && !isPrivateIpv4) return '';
  return `http://${host.includes(':') ? `[${host}]` : host}:3002`;
}

function apiUrl(path) {
  const configured = document.body.dataset.apiBase.trim();
  return `${(configured || localApiBase()).replace(/\/$/, '')}${path}`;
}

function showStatus(message, success = false) {
  statusMessage.hidden = false;
  statusMessage.textContent = message;
  statusMessage.classList.toggle('is-success', success);
}

function clearStatus() { statusMessage.hidden = true; statusMessage.textContent = ''; statusMessage.classList.remove('is-success'); }

function isValidQuestion(question, type) {
  if (!question || typeof question.question !== 'string' || !question.question.trim() || typeof question.answer !== 'string' || typeof question.explanation !== 'string') return false;
  if (type === 'mcq') return Array.isArray(question.options) && question.options.length === 4 && question.options.includes(question.answer);
  if (type === 'assertion-reasoning') return typeof question.assertion === 'string' && typeof question.reason === 'string' && Array.isArray(question.options) && question.options.length === 4 && question.options.includes(question.answer);
  if (type === 'match-following') return Array.isArray(question.matchPairs) && question.matchPairs.length === 4 && question.matchPairs.every((pair) => pair.left && pair.right);
  return true;
}

function validateResponse(payload, config) {
  if (!payload || !Array.isArray(payload.questions) || payload.questions.length !== config.count) return false;
  return payload.questions.every((question) => isValidQuestion(question, config.questionType));
}

async function requestQuestions(config) {
  const response = await fetch(apiUrl('/api/questions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  const responseText = await response.text();
  let payload;
  try { payload = JSON.parse(responseText); } catch {
    const hasConfiguredApi = Boolean(document.body.dataset.apiBase.trim() || localApiBase());
    throw new Error(hasConfiguredApi
      ? `The question service returned an invalid response (HTTP ${response.status}). Please restart the shared backend and try again.`
      : 'The question service is not configured for this hosted site. Set data-api-base to the deployed study API URL.');
  }
  if (!response.ok) throw new Error(payload?.message || 'The question service is unavailable. Please try again shortly.');
  if (!validateResponse(payload, config)) throw new Error('The generated questions did not pass validation. Please generate the set again.');
  return payload;
}

function numericalMarkup(question) {
  const numerical = question.numerical;
  if (!numerical?.given && !numerical?.formula && !numerical?.substitution && !numerical?.calculation && !numerical?.finalAnswer) return '';
  return `<div class="numerical-steps"><p><strong>Given:</strong> ${escapeHtml(numerical.given)}</p><p><strong>Formula:</strong> ${escapeHtml(numerical.formula)}</p><p><strong>Substitution:</strong> ${escapeHtml(numerical.substitution)}</p><p><strong>Calculation:</strong> ${escapeHtml(numerical.calculation)}</p><p><strong>Final answer:</strong> ${escapeHtml(numerical.finalAnswer)}</p></div>`;
}

function answerMarkup(question) {
  return `<div class="answer-panel"><p><strong>Answer:</strong> ${escapeHtml(question.answer)}</p><p><strong>Explanation:</strong> ${escapeHtml(question.explanation)}</p>${numericalMarkup(question)}</div>`;
}

function optionsMarkup(question, questionIndex) {
  const selectedAnswer = state.answers[questionIndex];
  return `<div class="option-list">${question.options.map((option, index) => `<button class="option-button ${selectedAnswer === option ? 'is-selected' : ''}" type="button" data-question="${questionIndex}" data-value="${escapeHtml(option)}" data-letter="${letters[index]}">${escapeHtml(option)}</button>`).join('')}</div>`;
}

function matchMarkup(question, questionIndex) {
  const savedAnswers = state.answers[questionIndex] && typeof state.answers[questionIndex] === 'object' ? state.answers[questionIndex] : {};
  const answers = shuffle(question.matchPairs.map((pair) => pair.right));
  return `<div class="match-grid">${question.matchPairs.map((pair, index) => `<label class="match-item"><span>${index + 1}. ${escapeHtml(pair.left)}</span><select data-match-question="${questionIndex}" data-match-left="${escapeHtml(pair.left)}" aria-label="Match answer ${index + 1}"><option value="">Select match</option>${answers.map((answer) => `<option value="${escapeHtml(answer)}" ${savedAnswers[pair.left] === answer ? 'selected' : ''}>${escapeHtml(answer)}</option>`).join('')}</select></label>`).join('')}</div>`;
}

function questionMarkup(question, index) {
  const config = state.config;
  const isAssertion = config.questionType === 'assertion-reasoning';
  const isMatch = config.questionType === 'match-following';
  const isShort = config.questionType === 'short-conceptual';
  const assertion = isAssertion ? `<div class="assertion-box"><p><strong>Assertion (A)</strong> ${escapeHtml(question.assertion)}</p><p><strong>Reason (R)</strong> ${escapeHtml(question.reason)}</p></div>` : '';
  const savedShortAnswer = typeof state.answers[index] === 'string' ? state.answers[index] : '';
  const response = isMatch ? matchMarkup(question, index) : isShort ? `<div class="short-response"><textarea data-short-question="${index}" aria-label="Your response for question ${index + 1}" placeholder="Write your answer here...">${escapeHtml(savedShortAnswer)}</textarea></div>` : optionsMarkup(question, index);
  const reveal = state.mode === 'practice' ? `<button class="button button-quiet reveal-answer" type="button" data-reveal="${index}">Show answer</button>` : '';
  return `<article class="question-card" data-card="${index}" ${state.mode === 'quiz' && index !== state.active ? 'hidden' : ''}><div class="question-meta"><span>Question ${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(labels[config.questionType])} · ${escapeHtml(labels[config.difficulty])}</span></div><h3>${escapeHtml(question.question)}</h3>${assertion}${response}${reveal}${answerMarkup(question)}</article>`;
}

function renderQuestionSet() {
  const { response, config } = state;
  questionList.innerHTML = response.questions.map(questionMarkup).join('');
  setTitle.textContent = `${optionText(classSelect)} ${optionText(subjectSelect)} practice`;
  setDescription.textContent = `${optionText(categorySelect)} · ${response.metadata.chapter} · ${response.metadata.topic} · ${labels[config.difficulty]} · ${labels[config.questionType]} · ${config.count} questions`;
  questionsSection.hidden = false;
  resultCard.hidden = true;
  quizStatus.hidden = state.mode !== 'quiz';
  quizControls.hidden = state.mode !== 'quiz';
  if (state.mode === 'quiz') renderQuizNavigation();
}

function renderQuizNavigation() {
  const total = state.response.questions.length;
  questionNav.innerHTML = Array.from({ length: total }, (_, index) => `<button type="button" data-go-question="${index}" class="${index === state.active ? 'is-current' : ''} ${state.answers[index] ? 'is-answered' : ''}" aria-label="Go to question ${index + 1}">${index + 1}</button>`).join('');
  const answered = Object.keys(state.answers).length;
  progressBar.style.width = `${((state.active + 1) / total) * 100}%`;
  progressText.textContent = `Question ${state.active + 1} of ${total} · ${answered} answered`;
  $('#previous-question').disabled = state.active === 0;
  $('#next-question').disabled = state.active === total - 1;
}

function recordAnswer(index, value) {
  state.answers[index] = value;
  if (state.mode === 'quiz') renderQuizNavigation();
}

function selectOption(button) {
  const index = Number(button.dataset.question);
  recordAnswer(index, button.dataset.value);
  button.closest('.question-card').querySelectorAll('.option-button').forEach((item) => item.classList.toggle('is-selected', item === button));
}

function checkShortResponse(text, answer) {
  const normalise = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  const expected = normalise(answer);
  const given = normalise(text);
  return given.length > 2 && (given.includes(expected) || expected.includes(given));
}

function isCorrect(question, answer) {
  if (!answer) return false;
  if (state.config.questionType === 'match-following') return question.matchPairs.every((pair) => answer[pair.left] === pair.right);
  if (state.config.questionType === 'short-conceptual') return checkShortResponse(answer, question.answer);
  return answer === question.answer;
}

function revealMarkedAnswers() {
  document.querySelectorAll('.question-card').forEach((card, index) => {
    card.classList.add('answers-visible');
    const question = state.response.questions[index];
    const answer = state.answers[index];
    if (state.config.questionType === 'mcq' || state.config.questionType === 'assertion-reasoning') {
      card.querySelectorAll('.option-button').forEach((button) => {
        const isAnswer = button.dataset.value === question.answer;
        button.classList.toggle('is-correct', isAnswer);
        button.classList.toggle('is-wrong', Boolean(answer) && button.dataset.value === answer && !isAnswer);
      });
    }
  });
}

function submitQuiz() {
  const total = state.response.questions.length;
  const correct = state.response.questions.reduce((score, question, index) => score + Number(isCorrect(question, state.answers[index])), 0);
  const wrong = total - correct;
  state.submitted = true;
  revealMarkedAnswers();
  $('#score-value').textContent = `${correct} / ${total}`;
  $('#percentage-value').textContent = `${Math.round((correct / total) * 100)}%`;
  $('#correct-value').textContent = correct;
  $('#wrong-value').textContent = wrong;
  resultCard.hidden = false;
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function generateQuestions() {
  const config = resolveRequestConfig();
  if (!config) { showStatus('Please complete the class, subject, category, chapter, and topic selections first.'); return; }
  clearStatus();
  generateButton.disabled = true;
  generateButton.innerHTML = 'Generating… <span>⌛</span>';
  try {
    const response = await requestQuestions(config);
    state = { config, response, mode: currentMode(), active: 0, answers: {}, submitted: false };
    renderQuestionSet();
    const demoNotice = response.metadata?.engine === 'demo' ? ' Demo mode is active; add a Gemini API key for AI-generated questions.' : '';
    showStatus(`Generated ${config.count} NCERT-focused questions.${demoNotice}`, true);
    questionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    showStatus(error.message || 'Questions could not be generated. Please try again.');
  } finally {
    generateButton.disabled = false;
    generateButton.innerHTML = 'Generate questions <span>→</span>';
  }
}

form.addEventListener('submit', (event) => { event.preventDefault(); generateQuestions(); });
classSelect.addEventListener('change', updateSubjects);
subjectSelect.addEventListener('change', updateCategories);
categorySelect.addEventListener('change', updateChapters);
chapterSelect.addEventListener('change', updateTopics);
[topicSelect, difficultySelect, typeSelect, countSelect].forEach((field) => field.addEventListener('change', updateSummary));

questionList.addEventListener('click', (event) => {
  const option = event.target.closest('.option-button');
  if (option) { selectOption(option); return; }
  const reveal = event.target.closest('[data-reveal]');
  if (reveal) { const card = reveal.closest('.question-card'); card.classList.toggle('answers-visible'); reveal.textContent = card.classList.contains('answers-visible') ? 'Hide answer' : 'Show answer'; }
});
questionList.addEventListener('input', (event) => { if (event.target.matches('[data-short-question]')) recordAnswer(Number(event.target.dataset.shortQuestion), event.target.value); });
questionList.addEventListener('change', (event) => {
  if (!event.target.matches('[data-match-question]')) return;
  const index = Number(event.target.dataset.matchQuestion);
  const matches = state.answers[index] && typeof state.answers[index] === 'object' ? state.answers[index] : {};
  matches[event.target.dataset.matchLeft] = event.target.value;
  recordAnswer(index, matches);
});
questionNav.addEventListener('click', (event) => {
  const button = event.target.closest('[data-go-question]');
  if (!button) return;
  state.active = Number(button.dataset.goQuestion);
  renderQuestionSet();
});
$('#previous-question').addEventListener('click', () => { if (state.active > 0) { state.active -= 1; renderQuestionSet(); } });
$('#next-question').addEventListener('click', () => { if (state.active < state.response.questions.length - 1) { state.active += 1; renderQuestionSet(); } });
$('#submit-quiz').addEventListener('click', submitQuiz);
$('#generate-again').addEventListener('click', generateQuestions);
$('#review-answers').addEventListener('click', () => { resultCard.hidden = true; document.querySelectorAll('.question-card').forEach((card) => card.hidden = false); revealMarkedAnswers(); questionList.scrollIntoView({ behavior: 'smooth', block: 'start' }); });

function printSet(answerKey) {
  document.body.classList.toggle('print-questions', !answerKey);
  document.body.classList.toggle('print-answer-key', answerKey);
  window.print();
  setTimeout(() => document.body.classList.remove('print-questions', 'print-answer-key'), 0);
}
$('#print-questions').addEventListener('click', () => printSet(false));
$('#print-answer-key').addEventListener('click', () => printSet(true));

$('#year').textContent = new Date().getFullYear();
populateClasses();
