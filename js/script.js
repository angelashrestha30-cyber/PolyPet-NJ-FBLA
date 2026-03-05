// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", function () {

  // ================= SCROLLING =================
  window.scrollToSection = function(id){
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:"smooth"});
  }

  // ================= PET XP / LEVEL / STREAK =================
  let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0;
  let level = localStorage.getItem("level") ? parseInt(localStorage.getItem("level")) : 1;
  let streak = localStorage.getItem("streak") ? parseInt(localStorage.getItem("streak")) : 0;

  function updatePetUI(){
    document.getElementById("level").textContent = level;
    document.getElementById("streak").textContent = streak;
    document.getElementById("xp-fill").style.width = (xp % 100) + "%";
  }

  window.completeLesson = function(){
    xp += 20;
    streak += 1;
    if(xp >= level*100){
      level++;
      launchConfetti();
    }
    localStorage.setItem("xp",xp);
    localStorage.setItem("level",level);
    localStorage.setItem("streak",streak);
    updatePetUI();
  }
  updatePetUI();

  // ================= SCHEDULE FILTER =================
  window.filterSchedule = function(day){
    const events = document.querySelectorAll('.event');
    events.forEach(event=>{
      event.style.display = (day==="all" || event.classList.contains(day)) ? "block" : "none";
    });
  }

  // ================= INTERACTIVE CALENDAR =================
  window.scheduleLesson = function(){
    const date = document.getElementById("lesson-date").value;
    if(!date) return;
    const li = document.createElement("li");
    li.textContent = "Lesson scheduled for " + date;
    document.getElementById("lesson-list").appendChild(li);
  }

  // ================= FADE-IN SECTIONS =================
  const sections = document.querySelectorAll(".section");
  function fadeInSections(){
    sections.forEach(section=>{
      const top = section.getBoundingClientRect().top;
      if(top < window.innerHeight - 100){
        section.classList.add("visible");
      }
    });
  }
  fadeInSections();
  window.addEventListener("scroll", fadeInSections);

  // ================= TIME GREETING =================
  function setGreeting(){
    const hour = new Date().getHours();
    let greeting = (hour<12) ? "Good Morning, Emma ☀️" :
                   (hour<18) ? "Good Afternoon, Emma 🌸" :
                   "Good Evening, Emma 🌙";
    document.getElementById("dynamicGreeting").textContent = greeting;
  }
  setGreeting();

  // ================= CONFETTI =================
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let confetti = [];

  function launchConfetti(){
    for(let i=0;i<100;i++){
      confetti.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height - canvas.height,
        size: Math.random()*6+4,
        speed: Math.random()*3+2
      });
    }
    animateConfetti();
  }

  function animateConfetti(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confetti.forEach(p=>{
      p.y += p.speed;
      ctx.fillStyle = "#ff7f7f";
      ctx.fillRect(p.x,p.y,p.size,p.size);
    });
    confetti = confetti.filter(p=>p.y < canvas.height);
    if(confetti.length>0) requestAnimationFrame(animateConfetti);
  }

  // ================= WORLD CLOCK =================
  let timezones = [
    { country: "Japan", code: "Asia/Tokyo", flag: "🇯🇵" },
    { country: "Spain", code: "Europe/Madrid", flag: "🇪🇸" },
    { country: "China", code: "Asia/Shanghai", flag: "🇨🇳" }
  ];

  function createSafeId(str){ return str.replace(/\//g,"-").replace(/\s/g,"").toLowerCase(); }

  function renderClocks(){
    const container = document.getElementById("clock-container");
    if(!container) return;
    container.innerHTML = "";
    timezones.forEach(tz=>{
      const id = createSafeId(tz.code);
      const box = document.createElement("div");
      box.classList.add("clock-box");
      box.innerHTML = `<h4>${tz.flag} ${tz.country}</h4><p id="${id}">--:--:--</p>`;
      container.appendChild(box);
    });
  }

  function updateWorldClocks(){
    const now = new Date();
    timezones.forEach(tz=>{
      const id = createSafeId(tz.code);
      const el = document.getElementById(id);
      if(el) el.textContent = now.toLocaleTimeString("en-US",{timeZone:tz.code});
    });
  }

  const addClockBtn = document.getElementById("add-clock-btn");
  if(addClockBtn){
    addClockBtn.addEventListener("click", ()=>{
      const countryInput = document.getElementById("new-country").value.trim();
      const tzInput = document.getElementById("new-tz").value.trim();
      if(!countryInput || !tzInput) return alert("Enter country and timezone");
      timezones.push({country:countryInput, code:tzInput, flag:"🌍"});
      document.getElementById("new-country").value="";
      document.getElementById("new-tz").value="";
      renderClocks();
    });
  }

  renderClocks();
  updateWorldClocks();
  setInterval(updateWorldClocks,1000);

  // ================= FLASHCARDS =================
let flashcards = [
  {front:"Aunque", back:"Although"},
  {front:"Sin embargo", back:"However"},
  {front:"A pesar de", back:"Despite"},
  {front:"Lograr", back:"To achieve"},
  {front:"Desarrollar", back:"To develop"},
  {front:"Fácil", back:"Easy"},
  {front:"Difícil", back:"Difficult"},
  {front:"Rápido", back:"Fast"},
  {front:"Lento", back:"Slow"},
  {front:"Bonito", back:"Beautiful"},
  {front:"Feo", back:"Ugly"},
  {front:"Grande", back:"Big"},
  {front:"Pequeño", back:"Small"},
  {front:"Nuevo", back:"New"},
  {front:"Viejo", back:"Old"},
  {front:"Feliz", back:"Happy"},
  {front:"Triste", back:"Sad"},
  {front:"Rico", back:"Rich"},
  {front:"Pobre", back:"Poor"},
  {front:"Importante", back:"Important"}
];
let currentCard = 0;
let flipped = false;

function showCard(){
  const card = document.getElementById("flashcard");
  if(!card) return;
  card.textContent = flipped ? flashcards[currentCard].back : flashcards[currentCard].front;
  document.getElementById("cardProgress").textContent = `Card ${currentCard+1} / ${flashcards.length}`;
}

window.flipCard = function(){
  flipped = !flipped;
  showCard();
}

window.nextCard = function(){
  currentCard = (currentCard+1) % flashcards.length;
  flipped = false;
  showCard();
}

window.prevCard = function(){
  currentCard = (currentCard-1+flashcards.length) % flashcards.length;
  flipped = false;
  showCard();
}

// ================= PRACTICE MODE =================
let practiceQuestions = [
  {question:"Fill in the blank: ___ es difícil, lo intentaré.", answer:"aunque", explanation:"Correct! 'Aunque' means 'although'."},
  {question:"Translate to Spanish: 'I want to learn'", answer:"quiero aprender", explanation:"Correct! 'Quiero aprender' means 'I want to learn'."},
  {question:"Sentence builder: make a correct sentence from ['Yo', 'manzana', 'como']", answer:"Yo como manzana", explanation:"Correct! 'Yo como manzana' = 'I eat an apple'."},
  // ...add unlimited more questions
];
let currentPractice = 0;

function loadPractice(){
  const pq = practiceQuestions[currentPractice];
  document.getElementById("practiceQuestion").textContent = pq.question;
  document.getElementById("practiceInput").value="";
  document.getElementById("practiceFeedback").textContent="";
}

window.checkPractice = function(){
  const input = document.getElementById("practiceInput").value.toLowerCase().trim();
  const pq = practiceQuestions[currentPractice];
  const feedback = document.getElementById("practiceFeedback");
  if(input === pq.answer.toLowerCase()){
    feedback.textContent = "✅ Correct!";
  } else {
    feedback.textContent = `❌ Incorrect. ${pq.explanation}`;
  }
}

window.nextPractice = function(){
  currentPractice = (currentPractice+1) % practiceQuestions.length;
  loadPractice();
}

// ================= UNIT TEST =================
let testQuestions = [
  {q:"'Sin embargo' means?", options:["However","Despite"], answer:"However", explanation:"'Sin embargo' translates to 'However'."},
  {q:"'Lograr' means?", options:["To achieve","To develop"], answer:"To achieve", explanation:"'Lograr' = 'To achieve'."},
  // ...add up to 25 mixed questions
];

function loadTest(){
  const container = document.getElementById("testContainer");
  container.innerHTML="";
  testQuestions.forEach((t,i)=>{
    const div = document.createElement("div");
    div.innerHTML = `<p>${i+1}. ${t.q}</p>` + t.options.map(o=>`
      <label><input type="radio" name="q${i}" value="${o}"> ${o}</label><br>
    `).join('');
    container.appendChild(div);
  });
}

window.submitTest = function(){
  let score = 0;
  const explanations = [];
  testQuestions.forEach((t,i)=>{
    const selected = document.querySelector(`input[name="q${i}"]:checked`)?.value;
    if(selected === t.answer) score++;
    else explanations.push(`Q${i+1}: ${t.explanation}`);
  });
  document.getElementById("testScore").textContent = `Score: ${score} / ${testQuestions.length}`;
  document.getElementById("testExplanations").innerHTML = explanations.join("<br>");
}

loadFlashcards();
loadPractice();
loadTest();
