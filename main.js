// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
    });
  });
}

// Scroll spy to highlight active section
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
  .map((link) => {
    const id = link.getAttribute("href") || "";
    const target = document.querySelector(id);
    if (!target) return null;
    return { link, section: target };
  })
  .filter(Boolean);

function updateActiveNav() {
  const offset = 120;
  let active = null;

  sections.forEach(({ link, section }) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= offset && rect.bottom > offset) {
      active = link;
    }
  });

  navLinks.forEach((lnk) => lnk.classList.remove("is-active"));
  if (active) active.classList.add("is-active");
}

window.addEventListener("scroll", () => {
  window.requestAnimationFrame(updateActiveNav);
});

updateActiveNav();

// Reveal sections on scroll
const revealSections = document.querySelectorAll(".section[data-animate]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px 60px 0px",
    }
  );

  revealSections.forEach((section) => observer.observe(section));

  // Fallback: reveal any sections still hidden after 1.5s (e.g. short pages, print, screenshots)
  setTimeout(() => {
    revealSections.forEach((section) => section.classList.add("is-visible"));
  }, 1500);
} else {
  revealSections.forEach((section) => section.classList.add("is-visible"));
}

// Dynamic year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

// Contact form: native POST to Formspree (secure form → autofill allowed), redirect back with success
const contactForm = document.getElementById("contact-form");
const formFeedback = document.getElementById("form-feedback");

if (contactForm && formFeedback) {
  // Redirect after submit: back to this page with success param (Formspree _next)
  const nextRedirect = document.getElementById("form-next-redirect");
  if (nextRedirect) {
    const path = window.location.pathname || "/";
    nextRedirect.value = window.location.origin + (path.endsWith("/") ? path : path + "/") + "#contact?contact=success";
  }

  // Keep date_and_time set so Formspree validation passes (set now and again on submit)
  const dateAndTimeEl = document.getElementById("date_and_time");
  if (dateAndTimeEl) {
    dateAndTimeEl.value = new Date().toISOString();
  }
  contactForm.addEventListener("submit", function () {
    if (dateAndTimeEl) {
      dateAndTimeEl.value = new Date().toISOString();
    }
  });

  // After redirect from Formspree: show success message and clean URL
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams((window.location.hash || "").split("?")[1] || "");
  if (params.get("contact") === "success" || hashParams.get("contact") === "success") {
    formFeedback.textContent = "Thanks — your message was sent. I'll get back to you soon.";
    formFeedback.classList.add("form-feedback--success");
    formFeedback.hidden = false;
    history.replaceState(null, "", window.location.pathname + window.location.search + "#contact");
  }
}

