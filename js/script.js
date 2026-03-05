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
  let flashcards = [
    {front:"Aunque", back:"Although"},
    {front:"Sin embargo", back:"However"},
    {front:"A pesar de", back:"Despite"},
    {front:"Lograr", back:"To achieve"},
    {front:"Desarrollar", back:"To develop"}
  ];
  let currentCard = 0;
  let flipped = false;

  window.loadSpanishLevel3 = function(){
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
  window.checkPractice = function(){
    const input = document.getElementById("practiceInput").value.toLowerCase();
    const result = document.getElementById("practiceResult");
    if(input==="aunque") result.textContent="✅ Correct!";
    else result.textContent="❌ Try again.";
  }

  // ================= UNIT TEST (25 QUESTIONS) =================
  const unitTestQuestions = [
    { type:"mc", question:"Translate 'Aunque' into English.", options:["However","Although","Despite"], answer:"Although" },
    { type:"mc", question:"Translate 'Sin embargo' into English.", options:["However","Although","Therefore"], answer:"However" },
    { type:"mc", question:"Translate 'Lograr' into English.", options:["To fail","To achieve","To forget"], answer:"To achieve" },
    { type:"short", question:"Translate 'Desarrollar' into English.", answer:"To develop" },
    { type:"mc", question:"Choose the correct article: ___ apple", options:["A","An","The"], answer:"An" },
    { type:"short", question:"Fill in the blank: I ___ happy today.", answer:"am" },
    { type:"mc", question:"Select the synonym of 'big'", options:["Small","Large","Tiny"], answer:"Large" },
    { type:"short", question:"Conjugate 'to be' for he: ___", answer:"is" },
    { type:"mc", question:"Translate 'A pesar de' into English.", options:["Although","Despite","Because"], answer:"Despite" },
    { type:"short", question:"Plural of 'child' is ___", answer:"children" },
    { type:"mc", question:"Choose the past tense of 'go'", options:["Goed","Went","Gone"], answer:"Went" },
    { type:"short", question:"Translate 'Perro' into English.", answer:"Dog" },
    { type:"mc", question:"Which is an adjective?", options:["Run","Beautiful","Swim"], answer:"Beautiful" },
    { type:"short", question:"Opposite of 'hot'", answer:"cold" },
    { type:"mc", question:"Translate 'Gracias' into English.", options:["Please","Thank you","Sorry"], answer:"Thank you" },
    { type:"short", question:"Fill in the blank: She ___ to school.", answer:"goes" },
    { type:"mc", question:"Select correct preposition: I live ___ London.", options:["on","in","at"], answer:"in" },
    { type:"short", question:"Past tense of 'eat' is ___", answer:"ate" },
    { type:"mc", question:"Translate 'Amigo' into English.", options:["Friend","Enemy","Brother"], answer:"Friend" },
    { type:"short", question:"Plural of 'mouse' is ___", answer:"mice" },
    { type:"mc", question:"Choose the synonym of 'happy'", options:["Sad","Joyful","Angry"], answer:"Joyful" },
    { type:"short", question:"Translate 'Hola' into English.", answer:"Hello" },
    { type:"mc", question:"Which is a verb?", options:["Quick","Run","Blue"], answer:"Run" },
    { type:"short", question:"Fill in the blank: They ___ playing.", answer:"are" },
    { type:"mc", question:"Choose the past tense of 'see'", options:["Saw","Seen","Seed"], answer:"Saw" },
  ];

  const testContainer = document.getElementById("unitTest");
  if(testContainer){
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

      testContainer.appendChild(qDiv);
    });

    const submitBtn = document.createElement("button");
    submitBtn.textContent="Submit Test";
    submitBtn.style.padding="10px 18px";
    submitBtn.style.background="#ff7f7f";
    submitBtn.style.color="white";
    submitBtn.style.border="none";
    submitBtn.style.borderRadius="10px";
    submitBtn.style.cursor="pointer";
    submitBtn.style.fontWeight="600";
    submitBtn.addEventListener("click",()=>{
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
    });
    testContainer.appendChild(submitBtn);
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
