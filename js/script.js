document.addEventListener("DOMContentLoaded", () => {

let xp = 0;
let level = 1;

function updateXP(){
    const xpBar = document.getElementById("xp-bar");
    const xpText = document.getElementById("xp-text");

    if(!xpBar || !xpText) return;

    xpBar.style.width = (xp % 100) + "%";
    xpText.textContent = "XP: " + xp;

    if(xp >= level * 100){
        level++;
        alert("Level Up! You are now level " + level);
    }
}

window.completeLesson = function(){
    xp += 10;
    updateXP();
};

window.collectPet = function(language){
    const petDisplay = document.getElementById("pet-display");
    if(!petDisplay) return;

    const pet = document.createElement("div");
    pet.textContent = language + " pet collected!";
    petDisplay.appendChild(pet);
};

window.filterSchedule = function(type){
    const lessons = document.querySelectorAll(".lesson");

    lessons.forEach(lesson=>{
        if(type === "all"){
            lesson.style.display = "block";
        } else {
            lesson.style.display =
                lesson.dataset.type === type ? "block" : "none";
        }
    });
};

window.scheduleLesson = function(){
    const schedule = document.getElementById("schedule-list");
    if(!schedule) return;

    const item = document.createElement("li");
    item.textContent = "New Lesson Scheduled";
    schedule.appendChild(item);
};

});


// 🌍 WORLD CLOCK
function updateClock(){
    const clock = document.getElementById("world-clock");
    if(!clock) return;

    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
}

setInterval(updateClock,1000);
updateClock();


// 📚 FLASHCARDS

let flashcards = [];
let currentCard = 0;
let flipped = false;

window.loadSpanishLevel3 = function(){
    flashcards = [
        {front:"Hola",back:"Hello"},
        {front:"Adiós",back:"Goodbye"},
        {front:"Gracias",back:"Thank you"},
        {front:"Por favor",back:"Please"},
        {front:"Sí",back:"Yes"}
    ];

    currentCard = 0;
    flipped = false;
    showCard();
};

function showCard(){
    const card = document.getElementById("flashcard");
    if(!card || flashcards.length === 0) return;

    card.textContent = flashcards[currentCard].front;
}

window.flipCard = function(){
    const card = document.getElementById("flashcard");
    if(!card) return;

    if(flipped){
        card.textContent = flashcards[currentCard].front;
    }else{
        card.textContent = flashcards[currentCard].back;
    }

    flipped = !flipped;
};

window.nextCard = function(){
    if(flashcards.length === 0) return;

    currentCard++;
    if(currentCard >= flashcards.length){
        currentCard = 0;
    }

    flipped = false;
    showCard();
};


// 🧠 PRACTICE MODE

let practiceQuestions = [
    {question:"Hola",answer:"Hello"},
    {question:"Gracias",answer:"Thank you"},
    {question:"Adiós",answer:"Goodbye"}
];

let currentPractice = 0;

window.startPractice = function(){
    currentPractice = 0;
    loadPractice();
};

function loadPractice(){
    const q = document.getElementById("practice-question");
    const input = document.getElementById("practice-input");

    if(!q || !input) return;

    q.textContent = practiceQuestions[currentPractice].question;
    input.value = "";
}

window.checkPractice = function(){
    const input = document.getElementById("practice-input");
    const feedback = document.getElementById("practice-feedback");

    if(!input || !feedback) return;

    const answer = input.value.trim().toLowerCase();
    const correct = practiceQuestions[currentPractice].answer.toLowerCase();

    if(answer === correct){
        feedback.textContent = "Correct!";
        xp += 5;
    }else{
        feedback.textContent = "Try again!";
    }
};

window.nextPractice = function(){
    currentPractice++;

    if(currentPractice >= practiceQuestions.length){
        currentPractice = 0;
    }

    loadPractice();
};


// 📖 RESOURCE MENU

window.showResource = function(id){
    const sections = document.querySelectorAll(".resource");

    sections.forEach(section=>{
        section.style.display = "none";
    });

    const target = document.getElementById(id);
    if(target){
        target.style.display = "block";
    }
};
