# Lessons Learned

## Session 1 — AI Intake Chatbot Build (2026-03-24)

### Codebase Architecture
- Single-file site: `index.html` contains all inline CSS (in `<style>`) and inline JS (in `<script>`) at bottom
- `index.css` and `index.js` are an older/separate design system — NOT used by `index.html`
- `Personal.html` is a separate page, not linked from the main site
- EmailJS is already integrated: service `service_jsmyaee`, template `template_4zt3j8c`, key `E6O2ebYEAtWKSokMm`
- EmailJS template expects: `name`, `email`, `subject`, `message` fields

### Design System (index.html)
- CSS variables: `--bg`, `--bg-raised`, `--bg-subtle`, `--bg-hover`, `--border`, `--border-hover`, `--border-active`
- Text: `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-quaternary`
- Accent: `--accent` (#4A7CFF), `--accent-muted`, `--accent-hover`
- Fonts: `var(--serif)` = Instrument Serif, `var(--sans)` = DM Sans, `var(--mono)` = IBM Plex Mono
- Spacing: `--page-margin`, `--section-gap`, `--radius`, `--ease`
- Animation: `.reveal`, `.reveal-scale`, `.stagger` classes toggled by IntersectionObserver

### Conversion Strategy
- Site was a personal portfolio; repositioned as agency lead-gen
- Chatbot is the primary lead capture mechanism — NOT the email modal
- 8-step chatbot flow: business type → service → budget → timeline → name → email → phone → business name → summary → submit
- All chatbot data submitted via EmailJS using the same existing credentials
- Chatbot submit formats a structured message body so Kisanth gets full lead details in one email
- Added `.open-chat-btn` class to any element that should open the chatbot panel

### Key Implementation Decisions
- Services section inserted after hero/marquee (section "00") — first content after hero
- AI Advantage section inserted after Engineering (section "05")
- Intake CTA section inserted between Client Work and Contact
- Chatbot is a fixed floating panel (bottom-right), not embedded in page
- Summary shown in chat messages; submit button shown in a separate `#chat-submit-area` div below input
- Book a call = mailto link (no Calendly dependency to keep things simple)
- Nav updated: links include "Services", CTA changed from "Get in touch" to "Start a Project"

### Risks & Gotchas
- EmailJS template fields are fixed; adding custom fields requires template update in EmailJS dashboard
  - Workaround: stuff all custom fields into the `message` body — template just needs to display the message
- The `stagger` animation class needs children to be direct children for nth-child CSS to work
- IntersectionObserver reveal is set up once on DOMContentLoaded — new sections must have `.reveal` or `.reveal-scale` classes
- Mobile: chatbot panel must be tested on small screens — use `calc(100vw - 24px)` width on mobile
- The `open-chat-btn` class wiring in JS must run AFTER the chatbot IIFE, or use event delegation

### What to Test After Each Deploy
1. Chatbot opens/closes via floating button
2. All 8 steps flow correctly
3. Submit sends email with correct fields
4. "Book a call" mailto link opens correctly
5. Services section renders on mobile (grid collapses to 1-col)
6. AI section renders correctly at all breakpoints
7. Nav "Start a Project" button opens chatbot
8. Scroll reveal animations trigger on all new sections
9. EmailJS success/error states handled gracefully
