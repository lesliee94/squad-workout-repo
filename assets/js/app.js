/**
 * app.js — Squad Workout Plan SPA
 * Loads workout JSON data and renders a switchable bottom-nav interface.
 */

const INDEX_URL = 'data/index.json';

let schedule = [];    // array of day meta from index.json
let cache = {};       // { dayKey: workoutData }
let activeDay = null; // currently displayed day key

/* ===== Boot ===== */
async function init() {
  try {
    const res = await fetch(INDEX_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const index = await res.json();
    schedule = index.split;
    buildNav();
    // Default to today's weekday if it matches, otherwise Monday
    const todayIndex = getTodayIndex();
    selectDay(schedule[todayIndex] ? schedule[todayIndex].day : schedule[0].day);
  } catch (err) {
    showError('无法加载训练计划索引，请刷新重试。');
    console.error(err);
  }
}

/* ===== Navigation ===== */
function buildNav() {
  const nav = document.getElementById('bottom-nav');
  nav.innerHTML = '';
  schedule.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'nav-tab';
    btn.dataset.day = item.day;
    btn.setAttribute('aria-label', item.label);
    btn.innerHTML = `
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
    `;
    btn.addEventListener('click', () => selectDay(item.day));
    nav.appendChild(btn);
  });
}

function setActiveTab(day) {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.day === day);
  });
}

/* ===== Day Selection ===== */
async function selectDay(day) {
  if (activeDay === day) return;
  activeDay = day;
  setActiveTab(day);

  if (cache[day]) {
    renderWorkout(cache[day]);
    return;
  }

  showLoading();
  const meta = schedule.find(s => s.day === day);
  if (!meta) return showError('找不到该训练日数据。');

  try {
    const res = await fetch(`data/${meta.file}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache[day] = data;
    renderWorkout(data);
  } catch (err) {
    showError('加载训练数据失败，请刷新重试。');
    console.error(err);
  }
}

/* ===== Render ===== */
function renderWorkout(data) {
  const app = document.getElementById('app');
  const subtitle = document.getElementById('day-subtitle');

  subtitle.textContent = `${data.title} · by ${data.author}`;

  const rows = data.exercises.map((ex, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><span class="exercise-name">${escHtml(ex.name)}</span></td>
      <td><span class="badge">${ex.sets} 组</span></td>
      <td><span class="badge">${escHtml(ex.reps)} 次</span></td>
      <td><span class="tips-text">${escHtml(ex.tips)}</span></td>
    </tr>
  `).join('');

  app.innerHTML = `
    <div class="day-card">
      <div class="day-card-header">
        <div class="day-card-title">${data.title}</div>
        <div class="day-card-meta">by ${escHtml(data.author)}</div>
      </div>
      <div class="table-wrap">
        <table class="exercise-table">
          <thead>
            <tr>
              <th>#</th>
              <th>动作名称</th>
              <th>组数</th>
              <th>次数</th>
              <th>要点提示</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

/* ===== UI Helpers ===== */
function showLoading() {
  document.getElementById('app').innerHTML = `
    <div class="loading">
      <span class="spinner"></span>
      <p>加载训练数据中…</p>
    </div>
  `;
}

function showError(msg) {
  document.getElementById('app').innerHTML = `<p class="error-msg">⚠️ ${escHtml(msg)}</p>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Returns 0-4 for Mon-Fri; defaults to 0 for weekends */
function getTodayIndex() {
  const d = new Date().getDay(); // 0=Sun,1=Mon,...,6=Sat
  if (d >= 1 && d <= 5) return d - 1;
  return 0;
}

/* ===== Start ===== */
init();
