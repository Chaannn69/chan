  // Typing effect
  const roles = ["a student", "a builder", "a dreamer", "a coffee enthusiast"];
  let r = 0, c = 0, deleting = false;
  const typed = document.getElementById("typed");
  function typeLoop() {
    const word = roles[r];
    typed.textContent = deleting ? word.slice(0, c--) : word.slice(0, c++);
    let delay = deleting ? 60 : 110;
    if (!deleting && c > word.length) { deleting = true; delay = 1400; }
    else if (deleting && c < 0) { deleting = false; c = 0; r = (r + 1) % roles.length; delay = 300; }
    setTimeout(typeLoop, delay);
  }
  typeLoop();

  // Cursor-following blobs
  document.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 60;
    const y = (e.clientY / window.innerHeight - 0.5) * 60;
    document.getElementById("blob1").style.transform = `translate(${x}px, ${y}px)`;
    document.getElementById("blob2").style.transform = `translate(${-x}px, ${-y}px)`;
  });

  // Scroll progress
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    document.getElementById("progress").style.width = pct + "%";
  });

  // Reveal on scroll + trigger skill bars and counters
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll(".fill").forEach(f => f.style.width = f.dataset.width + "%");
      entry.target.querySelectorAll(".num-big").forEach(animateCount);
      if (entry.target.classList.contains("fill")) entry.target.style.width = entry.target.dataset.width + "%";
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal, #skills .skills, .counters").forEach(el => observer.observe(el));

  function animateCount(el) {
    const target = +el.dataset.target;
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      n += step;
      if (n >= target) { n = target; clearInterval(timer); }
      el.textContent = n;
    }, 40);
  }

  // Flip hobby cards
  document.querySelectorAll(".flip").forEach(card => {
    card.addEventListener("click", () => card.classList.toggle("active"));
  });

  // Quiz
  const questions = [
    { q: "What's my favorite way to spend a free afternoon?", options: ["Gaming", "Cooking something new", "Exploring with my camera"], answer: 1 },
    { q: "What keeps me going on tough days?", options: ["Music", "Sleep", "Snacks"], answer: 0 },
    { q: "What would you find in my bag?", options: ["A notebook", "Snacks", "A tiny camera"], answer: 1 }
  ];
  let qi = 0, score = 0;
  const qText = document.getElementById("qText");
  const qOptions = document.getElementById("qOptions");
  const quizResult = document.getElementById("quizResult");

  function renderQuestion() {
    if (qi >= questions.length) {
      quizResult.textContent = `You got ${score}/${questions.length}! ${score === questions.length ? "You really know me 🎉" : "Let's grab coffee and fix that ☕"}`;
      qText.textContent = "Quiz complete!";
      qOptions.innerHTML = `<button class="opt" onclick="restartQuiz()">Play again</button>`;
      return;
    }
    const item = questions[qi];
    qText.textContent = item.q;
    quizResult.textContent = "";
    qOptions.innerHTML = "";
    item.options.forEach((text, idx) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.textContent = text;
      b.onclick = () => answer(idx, b);
      qOptions.appendChild(b);
    });
  }
  function answer(idx, btn) {
    const correct = questions[qi].answer;
    const buttons = qOptions.querySelectorAll(".opt");
    buttons.forEach(b => b.disabled = true);
    if (idx === correct) {
      btn.classList.add("correct");
      score++;
      quizResult.textContent = "Nailed it! 🎉";
      confettiBurst();
    } else {
      btn.classList.add("wrong");
      buttons[correct].classList.add("correct");
      quizResult.textContent = "Close! Keep guessing.";
    }
    setTimeout(() => { qi++; renderQuestion(); }, 1400);
  }
  function restartQuiz() { qi = 0; score = 0; renderQuestion(); }
  renderQuestion();

  // Confetti
  function confettiBurst() {
    const colors = ["#ff6b6b", "#4ecdc4", "#ffd166", "#9b5de5"];
    for (let i = 0; i < 40; i++) {
      const d = document.createElement("div");
      d.className = "confetti";
      d.style.left = Math.random() * 100 + "vw";
      d.style.top = "-10px";
      d.style.background = colors[i % colors.length];
      d.style.animationDelay = Math.random() * 0.3 + "s";
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 2000);
    }
  }

  // Copy email with toast
  const toast = document.getElementById("toast");
  document.getElementById("emailBtn").addEventListener("click", () => {
    navigator.clipboard?.writeText("your.email@example.com");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  });

  // Theme toggle
  const themeBtn = document.getElementById("themeBtn");
  themeBtn.addEventListener("click", () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", dark ? "light" : "dark");
    themeBtn.textContent = dark ? "🌙" : "☀️";
  });

  document.getElementById("year").textContent = new Date().getFullYear();
