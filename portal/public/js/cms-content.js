/**
 * cms-content.js — Burlington Cadets CMS client integration
 *
 * Add to any website page before </body>:
 *   <script src="script/cms-content.js"></script>
 *
 * Mark editable text with:    data-cms="section.field"
 * Mark swappable images with: data-cms-img="images.fieldname"
 *
 * Change CMS_URL to your production URL when deploying.
 */

(function () {
  const CMS_URL = 'http://localhost:3000/content.json';

  fetch(CMS_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('CMS content unavailable');
      return res.json();
    })
    .then(function (content) {
      // Replace text content
      document.querySelectorAll('[data-cms]').forEach(function (el) {
        var parts = el.getAttribute('data-cms').split('.');
        if (parts.length !== 2) return;
        var section = parts[0], field = parts[1];
        if (content[section] && content[section][field] !== undefined) {
          el.textContent = content[section][field];
        }
      });

      // Replace image src
      document.querySelectorAll('[data-cms-img]').forEach(function (el) {
        var parts = el.getAttribute('data-cms-img').split('.');
        if (parts.length !== 2) return;
        var section = parts[0], field = parts[1];
        if (content[section] && content[section][field]) {
          el.src = content[section][field];
          if (!el.alt) el.alt = field;
        }
      });
    })
    .catch(function (err) {
      // Silent fail — website shows its default HTML content
      if (window.location.hostname === 'localhost') {
        console.warn('[CMS] Could not load content:', err.message);
      }
    });
})();
