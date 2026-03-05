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
  // ================= RESOURCE SYSTEM =================

const spanishCards = [
{front:"Hola", back:"Hello"},
{front:"Adiós", back:"Goodbye"},
{front:"Gracias", back:"Thank you"},
{front:"Por favor", back:"Please"},
{front:"Lo siento", back:"I'm sorry"},
{front:"Sí", back:"Yes"},
{front:"No", back:"No"},
{front:"Buenos días", back:"Good morning"},
{front:"Buenas tardes", back:"Good afternoon"},
{front:"Buenas noches", back:"Good night"}
];

let currentCard = 0;
let flipped = false;

function showCard(){

const card = spanishCards[currentCard];
const cardDiv = document.getElementById("flashcard");

if(!cardDiv) return;

cardDiv.textContent = flipped ? card.back : card.front;

}

window.flipCard = function(){

flipped = !flipped;
showCard();

}

window.nextCard = function(){

currentCard = (currentCard+1) % spanishCards.length;
flipped = false;
showCard();

}

// ================= PRACTICE MODE =================

let practiceIndex = 0;

function loadPractice(){

const q = spanishCards[practiceIndex];

document.getElementById("practiceQuestion").textContent =
"Translate: " + q.back;

document.getElementById("practiceInput").value = "";
document.getElementById("practiceFeedback").textContent = "";

}

window.checkAnswer = function(){

const input =
document.getElementById("practiceInput").value.trim().toLowerCase();

const correct = spanishCards[practiceIndex].front.toLowerCase();

const feedback = document.getElementById("practiceFeedback");

if(input === correct){

feedback.textContent = "✅ Correct!";

}else{

feedback.textContent =
"❌ Correct answer: " + spanishCards[practiceIndex].front;

}

practiceIndex = (practiceIndex + 1) % spanishCards.length;

setTimeout(loadPractice,800);

}

// ================= UNIT TEST =================

function loadUnitTest(){

const container = document.getElementById("testQuestions");

container.innerHTML = "";

spanishCards.forEach((card,i)=>{

const div = document.createElement("div");

div.className = "test-box";

div.innerHTML = `
<p>${i+1}. Translate: ${card.back}</p>
<input type="text" id="testInput${i}">
`;

container.appendChild(div);

});

document.getElementById("testResults").innerHTML = "";

}

window.gradeTest = function(){

let score = 0;
let resultsHTML = "";

spanishCards.forEach((card,i)=>{

const input =
document.getElementById("testInput"+i).value.trim().toLowerCase();

const correct = card.front.toLowerCase();

if(input === correct){

score++;

resultsHTML += `<p>${i+1}. ✅ Correct</p>`;

}else{

resultsHTML += `<p>${i+1}. ❌ Correct: "${card.front}"</p>`;

}

});

resultsHTML +=
`<p><strong>Score: ${score}/${spanishCards.length}</strong></p>`;

document.getElementById("testResults").innerHTML = resultsHTML;

}

// initialize
showCard();
loadPractice();
loadUnitTest();
