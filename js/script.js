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

  window.loadSpanishLevel3 = function(){
    currentCard = 0;
    flipped = false;
    showCard();
  }

  function showCard(){
    const card = document.getElementById("flashcard");
    if(!card) return;
    card.textContent = flipped ? flashcards[currentCard].back : flashcards[currentCard].front;
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
  window.checkPractice = function(){
    const input = document.getElementById("practiceInput").value.toLowerCase();
    const result = document.getElementById("practiceResult");
    if(input==="aunque") result.textContent="✅ Correct!";
    else result.textContent="❌ Try again.";
  }

  // ================= UNIT TEST =================
  window.submitTest = function(){
    let score = 0;
    if(document.querySelector('input[name="q1"]:checked')?.value==="however") score++;
    if(document.querySelector('input[name="q2"]:checked')?.value==="achieve") score++;
    document.getElementById("testScore").textContent="Score: "+score+"/2";
  }

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
// UNIT TEST
function loadUnitTest(unitIndex){
  currentUnit = unitIndex;
  document.getElementById("testUnit").textContent = currentUnit+1;
  const container = document.getElementById("testQuestions");
  container.innerHTML = "";
  spanishUnits[currentUnit].forEach((card,i)=>{
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${i+1}. Translate: ${card.back}</p>
      <input type="text" id="testInput${i}">
    `;
    container.appendChild(div);
  });
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
  window.showResource = function(name){
    document.querySelectorAll(".resource-content").forEach(sec => sec.style.display="none");
    const target = document.getElementById(name);
    if(target) target.style.display = "block";
  }

  // ================= SPANISH UNITS =================
  const spanishUnits = [
    // Unit 1
    [
      {front:"Hola", back:"Hello"},
      {front:"Adiós", back:"Goodbye"},
      {front:"Gracias", back:"Thank you"},
      {front:"Por favor", back:"Please"},
      {front:"Sí", back:"Yes"},
      {front:"No", back:"No"},
      {front:"¿Cómo estás?", back:"How are you?"},
      {front:"Bien", back:"Good"},
      {front:"Mal", back:"Bad"},
      {front:"¿Qué tal?", back:"What's up?"},
      {front:"Buenos días", back:"Good morning"},
      {front:"Buenas noches", back:"Good night"},
      {front:"Perdón", back:"Sorry"},
      {front:"Lo siento", back:"I'm sorry"},
      {front:"De nada", back:"You're welcome"},
      {front:"Amigo", back:"Friend"},
      {front:"Amiga", back:"Friend (female)"},
      {front:"Señor", back:"Mr."},
      {front:"Señora", back:"Mrs."},
      {front:"Señorita", back:"Miss"}
    ],
    // Units 2-5 can be populated similarly...
  ];

  let currentUnit = 0;
  let currentCard = 0;
  let flipped = false;

  function loadUnit1(){ currentUnit=0; currentCard=0; flipped=false; showCard(); }

  function showCard(){
    const cardEl = document.getElementById("flashcard");
    if(!cardEl) return;
    const card = spanishUnits[currentUnit][currentCard];
    cardEl.textContent = flipped ? card.back : card.front;
    document.getElementById("flashcardProgress").textContent = `Card ${currentCard+1} / ${spanishUnits[currentUnit].length}`;
  }

  window.flipCard = function(){
    flipped = !flipped;
    showCard();
  }

  window.nextCard = function(){
    currentCard = (currentCard+1) % spanishUnits[currentUnit].length;
    flipped = false;
    showCard();
  }

  window.prevCard = function(){
    currentCard = (currentCard-1 + spanishUnits[currentUnit].length) % spanishUnits[currentUnit].length;
    flipped = false;
    showCard();
  }

  // ================= PRACTICE MODE =================
  function loadPractice(){
    const questionEl = document.getElementById("practiceQuestion");
    if(!questionEl) return;
    const card = spanishUnits[currentUnit][Math.floor(Math.random()*spanishUnits[currentUnit].length)];
    questionEl.textContent = `Translate: ${card.back}`;
    document.getElementById("practiceInput").value="";
    document.getElementById("practiceFeedback").textContent="";
    window.currentPracticeAnswer = card.front.toLowerCase();
  }

  window.checkPractice = function(){
    const input = document.getElementById("practiceInput").value.toLowerCase();
    const feedback = document.getElementById("practiceFeedback");
    feedback.textContent = input===window.currentPracticeAnswer ? "✅ Correct!" : "❌ Try again.";
    loadPractice(); // new question immediately for unlimited practice
  }

  // ================= UNIT TEST =================
  window.loadUnitTest = function(){
    currentUnit = 0;
    const container = document.getElementById("testQuestions");
    container.innerHTML = "";
    spanishUnits[currentUnit].forEach((card,i)=>{
      const div = document.createElement("div");
      div.innerHTML = `<p>${i+1}. Translate: ${card.back}</p><input type="text" id="testInput${i}">`;
      container.appendChild(div);
    });
    document.getElementById("unitTestScore").textContent="";
  }

  window.submitUnitTest = function(){
    let score = 0;
    spanishUnits[currentUnit].forEach((card,i)=>{
      const answer = document.getElementById(`testInput${i}`).value.toLowerCase();
      if(answer===card.front.toLowerCase()) score++;
    });
    document.getElementById("unitTestScore").textContent = `Score: ${score} / ${spanishUnits[currentUnit].length}`;
  }

  // Initialize first resource
  showResource('videoLesson');
  loadUnit1();
  loadPractice();
  loadUnitTest();
});
