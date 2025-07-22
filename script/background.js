// ..... GET OUT.
// goofy haha

const apiBase = "https://cloudfreed.com/api";
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "activate") {
    (async () => {
      const key = msg.key;
      if (!key) return sendResponse({ ok: false, error: "No key" });

      try {
        const url = `${apiBase}/ohwowthecode.js?key=${encodeURIComponent(key)}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const version = resp.headers.get("x-extension-version")?.trim() ?? "";
        const js = await resp.text();

        await chrome.storage.local.set({ ohwowthecode: js, storedVersion: version });

        console.log("Activation successful, code saved to storage");
        sendResponse({ ok: true, version });
      } catch (e) {
        console.error("Activation failed", e);
        sendResponse({ ok: false, error: e.message });
      }
    })();

    return true;
  }
});