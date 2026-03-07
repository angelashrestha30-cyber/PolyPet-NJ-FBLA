document.addEventListener("DOMContentLoaded",function(){

/* ================= PET SYSTEM ================= */

let petCollection=JSON.parse(localStorage.getItem("petCollection"))||[
{name:"Fox",emoji:"🦊",language:"Starter"}
];

let currentPet=JSON.parse(localStorage.getItem("currentPet"))||petCollection[0];

let petName=localStorage.getItem("petName");

const avatar=document.querySelector(".pet-avatar");
const nameDisplay=document.getElementById("pet-name-display");

const nameInput=document.getElementById("pet-name-input");
const nameBtn=document.getElementById("pet-name-btn");

if(petName){

nameDisplay.textContent=petName;

document.querySelector(".pet-name-input-container").style.display="none";

}

function updatePet(){

avatar.textContent=currentPet.emoji;

if(currentPet.name==="Wolf"){

document.body.style.background="linear-gradient(180deg,#e6f2ff,#b3d9ff)";

}

}

/* rename pet */

nameBtn.onclick=function(){

if(nameInput.value.trim()!==""){

petName=nameInput.value;

localStorage.setItem("petName",petName);

nameDisplay.textContent=petName;

document.querySelector(".pet-name-input-container").style.display="none";

}

}

/* ================= PET COLLECTION ================= */

function renderPets(){

const container=document.getElementById("pet-collection");

container.innerHTML="";

petCollection.forEach(pet=>{

let card=document.createElement("div");

card.className="pet-card";

card.innerHTML=`
<div class="pet-emoji">${pet.emoji}</div>
<div class="pet-name">${pet.name}</div>
<div class="language-badge">${pet.language}</div>
`;

card.onclick=function(){

currentPet=pet;

localStorage.setItem("currentPet",JSON.stringify(pet));

updatePet();

};

container.appendChild(card);

});

}

renderPets();


window.collectPet=function(lang){

let newPet;

if(lang==="Spanish") newPet={name:"Fox",emoji:"🦊",language:"Spanish"};

if(lang==="Mandarin") newPet={name:"Panda",emoji:"🐼",language:"Mandarin"};

if(lang==="Japanese") newPet={name:"Cat",emoji:"🐱",language:"Japanese"};

if(lang==="German") newPet={name:"Wolf",emoji:"🐺",language:"German"};

if(!petCollection.find(p=>p.name===newPet.name)){

petCollection.push(newPet);

localStorage.setItem("petCollection",JSON.stringify(petCollection));

renderPets();

alert("New Pet Collected!");

}

}

/* ================= FLASHCARDS ================= */

let flashcards=[
{front:"hola",back:"hello"},
{front:"perro",back:"dog"},
{front:"gato",back:"cat"},
{front:"agua",back:"water"}
];

let cardIndex=0;

window.loadSpanish=function(){

cardIndex=0;

document.getElementById("flashcard").textContent=flashcards[0].front;

}

window.nextCard=function(){

cardIndex=(cardIndex+1)%flashcards.length;

document.getElementById("flashcard").textContent=flashcards[cardIndex].front;

}

/* ================= PRACTICE ================= */

let practiceQuestions=[
{q:"hola",a:"hello"},
{q:"perro",a:"dog"},
{q:"gato",a:"cat"},
{q:"agua",a:"water"}
];

let practiceIndex=0;

window.checkPractice=function(){

let input=document.getElementById("practiceInput").value.toLowerCase();

let correct=practiceQuestions[practiceIndex].a;

if(input===correct){

document.getElementById("practiceResult").textContent="Correct!";

}else{

document.getElementById("practiceResult").textContent="Correct: "+correct;

}

}

window.nextPractice=function(){

practiceIndex=(practiceIndex+1)%practiceQuestions.length;

document.getElementById("practiceQuestion").textContent=practiceQuestions[practiceIndex].q;

}

/* ================= 20 QUESTION TEST ================= */

const testQuestions=[

{q:"hola",options:["hello","bye","dog","cat"],a:"hello",exp:"hola means hello"},
{q:"perro",options:["dog","cat","fish","bird"],a:"dog",exp:"perro means dog"},
{q:"gato",options:["dog","cat","fish","bird"],a:"cat",exp:"gato means cat"},
{q:"agua",options:["water","milk","bread","juice"],a:"water",exp:"agua means water"},
{q:"libro",options:["book","pen","desk","chair"],a:"book",exp:"libro means book"},

{q:"hola",options:["hello","bye","dog","cat"],a:"hello",exp:"hola means hello"},
{q:"perro",options:["dog","cat","fish","bird"],a:"dog",exp:"perro means dog"},
{q:"gato",options:["dog","cat","fish","bird"],a:"cat",exp:"gato means cat"},
{q:"agua",options:["water","milk","bread","juice"],a:"water",exp:"agua means water"},
{q:"libro",options:["book","pen","desk","chair"],a:"book",exp:"libro means book"},

{q:"hola",options:["hello","bye","dog","cat"],a:"hello",exp:"hola means hello"},
{q:"perro",options:["dog","cat","fish","bird"],a:"dog",exp:"perro means dog"},
{q:"gato",options:["dog","cat","fish","bird"],a:"cat",exp:"gato means cat"},
{q:"agua",options:["water","milk","bread","juice"],a:"water",exp:"agua means water"},
{q:"libro",options:["book","pen","desk","chair"],a:"book",exp:"libro means book"},

{q:"hola",options:["hello","bye","dog","cat"],a:"hello",exp:"hola means hello"},
{q:"perro",options:["dog","cat","fish","bird"],a:"dog",exp:"perro means dog"},
{q:"gato",options:["dog","cat","fish","bird"],a:"cat",exp:"gato means cat"},
{q:"agua",options:["water","milk","bread","juice"],a:"water",exp:"agua means water"},
{q:"libro",options:["book","pen","desk","chair"],a:"book",exp:"libro means book"}

];

const testBox=document.getElementById("unitTest");

testQuestions.forEach((q,i)=>{

let div=document.createElement("div");

div.className="question-box";

let html=`<p>${i+1}. ${q.q}</p>`;

q.options.forEach(opt=>{

html+=`<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`;

});

div.innerHTML=html;

testBox.appendChild(div);

});

let submit=document.createElement("button");

submit.textContent="Submit Test";

submit.onclick=function(){

let score=0;

let resultHTML="";

testQuestions.forEach((q,i)=>{

let selected=document.querySelector(`input[name="q${i}"]:checked`);

if(selected && selected.value===q.a){

score++;

}else{

resultHTML+=`<p>Q${i+1}: Correct = ${q.a} (${q.exp})</p>`;

}

});

let percent=Math.round((score/testQuestions.length)*100);

testBox.innerHTML=`<h2>Your Score: ${percent}%</h2>${resultHTML}`;

};

testBox.appendChild(submit);

});
