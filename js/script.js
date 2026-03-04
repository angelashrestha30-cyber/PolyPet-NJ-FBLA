// ---------------- SCROLLING ----------------
function scrollToSection(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:"smooth"});
}

// ---------------- SCHEDULE FILTER ----------------
function filterSchedule(day){
  const events = document.querySelectorAll('.event');
  events.forEach(event=>{
    event.style.display = (day==="all" || event.classList.contains(day)) ? "block" : "none";
  });
}

// ---------------- PET XP / LEVEL / STREAK ----------------
let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0;
let level = localStorage.getItem("level") ? parseInt(localStorage.getItem("level")) : 1;
let streak = localStorage.getItem("streak") ? parseInt(localStorage.getItem("streak")) : 0;

function updatePetUI(){
  const levelEl = document.getElementById("level");
  const streakEl = document.getElementById("streak");
  const xpFill = document.getElementById("xp-fill");

  if(levelEl) levelEl.textContent = level;
  if(streakEl) streakEl.textContent = streak;
  if(xpFill) xpFill.style.width = (xp % 100) + "%";
}

function completeLesson(){
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

// ---------------- INTERACTIVE CALENDAR ----------------
function scheduleLesson(){
  const dateInput = document.getElementById("lesson-date");
  const list = document.getElementById("lesson-list");
  if(!dateInput || !list) return;

  const date = dateInput.value;
  if(!date) return;

  const li = document.createElement("li");
  li.textContent = "Lesson scheduled for " + date;
  list.appendChild(li);
}

// ---------------- FADE-IN SECTIONS ----------------
window.addEventListener("scroll", ()=>{
  const sections = document.querySelectorAll(".section");
  sections.forEach(section=>{
    const top = section.getBoundingClientRect().top;
    if(top < window.innerHeight - 100){
      section.classList.add("visible");
    }
  });
});

// ---------------- TIME-BASED GREETING ----------------
function setGreeting(){
  const greetingEl = document.getElementById("dynamicGreeting");
  if(!greetingEl) return;

  const hour = new Date().getHours();
  let greeting =
    (hour<12) ? "Good Morning ☀️" :
    (hour<18) ? "Good Afternoon 🌸" :
    "Good Evening 🌙";

  greetingEl.textContent = greeting;
}

setGreeting();

// ---------------- CONFETTI (SAFE VERSION) ----------------
let confetti = [];
let canvas = document.getElementById("confettiCanvas");
let ctx = canvas ? canvas.getContext("2d") : null;

if(canvas){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function launchConfetti(){
  if(!canvas || !ctx) return;

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
  if(!ctx) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  confetti.forEach(p=>{
    p.y += p.speed;
    ctx.fillStyle = "#ff7f7f";
    ctx.fillRect(p.x,p.y,p.size,p.size);
  });

  requestAnimationFrame(animateConfetti);
}

// ---------------- DYNAMIC WORLD CLOCK ----------------

let timezones = [
  { country: "Japan", code: "Asia/Tokyo", flag: "🇯🇵" },
  { country: "Spain", code: "Europe/Madrid", flag: "🇪🇸" },
  { country: "China", code: "Asia/Shanghai", flag: "🇨🇳" }
];

function createSafeId(str) {
  return str.replace(/\//g, "-").replace(/\s/g, "").toLowerCase();
}

function renderClocks() {
  const clockContainer = document.getElementById("clock-container");
  if (!clockContainer) return;

  clockContainer.innerHTML = "";

  timezones.forEach(tz => {
    const safeId = createSafeId(tz.code);

    const box = document.createElement("div");
    box.classList.add("clock-box");
    box.innerHTML = `
      <h4>${tz.flag} ${tz.country}</h4>
      <p id="${safeId}">--:--:--</p>
    `;

    clockContainer.appendChild(box);
  });
}

function updateWorldClocks() {
  const now = new Date();

  timezones.forEach(tz => {
    const safeId = createSafeId(tz.code);
    const timeElem = document.getElementById(safeId);
    if (!timeElem) return;

    timeElem.textContent = now.toLocaleTimeString("en-US", {
      timeZone: tz.code
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {

  renderClocks();
  updateWorldClocks();
  setInterval(updateWorldClocks, 1000);

  const button = document.getElementById("add-clock-btn");
  const input = document.getElementById("new-country");

  if(button && input){
    button.addEventListener("click", function () {

      const countryName = input.value.trim().toLowerCase();
      if (!countryName) {
        alert("Enter a country.");
        return;
      }

      const countryMap = {
        india: "Asia/Kolkata",
        japan: "Asia/Tokyo",
        spain: "Europe/Madrid",
        china: "Asia/Shanghai",
        usa: "America/New_York",
        uk: "Europe/London",
        france: "Europe/Paris",
        germany: "Europe/Berlin",
        australia: "Australia/Sydney",
        canada: "America/Toronto",
        nepal: "Asia/Kathmandu"
      };

      const timezone = countryMap[countryName];

      if (!timezone) {
        alert("Country not supported.");
        return;
      }

      timezones.push({
        country: countryName.charAt(0).toUpperCase() + countryName.slice(1),
        code: timezone,
        flag: "🌍"
      });

      input.value = "";
      renderClocks();
      updateWorldClocks();
    });
  }

});
