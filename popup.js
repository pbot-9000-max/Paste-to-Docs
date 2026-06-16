/**
 * paste-to-docs — popup.js
 * Manages the extension popup: state loading, toggle, and stats display.
 */

const SOURCE_LABELS = {
  claude:   'Claude',
  chatgpt:  'ChatGPT',
  gemini:   'Gemini',
  html:     'HTML',
  markdown: 'Markdown',
};

document.addEventListener('DOMContentLoaded', async () => {
  const toggle      = document.getElementById('toggle');
  const statusDot   = document.getElementById('statusDot');
  const statusText  = document.getElementById('statusText');
  const countVal    = document.getElementById('countVal');
  const lastSrcVal  = document.getElementById('lastSourceVal');
  const versionEl   = document.getElementById('version');

  // Display current extension version
  const manifest = chrome.runtime.getManifest();
  versionEl.textContent = `v${manifest.version}`;

  // Load persisted state
  const { enabled = true, count = 0, lastSource = null } =
    await chrome.storage.sync.get(['enabled', 'count', 'lastSource']);

  toggle.checked = enabled;
  setStatus(enabled);

  // Animate counter in
  animateCount(countVal, count);

  // Show last source
  lastSrcVal.textContent = lastSource ? (SOURCE_LABELS[lastSource] ?? lastSource) : '—';

  // Handle toggle
  toggle.addEventListener('change', async () => {
    const isEnabled = toggle.checked;
    await chrome.storage.sync.set({ enabled: isEnabled });
    setStatus(isEnabled);

    // Notify all open Google Docs tabs
    const tabs = await chrome.tabs.query({ url: 'https://docs.google.com/document/*' });
    for (const tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { type: 'SET_ENABLED', enabled: isEnabled }).catch(() => {});
    }
  });

  // Open GitHub on star link click
  document.getElementById('ghLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/yourusername/paste-to-docs' });
  });

  function setStatus(on) {
    statusDot.style.background = on ? 'var(--green)' : 'var(--red)';
    statusText.style.color     = on ? 'var(--green)' : 'var(--red)';
    statusText.textContent     = on ? 'Active' : 'Paused';
  }

  function animateCount(el, target) {
    if (target === 0) return;
    const duration = 600;
    const start    = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
});
