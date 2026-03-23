const revealTargets = document.querySelectorAll("[data-reveal]");
const siteHeader = document.getElementById("site-header");
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuLinks = document.querySelectorAll(".mobile-nav-link");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
const isMobileNavViewport = () => window.innerWidth < 1024;

const revealAll = (elements) => {
  elements.forEach((element) => element.classList.add("is-visible"));
};

const setMobileMenuState = (isOpen) => {
  if (!mobileMenuButton || !mobileMenu || !siteHeader) {
    return;
  }

  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  mobileMenu.classList.toggle("is-open", isOpen);
  siteHeader.classList.toggle("menu-open", isOpen);
};

const syncHeaderState = () => {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
};

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealAll(revealTargets);
} else if (isMobileViewport) {
  const revealSections = [...new Set(
    [...revealTargets]
      .map((element) => element.closest("section"))
      .filter(Boolean)
  )];

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealAll(entry.target.querySelectorAll("[data-reveal]"));
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.04,
      rootMargin: "0px 0px -12% 0px",
    }
  );

  revealSections.forEach((section) => sectionObserver.observe(section));
} else {
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
      threshold: 0.08,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealTargets.forEach((element) => observer.observe(element));
}

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    const isOpen = mobileMenuButton.getAttribute("aria-expanded") === "true";
    setMobileMenuState(!isOpen);
  });

  let touchStartY = 0;
  let touchStartX = 0;
  let touchEndY = 0;
  let touchEndX = 0;

  document.addEventListener(
    "touchstart",
    (event) => {
      if (!isMobileNavViewport()) {
        return;
      }

      const touch = event.changedTouches[0];

      touchStartY = touch.clientY;
      touchStartX = touch.clientX;
      touchEndY = touch.clientY;
      touchEndX = touch.clientX;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      if (!isMobileNavViewport()) {
        return;
      }

      const touch = event.changedTouches[0];

      touchEndY = touch.clientY;
      touchEndX = touch.clientX;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    () => {
      if (!isMobileNavViewport()) {
        return;
      }

      const deltaY = touchEndY - touchStartY;
      const deltaX = touchEndX - touchStartX;
      const isMostlyVertical = Math.abs(deltaY) > Math.abs(deltaX) * 1.2;
      const isOpen = mobileMenuButton.getAttribute("aria-expanded") === "true";

      if (!isMostlyVertical) {
        return;
      }

      // Open the mobile nav when the user pulls downward from the top edge.
      if (!isOpen && touchStartY <= 120 && window.scrollY <= 32 && deltaY >= 84) {
        setMobileMenuState(true);
      }

      // Allow a quick upward swipe to dismiss the panel once it is open.
      if (isOpen && deltaY <= -64) {
        setMobileMenuState(false);
      }
    },
    { passive: true }
  );

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => setMobileMenuState(false));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenuState(false);
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Node)) {
      return;
    }

    if (!siteHeader.contains(target)) {
      setMobileMenuState(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      setMobileMenuState(false);
    }
  });
}

const orderForm = document.getElementById("order-form");

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const selection = document.getElementById("selection").value;
    const delivery = document.getElementById("delivery").value;
    const budget = document.getElementById("budget").value.trim();
    const note = document.getElementById("message").value.trim();

    const message = [
      `Hi NK Luxury, I'm ${name || "a new customer"}.`,
      `I'd like to order: ${selection}.`,
      `Delivery preference: ${delivery}.`,
      `Budget or quantity: ${budget || "Not specified yet."}`,
      `Notes: ${note || "No extra notes yet."}`,
    ].join(" ");

    window.open(`https://wa.me/27823028099?text=${encodeURIComponent(message)}`, "_blank");
  });
}
