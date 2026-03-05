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

  // ================= RESOURCES =================

  // ---------- Spanish Units Data ----------
  const spanishUnits = [
    // Unit 1
    [
      {front:"Hola", back:"Hello"},
      {front:"Adiós", back:"Goodbye"},
      {front:"Gracias", back:"Thank you"},
      {front:"Por favor", back:"Please"},
      {front:"Lo siento", back:"Sorry"},
      {front:"Sí", back:"Yes"},
      {front:"No", back:"No"},
      {front:"¿Cómo estás?", back:"How are you?"},
      {front:"Bien", back:"Good"},
      {front:"Mal", back:"Bad"},
      {front:"¿Qué tal?", back:"What's up?"},
      {front:"Buenos días", back:"Good morning"},
      {front:"Buenas noches", back:"Good night"},
      {front:"Hasta luego", back:"See you later"},
      {front:"Nos vemos", back:"See you"},
      {front:"Mucho gusto", back:"Nice to meet you"},
      {front:"Encantado", back:"Delighted"},
      {front:"¿Cuál es tu nombre?", back:"What is your name?"},
      {front:"Mi nombre es...", back:"My name is..."},
      {front:"¿De dónde eres?", back:"Where are you from?"}
    ],
    // Units 2-5 can be added similarly
  ];

  let currentUnit = 0;
  let currentCard = 0;
  let flipped = false;

  // Show only clicked resource
  window.showResource = function(name){
    const sections = document.querySelectorAll(".resource-content");
    sections.forEach(sec => sec.style.display = "none");
    const target = document.getElementById(name);
    if(target) target.style.display = "block";
  }

  // ---------- Flashcards ----------
  function showFlashcard(){
    const cardEl = document.getElementById("flashcard");
    if(!cardEl) return;
    const card = spanishUnits[currentUnit][currentCard];
    cardEl.textContent = flipped ? card.back : card.front;
  }

  window.flipCard = function(){
    flipped = !flipped;
    showFlashcard();
  }

  window.nextCard = function(){
    currentCard = (currentCard + 1) % spanishUnits[currentUnit].length;
    flipped = false;
    showFlashcard();
  }

  // ---------- Practice Mode ----------
  window.checkPractice = function(){
    const input = document.getElementById("practiceInput").value.trim().toLowerCase();
    const feedback = document.getElementById("practiceFeedback");
    const correct = spanishUnits[currentUnit][currentCard].back.toLowerCase();
    if(input === correct){
      feedback.textContent = "✅ Correct!";
      nextCard();
      document.getElementById("practiceInput").value="";
    } else {
      feedback.textContent = `❌ Incorrect. Try again!`;
    }
  }

  // ---------- Unit Test ----------
  window.loadUnitTest = function(unitIndex){
    currentUnit = unitIndex;
    const container = document.getElementById("testQuestions");
    container.innerHTML = "";
    spanishUnits[currentUnit].forEach((card,i)=>{
      const div = document.createElement("div");
      div.innerHTML = `
        <p>${i+1}. Translate: ${card.front}</p>
        <input type="text" id="testInput${i}">
      `;
      container.appendChild(div);
    });
  }

  window.submitTest = function(){
    let score = 0;
    let feedbackText = "";
    spanishUnits[currentUnit].forEach((card,i)=>{
      const input = document.getElementById(`testInput${i}`).value.trim().toLowerCase();
      const correct = card.back.toLowerCase();
      if(input === correct){
        score++;
      } else {
        feedbackText += `<p>${i+1}. Correct: ${card.back} - Explanation: "${card.front}" means "${card.back}"</p>`;
      }
    });
    document.getElementById("testScore").innerHTML = `Score: ${score}/${spanishUnits[currentUnit].length}` + feedbackText;
  }

});
