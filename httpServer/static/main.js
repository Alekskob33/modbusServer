// DOM elements
const logOutput = document.getElementById('logOutput');
const refreshBtn = document.getElementById('refreshBtn');
const autoRefreshCheckbox = document.getElementById('autoRefresh');
const refreshIntervalSelect = document.getElementById('refreshInterval');

// Variables
let autoRefreshTimer;

// Functions
async function fetchLogs() {
  try {
    const response = await fetch(`/log`);
    if (!response.ok) {
      throw new Error(`Failed to fetch logs: ${response.status}`);
    }

    const logText = await response.text();
    displayLogs(logText);
  } catch (error) {
    console.error('Error fetching logs:', error);
    logOutput.innerHTML = `<div class="log-line error">Error loading logs: ${error.message}</div>`;
  }
}

function displayLogs(logText) {
  // Split the log text into lines
  const lines = logText.split('\n').filter((line) => line.trim());

  // Process each line to add styling based on log level
  const formattedLines = lines.map((line) => {
    let cssClass = '';
    if (line.includes('[ERROR]')) cssClass = 'error';
    else if (line.includes('[INFO]')) cssClass = 'info';
    else if (line.includes('[DEBUG]')) cssClass = 'debug';
    else if (line.includes('[WARN]')) cssClass = 'warn';

    return `<div class="log-line ${cssClass}">${line}</div>`;
  });

  // Update the log container
  logOutput.innerHTML = formattedLines.join('');

  // Scroll to bottom to show latest logs
  logOutput.scrollTop = logOutput.scrollHeight;
}

function startAutoRefresh() {
  stopAutoRefresh();
  if (autoRefreshCheckbox.checked) {
    const interval = parseInt(refreshIntervalSelect.value);
    autoRefreshTimer = setInterval(fetchLogs, interval);
  }
}

function stopAutoRefresh() {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer);
  }
}

// Event listeners
refreshBtn.addEventListener('click', fetchLogs);
autoRefreshCheckbox.addEventListener('change', startAutoRefresh);
refreshIntervalSelect.addEventListener('change', startAutoRefresh);

// Initial load
fetchLogs();
startAutoRefresh();
