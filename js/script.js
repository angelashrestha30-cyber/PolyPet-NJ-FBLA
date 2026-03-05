// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", function () {

  // ================= SCROLLING =================
  window.scrollToSection = function(id){
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:"smooth"});
  }

  // ================= PET XP / LEVEL / STREAK =================
  let xp = parseInt(localStorage.getItem("xp")||"0");
  let level = parseInt(localStorage.getItem("level")||"1");
  let streak = parseInt(localStorage.getItem("streak")||"0");

  function updatePetUI(){
    document.getElementById("level").textContent = level;
    document.getElementById("streak").textContent = streak;
    document.getElementById("xp-fill").style.width = (xp%100)+"%";
  }

  window.completeLesson = function(){
    xp+=20; streak++;
    if(xp>=level*100){ level++; launchConfetti();}
    localStorage.setItem("xp",xp);
    localStorage.setItem("level",level);
    localStorage.setItem("streak",streak);
    updatePetUI();
  }
  updatePetUI();

  // ================= SCHEDULE FILTER =================
  window.filterSchedule = function(day){
    document.querySelectorAll(".event").forEach(ev=>{
      ev.style.display = (day==="all" || ev.classList.contains(day))?"block":"none";
    });
  }

  // ================= INTERACTIVE CALENDAR =================
  window.scheduleLesson = function(){
    const date=document.getElementById("lesson-date").value;
    if(!date) return;
    const li=document.createElement("li");
    li.textContent="Lesson scheduled for "+date;
    document.getElementById("lesson-list").appendChild(li);
  }

  // ================= FADE-IN SECTIONS =================
  const sections=document.querySelectorAll(".section");
  function fadeInSections(){
    sections.forEach(sec=>{
      if(sec.getBoundingClientRect().top < window.innerHeight-100) sec.classList.add("visible");
    });
  }
  fadeInSections();
  window.addEventListener("scroll",fadeInSections);

  // ================= TIME GREETING =================
  function setGreeting(){
    const hour=new Date().getHours();
    let greet=(hour<12)?"Good Morning, Emma ☀️":(hour<18)?"Good Afternoon, Emma 🌸":"Good Evening, Emma 🌙";
    document.getElementById("dynamicGreeting").textContent=greet;
  }
  setGreeting();

  // ================= CONFETTI =================
  const canvas=document.getElementById("confettiCanvas");
  const ctx=canvas.getContext("2d");
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  let confetti=[];
  function launchConfetti(){
    for(let i=0;i<100;i++) confetti.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height-canvas.height, size:Math.random()*6+4, speed:Math.random()*3+2});
    animateConfetti();
  }
  function animateConfetti(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confetti.forEach(p=>{p.y+=p.speed; ctx.fillStyle="#ff7f7f"; ctx.fillRect(p.x,p.y,p.size,p.size);});
    confetti=confetti.filter(p=>p.y<canvas.height);
    if(confetti.length>0) requestAnimationFrame(animateConfetti);
  }

  // ================= WORLD CLOCK =================
  let timezones=[{country:"Japan",code:"Asia/Tokyo",flag:"🇯🇵"},{country:"Spain",code:"Europe/Madrid",flag:"🇪🇸"},{country:"China",code:"Asia/Shanghai",flag:"🇨🇳"}];
  function createSafeId(str){ return str.replace(/\//g,"-").replace(/\s/g,"").toLowerCase(); }
  function renderClocks(){
    const container=document.getElementById("clock-container");
    if(!container) return; container.innerHTML="";
    timezones.forEach(tz=>{
      const id=createSafeId(tz.code);
      const div=document.createElement("div"); div.classList.add("clock-box");
      div.innerHTML=`<h4>${tz.flag} ${tz.country}</h4><p id="${id}">--:--:--</p>`;
      container.appendChild(div);
    });
  }
  function updateWorldClocks(){
    const now=new Date();
    timezones.forEach(tz=>{
      const el=document.getElementById(createSafeId(tz.code));
      if(el) el.textContent=now.toLocaleTimeString("en-US",{timeZone:tz.code});
    });
  }
  document.getElementById("add-clock-btn")?.addEventListener("click",()=>{
    const c=document.getElementById("new-country").value.trim();
    const tz=document.getElementById("new-tz").value.trim();
    if(!c||!tz) return alert("Enter country and timezone");
    timezones.push({country:c,code:tz,flag:"🌍"});
    document.getElementById("new-country").value=""; document.getElementById("new-tz").value="";
    renderClocks();
  });
  renderClocks(); updateWorldClocks(); setInterval(updateWorldClocks,1000);

  // ================= RESOURCES =================
  let spanishUnits=[
    [
      {front:"Hola", back:"Hello"},
      {front:"Adiós", back:"Goodbye"},
      {front:"Gracias", back:"Thank you"},
      {front:"Por favor", back:"Please"},
      {front:"Lo siento", back:"Sorry"},
      {front:"Sí", back:"Yes"},
      {front:"No", back:"No"},
      {front:"¿Cómo estás?", back:"How are you?"},
      {front:"Bien", back:"Good"},
      {front:"Mal", back:"Bad"},
      {front:"Amigo", back:"Friend"},
      {front:"Familia", back:"Family"},
      {front:"Comida", back:"Food"},
      {front:"Agua", back:"Water"},
      {front:"Escuela", back:"School"},
      {front:"Libro", back:"Book"},
      {front:"Perro", back:"Dog"},
      {front:"Gato", back:"Cat"},
      {front:"Casa", back:"House"},
      {front:"Trabajo", back:"Work"}
    ]
    // You can add units 2-5 similarly
  ];
  let currentUnit=0; let currentCard=0; let flipped=false;

  window.showResource=function(name){
    document.querySelectorAll(".resource-content").forEach(s=>s.style.display="none");
    document.getElementById(name).style.display="block";
  }

  function loadLanguage(){ // placeholder for future multiple languages
    currentUnit=0; currentCard=0; flipped=false; showCard();
  }

  function showCard(){
    const card=document.getElementById("flashcard");
    if(!card) return;
    card.textContent=flipped?spanishUnits[currentUnit][currentCard].back:spanishUnits[currentUnit][currentCard].front;
  }
  window.flipCard=function(){flipped=!flipped; showCard();}
  window.nextCard=function(){currentCard=(currentCard+1)%spanishUnits[currentUnit].length; flipped=false; showCard();}

  // Practice
  function loadPracticeQuestion(){
    const question=document.getElementById("practiceQuestion");
    question.textContent="Translate: "+spanishUnits[currentUnit][currentCard].front;
  }
  window.checkPractice=function(){
    const input=document.getElementById("practiceInput").value.toLowerCase();
    const correct=spanishUnits[currentUnit][currentCard].back.toLowerCase();
    const feedback=document.getElementById("practiceFeedback");
    if(input===correct){ feedback.textContent="✅ Correct!"; currentCard=(currentCard+1)%spanishUnits[currentUnit].length; loadPracticeQuestion(); }
    else feedback.textContent=`❌ Wrong. Correct: ${spanishUnits[currentUnit][currentCard].back}`;
  }
  loadPracticeQuestion();

  // Unit Test
  window.submitTest=function(){
    let score=0; let results="";
    spanishUnits[currentUnit].forEach((card,i)=>{
      const val=document.getElementById("testInput"+i)?.value.trim();
      if(val?.toLowerCase()===card.back.toLowerCase()){ score++; results+="<p>"+(i+1)+". Correct!</p>"; }
      else results+="<p>"+(i+1)+". Wrong. Your answer: "+val+" | Correct: "+card.back+"</p>";
    });
    document.getElementById("testScore").textContent="Score: "+score+"/"+spanishUnits[currentUnit].length;
    document.getElementById("testResults").innerHTML=results;
  }

  showResource('videoLesson'); // default view

});
