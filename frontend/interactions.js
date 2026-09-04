// interactions.js
// All the visual polish lives here, separate from script.js (which only
// handles the contact form's network request). Kept isolated so editing
// animations never risks breaking the email-sending logic.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// Scroll-reveal: fade + rise elements into view as the user scrolls, using
// IntersectionObserver instead of a scroll-event listener (far cheaper —
// the browser only notifies us when something actually crosses the
// viewport, rather than running code on every pixel of scroll).
// ---------------------------------------------------------------------------
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // reveal once, don't re-animate on scroll-back
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

// ---------------------------------------------------------------------------
// Hero "boot" line — a short typed-text accent, on-brand with the
// PCB/schematic theme (like a board running a quick self-test on power-up).
// Purely decorative, never blocks the rest of the page from being visible.
// ---------------------------------------------------------------------------
function initBootLine() {
  const el = document.getElementById('bootText');
  if (!el) return;

  const message = 'booting sachin_maurya.dev — profile loaded';

  if (prefersReducedMotion) {
    el.textContent = message;
    return;
  }

  let i = 0;
  function type() {
    if (i <= message.length) {
      el.textContent = message.slice(0, i);
      i++;
      setTimeout(type, 22);
    }
  }
  type();
}

// ---------------------------------------------------------------------------
// Subtle 3D tilt on IC-chip cards (About + Project cards) as the pointer
// moves over them — small, capped rotation so it reads as a physical card
// catching light, not a gimmick. Skipped entirely on touch devices and
// when reduced motion is requested.
// ---------------------------------------------------------------------------
function initCardTilt() {
  if (prefersReducedMotion) return;
  if (window.matchMedia('(hover: none)').matches) return; // touch devices

  const cards = document.querySelectorAll('.ic-chip');

  cards.forEach((card) => {
    card.style.transformStyle = 'preserve-3d';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -6; // max ~3deg either way
      const rotateY = ((x / rect.width) - 0.5) * 6;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ---------------------------------------------------------------------------
// Custom cursor — a ring that follows the pointer with a slight smoothing
// lag (via linear interpolation each animation frame, rather than snapping
// instantly), plus a larger ambient glow that trails a bit further behind
// for depth. The ring zooms up when hovering anything interactive.
// Automatically does nothing on touch devices or reduced-motion — the CSS
// media queries already hide these elements there, so this just skips the
// wasted work.
// ---------------------------------------------------------------------------
function initCustomCursor() {
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (prefersReducedMotion || !hasFinePointer) return;

  const dot = document.querySelector('.cursor-dot');
  const glow = document.querySelector('.cursor-glow');
  if (!dot || !glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX, dotY = mouseY;
  let glowX = mouseX, glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('mousedown', () => dot.classList.add('is-clicking'));
  window.addEventListener('mouseup', () => dot.classList.remove('is-clicking'));

  // Zoom the ring on anything clickable/interactive
  const hoverTargets = 'a, button, input, textarea, .ic-chip, .bom-row';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) dot.classList.add('is-hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) dot.classList.remove('is-hovering');
  });

  function animate() {
    // Ring follows quickly (snappy), glow follows more loosely (ambient trail)
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    glow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initBootLine();
  initCardTilt();
  initCustomCursor();
});
