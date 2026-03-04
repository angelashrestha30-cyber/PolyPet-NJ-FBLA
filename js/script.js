// SCROLLING
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

// SCHEDULE FILTER
function filterSchedule(day){
  const events = document.querySelectorAll('.event');
  events.forEach(event=>{
    event.style.display = (day==="all" || event.classList.contains(day)) ? "block" : "none";
  });
}

// PET XP / LEVEL / STREAK
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
  localStorage.setItem("xp",xp);
  localStorage.setItem("level",level);
  localStorage.setItem("streak",streak);
  updatePetUI();
}
updatePetUI();

// INTERACTIVE CALENDAR
function scheduleLesson(){
  const date = document.getElementById("lesson-date").value;
  if(!date) return;
  const li = document.createElement("li");
  li.textContent = "Lesson scheduled for " + date;
  document.getElementById("lesson-list").appendChild(li);
}

// FADE-IN SECTIONS
const sections = document.querySelectorAll(".section");
window.addEventListener("scroll", ()=>{
  sections.forEach(section=>{
    const top = section.getBoundingClientRect().top;
    if(top < window.innerHeight - 100){
      section.classList.add("visible");
    }
  });
});

// TIME-BASED GREETING
function setGreeting(){
  const hour = new Date().getHours();
  let greeting = (hour<12) ? "Good Morning, Emma ☀️" : (hour<18) ? "Good Afternoon, Emma 🌸" : "Good Evening, Emma 🌙";
  document.getElementById("dynamicGreeting").textContent = greeting;
}
setGreeting();

// CONFETTI
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

// WORLD CLOCKS
function updateWorldClocks(){
  const now = new Date();
  document.getElementById("japan-time").textContent = now.toLocaleTimeString("en-US",{timeZone:"Asia/Tokyo"});
  document.getElementById("spain-time").textContent = now.toLocaleTimeString("en-GB",{timeZone:"Europe/Madrid"});
  document.getElementById("china-time").textContent = now.toLocaleTimeString("en-US",{timeZone:"Asia/Shanghai"});
}
setInterval(updateWorldClocks,1000);
updateWorldClocks();
// ---------------------- DYNAMIC WORLD CLOCK ----------------------

// Default timezones
let timezones = [
  { country: "Japan", code: "Asia/Tokyo", flag: "🇯🇵" },
  { country: "Spain", code: "Europe/Madrid", flag: "🇪🇸" },
  { country: "China", code: "Asia/Shanghai", flag: "🇨🇳" }
];

// Container
const clockContainer = document.getElementById("clock-container");

// Function to render clocks
function renderClocks() {
  clockContainer.innerHTML = "";
  timezones.forEach(tz => {
    const box = document.createElement("div");
    box.classList.add("clock-box");
    box.innerHTML = `<h4>${tz.flag} ${tz.country}</h4><p id="${tz.code.replace("/", "-")}">--:--:--</p>`;
    clockContainer.appendChild(box);
  });
}
renderClocks();

// Update all clocks every second
function updateWorldClocks() {
  timezones.forEach(tz => {
    const timeElem = document.getElementById(tz.code.replace("/", "-"));
    const now = new Date();
    timeElem.textContent = now.toLocaleTimeString("en-US", { timeZone: tz.code });
  });
}
setInterval(updateWorldClocks, 1000);
updateWorldClocks();

// Function to add a new custom clock
function addCustomClock() {
  const country = document.getElementById("new-country").value.trim();
  const tz = document.getElementById("new-tz").value.trim();
  if(!country || !tz) return alert("Please fill both fields.");
  // Add to array
  timezones.push({ country, code: tz, flag: "🌏" });
  // Clear inputs
  document.getElementById("new-country").value = "";
  document.getElementById("new-tz").value = "";
  // Re-render clocks
  renderClocks();
  updateWorldClocks();
}
