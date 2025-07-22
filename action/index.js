// Hey stop reading my stuff...

const toggle        = document.getElementById('autoSolveToggle');
const delayInput    = document.getElementById('clickDelay');
const buyBtn        = document.getElementById('buyBtn');
const activateBtn   = document.getElementById('activateBtn');
const keyInput      = document.getElementById('activationKey');
const statusText    = document.getElementById('statusText');
const versionTag    = document.getElementById('versionTag');
const apiBase       = "https://cloudfreed.com/api";

chrome.storage.local.get(
  ['autoSolve', 'clickDelay', 'ohwowthecode', 'storedVersion'],
  ({ autoSolve, clickDelay, ohwowthecode, storedVersion }) => {

    toggle.classList.toggle('on', autoSolve ?? true);
    delayInput.value = clickDelay ?? 0;

    versionTag.textContent = storedVersion ? `v ${storedVersion}` : 'v ?';
    if (ohwowthecode) showActivated(); else showUnactivated();
    if (storedVersion) checkIfOutdated(storedVersion);
  }
);

async function checkIfOutdated(localVer) {
  try {
    const res = await fetch(`${apiBase}/extension_version?version=${encodeURIComponent(localVer)}`);
    const upToDate = (await res.text()).trim() === 'true';

    if (upToDate) {
      statusText.textContent = 'You\'re on the latest version!';
      versionTag.textContent = `v ${localVer}`;
      showActivated();
    } else {
      statusText.textContent = 'Update available - buy / activate to unlock it.';
      versionTag.textContent = `v ${localVer} (outdated)`;
      showUnactivated();
    }
  } catch (err) {
    console.error('[VERSION] check failed:', err);
    statusText.textContent = 'Can\'t verify version (offline?)';
  }
}

toggle.addEventListener('click', () => {
  const newState = !toggle.classList.contains('on');
  toggle.classList.toggle('on', newState);
  chrome.storage.local.set({ autoSolve: newState });
});

delayInput.addEventListener('change', () => {
  const delay = parseInt(delayInput.value) || 0;
  chrome.storage.local.set({ clickDelay: delay });
});

buyBtn?.addEventListener('click', async () => {
  const res = await fetch(`${apiBase}/buy`, { method: "POST" });
  const { url } = await res.json();
  chrome.tabs.create({ url });
});

activateBtn?.addEventListener('click', () => {
  const key = keyInput.value.trim();
  if (!key) return;

  statusText.textContent = 'Activating…';
  chrome.runtime.sendMessage({ action: 'activate', key }, (resp) => {
    if (chrome.runtime.lastError) {
      console.error('Message failed:', chrome.runtime.lastError);
      statusText.textContent = 'Activation error.';
      return;
    }

    if (resp?.ok) {
      statusText.textContent = 'Activation successful!';
      showActivated();

      if (resp.version) versionTag.textContent = `v ${resp.version}`;
    } else {
      statusText.textContent = 'Invalid or already-used key.\nNeed help? Discord → https://discord.gg/5ncqYYQTPN';
    }
  });
});

function showActivated()   {
  document.getElementById('activationSection').style.display = 'none';
}
function showUnactivated() {
  document.getElementById('activationSection').style.display = 'flex';
}
