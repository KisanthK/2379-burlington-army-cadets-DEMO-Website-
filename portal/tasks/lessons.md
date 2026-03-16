# CMS Lessons Log

Format: `Date | What failed | Root cause | Fix applied | Prevention rule`

---

2026-03-16 | Session-based auth was used instead of JWT | Initial build assumed browser-session architecture; spec required stateless JWT Bearer tokens | Replaced express-session throughout: routes/auth.js now signs JWTs on login and returns JSON; middleware/auth.js extracts + verifies Bearer token and attaches req.user; login.html uses fetch + localStorage; dashboard.html passes Authorization header on all API calls | Always read the full auth spec before scaffolding — session vs JWT is an architectural fork that touches every layer of the stack
