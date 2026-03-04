(async () => {
  const tabsEl    = document.getElementById('day-tabs');
  const contentEl = document.getElementById('workout-content');
  const weekLabel = document.getElementById('week-label');

  // Load the weekly index
  let index;
  try {
    const res = await fetch('data/index.json');
    index = await res.json();
  } catch (e) {
    contentEl.innerHTML = '<p class="error">无法加载训练计划，请检查数据文件。</p>';
    return;
  }

  weekLabel.textContent = index.week;

  // Build day tabs
  index.split.forEach((day, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.dataset.file = day.file;
    btn.textContent = `${day.icon} ${day.label}`;
    btn.addEventListener('click', () => loadDay(day.file, btn));
    tabsEl.appendChild(btn);
    if (i === 0) loadDay(day.file, btn);   // auto-load first day
  });

  async function loadDay(file, activeBtn) {
    // Update active tab
    tabsEl.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');

    contentEl.innerHTML = '<p class="loading">正在加载…</p>';

    let data;
    try {
      const res = await fetch(`data/${file}`);
      data = await res.json();
    } catch (e) {
      contentEl.innerHTML = '<p class="error">无法加载该天训练数据。</p>';
      return;
    }

    const rows = data.exercises.map((ex, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${ex.name}</td>
        <td><span class="badge">${ex.sets} 组</span></td>
        <td><span class="badge">${ex.reps}</span></td>
        <td class="tips-cell">${ex.tips}</td>
      </tr>
    `).join('');

    contentEl.innerHTML = `
      <div class="workout-header">
        <h2>${data.title}</h2>
        <p class="meta">作者：${data.author} · ${data.exercises.length} 个动作</p>
      </div>
      <table class="exercise-table">
        <thead>
          <tr>
            <th>#</th>
            <th>动作</th>
            <th>组数</th>
            <th>次数</th>
            <th>要点</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }
})();
