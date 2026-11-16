const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

// A light-touch motion system: reveal sections as they enter the viewport.
const revealTargets = $$('.feature-card, .deep-lesson, .control-card, .beyond-grid article, .reference-card, .roadmap-item, .lesson-split, .function-layout, .oop-layout, .quiz-card');
revealTargets.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  revealTargets.forEach(el => observer.observe(el));
} else revealTargets.forEach(el => el.classList.add('visible'));

// Reading progress indicator.
const progress = $('#readingProgress');
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    ticking = false;
  });
}, { passive: true });

// Mobile navigation.
const menuToggle = $('#menuToggle');
const nav = $('.desktop-nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuToggle.textContent = open ? '×' : '☰';
});
$$('.desktop-nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.textContent = '☰';
}));

// Copy code examples without requiring a server or browser storage.
$$('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const target = document.getElementById(button.dataset.copy);
  if (!target) return;
  const clean = target.cloneNode(true);
  clean.querySelectorAll('.ln, .copy-button').forEach(node => node.remove());
  const code = clean.innerText.trim();
  try {
    await navigator.clipboard.writeText(code);
    const old = button.innerHTML; button.textContent = 'Copied ✓'; button.classList.add('copied');
    setTimeout(() => { button.innerHTML = old; button.classList.remove('copied'); }, 1500);
  } catch {
    button.textContent = 'Select code to copy';
    setTimeout(() => { button.textContent = 'Copy'; }, 1500);
  }
}));

// Filter the language reference as the learner types.
const search = $('#referenceSearch');
const refCards = $$('.reference-card');
search.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase(); let visible = 0;
  refCards.forEach(card => {
    const match = `${card.dataset.search} ${card.innerText}`.toLowerCase().includes(q);
    card.hidden = !match; if (match) visible++;
  });
  $('#noResults').hidden = visible !== 0;
});
document.addEventListener('keydown', e => {
  if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) { e.preventDefault(); search.focus(); }
  if (e.key === 'Escape' && document.activeElement === search) { search.value = ''; search.dispatchEvent(new Event('input')); search.blur(); }
});

// Five short checks. Score exists only in memory and resets on refresh.
const questions = [
  { q: 'Which keyword declares a new variable in Plain?', a: ['SAY','LET','SET','MAKE'], correct: 'LET', why: 'LET declares a variable. SET assigns a new value to a variable that already exists.' },
  { q: 'Which statement prints a value to the program output?', a: ['ASK','SHOW','SAY','PRINT'], correct: 'SAY', why: 'SAY writes a value to the program output.' },
  { q: 'In REPEAT i FROM 1 TO 3, how many times does the loop run?', a: ['2 times','3 times','4 times','It never runs'], correct: '3 times', why: 'Both endpoints are included: 1, then 2, then 3.' },
  { q: 'Which keyword sends a value back from a function?', a: ['GIVE BACK','RETURN TO','SEND','OUTPUT'], correct: 'GIVE BACK', why: 'GIVE BACK returns a value to the function caller.' },
  { q: 'What does EXTENDS do in a class declaration?', a: ['Repeats a class','Imports a file','Creates a list','Inherits from a parent class'], correct: 'Inherits from a parent class', why: 'EXTENDS declares a child class that inherits fields and methods from a parent.' }
];
let questionIndex = 0, score = 0, answered = false, finished = false;
function renderQuestion() {
  const item = questions[questionIndex]; answered = false; finished = false;
  $('#quizCount').textContent = `QUESTION ${String(questionIndex + 1).padStart(2,'0')} / ${String(questions.length).padStart(2,'0')}`;
  $('#quizProgress').style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  $('#quizQuestion').textContent = item.q;
  $('#quizOptions').innerHTML = '';
  item.a.forEach(answer => {
    const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = answer; btn.dataset.answer = answer;
    btn.addEventListener('click', () => chooseAnswer(btn, item)); $('#quizOptions').append(btn);
  });
  $('#quizFeedback').textContent = ''; $('#quizFeedback').className = 'quiz-feedback';
  $('#quizScore').textContent = `SCORE: ${score}`;
  $('#nextQuestion').disabled = true; $('#nextQuestion').innerHTML = questionIndex === questions.length - 1 ? 'See results →' : 'Next question →';
}
function chooseAnswer(button, item) {
  if (answered) return; answered = true;
  const correct = button.dataset.answer === item.correct;
  if (correct) score++;
  $$('#quizOptions button').forEach(option => {
    option.disabled = true;
    if (option.dataset.answer === item.correct) option.classList.add('correct');
    else if (option === button) option.classList.add('wrong');
  });
  const feedback = $('#quizFeedback'); feedback.className = `quiz-feedback ${correct ? 'good' : 'bad'}`;
  feedback.textContent = `${correct ? 'Correct!' : `Not quite — the answer is ${item.correct}.`} ${item.why}`;
  $('#quizScore').textContent = `SCORE: ${score}`; $('#nextQuestion').disabled = false;
}
$('#nextQuestion').addEventListener('click', () => {
  if (finished) { questionIndex = 0; score = 0; renderQuestion(); return; }
  if (!answered) return;
  if (questionIndex < questions.length - 1) { questionIndex++; renderQuestion(); }
  else {
    finished = true;
    $('#quizCount').textContent = 'CHECK COMPLETE'; $('#quizQuestion').textContent = `You scored ${score} out of ${questions.length}.`;
    $('#quizOptions').innerHTML = `<p class="quiz-feedback good">${score === 5 ? 'Excellent — you have a strong start.' : score >= 3 ? 'Nice work. Review the explanations above and keep practising.' : 'Good first attempt. Revisit the lessons and give it another go.'}</p>`;
    $('#quizFeedback').textContent = 'This score is temporary and is not saved anywhere.';
    $('#nextQuestion').disabled = false; $('#nextQuestion').textContent = 'Try again ↻';
  }
});
renderQuestion();
$('#year').textContent = new Date().getFullYear();
