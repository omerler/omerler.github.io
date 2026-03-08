# omerler.github.io
personal web page

## Contact form (Formspree)

The contact form sends submissions to your inbox via [Formspree](https://formspree.io) (works on GitHub Pages with no backend).

**Is the form ID safe in a public repo?** Yes. The form ID is not a secret—it’s visible to anyone who loads the page (view source or DevTools). Formspree protects you with rate limiting and optional domain allowlisting. In the Formspree dashboard, set **Settings → Accept submissions only from** to your domain (e.g. `lerinman.com`) so only your site can submit.

To use a different form: create one at [formspree.io](https://formspree.io), copy the form ID from the form URL, and update the form `action` in `index.html`.
