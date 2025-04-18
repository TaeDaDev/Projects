// Mobile Navigation Toggle
const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
const nav = document.querySelector("nav");

mobileNavToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
  mobileNavToggle.classList.toggle("active");
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Close mobile menu if open
      nav.classList.remove("open");
      mobileNavToggle.classList.remove("active");
    }
  });
});

// Sticky Header
const header = document.querySelector(".sticky-header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    header.classList.remove("scroll-up");
    return;
  }

  if (currentScroll > lastScroll && !header.classList.contains("scroll-down")) {
    // Scroll Down
    header.classList.remove("scroll-up");
    header.classList.add("scroll-down");
  } else if (
    currentScroll < lastScroll &&
    header.classList.contains("scroll-down")
  ) {
    // Scroll Up
    header.classList.remove("scroll-down");
    header.classList.add("scroll-up");
  }
  lastScroll = currentScroll;
});

// Intersection Observer for Animations
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
document
  .querySelectorAll(".project-card, .skill, .section-title")
  .forEach((el) => {
    observer.observe(el);
  });

// Form Validation and Submission
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    try {
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitButton.disabled = true;

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        contactForm.reset();
        submitButton.innerHTML = '<i class="fas fa-check"></i> Sent!';
        setTimeout(() => {
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;
        }, 3000);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
      submitButton.innerHTML =
        '<i class="fas fa-exclamation-circle"></i> Error';
      setTimeout(() => {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }, 3000);
    }
  });
}

// Project Card Hover Effect
const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {
  const overlay = card.querySelector(".project-overlay");
  const links = card.querySelectorAll(".project-link, .project-github");

  card.addEventListener("mouseenter", () => {
    overlay.style.opacity = "1";
    links.forEach((link) => {
      link.style.transform = "scale(1)";
    });
  });

  card.addEventListener("mouseleave", () => {
    overlay.style.opacity = "0";
    links.forEach((link) => {
      link.style.transform = "scale(0)";
    });
  });
});

// Skill Cards Animation
const skills = document.querySelectorAll(".skill");

skills.forEach((skill) => {
  skill.addEventListener("mouseenter", () => {
    skill.style.transform = "translateY(-5px)";
  });

  skill.addEventListener("mouseleave", () => {
    skill.style.transform = "translateY(0)";
  });
});

// Add loading animation to images
document.querySelectorAll("img").forEach((img) => {
  img.style.opacity = "0";
  img.addEventListener("load", () => {
    img.style.transition = "opacity 0.5s ease";
    img.style.opacity = "1";
  });
});

// Projects Carousel
const carousel = document.querySelector(".projects-container");
const prevButton = document.querySelector(".carousel-button.prev");
const nextButton = document.querySelector(".carousel-button.next");
const dots = document.querySelectorAll(".dot");
let currentIndex = 0;
let isAnimating = false;

function updateCarousel() {
  if (isAnimating) return;
  isAnimating = true;

  const cardWidth = document.querySelector(".project-card").offsetWidth;
  const gap = parseInt(window.getComputedStyle(carousel).gap);
  const offset = (cardWidth + gap) * currentIndex;

  carousel.style.transform = `translateX(-${offset}px)`;

  // Update dots
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });

  // Update button states
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === dots.length - 1;

  setTimeout(() => {
    isAnimating = false;
  }, 500);
}

function nextSlide() {
  if (currentIndex < dots.length - 1) {
    currentIndex++;
    updateCarousel();
  }
}

function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
}

// Event Listeners
prevButton.addEventListener("click", prevSlide);
nextButton.addEventListener("click", nextSlide);

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    updateCarousel();
  });
});

// Touch support
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
}

// Auto-advance
let autoAdvanceInterval;

function startAutoAdvance() {
  autoAdvanceInterval = setInterval(() => {
    if (currentIndex === dots.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updateCarousel();
  }, 5000);
}

function stopAutoAdvance() {
  clearInterval(autoAdvanceInterval);
}

// Start auto-advance when mouse leaves carousel
carousel.addEventListener("mouseleave", startAutoAdvance);
carousel.addEventListener("mouseenter", stopAutoAdvance);

// Initialize carousel
updateCarousel();
startAutoAdvance();
