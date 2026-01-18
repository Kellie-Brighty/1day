document.addEventListener("DOMContentLoaded", () => {
  // Custom Cursor tracking with RAF for performance
  const cursor = document.querySelector(".custom-cursor");
  let mouseX = 0, mouseY = 0;
  let ballX = 0, ballY = 0;
  let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  let hasMoved = false;

  if (isTouchDevice) {
    if (cursor) cursor.style.display = "none";
    document.body.style.cursor = "auto";
  } else {
    document.addEventListener("mousemove", (e) => {
      if (!hasMoved) {
        hasMoved = true;
        if (cursor) cursor.style.opacity = "1";
        document.body.style.cursor = "none";
        ballX = e.clientX;
        ballY = e.clientY;
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      // Smooth lag effect
      ballX += (mouseX - ballX) * 0.25;
      ballY += (mouseY - ballY) * 0.25;
      
      if (cursor && hasMoved) {
        cursor.style.left = ballX + "px";
        cursor.style.top = ballY + "px";
      }
      
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // CA Copy Functionality
  const copyBtn = document.getElementById("copy-btn");
  const caAddress = document.getElementById("ca-address");

  if (copyBtn && caAddress) {
    copyBtn.addEventListener("click", () => {
      const address = caAddress.innerText;
      navigator.clipboard.writeText(address).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "COPIED!";
        copyBtn.style.background = "#fff";
        copyBtn.style.color = "#000";
        
        setTimeout(() => {
          copyBtn.innerText = originalText;
          copyBtn.style.background = "transparent";
          copyBtn.style.color = "#fff";
        }, 2000);
      });
    });
  }

  // Cursor interaction
  const interactiveElements = document.querySelectorAll(
    "a, .protocol-card, .x-link, .social-icon, .ca-copy-btn",
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (!isTouchDevice && cursor) {
        cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
        cursor.style.background = "transparent";
        cursor.style.border = "1px solid currentColor";
      }
    });
    el.addEventListener("mouseleave", () => {
      if (!isTouchDevice && cursor) {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursor.style.background = "#ffffff";
        cursor.style.border = "none";
      }
    });
  });

  // Intersection Observer for reveal animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll(
    ".reveal-text, .reveal-card",
  );
  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // Parallax effect for hero image
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const heroImg = document.querySelector(".hero-img");
    if (heroImg) {
      heroImg.style.transform = `scale(1.1) translateY(${scrolled * 0.2}px)`;
    }
  }, { passive: true });

  // Sketchy interaction: Randomly jitter the cursor slightly
  if (!isTouchDevice && cursor) {
    setInterval(() => {
      const jitterX = (Math.random() - 0.5) * 1.5;
      const jitterY = (Math.random() - 0.5) * 1.5;
      cursor.style.marginLeft = jitterX + "px";
      cursor.style.marginTop = jitterY + "px";
    }, 120);
  }
});
