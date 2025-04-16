const textElement = document.getElementById("typewriter-text");
const texts = ["Welcome to My Portfolio", "Explore My Skills", "Check Out My Projects", "Scroll Up"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isTyping = false;
let observerStarted = false;

function type() {
  if (!isTyping) return;
  const currentText = texts[textIndex];
  const currentDisplay = currentText.substring(0, charIndex + 1);
  textElement.textContent = currentDisplay;
    console.log(currentDisplay)
  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(type, 1000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
    setTimeout(type, 300);
  } else {
    setTimeout(type, isDeleting ? 50 : 100);
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!observerStarted) {
          isTyping = true;
          type();
          observerStarted = true;
        } else {
          isTyping = true;
          type();
        }
      } else {
        isTyping = false;
      }
    });
  },
  { threshold: 0.6 }
);

observer.observe(document.getElementById("pre-hero-section"));
