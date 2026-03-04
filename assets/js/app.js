(async () => {
  const INDEX_URL = 'data/index.json';

  try {
    // Load index
    const index = await fetchJSON(INDEX_URL);
    document.getElementById('week-label').textContent = index.week;

    const nav = document.getElementById('day-nav');
    const detail = document.getElementById('workout-detail');

    // Build nav buttons
    index.split.forEach((entry, i) => {
      const btn = document.createElement('button');
      btn.textContent = `${entry.icon} ${entry.label} — ${entry.focus}`;
      btn.dataset.file = entry.file;
      btn.addEventListener('click', () => loadDay(entry, btn));
      nav.appendChild(btn);

      // Auto-load the first day
      if (i === 0) loadDay(entry, btn);
    });

    async function loadDay(entry, btn) {
      // Update active button
      nav.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      try {
        const data = await fetchJSON(`data/${entry.file}`);
        renderWorkout(data, detail);
      } catch (err) {
        detail.innerHTML = `<p class="placeholder">加载失败：${err.message}</p>`;
      }
    }

    function renderWorkout(data, container) {
      container.innerHTML = `
        <div class="workout-header">
          <h2>${data.title}</h2>
          <p class="meta">作者：${data.author || '—'} &nbsp;|&nbsp; ${data.day}</p>
        </div>
        <div class="exercise-list">
          ${data.exercises.map(ex => `
            <div class="exercise-card">
              <div class="exercise-name">${ex.name}</div>
              <div class="exercise-meta">
                <span>📋 ${ex.sets} 组</span>
                <span>🔁 ${ex.reps} 次</span>
              </div>
              <div class="exercise-tips">💡 ${ex.tips}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
  } catch (err) {
    document.getElementById('workout-detail').innerHTML =
      `<p class="placeholder">初始化失败：${err.message}</p>`;
  }

  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
    return res.json();
  }
})();
