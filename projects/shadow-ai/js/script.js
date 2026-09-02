(() => {
  const $ = (selector) => document.querySelector(selector);
  const storageKey = 'shadow-ai-chats-v1';
  const maxImageBytes = 3 * 1024 * 1024;
  const list = $('#message-list');
  const input = $('#chat-input');
  const form = $('#chat-form');
  const imageInput = $('#image-input');
  const preview = $('#attachment-preview');
  const status = $('#composer-status');
  const historyList = $('#chat-history');
  const title = $('#chat-title');
  const voiceButton = $('#voice-input');
  let attachment = null;
  let recognition = null;
  let state = { chats: loadChats(), currentId: null, waiting: false };

  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const api = (path) => { const base = document.body.dataset.apiBase.trim(); return base ? `${base.replace(/\/$/, '')}${path}` : ['localhost', '127.0.0.1'].includes(location.hostname) ? `http://127.0.0.1:3002${path}` : path; };
  const current = () => state.chats.find((chat) => chat.id === state.currentId);
  const formatDate = (date) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(date));
  const contentTitle = (content) => String(content || 'New conversation').replace(/\s+/g, ' ').trim().slice(0, 42) || 'New conversation';

  function loadChats() { try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(saved) ? saved.filter((chat) => chat && Array.isArray(chat.messages)).slice(0, 30) : []; } catch { return []; } }
  function saveChats() { try { localStorage.setItem(storageKey, JSON.stringify(state.chats.slice(0, 30).map((chat) => ({ ...chat, messages: chat.messages.map(({ attachmentData, ...message }) => message) })))); } catch { showStatus('This browser could not save chat history.'); } }
  function showStatus(message) { status.hidden = false; status.textContent = message; }
  function clearStatus() { status.hidden = true; status.textContent = ''; }
  function resizeInput() { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 220)}px`; }

  function newChat() {
    const chat = { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, title: 'New conversation', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messages: [] };
    state.chats.unshift(chat); state.currentId = chat.id; clearAttachment(); input.value = ''; resizeInput(); saveChats(); render(); input.focus();
  }
  function renderHistory() { historyList.innerHTML = state.chats.map((chat) => `<button class="history-item ${chat.id === state.currentId ? 'is-active' : ''}" type="button" data-chat-id="${escapeHtml(chat.id)}"><b>${escapeHtml(chat.title)}</b><span>${formatDate(chat.updatedAt)}</span></button>`).join('') || '<p class="history-note">Your saved chats will appear here.</p>'; }
  function textMarkup(value) { return escapeHtml(value).split(/\n{2,}/).map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join(''); }
  function visualImage(visual) {
    if (!visual || visual.kind === 'none' || !Array.isArray(visual.labels) || visual.labels.length < 2) return '';
    const labels = visual.labels.slice(0, 6); const positions = [[250,64],[404,132],[404,270],[250,337],[96,270],[96,132]];
    const nodes = labels.map((label, index) => { const [x, y] = positions[index]; const safe = escapeHtml(label).slice(0, 48); return `<g><line x1="250" y1="200" x2="${x}" y2="${y}" stroke="#ef5148" stroke-width="2" opacity=".7"/><rect x="${x - 68}" y="${y - 24}" width="136" height="48" rx="8" fill="#1b1b24" stroke="#5d5b66"/><text x="${x}" y="${y + 5}" fill="#f7f5f1" text-anchor="middle" font-family="Arial,sans-serif" font-size="12">${safe}</text></g>`; }).join('');
    const center = escapeHtml(visual.title || 'Study visual').slice(0, 44);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" role="img" aria-label="${center}"><rect width="500" height="400" fill="#101015"/><circle cx="250" cy="200" r="64" fill="#311a1c" stroke="#ef5148" stroke-width="2"/><text x="250" y="195" fill="#fff" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="700">${center}</text><text x="250" y="217" fill="#ffb4ae" text-anchor="middle" font-family="Arial,sans-serif" font-size="11">${escapeHtml(visual.kind || 'concept map')}</text>${nodes}</svg>`;
    return `<figure class="visual-card"><img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}" alt="${center} study diagram"><p>${escapeHtml(visual.caption || 'A visual summary generated from this response.')}</p></figure>`;
  }
  function messageMarkup(message) { const attachmentMarkup = message.attachmentData ? `<div class="message-attachment"><img src="${message.attachmentData}" alt="Attached reference image"></div>` : ''; const heading = message.role === 'assistant' && message.title ? `<h3 class="assistant-title">${escapeHtml(message.title)}</h3>` : ''; return `<article class="message ${message.role}"><p class="message-role">${message.role === 'assistant' ? 'Shadow AI' : 'You'}</p><div class="message-body">${heading}${textMarkup(message.content)}${attachmentMarkup}${message.role === 'assistant' ? visualImage(message.visual) : ''}</div></article>`; }
  function welcomeMarkup() { return '<section class="welcome-card" id="welcome-card"><p class="eyebrow"><i></i> Text · voice · image reference</p><h2>What are you<br><em>working through?</em></h2><p>Ask for a clear explanation, solve a problem step by step, or attach a diagram, question sheet, or image as context.</p><div class="capability-grid"><button type="button" class="prompt-chip" data-prompt="Explain this topic in simple steps."><span>01</span> Explain a concept</button><button type="button" class="prompt-chip" data-prompt="Help me solve this problem step by step."><span>02</span> Solve a problem</button><button type="button" class="prompt-chip" data-prompt="Create short revision notes with important points."><span>03</span> Make revision notes</button></div></section>'; }
  function renderMessages() { const chat = current(); const messages = chat?.messages || []; list.innerHTML = messages.length ? messages.map(messageMarkup).join('') : welcomeMarkup(); if (state.waiting) list.insertAdjacentHTML('beforeend', '<article class="message"><p class="message-role">Shadow AI</p><div class="message-body typing" aria-label="Shadow AI is thinking"><i></i><i></i><i></i></div></article>'); title.textContent = chat?.title || 'New conversation'; }
  function render() { renderHistory(); renderMessages(); }
  function clearAttachment() { attachment = null; imageInput.value = ''; preview.hidden = true; preview.innerHTML = ''; }
  function renderAttachment() { if (!attachment) { clearAttachment(); return; } preview.hidden = false; preview.innerHTML = `<img src="${attachment.dataUrl}" alt="Image reference preview"><p><b>${escapeHtml(attachment.name)}</b><br>${Math.ceil(attachment.size / 1024)} KB image reference</p><button class="remove-attachment" type="button" aria-label="Remove image reference">×</button>`; }
  function chatHistoryForApi(chat) { return chat.messages.filter((message) => message.role === 'user' || message.role === 'assistant').slice(-10).map((message) => ({ role: message.role, content: message.content })); }

  async function sendMessage() {
    const chat = current(); const content = input.value.trim() || (attachment ? 'Please analyze the attached image reference.' : ''); if (!content || state.waiting) return;
    clearStatus(); const image = attachment; const priorHistory = chatHistoryForApi(chat);
    chat.messages.push({ role: 'user', content, attachmentData: image?.dataUrl || '', createdAt: new Date().toISOString() }); chat.title = chat.messages.length === 1 ? contentTitle(content) : chat.title; chat.updatedAt = new Date().toISOString(); input.value = ''; resizeInput(); clearAttachment(); state.waiting = true; render(); list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    try {
      const response = await fetch(api('/api/shadow-ai/chat'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: content, history: priorHistory, image: image ? { dataUrl: image.dataUrl, name: image.name } : null }) });
      const payload = await response.json().catch(() => null); if (!response.ok || !payload?.answer?.text) throw new Error(payload?.message || 'Shadow AI could not prepare a response.');
      chat.messages.push({ role: 'assistant', content: payload.answer.text, title: payload.answer.title, visual: payload.answer.visual, createdAt: new Date().toISOString() }); chat.updatedAt = new Date().toISOString(); saveChats();
    } catch (error) { showStatus(error instanceof TypeError ? 'Shadow AI cannot reach the local study service. Start the backend, then refresh this page.' : error.message || 'Shadow AI is unavailable. Please try again.'); }
    finally { state.waiting = false; render(); list.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { showStatus('Voice input is not available in this browser. You can still type your message.'); return; }
    if (recognition) { recognition.stop(); return; }
    recognition = new SpeechRecognition(); recognition.lang = navigator.language || 'en-IN'; recognition.interimResults = true; recognition.continuous = false; let finalText = '';
    voiceButton.classList.add('is-recording'); voiceButton.setAttribute('aria-pressed', 'true'); voiceButton.innerHTML = '<span aria-hidden="true">●</span> Listening…';
    recognition.onresult = (event) => { let transcript = ''; for (let index = event.resultIndex; index < event.results.length; index += 1) { transcript += event.results[index][0].transcript; if (event.results[index].isFinal) finalText += event.results[index][0].transcript; } input.value = `${input.value.trim()} ${finalText || transcript}`.trim(); resizeInput(); };
    recognition.onerror = (event) => { if (event.error !== 'aborted') showStatus(event.error === 'not-allowed' ? 'Microphone access was not allowed. Enable it to use voice input.' : 'Voice input could not be completed. Please try again.'); };
    recognition.onend = () => { recognition = null; voiceButton.classList.remove('is-recording'); voiceButton.setAttribute('aria-pressed', 'false'); voiceButton.innerHTML = '<span aria-hidden="true">◉</span> Voice'; }; recognition.start();
  }

  imageInput.addEventListener('change', () => { const file = imageInput.files?.[0]; if (!file) return; if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { showStatus('Choose a PNG, JPEG, or WebP image.'); clearAttachment(); return; } if (file.size > maxImageBytes) { showStatus('Choose an image smaller than 3 MB.'); clearAttachment(); return; } const reader = new FileReader(); reader.onload = () => { attachment = { dataUrl: String(reader.result), name: file.name, size: file.size }; renderAttachment(); }; reader.onerror = () => showStatus('This image could not be read. Please choose another file.'); reader.readAsDataURL(file); });
  form.addEventListener('submit', (event) => { event.preventDefault(); sendMessage(); }); input.addEventListener('input', resizeInput); input.addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }); voiceButton.addEventListener('click', startVoice); preview.addEventListener('click', (event) => { if (event.target.closest('.remove-attachment')) clearAttachment(); }); $('#new-chat').addEventListener('click', newChat); $('#clear-chat').addEventListener('click', () => { const chat = current(); if (!chat || !chat.messages.length) return; chat.messages = []; chat.title = 'New conversation'; chat.updatedAt = new Date().toISOString(); saveChats(); render(); }); historyList.addEventListener('click', (event) => { const button = event.target.closest('[data-chat-id]'); if (!button) return; state.currentId = button.dataset.chatId; clearStatus(); render(); }); list.addEventListener('click', (event) => { const chip = event.target.closest('[data-prompt]'); if (!chip) return; input.value = chip.dataset.prompt; resizeInput(); input.focus(); });
  if (state.chats.length) state.currentId = state.chats[0].id; else newChat(); render(); resizeInput();
})();
