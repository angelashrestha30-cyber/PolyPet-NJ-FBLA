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

  // ================= LANGUAGE / FLASHCARDS =================
  let flashcards = [
    {front:"Aunque", back:"Although"},
    {front:"Sin embargo", back:"However"},
    {front:"A pesar de", back:"Despite"},
    {front:"Lograr", back:"To achieve"},
    {front:"Desarrollar", back:"To develop"}
  ];
  let currentCard = 0;
  let flipped = false;

  function showCard(){
    const card = document.getElementById("flashcard");
    if(!card) return;
    card.textContent = flipped ? flashcards[currentCard].back : flashcards[currentCard].front;
  }

  window.loadSpanishLevel3 = function(){
    currentCard = 0;
    flipped = false;
    showCard();
  }

  window.flipCard = function(){
    flipped = !flipped;
    showCard();
  }

  window.nextCard = function(){
    currentCard = (currentCard+1)%flashcards.length;
    flipped = false;
    showCard();
  }

  // ================= PRACTICE MODE =================
  let practiceQuestions = [
    {question:"Fill in the blank: ___ es difícil, lo intentaré.", answer:"aunque", explanation:"'Aunque' means 'although'."},
    {question:"Translate: 'I want to eat' → ___", answer:"quiero comer", explanation:"'Quiero comer' means 'I want to eat'."},
    {question:"Translate: 'She is happy' → ___", answer:"ella está feliz", explanation:"'Ella está feliz' means 'She is happy'."}
  ];
  let practiceIndex = 0;

  function loadPracticeQuestion(){
    const qEl = document.getElementById("practiceQuestion");
    const input = document.getElementById("practiceInput");
    const result = document.getElementById("practiceResult");
    if(!qEl || !input || !result) return;
    qEl.textContent = practiceQuestions[practiceIndex].question;
    input.value = "";
    result.textContent = "";
  }

  window.checkPractice = function(){
    const input = document.getElementById("practiceInput").value.toLowerCase();
    const result = document.getElementById("practiceResult");
    if(input === practiceQuestions[practiceIndex].answer.toLowerCase()){
      result.textContent = "✅ Correct! " + practiceQuestions[practiceIndex].explanation;
    } else {
      result.textContent = "❌ Wrong. " + practiceQuestions[practiceIndex].explanation;
    }
    practiceIndex = (practiceIndex+1)%practiceQuestions.length;
    setTimeout(loadPracticeQuestion,2000);
  }

  loadPracticeQuestion();

  // ================= UNIT TEST =================
  let unitTestQuestions = [
    {q:"Sin embargo means:", options:["However","Despite","Although"], correct:"However", explanation:"'Sin embargo' translates to 'However'."},
    {q:"Lograr means:", options:["To achieve","To develop","To eat"], correct:"To achieve", explanation:"'Lograr' translates to 'To achieve'."},
    {q:"A pesar de means:", options:["Despite","However","Although"], correct:"Despite", explanation:"'A pesar de' translates to 'Despite'."},
    // ...add up to 25 questions similarly
  ];

  function renderUnitTest(){
    const container = document.getElementById("test");
    container.innerHTML = "<h3>Unit Test</h3><form id='unitTestForm'></form><p id='testScore'></p><div id='testExplanations'></div>";
    const form = document.getElementById("unitTestForm");
    unitTestQuestions.forEach((q,i)=>{
      const box = document.createElement("div");
      box.classList.add("test-box");
      let html = `<p>${i+1}. ${q.q}</p>`;
      q.options.forEach(opt=>{
        html += `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label>`;
      });
      box.innerHTML = html;
      form.appendChild(box);
    });
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit Test";
    submitBtn.type = "button";
    submitBtn.onclick = submitUnitTest;
    form.appendChild(submitBtn);
  }

  function submitUnitTest(){
    let score = 0;
    const explanations = [];
    unitTestQuestions.forEach((q,i)=>{
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if(selected && selected.value === q.correct) score++;
      explanations.push(`${i+1}. ${selected?.value || "No answer"} → ${q.correct}: ${q.explanation}`);
    });
    document.getElementById("testScore").textContent = `Score: ${score}/${unitTestQuestions.length}`;
    const expEl = document.getElementById("testExplanations");
    expEl.innerHTML = "";
    explanations.forEach(e=>{
      const p = document.createElement("p");
      p.textContent = e;
      expEl.appendChild(p);
    });
  }

  renderUnitTest();

  // ================= RESOURCE TAB SWITCHING =================
  window.showResource = function(name){
    const sections = document.querySelectorAll(".resource-content");
    sections.forEach(sec => sec.style.display = "none");
    const target = document.getElementById(name);
    if(target) target.style.display = "block";
  }

  // show Video by default
  showResource("video");

});
