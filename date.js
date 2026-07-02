// ==UserScript==
// @name         Staffbase Wetter-Widget: deutsches Datum
// @namespace    local.staffbase.dateformat
// @version      1.0
// @description  Wandelt "Jul 2nd, 2:44pm" in "2. Juli, 14:44" um
// @match        https://igefa.staffbase.rocks/*
// @run-at       document-idle
// @all-frames   true
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const MONTHS = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };

  function toGerman(text) {
    const m = text.match(/([A-Za-z]{3})\s+(\d{1,2})(?:st|nd|rd|th)?,\s*(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (!m) return null;
    let h = +m[3];
    const ap = m[5].toLowerCase();
    if (ap === 'pm' && h !== 12) h += 12;
    if (ap === 'am' && h === 12) h = 0;
    const d = new Date(new Date().getFullYear(), MONTHS[m[1]], +m[2], h, +m[4]);
    const datum = new Intl.DateTimeFormat('de-DE', { day:'numeric', month:'long' }).format(d);
    const zeit  = new Intl.DateTimeFormat('de-DE', { hour:'2-digit', minute:'2-digit' }).format(d);
    return `${datum}, ${zeit}`;
  }

  function apply() {
    document.querySelectorAll('div.widget-card p').forEach(p => {
      const g = toGerman(p.textContent);
      if (g && p.textContent.trim() !== g) p.textContent = g;
    });
  }

  // Direkt ausführen, per Observer bei Neurendern erneut, und als Sicherheit alle 30 s
  apply();
  const obs = new MutationObserver(() => apply());
  obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  setInterval(apply, 30000);
})();
