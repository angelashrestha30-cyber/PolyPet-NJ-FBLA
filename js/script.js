document.addEventListener("DOMContentLoaded", function () {

  // ================= SCROLLING =================
  window.scrollToSection = function(id){
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:"smooth"});
  }

  // ================= PET / XP / LEVEL =================
  let xp = parseInt(localStorage.getItem("xp")) || 0;
  let level = parseInt(localStorage.getItem("level")) || 1;
  let streak = parseInt(localStorage.getItem("streak")) || 0;

  let petCollection = [
    {name:"Wolf", emoji:"🐺", language:"German"},
    {name:"Lion", emoji:"🦁", language:"Swahili (Kenya)"}
  ];

  let currentPet = petCollection[0]; // first collected as default

    function updatePetUI(){
  const emojiEl = document.querySelector(".pet-avatar");
  const nameDisplay = document.getElementById("pet-name-display");
   emojiEl.textContent = currentPet.emoji;
nameDisplay.textContent = petName || currentPet.name;
    document.getElementById("level").textContent = level;
    document.getElementById("streak").textContent = streak;
    document.getElementById("xp-fill").style.width = (xp % 100) + "%";
  }
  updatePetUI();

  window.completeLesson = function(){
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

  // ================= PET COLLECTION =================
  function renderPetCollection(){
    const container = document.getElementById("pet-collection");
    container.innerHTML = "";
    petCollection.forEach(pet=>{
      const card = document.createElement("div");
      card.classList.add("pet-card");
      card.innerHTML = `
        <div class="pet-emoji">${pet.emoji}</div>
        <div class="pet-name">${pet.name}</div>
        <div class="language-badge">${pet.language}</div>
      `;
      container.appendChild(card);
    });
  }
  renderPetCollection();

  // ================= COLLECT NEW PET =================
  window.collectPet = function(lang){
    let newPet = null;
    switch(lang){
      case "Spanish": newPet = {name:"Fox", emoji:"🦊", language:"Spanish"}; break;
      case "Mandarin": newPet = {name:"Panda", emoji:"🐼", language:"Mandarin"}; break;
      case "Japanese": newPet = {name:"Cat", emoji:"🐱", language:"Japanese"}; break;
    }
    if(newPet && !petCollection.find(p=>p.name===newPet.name)){
      petCollection.push(newPet);
      renderPetCollection();
      launchConfetti();
      alert(`🎉 You collected a new pet: ${newPet.emoji} ${newPet.name} (${newPet.language})!`);
    } else {
      alert(`${newPet.name} already collected!`);
    }
  }

 // ================= PET NAMING =================
const nameInput = document.getElementById("pet-name-input");
const nameBtn = document.getElementById("pet-name-btn");

if(nameBtn && nameInput){
  nameBtn.addEventListener("click", ()=>{
    const val = nameInput.value.trim();
    if(val){
      petName = val;
      localStorage.setItem("petName", petName);
      updatePetUI();
      nameInput.value = ""; // clear input after renaming
    }
  });
}

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

  window.loadFlashcards = function(){
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
  let practiceQuestions = [
    {question:"Translate 'Aunque' to English", answer:"although"},
    {question:"Translate 'Perro' to English", answer:"dog"}
  ];
  let practiceIndex = 0;

  window.startPractice = function(){
    practiceIndex = 0;
    document.getElementById("practiceInput").value = "";
    document.getElementById("practiceResult").textContent = "";
    document.getElementById("nextPracticeBtn").style.display = "none";
    showPracticeQuestion();
  }

  function showPracticeQuestion(){
    const q = practiceQuestions[practiceIndex];
    document.getElementById("practiceQuestion").textContent = q.question;
  }

  window.checkPractice = function(){
    const input = document.getElementById("practiceInput").value.toLowerCase();
    const result = document.getElementById("practiceResult");
    if(input===practiceQuestions[practiceIndex].answer){
      result.textContent = "✅ Correct!";
      document.getElementById("nextPracticeBtn").style.display = "inline-block";
    } else result.textContent = "❌ Try again.";
  }

  window.nextPractice = function(){
    practiceIndex = (practiceIndex + 1) % practiceQuestions.length;
    document.getElementById("practiceInput").value = "";
    document.getElementById("practiceResult").textContent = "";
    document.getElementById("nextPracticeBtn").style.display = "none";
    showPracticeQuestion();
  }
// ================= UNIT TEST QUESTIONS =================
const unitTestQuestions = [
{type:"mc", question:"What does 'aunque' mean?", options:["Although","Because","Before","After"], answer:"Although"},
{type:"mc", question:"Translate 'perro'", options:["Cat","Dog","Bird","Fish"], answer:"Dog"},
{type:"mc", question:"Translate 'gato'", options:["Dog","Mouse","Cat","Horse"], answer:"Cat"},
{type:"mc", question:"What does 'sin embargo' mean?", options:["However","Because","Therefore","Before"], answer:"However"},
{type:"mc", question:"Translate 'libro'", options:["Pen","Book","Paper","Chair"], answer:"Book"},

{type:"short", question:"Translate 'hola'", answer:"hello"},
{type:"short", question:"Translate 'gracias'", answer:"thank you"},
{type:"short", question:"Translate 'escuela'", answer:"school"},
{type:"short", question:"Translate 'comida'", answer:"food"},
{type:"short", question:"Translate 'familia'", answer:"family"},

{type:"mc", question:"Translate 'correr'", options:["To run","To eat","To sleep","To drink"], answer:"To run"},
{type:"mc", question:"Translate 'beber'", options:["To eat","To drink","To run","To jump"], answer:"To drink"},
{type:"mc", question:"Translate 'comer'", options:["To eat","To drink","To walk","To talk"], answer:"To eat"},
{type:"mc", question:"Translate 'escuchar'", options:["To listen","To run","To jump","To write"], answer:"To listen"},
{type:"mc", question:"Translate 'hablar'", options:["To talk","To eat","To drink","To walk"], answer:"To talk"},

{type:"short", question:"Translate 'amigo'", answer:"friend"},
{type:"short", question:"Translate 'casa'", answer:"house"},
{type:"short", question:"Translate 'agua'", answer:"water"},
{type:"short", question:"Translate 'pan'", answer:"bread"},
{type:"short", question:"Translate 'día'", answer:"day"},

{type:"mc", question:"Translate 'feliz'", options:["Happy","Sad","Angry","Cold"], answer:"Happy"},
{type:"mc", question:"Translate 'triste'", options:["Happy","Sad","Fast","Cold"], answer:"Sad"},
{type:"mc", question:"Translate 'rápido'", options:["Fast","Slow","Hot","Cold"], answer:"Fast"},
{type:"mc", question:"Translate 'caliente'", options:["Cold","Hot","Fast","Big"], answer:"Hot"},
{type:"mc", question:"Translate 'grande'", options:["Small","Big","Fast","Cold"], answer:"Big"}
];
  // ================= UNIT TEST =================
  const unitTestForm = document.getElementById("unitTest");
  if(unitTestForm){
    unitTestQuestions.forEach((q,i)=>{
      const qDiv = document.createElement("div");
      qDiv.classList.add("question-box");
      qDiv.style.marginBottom = "20px";
      const qTitle = document.createElement("p");
      qTitle.textContent = (i+1)+". "+q.question;
      qDiv.appendChild(qTitle);

      if(q.type==="mc"){
        q.options.forEach(opt=>{
          const label = document.createElement("label");
          label.style.display="block";
          const input = document.createElement("input");
          input.type="radio";
          input.name="q"+i;
          input.value=opt;
          label.appendChild(input);
          label.appendChild(document.createTextNode(" "+opt));
          qDiv.appendChild(label);
        });
      } else if(q.type==="short"){
        const input = document.createElement("input");
        input.type="text";
        input.id="q"+i;
        input.style.width="60%";
        input.style.padding="6px";
        input.style.marginTop="6px";
        qDiv.appendChild(input);
      }

      unitTestForm.appendChild(qDiv);
    });
  }

  window.submitTest = function(){
    let score=0;
    unitTestQuestions.forEach((q,i)=>{
      if(q.type==="mc"){
        const selected = document.querySelector('input[name="q'+i+'"]:checked');
        if(selected && selected.value===q.answer) score++;
      } else if(q.type==="short"){
        const answerInput = document.getElementById("q"+i);
        if(answerInput && answerInput.value.trim().toLowerCase() === q.answer.toLowerCase()) score++;
      }
    });
    alert("Score: "+score+"/"+unitTestQuestions.length);
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
