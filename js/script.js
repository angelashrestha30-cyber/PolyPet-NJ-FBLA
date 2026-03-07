document.addEventListener("DOMContentLoaded", function () {

  // ================= SCROLL =================
  window.scrollToSection = function(id){
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:"smooth"});
  }

  // ================= PET DATA =================
  let xp = parseInt(localStorage.getItem("xp")) || 0;
  let level = parseInt(localStorage.getItem("level")) || 1;
  let streak = parseInt(localStorage.getItem("streak")) || 0;
  let petCollection = JSON.parse(localStorage.getItem("petCollection")) || [
    {name:"Fox", emoji:"🦊", language:"Starter"}
  ];
  let currentPet = JSON.parse(localStorage.getItem("currentPet")) || petCollection[0];
  let petName = localStorage.getItem("petName") || "Pika";

  function updatePetUI(){
    const avatar = document.querySelector(".pet-avatar");
    const nameDisplay = document.getElementById("pet-name-display");
    if(avatar) avatar.textContent = currentPet.emoji;
    if(nameDisplay) nameDisplay.textContent = petName;
    document.getElementById("level").textContent = level;
    document.getElementById("streak").textContent = streak;
    document.getElementById("xp-fill").style.width = (xp % 100) + "%";
    // Background gradient
    document.body.style.background = currentPet.name==="Wolf" 
      ? "linear-gradient(180deg,#e6f2ff,#b3d9ff)"
      : "linear-gradient(180deg,#fff6f6,#ffd6d6)";
  }
  updatePetUI();

  // ================= PET RENAME =================
  const nameBtn = document.getElementById("pet-name-btn");
  const nameInput = document.getElementById("pet-name-input");
  if(nameBtn){
    nameBtn.addEventListener("click", function(){
      const newName = nameInput.value.trim();
      if(newName){
        petName = newName;
        localStorage.setItem("petName", newName);
        updatePetUI();
        nameInput.value="";
      }
    });
  }

  // ================= LESSON XP =================
  window.completeLesson = function(){
    xp += 20;
    streak += 1;
    if(xp >= level*100){ level++; launchConfetti(); }
    localStorage.setItem("xp",xp);
    localStorage.setItem("level",level);
    localStorage.setItem("streak",streak);
    updatePetUI();
  }

  // ================= PET COLLECTION =================
  function renderPetCollection(){
    const container = document.getElementById("pet-collection");
    if(!container) return;
    container.innerHTML="";
    petCollection.forEach(pet=>{
      const card=document.createElement("div");
      card.className="pet-card";
      card.innerHTML=`
        <div class="pet-emoji">${pet.emoji}</div>
        <div class="pet-name">${pet.name}</div>
        <div class="language-badge">${pet.language}</div>`;
      card.addEventListener("click",function(){
        currentPet = pet;
        localStorage.setItem("currentPet",JSON.stringify(pet));
        updatePetUI();
      });
      container.appendChild(card);
    });
  }
  renderPetCollection();

  window.collectPet = function(lang){
    let newPet;
    if(lang==="Spanish") newPet={name:"Fox",emoji:"🦊",language:"Spanish"};
    if(lang==="Mandarin") newPet={name:"Panda",emoji:"🐼",language:"Mandarin"};
    if(lang==="Japanese") newPet={name:"Cat",emoji:"🐱",language:"Japanese"};
    if(lang==="German") newPet={name:"Wolf",emoji:"🐺",language:"German"};
    if(!petCollection.find(p=>p.name===newPet.name)){
      petCollection.push(newPet);
      localStorage.setItem("petCollection",JSON.stringify(petCollection));
      renderPetCollection();
      launchConfetti();
      alert("New pet collected: "+newPet.name);
    }
  }

  // ================= CONFETTI =================
  const canvas=document.getElementById("confettiCanvas");
  const ctx=canvas.getContext("2d");
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  let confetti=[];
  function launchConfetti(){
    for(let i=0;i<100;i++){
      confetti.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height-canvas.height,size:Math.random()*6+4,speed:Math.random()*3+2});
    }
    animateConfetti();
  }
  function animateConfetti(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confetti.forEach(p=>{
      p.y+=p.speed;
      ctx.fillStyle="#ff7f7f";
      ctx.fillRect(p.x,p.y,p.size,p.size);
    });
    confetti=confetti.filter(p=>p.y<canvas.height);
    if(confetti.length>0) requestAnimationFrame(animateConfetti);
  }

});
