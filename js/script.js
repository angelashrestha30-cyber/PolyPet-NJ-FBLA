// ===============================
// POLYPET MAIN SCRIPT
// ===============================

// -------------------------------
// SCROLL NAVIGATION
// -------------------------------

function scrollToSection(id){
  document.getElementById(id).scrollIntoView({
    behavior:"smooth"
  });
}

// -------------------------------
// PET SYSTEM
// -------------------------------

let level = 1;
let xp = 0;
let streak = 0;

const xpNeeded = 100;

const petMessages = {
  fox: "Clever like a fox, keep up the great work! 🌟",
  wolf: "That's some howling progress! Pawsome work! 🐺",
  panda: "Panda-tastic effort! Keep learning! 🐼",
  cat: "Purr-fect progress! Keep going! 🐱"
};

let petCollection = [
  {name:"Fox", emoji:"🦊", language:"Spanish"}
];

let currentPet = petCollection[0];

// -------------------------------
// PET NAME
// -------------------------------

document.getElementById("pet-name-btn").addEventListener("click",function(){

  const input = document.getElementById("pet-name-input");

  if(input.value.trim() !== ""){
    document.getElementById("pet-name-display").textContent = input.value;
    input.value = "";
  }

});

// -------------------------------
// GREETING BASED ON TIME
// -------------------------------

function setGreeting(){

  const greeting = document.getElementById("dynamicGreeting");
  const hour = new Date().getHours();

  let message = "Welcome Back";

  if(hour < 12){
    message = "Good Morning";
  }
  else if(hour < 18){
    message = "Good Afternoon";
  }
  else{
    message = "Good Evening";
  }

  greeting.textContent = `${message}, Emma!`;

}

setGreeting();

// -------------------------------
// XP / LEVEL SYSTEM
// -------------------------------

function completeLesson(){

  xp += 25;
  streak++;

  if(xp >= xpNeeded){
    level++;
    xp = 0;
  }

  updateStats();
  launchConfetti();

}

function updateStats(){

  document.getElementById("level").textContent = level;
  document.getElementById("streak").textContent = streak;

  const fill = document.getElementById("xp-fill");

  fill.style.width = (xp/xpNeeded)*100 + "%";

}

// -------------------------------
// PET COLLECTION
// -------------------------------

function collectPet(language){

  let pet;

  if(language === "Spanish"){
    pet = {name:"Fox", emoji:"🦊", language:"Spanish"};
  }

  if(language === "Mandarin"){
    pet = {name:"Panda", emoji:"🐼", language:"Mandarin"};
  }

  if(language === "Japanese"){
    pet = {name:"Cat", emoji:"🐱", language:"Japanese"};
  }

  petCollection.push(pet);

  renderPets();
  launchConfetti();

}

function renderPets(){

  const container = document.getElementById("pet-collection");

  container.innerHTML = "";

  petCollection.forEach(pet =>{

    const card = document.createElement("div");

    card.className = "pet-card";

    card.innerHTML = `
      <div class="pet-emoji">${pet.emoji}</div>
      <div class="pet-name">${pet.name}</div>
      <div class="language-badge">${pet.language}</div>
    `;

    container.appendChild(card);

  });

}

renderPets();

// -------------------------------
// SCHEDULE FILTER
// -------------------------------

function filterSchedule(type){

  const events = document.querySelectorAll(".event");

  events.forEach(event =>{

    if(type === "all"){
      event.style.display = "block";
    }
    else{
      if(event.classList.contains(type)){
        event.style.display = "block";
      }
      else{
        event.style.display = "none";
      }
    }

  });

}

// -------------------------------
// LESSON SCHEDULER
// -------------------------------

function scheduleLesson(){

  const dateInput = document.getElementById("lesson-date");
  const lessonList = document.getElementById("lesson-list");

  const date = dateInput.value;

  if(!date){
    alert("Please choose a date.");
    return;
  }

  const li = document.createElement("li");

  li.textContent = "📚 Lesson scheduled on " + date;

  lessonList.appendChild(li);

  dateInput.value = "";

}

// -------------------------------
// WORLD CLOCK
// -------------------------------

let timezones = [

  {country:"USA (EST)", code:"America/New_York", flag:"🇺🇸"},
  {country:"Spain", code:"Europe/Madrid", flag:"🇪🇸"},
  {country:"Japan", code:"Asia/Tokyo", flag:"🇯🇵"}

];

function renderClocks(){

  const container = document.getElementById("clock-container");

  container.innerHTML = "";

  timezones.forEach(zone =>{

    const div = document.createElement("div");

    div.className = "clock";

    const time = new Date().toLocaleTimeString("en-US",{
      timeZone:zone.code,
      hour:"2-digit",
      minute:"2-digit"
    });

    div.innerHTML = `
      <h4>${zone.flag} ${zone.country}</h4>
      <p>${time}</p>
    `;

    container.appendChild(div);

  });

}

setInterval(renderClocks,1000);
renderClocks();

document.getElementById("add-clock-btn").addEventListener("click",function(){

  const country = document.getElementById("new-country").value;
  const tz = document.getElementById("new-tz").value;

  if(country === "" || tz === ""){
    alert("Enter both country and timezone");
    return;
  }

  timezones.push({
    country:country,
    code:tz,
    flag:"🌍"
  });

  renderClocks();

  document.getElementById("new-country").value = "";
  document.getElementById("new-tz").value = "";

});

// -------------------------------
// RESOURCE TABS
// -------------------------------

function showResource(id){

  const resources = document.querySelectorAll(".resource-content");

  resources.forEach(r=>{
    r.style.display = "none";
  });

  document.getElementById(id).style.display = "block";

}

// -------------------------------
// FLASHCARDS
// -------------------------------

let flashcards = [];
let currentCard = 0;
let flipped = false;

