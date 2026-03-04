// SMOOTH SCROLL
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

// WORLD CLOCKS
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

// PET XP + STREAK
let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0;
let level = localStorage.getItem("level") ? parseInt(localStorage.getItem("level")) : 1;
let streak = localStorage.getItem("streak") ? parseInt(localStorage.getItem("streak")) : 0;
function updatePetUI(){
  document.getElementById("level").textContent = level;
  document.getElementById("streak").textContent = streak;
}
function completeLesson(){
  xp += 20; streak += 1;
  if(xp >= level * 100) level++;
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
  localStorage.setItem("streak", streak);
  updatePetUI();
}
updatePetUI();

// DYNAMIC GREETING
function setGreeting(){
  const hour = new Date().getHours();
  let greeting;
  if(hour < 12) greeting = "Good Morning, Emma ☀️";
  else if(hour < 18) greeting = "Good Afternoon, Emma 🌸";
  else greeting = "Good Evening, Emma 🌙";
  document.getElementById("dynamicGreeting").textContent = greeting;
}
setGreeting();

// LESSON POPUP
const lessonModule = document.getElementById("lesson-module");
const lessonContent = document.getElementById("lesson-content");
function openLesson(name){
  lessonContent.style.display = "block";
  lessonModule.innerHTML = "";
  if(name === "spanish"){
    lessonModule.innerHTML = `<h2>Spanish Basics</h2><p>Start learning Spanish today!</p>`;
  } else if(name === "kanji"){
    lessonModule.innerHTML = `<h2>Kanji Practice</h2><p>Practice Kanji characters.</p>`;
  } else if(name === "grammar"){
    lessonModule.innerHTML = `<h2>Grammar Quiz</h2><p>Test your grammar knowledge.</p>`;
  }
}
function closeLesson(){ lessonContent.style.display = "none"; }

// TUTOR SCHEDULING
function scheduleTutor(){
  const date = document.getElementById("tutor-date").value;
  const time = document.getElementById("tutor-time").value;
  if(!date || !time) return;
  const li = document.createElement("li");
  li.textContent = `Lesson scheduled on ${date} at ${time}`;
  document.getElementById("tutor-list").appendChild(li);
}
