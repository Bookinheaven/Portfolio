document.addEventListener("DOMContentLoaded", function () {
  const textElement = document.getElementById("typewriter-text");
  const scrollup = document.getElementById("scroll-up");

  const texts = [
    "Welcome to My Portfolio",
    "Explore My Skills",
    "Check Out My Projects"
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingActive = false; 

  let lastFrameTime = 0;
  const typingDelay = 50;
  const deletingDelay = 30;
  let pauseTime = 0;

  function typeWriterEffect(timestamp) {
    if (!typingActive) return; 

    const delay = isDeleting ? deletingDelay : typingDelay;

    if (timestamp - lastFrameTime < delay + pauseTime) {
      requestAnimationFrame(typeWriterEffect);
      return;
    }

    lastFrameTime = timestamp;
    pauseTime = 0;

    const currentText = texts[textIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    textElement.textContent = currentText.substring(0, charIndex);

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      pauseTime = 800;
    } 
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      if (textIndex === texts.length - 1) {
        scrollup.style.display = "inline-block";
      }
      textIndex = (textIndex + 1) % texts.length;
      pauseTime = 0;
    }
    requestAnimationFrame(typeWriterEffect);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!typingActive) {
            typingActive = true;
            lastFrameTime = performance.now(); 
            requestAnimationFrame(typeWriterEffect);
          }
        } else {
          typingActive = false;
        }
      });
    },
    { threshold: 0.6 }
  );

  observer.observe(document.getElementById("pre-hero-section"));

  window.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition > window.innerHeight * 0.8) {
      scrollup.style.opacity = 1;
      scrollup.style.pointerEvents = "auto";
    } else {
      scrollup.style.opacity = 0;
      scrollup.style.pointerEvents = "none";
    }
  });

  scrollup.addEventListener("click", () => {
    const nextSection = document.getElementById("hero-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});