function loadSpanishLevel3(){

  flashcards = [
    {front:"Hola",back:"Hello"},
    {front:"Adiós",back:"Goodbye"},
    {front:"Gracias",back:"Thank you"},
    {front:"Perro",back:"Dog"},
    {front:"Gato",back:"Cat"}
  ];

  currentCard = 0;
  flipped = false;

  document.getElementById("flashcard").textContent = flashcards[0].front;

}

function flipCard(){

  if(flashcards.length === 0) return;

  const card = document.getElementById("flashcard");

  if(!flipped){
    card.textContent = flashcards[currentCard].back;
    flipped = true;
  }
  else{
    card.textContent = flashcards[currentCard].front;
    flipped = false;
  }

}

function nextCard(){

  if(flashcards.length === 0) return;

  currentCard++;

  if(currentCard >= flashcards.length){
    currentCard = 0;
  }

  flipped = false;

  document.getElementById("flashcard").textContent = flashcards[currentCard].front;

}

// -------------------------------
// PRACTICE MODE
// -------------------------------

let practiceQuestions = [
  {q:"Translate 'Hola'",a:"hello"},
  {q:"Translate 'Gracias'",a:"thank you"},
  {q:"Translate 'Perro'",a:"dog"}
];

let currentPractice = 0;

function startPractice(){

  currentPractice = 0;

  document.getElementById("practiceQuestion").textContent = practiceQuestions[0].q;

}

function checkPractice(){

  const input = document.getElementById("practiceInput").value.toLowerCase();

  const answer = practiceQuestions[currentPractice].a;

  const result = document.getElementById("practiceResult");

  if(input === answer){
    result.textContent = "✅ Correct!";
  }
  else{
    result.textContent = "❌ Try again";
  }

}

function nextPractice(){

  currentPractice++;

  if(currentPractice >= practiceQuestions.length){
    currentPractice = 0;
  }

  document.getElementById("practiceQuestion").textContent = practiceQuestions[currentPractice].q;

}

// -------------------------------
// UNIT TEST (25 QUESTIONS)
// -------------------------------

const unitTestQuestions = [

{q:"Hola means?",o:["Hello","Bye","Please","Food"],a:"Hello"},
{q:"Perro means?",o:["Dog","Cat","Fish","Bird"],a:"Dog"},
{q:"Gato means?",o:["Dog","Cat","Fish","Bird"],a:"Cat"},
{q:"Libro means?",o:["Book","Pen","Desk","Chair"],a:"Book"},
{q:"Agua means?",o:["Water","Milk","Bread","Juice"],a:"Water"},
{q:"Casa means?",o:["House","Car","School","Park"],a:"House"},
{q:"Amigo means?",o:["Friend","Enemy","Teacher","Doctor"],a:"Friend"},
{q:"Comida means?",o:["Food","Water","Game","Music"],a:"Food"},
{q:"Escuela means?",o:["School","House","City","Book"],a:"School"},
{q:"Familia means?",o:["Family","Friends","Team","Group"],a:"Family"},
{q:"Rojo means?",o:["Red","Blue","Green","Yellow"],a:"Red"},
{q:"Azul means?",o:["Red","Blue","Green","Yellow"],a:"Blue"},
{q:"Grande means?",o:["Big","Small","Fast","Slow"],a:"Big"},
{q:"Pequeño means?",o:["Big","Small","Fast","Slow"],a:"Small"},
{q:"Correr means?",o:["Run","Eat","Sleep","Read"],a:"Run"},
{q:"Beber means?",o:["Drink","Run","Write","Play"],a:"Drink"},
{q:"Leer means?",o:["Read","Write","Run","Eat"],a:"Read"},
{q:"Escribir means?",o:["Write","Read","Run","Eat"],a:"Write"},
{q:"Hablar means?",o:["Speak","Sleep","Play","Eat"],a:"Speak"},
{q:"Escuchar means?",o:["Listen","Speak","Play","Run"],a:"Listen"},
{q:"Rápido means?",o:["Fast","Slow","Big","Small"],a:"Fast"},
{q:"Lento means?",o:["Fast","Slow","Big","Small"],a:"Slow"},
{q:"Día means?",o:["Day","Night","Week","Year"],a:"Day"},
{q:"Noche means?",o:["Day","Night","Week","Year"],a:"Night"},
{q:"Gracias means?",o:["Thank you","Hello","Goodbye","Please"],a:"Thank you"}

];

function loadTest(){

  const container = document.getElementById("unitTest");

  container.innerHTML = "";

  unitTestQuestions.forEach((q,i)=>{

    const div = document.createElement("div");

    div.innerHTML = `<p>${i+1}. ${q.q}</p>`;

    q.o.forEach(opt=>{

      div.innerHTML += `
      <label>
      <input type="radio" name="q${i}" value="${opt}">
      ${opt}
      </label><br>`;

    });

    container.appendChild(div);

  });

  const btn = document.createElement("button");

  btn.textContent = "Submit Test";

  btn.onclick = gradeTest;

  container.appendChild(btn);

}

function gradeTest(){

  let score = 0;

  unitTestQuestions.forEach((q,i)=>{

    const selected = document.querySelector(`input[name="q${i}"]:checked`);

    if(selected && selected.value === q.a){
      score++;
    }

  });

  document.getElementById("unitTest").innerHTML =
  `<h3>Your Score: ${score} / ${unitTestQuestions.length}</h3>`;

}

loadTest();

// -------------------------------
// CONFETTI
// -------------------------------

function launchConfetti(){

  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  for(let i=0;i<100;i++){

    ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;

    ctx.fillRect(
      Math.random()*canvas.width,
      Math.random()*canvas.height,
      6,
      6
    );

  }

  setTimeout(()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
  },500);

}
