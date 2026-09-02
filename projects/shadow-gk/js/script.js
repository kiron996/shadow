(() => {
  const categoryData = [
    { id: 'indian-gk', icon: '🇮🇳', name: 'Indian General Knowledge', subcategories: ['National Symbols', 'States & Capitals', 'Awards & Honours', 'Landmarks'], facts: [
      { s: 'National Symbols', q: 'Which is the national animal of India?', a: 'Bengal tiger', d: ['Asiatic lion', 'Indian elephant', 'Snow leopard'], e: 'The Bengal tiger is India’s national animal and a prominent national symbol.' },
      { s: 'States & Capitals', q: 'What is the capital city of Rajasthan?', a: 'Jaipur', d: ['Udaipur', 'Jodhpur', 'Bikaner'], e: 'Jaipur is the capital of Rajasthan and is widely known as the Pink City.' },
      { s: 'Awards & Honours', q: 'What is India’s highest civilian award?', a: 'Bharat Ratna', d: ['Padma Vibhushan', 'Padma Bhushan', 'Param Vir Chakra'], e: 'The Bharat Ratna is India’s highest civilian award.' },
      { s: 'Landmarks', q: 'In which city is the Taj Mahal located?', a: 'Agra', d: ['Delhi', 'Jaipur', 'Lucknow'], e: 'The Taj Mahal stands in Agra, Uttar Pradesh.' }
    ]},
    { id: 'polity', icon: '🏛️', name: 'Indian Constitution & Polity', subcategories: ['Preamble', 'Fundamental Rights', 'Parliament', 'Constitution'], facts: [
      { s: 'Preamble', q: 'The opening words of the Preamble to the Indian Constitution are:', a: 'We, the People of India', d: ['Liberty, Equality, Fraternity', 'Satyameva Jayate', 'Vande Mataram'], e: 'The Preamble begins with “We, the People of India”.' },
      { s: 'Fundamental Rights', q: 'Which article protects life and personal liberty in India?', a: 'Article 21', d: ['Article 14', 'Article 19', 'Article 32'], e: 'Article 21 protects life and personal liberty.' },
      { s: 'Parliament', q: 'Which house of Parliament is directly elected by the people?', a: 'Lok Sabha', d: ['Rajya Sabha', 'Legislative Council', 'Vidhan Parishad'], e: 'Members of the Lok Sabha are directly elected by citizens.' },
      { s: 'Constitution', q: 'On which date was the Constitution of India adopted?', a: '26 November 1949', d: ['15 August 1947', '26 January 1950', '2 October 1948'], e: 'The Constituent Assembly adopted the Constitution on 26 November 1949.' }
    ]},
    { id: 'history', icon: '📜', name: 'History', subcategories: ['Ancient India', 'Medieval India', 'Freedom Movement', 'Modern India'], facts: [
      { s: 'Ancient India', q: 'Which emperor embraced Buddhism after the Kalinga War?', a: 'Ashoka', d: ['Chandragupta Maurya', 'Harsha', 'Kanishka'], e: 'Emperor Ashoka embraced Buddhism after the Kalinga War.' },
      { s: 'Medieval India', q: 'Who began the construction of the Qutub Minar?', a: 'Qutb-ud-din Aibak', d: ['Iltutmish', 'Alauddin Khilji', 'Sher Shah Suri'], e: 'Qutb-ud-din Aibak began construction of the Qutub Minar.' },
      { s: 'Freedom Movement', q: 'In which year did the Dandi March take place?', a: '1930', d: ['1919', '1922', '1942'], e: 'Mahatma Gandhi led the Dandi March in 1930.' },
      { s: 'Modern India', q: 'In which year was the Indian National Congress founded?', a: '1885', d: ['1857', '1905', '1911'], e: 'The Indian National Congress was founded in 1885.' }
    ]},
    { id: 'geography', icon: '🌍', name: 'Geography', subcategories: ['Physical Geography', 'Indian Geography', 'Rivers & Water Bodies', 'World Geography'], facts: [
      { s: 'Physical Geography', q: 'Which mountain range forms India’s northern boundary?', a: 'The Himalayas', d: ['The Aravallis', 'The Vindhyas', 'The Satpuras'], e: 'The Himalayas form India’s northern mountain barrier.' },
      { s: 'Indian Geography', q: 'Which is the largest Indian state by area?', a: 'Rajasthan', d: ['Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh'], e: 'Rajasthan is India’s largest state by area.' },
      { s: 'Rivers & Water Bodies', q: 'The Bhagirathi, a headstream of the Ganga, rises from which glacier?', a: 'Gangotri Glacier', d: ['Siachen Glacier', 'Zemu Glacier', 'Pindari Glacier'], e: 'The Bhagirathi rises from the Gangotri Glacier.' },
      { s: 'World Geography', q: 'Which is the largest hot desert in the world?', a: 'Sahara Desert', d: ['Gobi Desert', 'Kalahari Desert', 'Arabian Desert'], e: 'The Sahara is the largest hot desert in the world.' }
    ]},
    { id: 'science', icon: '🔬', name: 'General Science', subcategories: ['Physics', 'Chemistry', 'Biology', 'Space Science'], facts: [
      { s: 'Physics', q: 'What is the SI unit of force?', a: 'Newton', d: ['Joule', 'Watt', 'Pascal'], e: 'Force is measured in newtons in the SI system.' },
      { s: 'Chemistry', q: 'A substance with pH below 7 is:', a: 'Acidic', d: ['Basic', 'Neutral', 'Saline'], e: 'A pH value below 7 indicates an acidic substance.' },
      { s: 'Biology', q: 'Which cell organelle is often called the powerhouse of the cell?', a: 'Mitochondrion', d: ['Nucleus', 'Ribosome', 'Vacuole'], e: 'Mitochondria release energy for cellular activities.' },
      { s: 'Space Science', q: 'Which planet is called the Red Planet?', a: 'Mars', d: ['Venus', 'Jupiter', 'Mercury'], e: 'Mars appears red because of iron oxide on its surface.' }
    ]},
    { id: 'economy', icon: '💰', name: 'Economy', subcategories: ['Economic Basics', 'Banking', 'Taxes & Budget', 'Indian Economy'], facts: [
      { s: 'Economic Basics', q: 'What does inflation generally mean?', a: 'A rise in the general price level', d: ['A fall in prices', 'A rise in exports only', 'A fixed exchange rate'], e: 'Inflation is a sustained rise in the general level of prices.' },
      { s: 'Banking', q: 'Which institution is India’s central bank?', a: 'Reserve Bank of India', d: ['State Bank of India', 'SEBI', 'NABARD'], e: 'The Reserve Bank of India is the country’s central bank.' },
      { s: 'Taxes & Budget', q: 'Income tax is an example of which kind of tax?', a: 'Direct tax', d: ['Indirect tax', 'Customs duty', 'Cess only'], e: 'Income tax is paid directly by the person or organisation on whom it is imposed.' },
      { s: 'Indian Economy', q: 'GST is primarily classified as which kind of tax?', a: 'Indirect tax', d: ['Direct tax', 'Property tax', 'Corporate tax'], e: 'Goods and Services Tax is an indirect tax on the supply of goods and services.' }
    ]},
    { id: 'current-affairs', icon: '📰', name: 'Current Affairs', subcategories: ['National Updates', 'International News', 'Awards & Appointments', 'Sports & Events'], facts: [
      { s: 'National Updates', q: 'Which source is best for verifying a newly announced Government of India policy?', a: 'An official government release', d: ['An unverified social-media post', 'An old textbook', 'A forwarded message'], e: 'Official government releases are a reliable starting point for current policy announcements.' },
      { s: 'International News', q: 'Which type of source is most suitable for checking a developing international event?', a: 'A current, reputable news report', d: ['An undated blog post', 'A random comment', 'An old quiz key'], e: 'Current affairs should always be checked against timely, reputable reporting.' },
      { s: 'Awards & Appointments', q: 'What should a learner check when preparing a question about a recent appointment?', a: 'The latest official announcement', d: ['Only a previous year’s guide', 'An unrelated biography', 'A guessed answer'], e: 'Appointments change, so current official information matters.' },
      { s: 'Sports & Events', q: 'Why should recent sports-event questions be refreshed regularly?', a: 'Results and records can change', d: ['Sports rules never change', 'Events have no dates', 'Old results are always current'], e: 'Current affairs questions need regular updates because events and results change.' }
    ]},
    { id: 'ncc-defence', icon: '🪖', name: 'NCC & Defence', subcategories: ['NCC Basics', 'Ranks & Values', 'Indian Armed Forces', 'Defence Awareness'], facts: [
      { s: 'NCC Basics', q: 'What is the motto of the National Cadet Corps?', a: 'Unity and Discipline', d: ['Service Before Self', 'Truth Alone Triumphs', 'Knowledge is Power'], e: 'The NCC motto is “Unity and Discipline”.' },
      { s: 'Ranks & Values', q: 'Which quality is strongly developed through NCC training?', a: 'Discipline', d: ['Carelessness', 'Isolation', 'Indifference'], e: 'NCC training emphasises discipline, leadership, service, and teamwork.' },
      { s: 'Indian Armed Forces', q: 'Which service protects India’s maritime interests?', a: 'Indian Navy', d: ['Indian Army', 'Indian Air Force', 'National Cadet Corps'], e: 'The Indian Navy protects maritime interests and operates at sea.' },
      { s: 'Defence Awareness', q: 'What is the highest rank in the Indian Army?', a: 'Field Marshal', d: ['General', 'Lieutenant General', 'Major General'], e: 'Field Marshal is the highest rank in the Indian Army.' }
    ]},
    { id: 'sports', icon: '🏆', name: 'Sports', subcategories: ['Indian Sports', 'Major Tournaments', 'Olympics', 'Sports Awards'], facts: [
      { s: 'Indian Sports', q: 'Which sport is played with a shuttlecock?', a: 'Badminton', d: ['Tennis', 'Cricket', 'Hockey'], e: 'Badminton is played using a shuttlecock and racquets.' },
      { s: 'Major Tournaments', q: 'How many overs does each side normally face in a One Day International cricket match?', a: '50 overs', d: ['20 overs', '60 overs', '90 overs'], e: 'A standard ODI match gives each side 50 overs.' },
      { s: 'Olympics', q: 'What do the five Olympic rings represent?', a: 'The union of five inhabited continents', d: ['Five Olympic sports', 'Five host cities', 'Five medals'], e: 'The rings symbolise the union of the five inhabited continents.' },
      { s: 'Sports Awards', q: 'Which is India’s highest sporting honour?', a: 'Major Dhyan Chand Khel Ratna Award', d: ['Arjuna Award', 'Dronacharya Award', 'Padma Shri'], e: 'The Major Dhyan Chand Khel Ratna Award is India’s highest sporting honour.' }
    ]},
    { id: 'art-culture', icon: '🎭', name: 'Art & Culture', subcategories: ['Classical Dance', 'Festivals', 'Heritage', 'Music & Literature'], facts: [
      { s: 'Classical Dance', q: 'Bharatanatyam is a classical dance form associated with which state?', a: 'Tamil Nadu', d: ['Odisha', 'Kerala', 'Assam'], e: 'Bharatanatyam developed in Tamil Nadu.' },
      { s: 'Festivals', q: 'Which festival is widely known as the festival of lights?', a: 'Diwali', d: ['Holi', 'Onam', 'Baisakhi'], e: 'Diwali is widely celebrated as the festival of lights.' },
      { s: 'Heritage', q: 'The Sun Temple at Konark is located in which state?', a: 'Odisha', d: ['West Bengal', 'Andhra Pradesh', 'Tamil Nadu'], e: 'The UNESCO-listed Sun Temple is in Konark, Odisha.' },
      { s: 'Music & Literature', q: 'Which instrument is traditionally associated with the sitar family of Indian classical music?', a: 'String instrument', d: ['Wind instrument', 'Percussion instrument', 'Keyboard instrument'], e: 'The sitar is a plucked string instrument used in Indian classical music.' }
    ]},
    { id: 'world-gk', icon: '🌐', name: 'World GK', subcategories: ['Countries & Capitals', 'International Organisations', 'World Landmarks', 'Environment'], facts: [
      { s: 'Countries & Capitals', q: 'What is the capital of Japan?', a: 'Tokyo', d: ['Kyoto', 'Osaka', 'Hiroshima'], e: 'Tokyo is the capital of Japan.' },
      { s: 'International Organisations', q: 'Where is the headquarters of the United Nations located?', a: 'New York City', d: ['Geneva', 'Paris', 'London'], e: 'The United Nations headquarters is in New York City.' },
      { s: 'World Landmarks', q: 'In which city is the Eiffel Tower located?', a: 'Paris', d: ['Rome', 'Madrid', 'Berlin'], e: 'The Eiffel Tower is one of Paris’s best-known landmarks.' },
      { s: 'Environment', q: 'Which is the largest ocean on Earth?', a: 'Pacific Ocean', d: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'], e: 'The Pacific Ocean is Earth’s largest ocean.' }
    ]},
    { id: 'reasoning', icon: '🧩', name: 'Reasoning & Aptitude', subcategories: ['Number Series', 'Logical Reasoning', 'Verbal Reasoning', 'Coding & Decoding'], facts: [
      { s: 'Number Series', q: 'What is the next number in the series: 2, 6, 12, 20, ?', a: '30', d: ['24', '28', '32'], e: 'The differences are +4, +6, +8, so the next difference is +10.' },
      { s: 'Logical Reasoning', q: 'Book is to Reading as Fork is to:', a: 'Eating', d: ['Writing', 'Walking', 'Painting'], e: 'A book is used for reading; a fork is used for eating.' },
      { s: 'Verbal Reasoning', q: 'Which word is the odd one out: Apple, Mango, Carrot, Banana?', a: 'Carrot', d: ['Apple', 'Mango', 'Banana'], e: 'Carrot is a vegetable; the others are fruits.' },
      { s: 'Coding & Decoding', q: 'If CAT is coded as DBU, how is DOG coded in the same pattern?', a: 'EPH', d: ['DNG', 'FOH', 'EOG'], e: 'Each letter is shifted forward by one: D→E, O→P, G→H.' }
    ]}
  ];

  const letters = ['A', 'B', 'C', 'D'];
  const labels = { mcq: 'Multiple choice', 'assertion-reasoning': 'Assertion & reasoning', 'short-answer': 'Short answer', 'match-following': 'Match the following' };
  const categorySelect = document.querySelector('#category');
  const subcategorySelect = document.querySelector('#subcategory');
  const levelSelect = document.querySelector('#level');
  const typeSelect = document.querySelector('#question-type');
  const countSelect = document.querySelector('#question-count');
  const form = document.querySelector('#quiz-form');
  const summary = document.querySelector('#selection-summary');
  const output = document.querySelector('#quiz-output');
  const title = document.querySelector('#quiz-title');
  const description = document.querySelector('#quiz-description');
  const questionsList = document.querySelector('#questions-list');
  const categoryGrid = document.querySelector('#category-grid');
  const progressText = document.querySelector('#quiz-progress-text');
  const progressBar = document.querySelector('#quiz-progress-bar');
  const showAnswersButton = document.querySelector('#show-answers');
  const newQuizButton = document.querySelector('#new-quiz');
  let currentQuiz = [];
  let answersVisible = false;
  let previousQuizSignature = '';
  let generationRound = 0;

  const getCategory = () => categoryData.find((category) => category.id === categorySelect.value) || categoryData[0];
  const shuffle = (items) => [...items].sort(() => crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 - .5);
  const esc = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));

  function populateCategories() {
    categorySelect.innerHTML = categoryData.map((category) => `<option value="${category.id}">${category.icon} ${category.name}</option>`).join('');
    updateSubcategories();
    categoryGrid.innerHTML = categoryData.map((category) => `<article class="category-card"><span aria-hidden="true">${category.icon}</span><h3>${category.name}</h3><p>${category.subcategories.join(' · ')}</p><button type="button" data-category="${category.id}">Build a quiz →</button></article>`).join('');
  }

  function updateSubcategories() {
    const category = getCategory();
    subcategorySelect.innerHTML = `<option value="all">All ${category.name} topics</option>${category.subcategories.map((sub) => `<option value="${esc(sub)}">${esc(sub)}</option>`).join('')}`;
    updateSummary();
  }

  function updateSummary() {
    const category = getCategory();
    const subcategory = subcategorySelect.value === 'all' ? 'All topics' : subcategorySelect.value;
    summary.textContent = `${category.name} · ${subcategory} · ${levelSelect.options[levelSelect.selectedIndex].text} · ${labels[typeSelect.value]} · ${countSelect.value} questions`;
  }

  function buildQuestion(fact, type, index, category, variant) {
    const questionPrompts = [
      fact.q,
      `For ${fact.s}, select the correct answer: ${fact.q}`,
      `Check your ${fact.s} knowledge. ${fact.q}`,
      `Which option best completes this ${fact.s} question? ${fact.q}`,
      `Identify the accurate response for ${fact.s}: ${fact.q}`,
      `Quick recall: ${fact.q}`,
      `Focus on ${fact.s}. ${fact.q}`,
      `Challenge question: ${fact.q}`
    ];
    const wording = questionPrompts[variant % questionPrompts.length];
    if (type === 'mcq') {
      const options = shuffle([fact.a, ...fact.d]);
      return { type, fact, heading: wording, options, correct: fact.a };
    }
    if (type === 'assertion-reasoning') {
      const assertions = [
        `“${fact.a}” is the correct answer to: ${fact.q}`,
        `Under ${fact.s}, “${fact.a}” is a correct association.`,
        `The fact “${fact.a}” is relevant to this question: ${fact.q}`,
        `For ${fact.s}, the answer “${fact.a}” is accurate.`
      ];
      return { type, fact, heading: 'Choose the correct relationship between the Assertion and Reason.', assertion: assertions[variant % assertions.length], reason: fact.e, options: ['Both Assertion and Reason are true, and Reason correctly explains Assertion.', 'Both Assertion and Reason are true, but Reason does not explain Assertion.', 'Assertion is true, but Reason is false.', 'Assertion is false, but Reason is true.'], correct: 'Both Assertion and Reason are true, and Reason correctly explains Assertion.' };
    }
    if (type === 'short-answer') {
      const prompts = [`Answer briefly: ${fact.q}`, `Write the correct answer: ${fact.q}`, `In one or two words, respond: ${fact.q}`, `Recall this ${fact.s} fact: ${fact.q}`];
      return { type, fact, heading: prompts[variant % prompts.length], correct: fact.a };
    }
    const matchFacts = shuffle(category.facts).slice(0, 4);
    return { type, fact, heading: 'Match each topic with its correct answer.', pairs: matchFacts.map((item) => ({ left: item.q.replace(/\?$/, ''), right: item.a })) };
  }

  function createQuiz() {
    const category = getCategory();
    const selectedSubcategory = subcategorySelect.value;
    const pool = selectedSubcategory === 'all' ? category.facts : category.facts.filter((fact) => fact.s === selectedSubcategory);
    const source = pool.length ? pool : category.facts;
    const count = Number(countSelect.value);
    let nextQuiz = [];
    let nextSignature = '';
    let attempts = 0;
    do {
      generationRound += 1;
      const facts = shuffle(source);
      const variants = shuffle(Array.from({ length: 8 }, (_, index) => index));
      nextQuiz = Array.from({ length: count }, (_, index) => buildQuestion(facts[index % facts.length], typeSelect.value, index, category, variants[(index + generationRound) % variants.length]));
      nextSignature = JSON.stringify(nextQuiz.map((question) => ({ heading: question.heading, assertion: question.assertion, options: question.options, pairs: question.pairs })));
      attempts += 1;
    } while (nextSignature === previousQuizSignature && attempts < 4);
    currentQuiz = nextQuiz;
    previousQuizSignature = nextSignature;
    answersVisible = false;
    output.hidden = false;
    title.textContent = `${category.name} quiz`;
    description.textContent = `${selectedSubcategory === 'all' ? 'Mixed topics' : selectedSubcategory} · ${levelSelect.options[levelSelect.selectedIndex].text} level · ${labels[typeSelect.value]} · ${count} randomized questions`;
    renderQuestions();
    output.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function optionMarkup(option, questionIndex, correct) {
    const letter = letters[questionIndex % letters.length];
    return `<button class="quiz-option" type="button" data-answer="${esc(option)}" data-correct="${option === correct}" data-letter="${letter}">${esc(option)}</button>`;
  }

  function renderQuestion(question, index) {
    const category = getCategory();
    const subcategory = question.fact.s;
    let body = '';
    if (question.type === 'mcq' || question.type === 'assertion-reasoning') {
      const assertion = question.type === 'assertion-reasoning' ? `<div class="assertion-box"><p><strong>Assertion</strong> ${esc(question.assertion)}</p><p><strong>Reason</strong> ${esc(question.reason)}</p></div>` : '';
      body = `${assertion}<div class="options">${question.options.map((option, optionIndex) => optionMarkup(option, optionIndex, question.correct)).join('')}</div><div class="answer-panel"><strong>Answer:</strong> ${esc(question.correct)}<br>${esc(question.fact.e)}</div>`;
    } else if (question.type === 'short-answer') {
      body = `<div class="short-answer-wrap"><input type="text" aria-label="Your answer for question ${index + 1}" placeholder="Write your answer"><button class="button button-quiet mark-short" type="button">Mark attempted</button></div><div class="answer-panel"><strong>Suggested answer:</strong> ${esc(question.correct)}<br>${esc(question.fact.e)}</div>`;
    } else {
      const choices = shuffle(question.pairs.map((pair) => pair.right));
      body = `<div class="match-grid">${question.pairs.map((pair, matchIndex) => `<label class="match-item"><span>${esc(pair.left)}</span><select aria-label="Match answer ${matchIndex + 1}"><option value="">Select answer</option>${choices.map((choice) => `<option value="${esc(choice)}">${esc(choice)}</option>`).join('')}</select></label>`).join('')}</div><div class="answer-panel"><strong>Answers:</strong> ${question.pairs.map((pair) => `${esc(pair.left)} — ${esc(pair.right)}`).join(' · ')}</div>`;
    }
    return `<article class="question-card" data-question="${index}"><div class="question-topline"><span>Question ${String(index + 1).padStart(2, '0')}</span><span>${esc(subcategory)} · ${esc(labels[question.type])}</span></div><h3>${esc(question.heading)}</h3>${body}</article>`;
  }

  function renderQuestions() {
    questionsList.classList.toggle('answers-visible', answersVisible);
    questionsList.innerHTML = currentQuiz.map((question, index) => renderQuestion(question, index)).join('');
    showAnswersButton.textContent = answersVisible ? 'Hide answers' : 'Show answers';
    updateProgress();
  }

  function updateProgress() {
    const cards = [...questionsList.querySelectorAll('.question-card')];
    const attempted = cards.filter((card) => card.dataset.answered === 'true').length;
    progressText.textContent = `${attempted} of ${currentQuiz.length} answered`;
    progressBar.style.width = `${currentQuiz.length ? attempted / currentQuiz.length * 100 : 0}%`;
  }

  categorySelect.addEventListener('change', updateSubcategories);
  [subcategorySelect, levelSelect, typeSelect, countSelect].forEach((select) => select.addEventListener('change', updateSummary));
  form.addEventListener('submit', (event) => { event.preventDefault(); createQuiz(); });
  newQuizButton.addEventListener('click', createQuiz);
  showAnswersButton.addEventListener('click', () => { answersVisible = !answersVisible; questionsList.classList.toggle('answers-visible', answersVisible); showAnswersButton.textContent = answersVisible ? 'Hide answers' : 'Show answers'; });
  questionsList.addEventListener('click', (event) => {
    const option = event.target.closest('.quiz-option');
    if (!option) {
      const mark = event.target.closest('.mark-short');
      if (mark) { mark.closest('.question-card').dataset.answered = 'true'; mark.textContent = 'Marked attempted'; updateProgress(); }
      return;
    }
    const card = option.closest('.question-card');
    card.querySelectorAll('.quiz-option').forEach((item) => item.classList.remove('is-selected'));
    option.classList.add('is-selected');
    card.dataset.answered = 'true';
    if (answersVisible) { card.querySelectorAll('.quiz-option').forEach((item) => item.classList.toggle('is-correct', item.dataset.correct === 'true')); option.classList.toggle('is-wrong', option.dataset.correct !== 'true'); }
    updateProgress();
  });
  questionsList.addEventListener('change', (event) => { if (event.target.matches('.match-item select') || event.target.matches('.short-answer-wrap input')) { event.target.closest('.question-card').dataset.answered = 'true'; updateProgress(); } });
  categoryGrid.addEventListener('click', (event) => { const button = event.target.closest('[data-category]'); if (!button) return; categorySelect.value = button.dataset.category; updateSubcategories(); document.querySelector('#quiz-builder').scrollIntoView({ behavior: 'smooth', block: 'start' }); });

  document.querySelector('#year').textContent = new Date().getFullYear();
  populateCategories();
})();
