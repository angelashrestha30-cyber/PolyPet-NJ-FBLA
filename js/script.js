function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

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
document.addEventListener("mousemove",(e)=>{
  const cards = document.querySelectorAll(".lesson-card");
  cards.forEach(card=>{
    const x = (window.innerWidth/2 - e.pageX)/40;
    const y = (window.innerHeight/2 - e.pageY)/40;
    card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  });
});
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
  document.getElementById("dynamicGreeting").textContent = greeting;
}

setGreeting();
