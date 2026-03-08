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
      threshold: 0.2,
    }
  );

  revealSections.forEach((section) => observer.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add("is-visible"));
}

// Dynamic year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

// Contact form: submit via Formspree (AJAX) and show success/error on the page
const contactForm = document.getElementById("contact-form");
const formFeedback = document.getElementById("form-feedback");
const submitBtn = document.getElementById("contact-submit-btn");

if (contactForm && formFeedback && submitBtn) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const action = contactForm.getAttribute("action");
    if (!action || action.includes("YOUR_FORM_ID")) {
      formFeedback.textContent = "Form is not configured. Please set your Formspree form ID in the form action.";
      formFeedback.hidden = false;
      formFeedback.classList.remove("form-feedback--success");
      formFeedback.classList.add("form-feedback--error");
      return;
    }

    submitBtn.disabled = true;
    formFeedback.hidden = true;
    formFeedback.classList.remove("form-feedback--success", "form-feedback--error");

    const dataAndTimeEl = document.getElementById("data_and_time");
    if (dataAndTimeEl) {
      dataAndTimeEl.value = new Date().toISOString();
    }

    const formData = new FormData(contactForm);

    try {
      const res = await fetch(action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && !data.error) {
        formFeedback.textContent = "Thanks — your message was sent. I'll get back to you soon.";
        formFeedback.classList.add("form-feedback--success");
        contactForm.reset();
      } else {
        formFeedback.textContent = data.error || "Something went wrong. Please try again or email contact@lerinman.com.";
        formFeedback.classList.add("form-feedback--error");
      }
    } catch (_) {
      formFeedback.textContent = "Network error. Please check your connection or email contact@lerinman.com.";
      formFeedback.classList.add("form-feedback--error");
    }

    formFeedback.hidden = false;
    submitBtn.disabled = false;
  });
}

