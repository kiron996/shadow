(() => {
  const projects = [
    {
      name: 'Shadow AI',
      type: 'learning',
      category: 'AI learning assistant',
      description: 'A text, voice, and image-reference study companion with private local chat history.',
      image: 'images/shadow-ai-logo.png',
      link: 'projects/shadow-ai/index.html',
      status: 'Live now',
      building: false,
    },
    {
      name: 'Shadow GK',
      type: 'learning',
      category: 'General knowledge',
      description: 'A quiz-focused experience for turning curiosity into an easy, repeatable learning habit.',
      image: 'images/shadow-gk-logo.png',
      link: 'projects/shadow-gk/index.html',
      status: 'In development',
      building: true,
    },
    {
      name: 'Shadow Digital Point',
      type: 'digital',
      category: 'Digital services',
      description: 'A central place for practical digital services and support when they are needed most.',
      image: 'images/shadow-digital-point-logo.png',
      link: 'pages/projects.html#shadow-digital-point',
      status: 'Exploring',
      building: false,
    },
    {
      name: 'Shadow Plus+',
      type: 'learning',
      category: 'Higher education',
      description: 'An AI-powered B.Sc study hub for science learning, problem solving, and exam preparation.',
      image: 'images/shadow-plus+.png',
      link: 'projects/shadow-plus3/index.html',
      status: 'In development',
      building: true,
    },
    {
      name: 'Shadow Exam Prep',
      type: 'learning',
      category: 'Exam preparation',
      description: 'A dedicated study space being shaped for JEE, JEE Advanced, and NEET aspirants.',
      image: 'images/shadow-exam-prep.png',
      link: 'projects/shadow-exam-prep/index.html',
      status: 'In development',
      building: true,
    },
    {
      name: 'Shadow Board Exam',
      type: 'learning',
      category: 'School learning',
      description: 'An updated NCERT practice companion for Classes 9 to 12, with focused question sets and clearer service feedback.',
      image: 'images/shadow-board-exam.png',
      link: 'projects/shadow-board-exam/index.html',
      status: 'Updated',
      building: false,
    },
  ];

  const grid = document.querySelector('#project-grid');
  const buttons = document.querySelectorAll('[data-filter]');
  if (!grid) return;

  grid.innerHTML = projects.map((project) => `
    <article class="project-card" data-type="${project.type}">
      <a href="${project.link}" aria-label="View ${project.name}">
        <div class="project-image">
          <img src="${project.image}" alt="${project.name} logo" loading="lazy" width="1200" height="1200">
          <span class="project-meta"><i class="status-dot ${project.building ? 'building' : ''}"></i>${project.status}</span>
        </div>
        <div class="project-info">
          <p class="section-label">${project.category}</p>
          <h3>${project.name}</h3>
          <p>${project.description}</p>
          <div class="project-footer"><span>View project</span><span aria-hidden="true">↗</span></div>
        </div>
      </a>
    </article>`).join('');

  buttons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    buttons.forEach((item) => item.classList.toggle('is-active', item === button));
    grid.querySelectorAll('.project-card').forEach((card) => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.type !== filter);
    });
  }));
})();
