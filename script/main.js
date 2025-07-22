// Bro leave my code alone...

(() => {
  /**
   * 
   * @param {string} pattern 
   * @returns {HTMLScriptElement}
  */
  function waitForScript(pattern) {
    let existingScript = [...document.querySelectorAll("script")].find(script => script.src.includes(pattern));
    if (existingScript) return existingScript
    return null;
  }

  async function startCode(code, delayms) {
    const targetScript = waitForScript("/v1");
    const script = document.createElement("script");
    script.onload = () => script.remove();
    script.nonce = targetScript.nonce;
    script.dataset.delay = delayms;

    let blob = new Blob([code], { type: "text/javascript" });
    let scriptUrl = URL.createObjectURL(blob);

    script.src = scriptUrl;
    document.head.appendChild(script);
  }

  window.addEventListener("message", e => {
    if (e.source !== window) return;
    if (e.data.source === "extension-world") {
      startCode(e.data.code, e.data.delayms)
    }
  });
})();