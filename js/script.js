// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", function () {

  // SCROLL
  window.scrollToSection = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  // PET XP
  let xp = parseInt(localStorage.getItem("xp")||0);
  let level = parseInt(localStorage.getItem("level")||1);
  let streak = parseInt(localStorage.getItem("streak")||0);

  function updatePetUI(){
    document.getElementById("level").textContent = level;
    document.getElementById("streak").textContent = streak;
    document.getElementById("xp-fill").style.width = (xp % 100) + "%";
  }

  window.completeLesson = function(){
    xp+=20; streak++;
    if(xp>=level*100){ level++; launchConfetti(); }
    localStorage.setItem("xp",xp); localStorage.setItem("level",level); localStorage.setItem("streak",streak);
    updatePetUI();
  }
  updatePetUI();

  // SCHEDULE FILTER
  window.filterSchedule = day => {
    document.querySelectorAll('.event').forEach(e => e.style.display = (day==="all"||e.classList.contains(day))?"block":"none");
  }

  // CALENDAR
  window.scheduleLesson = () => {
    const date = document.getElementById("lesson-date").value;
    if(!date) return;
    const li = document.createElement("li"); li.textContent = "Lesson scheduled for " + date;
    document.getElementById("lesson-list").appendChild(li);
  }

  // FADE IN
  const sections = document.querySelectorAll(".section");
  function fadeInSections(){sections.forEach(s=>{if(s.getBoundingClientRect().top<window.innerHeight-100)s.classList.add("visible");});}
  fadeInSections(); window.addEventListener("scroll", fadeInSections);

  // GREETING
  const h = new Date().getHours();
  document.getElementById("dynamicGreeting").textContent = h<12?"Good Morning, Emma ☀️":h<18?"Good Afternoon, Emma 🌸":"Good Evening, Emma 🌙";

  // CONFETTI
  const canvas=document.getElementById("confettiCanvas"),ctx=canvas.getContext("2d");canvas.width=window.innerWidth;canvas.height=window.innerHeight;let confetti=[];
  function launchConfetti(){for(let i=0;i<100;i++){confetti.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height-canvas.height,size:Math.random()*6+4,speed:Math.random()*3+2});}animateConfetti();}
  function animateConfetti(){ctx.clearRect(0,0,canvas.width,canvas.height);confetti.forEach(p=>{p.y+=p.speed;ctx.fillStyle="#ff7f7f";ctx.fillRect(p.x,p.y,p.size,p.size);});confetti=confetti.filter(p=>p.y<canvas.height);if(confetti.length>0)requestAnimationFrame(animateConfetti);}

  // WORLD CLOCK
  let timezones=[{country:"Japan",code:"Asia/Tokyo",flag:"🇯🇵"},{country:"Spain",code:"Europe/Madrid",flag:"🇪🇸"},{country:"China",code:"Asia/Shanghai",flag:"🇨🇳"}];
  const container=document.getElementById("clock-container");
  function createSafeId(str){return str.replace(/\//g,"-").replace(/\s/g,"").toLowerCase();}
  function renderClocks(){if(!container)return;container.innerHTML="";timezones.forEach(tz=>{const id=createSafeId(tz.code);const box=document.createElement("div");box.classList.add("clock-box");box.innerHTML=`<h4>${tz.flag} ${tz.country}</h4><p id="${id}">--:--:--</p>`;container.appendChild(box);});}
  function updateWorldClocks(){const now=new Date();timezones.forEach(tz=>{const id=createSafeId(tz.code);const el=document.getElementById(id);if(el)el.textContent=now.toLocaleTimeString("en-US",{timeZone:tz.code});});}
  document.getElementById("add-clock-btn")?.addEventListener("click",()=>{const c=document.getElementById("new-country").value.trim();const t=document.getElementById("new-tz").value.trim();if(!c||!t)return alert("Enter country and timezone");timezones.push({country:c,code:t,flag:"🌍"});document.getElementById("new-country").value="";document.getElementById("new-tz").value="";renderClocks();});
  renderClocks();updateWorldClocks();setInterval(updateWorldClocks,1000);

  // RESOURCE NAV
  window.showResource = name => {
    document.querySelectorAll(".resource-content").forEach(r=>r.style.display="none");
    document.getElementById(name)?.style.display="block";
  }

  // FLASHCARDS
  const flashcards = [
    {front:"Hola",back:"Hello"},{front:"Adiós",back:"Goodbye"},{front:"Gracias",back:"Thank you"},{front:"Por favor",back:"Please"}
  ];
  let currentCard=0,flipped=false;
  window.loadSpanishLevel3 = ()=>{currentCard=0;flipped=false;showCard();}
  function showCard(){document.getElementById("flashcard")&&(document.getElementById("flashcard").textContent=flipped?flashcards[currentCard].back:flashcards[currentCard].front);}
  window.flipCard=()=>{flipped=!flipped;showCard();}
  window.nextCard=()=>{currentCard=(currentCard+1)%flashcards.length;flipped=false;showCard();}

  // PRACTICE MODE UNITS 1-5
  const practiceUnits={
    1:[{word:"Hola",translation:"Hello",sentence:"Hola, ¿cómo estás?"},{word:"Adiós",translation:"Goodbye",sentence:"Adiós, hasta luego."},{word:"Gracias",translation:"Thank you",sentence:"Gracias por tu ayuda."},{word:"Por favor",translation:"Please",sentence:"Por favor, pasa la sal."}],
    2:[{word:"Perro",translation:"Dog",sentence:"El perro corre rápido."},{word:"Gato",translation:"Cat",sentence:"El gato duerme mucho."},{word:"Casa",translation:"House",sentence:"Mi casa es grande."},{word:"Escuela",translation:"School",sentence:"Voy a la escuela."}],
    3:[{word:"Libro",translation:"Book",sentence:"Estoy leyendo un libro."},{word:"Comida",translation:"Food",sentence:"La comida está deliciosa."},{word:"Agua",translation:"Water",sentence:"Necesito beber agua."},{word:"Amigo",translation:"Friend",sentence:"Mi amigo es simpático."}],
    4:[{word:"Familia",translation:"Family",sentence:"Mi familia es muy unida."},{word:"Feliz",translation:"Happy",sentence:"Estoy feliz hoy."},{word:"Triste",translation:"Sad",sentence:"Ella está triste."},{word:"Rápido",translation:"Fast",sentence:"Él corre rápido."}],
    5:[{word:"Lento",translation:"Slow",sentence:"El caracol es lento."},{word:"Correr",translation:"Run",sentence:"Me gusta correr en el parque."},{word:"Caminar",translation:"Walk",sentence:"Vamos a caminar juntos."},{word:"Dormir",translation:"Sleep",sentence:"Quiero dormir ocho horas."}]
  };
  let currentUnit=1,currentExercise="translate",currentIndex=0;
  window.startExercise=exType=>{currentExercise=exType;currentIndex=0;loadQuestion();}
  function loadQuestion(){
    const q=practiceUnits[currentUnit][currentIndex];
    const questionEl=document.getElementById("practiceQuestion");
    const inputEl=document.getElementById("practiceInput"); inputEl.value=""; document.getElementById("practiceResult").textContent="";
    if(currentExercise==="translate") questionEl.textContent=`Translate this word: ${q.word}`;
    else if(currentExercise==="fillblank") questionEl.textContent=q.sentence.replace(q.word,"_____");
    else if(currentExercise==="sentence") questionEl.textContent=`Arrange the words: ${q.sentence.split(" ").sort(()=>Math.random()-
