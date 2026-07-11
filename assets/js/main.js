/* ==========================================================================
   Jivitha Revive — main.js (Vanilla JS, no framework)
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header shadow on scroll ---- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Scroll reveal (respects prefers-reduced-motion via CSS) ---- */
  var revealTargets = document.querySelectorAll("[data-aos]");
  if ("IntersectionObserver" in window && revealTargets.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("aos-in"); });
  }

  /* ---- Dark mode toggle (persists for the session only — no localStorage) ---- */
  var darkToggle = document.querySelectorAll("[data-dark-toggle]");
  darkToggle.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var html = document.documentElement;
      var isDark = html.getAttribute("data-theme") === "dark";
      html.setAttribute("data-theme", isDark ? "light" : "dark");
      btn.setAttribute("aria-pressed", String(!isDark));
      btn.textContent = isDark ? "🌙 Dark" : "☀️ Light";
    });
  });

  /* ---- Simple language switch stub (English / Hindi placeholder) ---- */
  var langSwitch = document.querySelectorAll("[data-lang-switch]");
  langSwitch.forEach(function (btn) {
    btn.addEventListener("click", function () {
      alert("Hindi translation is coming soon. The site currently displays in English.");
    });
  });

  /* ---- Service / condition filter pills (used on services.html, conditions-treated.html) ---- */
  var filterGroup = document.querySelector("[data-filter-group]");
  if (filterGroup) {
    var pills = filterGroup.querySelectorAll(".filter-pill");
    var cards = document.querySelectorAll("[data-filter-item]");
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (p) { p.classList.remove("active"); });
        pill.classList.add("active");
        var category = pill.getAttribute("data-filter");
        cards.forEach(function (card) {
          var cats = (card.getAttribute("data-categories") || "").split(",");
          var show = category === "all" || cats.indexOf(category) > -1;
          card.closest("[data-filter-col]").style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---- Gallery lightbox (lightweight, no dependency) ---- */
  var galleryLinks = document.querySelectorAll("[data-lightbox]");
  if (galleryLinks.length) {
    var overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.innerHTML = '<img src="" alt="" /><button type="button" class="lightbox-close" aria-label="Close">&times;</button>';
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(20,39,35,.92);display:none;align-items:center;justify-content:center;z-index:2000;padding:2rem;";
    overlay.querySelector("img").style.cssText = "max-width:92vw;max-height:88vh;border-radius:8px;";
    overlay.querySelector(".lightbox-close").style.cssText = "position:absolute;top:1.5rem;right:1.5rem;background:transparent;border:0;color:#fff;font-size:2.5rem;line-height:1;cursor:pointer;";
    document.body.appendChild(overlay);

    galleryLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var img = link.querySelector("img");
        overlay.querySelector("img").src = link.getAttribute("href") || (img && img.src);
        overlay.querySelector("img").alt = img ? img.alt : "";
        overlay.style.display = "flex";
      });
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.classList.contains("lightbox-close")) {
        overlay.style.display = "none";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") overlay.style.display = "none";
    });
  }

  /* ---- Serverless form handling (Contact + Appointment Booking) ----
     Replace FORM_ENDPOINT below with your real Formspree endpoint,
     e.g. "https://formspree.io/f/xxxxxxxx" once you create a Formspree account. */
  var FORM_ENDPOINT_PLACEHOLDER = "https://formspree.io/f/REPLACE_WITH_YOUR_FORM_ID";

  var forms = document.querySelectorAll("[data-ajax-form]");
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('[type="submit"]');
      var successBox = form.parentElement.querySelector(".form-success");
      var endpoint = form.getAttribute("action") || FORM_ENDPOINT_PLACEHOLDER;

      if (endpoint.indexOf("REPLACE_WITH_YOUR_FORM_ID") > -1) {
        // No real endpoint configured yet — show a friendly notice instead of failing silently.
        console.warn(
          "Jivitha Revive: this form is not yet connected to a live submission service. " +
          "Create a free Formspree (or EmailJS) endpoint and update FORM_ENDPOINT_PLACEHOLDER in assets/js/main.js."
        );
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = "Sending...";
      }

      fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            form.style.display = "none";
            if (successBox) successBox.classList.add("show");
          } else {
            alert("Something went wrong sending your message. Please call or WhatsApp us directly for now.");
          }
        })
        .catch(function () {
          alert("Something went wrong sending your message. Please call or WhatsApp us directly for now.");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || "Submit";
          }
        });
    });
  });
})();
