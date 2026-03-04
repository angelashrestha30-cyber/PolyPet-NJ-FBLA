// ================= SCROLLING WITH OFFSET =================
function scrollToSection(id){
  const element = document.getElementById(id);
  const yOffset = -100; // height of navbar
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({top: y, behavior: "smooth"});
}

// ================= FADE-IN SECTIONS =================
const sections = document.querySelectorAll(".section");
function checkSectionsVisibility(){
  sections.forEach(section=>{
    const top = section.getBoundingClientRect().top;
    if(top < window.innerHeight - 100){
      section.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", checkSectionsVisibility);
window.addEventListener("load", checkSectionsVisibility);

// ================= PET XP / LEVEL / STREAK =================
let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0;
let level = localStorage.getItem("level") ? parseInt(localStorage.getItem("level")) : 1;
let streak = localStorage.getItem("streak") ? parseInt(localStorage.getItem("streak")) : 0;

function updatePetUI(){
  document.getElementById("level").textContent = level;
  document.getElementById("streak").textContent = streak;
  document.getElementById("xp-fill").style.width = (xp % 100) + "%";
}

function completeLesson(){
  xp += 20;
  streak += 1;
  if(xp >= level*100){
    level++;
    launchConfetti();
  }
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("streak", streak);
  updatePetUI();
}
updatePetUI();

// ================= SCHEDULE FILTER =================
function filterSchedule(day){
  const events = document.querySelectorAll(".event");
  events.forEach(event=>{
    event.style.display = (day==="all" || event.classList.contains(day)) ? "block" : "none";
  });
}

// ================= INTERACTIVE CALENDAR =================
function scheduleLesson(){
  const date = document.getElementById("lesson-date").value;
  if(!date) return;
  const li = document.createElement("li");
  li.textContent = "Lesson scheduled for " + date;
  document.getElementById("lesson-list").appendChild(li);
}

// ================= TIME GREETING =================
function setGreeting(){
  const hour = new Date().getHours();
  let greeting = (hour < 12) ? "Good Morning, Emma ☀️" :
                 (hour < 18) ? "Good Afternoon, Emma 🌸" :
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
  requestAnimationFrame(animateConfetti);
}

// ================= WORLD CLOCK =================
let timezones = [
  { country: "Japan", code: "Asia/Tokyo", flag: "🇯🇵" },
  { country: "Spain", code: "Europe/Madrid", flag: "🇪🇸" },
  { country: "China", code: "Asia/Shanghai", flag: "🇨🇳" }
];

function createSafeId(str){
  return str.replace(/\//g,"-").replace(/\s/g,"").toLowerCase();
}

function renderClocks(){
  const container = document.getElementById("clock-container");
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

document.getElementById("add-clock-btn").addEventListener("click", ()=>{
  const countryInput = document.getElementById("new-country").value.trim();
  const tzInput = document.getElementById("new-tz").value.trim();
  if(!countryInput || !tzInput) return alert("Enter country and timezone");
  timezones.push({country: countryInput, code: tzInput, flag: "🌍"});
  renderClocks();
});

renderClocks();
updateWorldClocks();
setInterval(updateWorldClocks, 1000);

// ================= FLASHCARDS =================
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
  if(!flashcards.length) return;
  document.getElementById("flashcard").textContent =
    flipped ? flashcards[currentCard].back : flashcards[currentCard].front;
}

function flipCard(){
  flipped = !flipped;
  showCard();
}

function nextCard(){
  currentCard = (currentCard + 1) % flashcards.length;
  flipped = false;
  showCard();
}

function loadSpanishLevel3(){
  currentCard = 0;
  flipped = false;
  showCard();
}

// ================= PRACTICE MODE =================
function checkPractice(){
  const input = document.getElementById("practiceInput").value.toLowerCase();
  const result = document.getElementById("practiceResult");
  if(input === "aunque"){
    result.textContent = "✅ Correct!";
  } else {
    result.textContent = "❌ Try again.";
  }
}

// ================= UNIT TEST =================
function submitTest(){
  let score = 0;
  if(document.querySelector('input[name="q1"]:checked')?.value === "however") score++;
  if(document.querySelector('input[name="q2"]:checked')?.value === "achieve") score++;
  document.getElementById("testScore").textContent = "Score: " + score + "/2";
}
