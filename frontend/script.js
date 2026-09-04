/* SACHIN MAURYA PORTFOLIO — MAIN JAVASCRIPT */

// Point this at your deployed backend. Same-origin "/send-message" works if
// the frontend is served by the same Express app, or a static host proxies
// /send-message to it. Otherwise set the full backend URL, e.g.
// "https://your-backend.onrender.com/send-message".
const CONTACT_API_URL = "http://localhost:5000/send-message";

document.addEventListener("DOMContentLoaded", () => {

  /* 1. Hero boot text */
  const bootText = document.getElementById("bootText");
  const bootMessage = "BOOTING SACHIN_MAURYA.PCB ... SYSTEM ONLINE";
  if (bootText) {
    let i = 0;
    function typeBoot() {
      if (i < bootMessage.length) {
        bootText.textContent += bootMessage.charAt(i);
        i++;
        setTimeout(typeBoot, 45);
      }
    }
    typeBoot();
  }

  /* 2. Custom cursor */
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorGlow = document.querySelector(".cursor-glow");
  const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (hasMouse && cursorDot && cursorGlow) {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + "px";
      cursorGlow.style.top = glowY + "px";
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    document.addEventListener("mousedown", () => cursorDot.classList.add("is-clicking"));
    document.addEventListener("mouseup", () => cursorDot.classList.remove("is-clicking"));

    const interactive = document.querySelectorAll("a, button, input, textarea, .ic-chip, .portfolio-bot");
    interactive.forEach((element) => {
      element.addEventListener("mouseenter", () => cursorDot.classList.add("is-hovering"));
      element.addEventListener("mouseleave", () => cursorDot.classList.remove("is-hovering"));
    });
  }

  /* 3. General scroll reveal */
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  /* 4. Robot */
  const robotText = document.getElementById("robotText");
  const robot = document.getElementById("portfolioBot");

  const robotMessages = [
  "Hi! I'm Sachin's portfolio assistant. I'll help you explore his profile, skills, and projects.",
  "Sachin Maurya is an Electronics & Communication Engineering student and an aspiring Full-Stack Developer.",
  "He has a strong interest in web development, programming, electronics, IoT, and software engineering.",
  "His projects include VoltMap, an AR Based Indoor Navigation System, and an IoT Based Lab Automation system.",
  "He has also developed practical web applications such as a To Do List and a Weather App.",
  "You can explore the Skills section to see his technical knowledge and the Projects section to learn about his work.",
  "Want to know more about Sachin? Scroll through the portfolio and I'll guide you along the way."
  ];

  let robotIndex = 0;

  function changeRobotMessage() {
    if (!robotText) return;
    robotText.style.opacity = "0";
    setTimeout(() => {
      robotText.textContent = robotMessages[robotIndex];
      robotText.style.opacity = "1";
      robotIndex++;
      if (robotIndex >= robotMessages.length) robotIndex = 0;
    }, 300);
  }

  if (robot && robotText) {
    setTimeout(changeRobotMessage, 1200);
    setInterval(changeRobotMessage, 6000);

    robot.addEventListener("mouseenter", () => {
      robotText.style.opacity = "0";
      setTimeout(() => {
        robotText.textContent = "Scroll down — I'll tell you about Sachin and his projects.";
        robotText.style.opacity = "1";
      }, 250);
    });

    robot.addEventListener("mouseleave", () => {
      robotText.style.opacity = "0";
      setTimeout(() => {
        robotText.textContent = robotMessages[robotIndex];
        robotText.style.opacity = "1";
      }, 250);
    });
  }

  /* 5. About Me terminal */
  const aboutTerminal = document.getElementById("aboutTerminal");

  const introLines = [
    "SYSTEM: Sachin Maurya profile detected.",
    "ROLE: Electronics & Communication Engineering Student.",
    "FOCUS: Full-Stack Development + Electronics + IoT.",
    "PROJECTS: AR Navigation + IoT Lab Automation + Web Apps.",
    "STATUS: Learning, building and solving real-world problems."
  ];

  const introElements = [
    document.getElementById("introLine1"),
    document.getElementById("introLine2"),
    document.getElementById("introLine3"),
    document.getElementById("introLine4"),
    document.getElementById("introLine5")
  ];

  let terminalStarted = false;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function typeLine(element, text, speed = 25) {
    return new Promise((resolve) => {
      if (!element) { resolve(); return; }
      let i = 0;
      const timer = setInterval(() => {
        element.textContent = text.substring(0, i);
        i++;
        if (i > text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  async function startTerminal() {
    if (terminalStarted) return;
    terminalStarted = true;
    if (aboutTerminal) aboutTerminal.classList.add("terminal-active");

    for (let i = 0; i < introLines.length; i++) {
      await typeLine(introElements[i], introLines[i], 22);
      await sleep(300);
    }
  }

  if (aboutTerminal) {
    const terminalObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startTerminal();
          terminalObserver.unobserve(aboutTerminal);
        }
      });
    }, { threshold: 0.25 });

    terminalObserver.observe(aboutTerminal);
  }

  /* 6. Project card stagger */
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 80}ms`;
  });

  /* 7. Contact form — sends message to backend */
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const sendBtn = document.getElementById("sendBtn");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all fields.";
      formStatus.className = "form-status error";
      return;
    }

    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.textContent = "Sending...";
    }

    formStatus.textContent = "Sending your message...";
    formStatus.className = "form-status";

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        formStatus.textContent =
          "Message sent! I'll get back to you soon.";
        formStatus.className = "form-status success";

        contactForm.reset();
      } else {
        formStatus.textContent =
          data.message || "Something went wrong. Please try again.";
        formStatus.className = "form-status error";
      }

    } catch (error) {
      console.error("Contact form error:", error);

      formStatus.textContent =
        "Couldn't reach the server. Please try again later.";
      formStatus.className = "form-status error";

    } finally {
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send Message";
      }
    }
  });
}

  /* 8. Navigation */
  const navLinks = document.querySelectorAll('.pin-nav a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* 9. Project hover effect */
  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

});