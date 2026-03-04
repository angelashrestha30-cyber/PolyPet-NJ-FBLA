// ====== SCROLLING ======
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

// ====== SCHEDULE FILTER ======
function filterSchedule(day){
  const events = document.querySelectorAll('.event');
  events.forEach(event=>{
    if(day === "all"){
      event.style.display = "block";
    } else {
      event.style.display = event.classList.contains(day) ? "block" : "none";
    }
  });
}

// ====== WORLD CLOCK ======
function updateClocks(){
  const now = new Date();
  document.getElementById("nj-time").textContent =
    now.toLocaleTimeString("en-US",{timeZone:"America/New_York"});
  document.getElementById("ca-time").textContent =
    now.toLocaleTimeString("en-US",{timeZone:"America/Los_Angeles"});
  document.getElementById("uk-time").textContent =
    now.toLocaleTimeString("en-GB",{timeZone:"Europe/London"});
}
setInterval(updateClocks,1000);
updateClocks();

// ====== PET XP SYSTEM ======
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

  if(xp >= level * 100){
    level++;
    launchConfetti();
  }

  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("streak", streak);

  updatePetUI();
}
updatePetUI();

// ====== DYNAMIC GREETING ======
function setGreeting(){
  const hour = new Date().getHours();
  let greeting;
  if(hour < 12){
    greeting = "Good Morning, Emma ☀️";
  } else if(hour < 18){
    greeting = "Good Afternoon, Emma 🌸";
  } else {
    greeting = "Good Evening, Emma 🌙";
  }
  document.getElementById("dynamicGreeting").textContent = greeting;
}
setGreeting();

// ====== CONFETTI ======
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

// ====== LESSON MODULE ======
const lessonModule = document.getElementById("lesson-module");
const lessonContent = document.getElementById("lesson-content");

function openLesson(name){
  lessonContent.style.display = "block";
  lessonModule.innerHTML = ""; // Clear previous

  if(name === "spanish"){
    lessonModule.innerHTML = `
      <h2>Spanish Basics</h2>
      <p>Welcome to Spanish! Start with basic greetings and phrases.</p>
      <button onclick="startFlashcards('spanish')">📇 Vocab Flashcards</button>
      <button onclick="startPractice('spanish')">📝 Practice Mode</button>
      <button onclick="startTest('spanish')">📊 Unit Test</button>
    `;
  }
  if(name === "kanji"){
    lessonModule.innerHTML = `
      <h2>Kanji Practice</h2>
      <p>Time to practice Kanji! Learn 5 new characters today.</p>
      <button onclick="startFlashcards('kanji')">📇 Vocab Flashcards</button>
      <button onclick="startPractice('kanji')">📝 Practice Mode</button>
      <button onclick="startTest('kanji')">📊 Unit Test</button>
    `;
  }
  if(name === "grammar"){
    lessonModule.innerHTML = `
      <h2>Grammar Quiz</h2>
      <p>Test your grammar knowledge!</p>
      <button onclick="startFlashcards('grammar')">📇 Vocab Flashcards</button>
      <button onclick="startPractice('grammar')">📝 Practice Mode</button>
      <button onclick="startTest('grammar')">📊 Unit Test</button>
    `;
  }
}

function closeLesson(){
  lessonContent.style.display = "none";
}

// Make lesson cards clickable
document.querySelectorAll(".lesson-card").forEach(card=>{
  card.addEventListener("click",()=>{
    const text = card.querySelector("h4").textContent;
    if(text.includes("Spanish")) openLesson("spanish");
    if(text.includes("Kanji")) openLesson("kanji");
    if(text.includes("Grammar")) openLesson("grammar");
  });
});

// ====== FLASHCARDS ======
function startFlashcards(lang){
  lessonModule.innerHTML = `<h3>${lang} Flashcards</h3>
    <div id="flashcard"></div>
    <button onclick="nextCard()">Next Card</button>`;
  
  window.flashcards = lang === 'spanish' ? ["Hola", "Adiós", "Gracias"] :
                      lang === 'kanji' ? ["日","月","水"] :
                      ["Subject-Verb", "Tense", "Agreement"];
  window.cardIndex = 0;
  document.getElementById("flashcard").textContent = flashcards[0];
}

function nextCard(){
  window.cardIndex = (window.cardIndex + 1) % window.flashcards.length;
  document.getElementById("flashcard").textContent = window.flashcards[window.cardIndex];
}

// ====== PRACTICE MODE / UNIT TEST (PLACEHOLDER) ======
function startPractice(lang){
  lessonModule.innerHTML = `<h3>${lang} Practice Mode</h3><p>Exercises go here...</p>`;
}
function startTest(lang){
  lessonModule.innerHTML = `<h3>${lang} Unit Test</h3><p>Questions go here...</p>`;
}

// ====== TUTOR SCHEDULING ======
function scheduleTutor(){
  const date = document.getElementById("tutor-date").value;
  const time = document.getElementById("tutor-time").value;
  if(!date || !time) return;

  const li = document.createElement("li");
  li.textContent = `Lesson scheduled on ${date} at ${time}`;
  document.getElementById("tutor-list").appendChild(li);
}
