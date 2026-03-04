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

// WORLD CLOCKS
function updateClocks(){
  const now = new Date();
  document.getElementById("nj-time").textContent = now.toLocaleTimeString("en-US",{timeZone:"America/New_York"});
  document.getElementById("ca-time").textContent = now.toLocaleTimeString("en-US",{timeZone:"America/Los_Angeles"});
  document.getElementById("uk-time").textContent = now.toLocaleTimeString("en-GB",{timeZone:"Europe/London"});
}
setInterval(updateClocks,1000);
updateClocks();

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
  requestAnimationFrame(animate
// SPEECH BUBBLE PARTICLES
const bubbleContainer = document.querySelector(".bubble-particles");
for(let i=0;i<5;i++){
  const bubble = document.createElement("span");
  bubbleContainer.appendChild(bubble);
}
