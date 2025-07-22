// Hey why u reading this?

const url = chrome.runtime.getURL("/script/ohwowthecode.js");

async function startCode(clickDelay, code) {
  if (!code || !code.trim()) throw new Error("Solver not activated.")
  window.postMessage({ source: "extension-world", code, delayms: clickDelay }, "*");
}

chrome.storage.local.get(["autoSolve", "clickDelay", "ohwowthecode"], ({ autoSolve = true, clickDelay = 0, ohwowthecode = null }) => {
  autoSolve&&startCode(clickDelay, ohwowthecode);
});