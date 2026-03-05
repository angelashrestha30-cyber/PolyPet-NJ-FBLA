// ================= RESOURCES / FLASHCARDS / PRACTICE / TEST =================
let flashcards = [
  {front:"Aunque", back:"Although"},
  {front:"Sin embargo", back:"However"},
  {front:"A pesar de", back:"Despite"},
  {front:"Lograr", back:"To achieve"},
  {front:"Desarrollar", back:"To develop"},
  {front:"Rápidamente", back:"Quickly"},
  {front:"Importante", back:"Important"},
  {front:"Fácil", back:"Easy"},
  {front:"Difícil", back:"Difficult"},
  {front:"Gracias", back:"Thank you"}
];

let currentCard = 0;
let flipped = false;

function loadFlashcards() {
  currentCard = 0;
  flipped = false;
  showCard();
}

function showCard() {
  const card = document.getElementById("flashcard");
  if(!card) return;
  card.textContent = flipped ? flashcards[currentCard].back : flashcards[currentCard].front;
}

function flipCard() {
  flipped = !flipped;
  showCard();
}

function nextCard() {
  currentCard = (currentCard + 1) % flashcards.length;
  flipped = false;
  showCard();
}

// ================= PRACTICE MODE =================
let practiceQuestions = [
  {question:"Translate 'Aunque' to English", answer:"although"},
  {question:"Translate 'Sin embargo' to English", answer:"however"},
  {question:"Translate 'Lograr' to English", answer:"to achieve"},
  {question:"Translate 'Desarrollar' to English", answer:"to develop"},
  {question:"Translate 'Difícil' to English", answer:"difficult"}
];

let practiceIndex = 0;

function startPractice() {
  practiceIndex = 0;
  document.getElementById("nextPracticeBtn").style.display = "none";
  showPractice();
}

function showPractice() {
  const q = practiceQuestions[practiceIndex];
  document.getElementById("practiceQuestion").textContent = q.question;
  document.getElementById("practiceInput").value = "";
  document.getElementById("practiceResult").textContent = "";
  document.getElementById("nextPracticeBtn").style.display = "none";
}

function checkPractice() {
  const input = document.getElementById("practiceInput").value.trim().toLowerCase();
  const result = document.getElementById("practiceResult");
  const correct = practiceQuestions[practiceIndex].answer.toLowerCase();

  if(input === correct) {
    result.textContent = "✅ Correct!";
  } else {
    result.textContent = `❌ Incorrect. Correct answer: ${practiceQuestions[practiceIndex].answer}`;
  }

  document.getElementById("nextPracticeBtn").style.display = "inline-block";
}

function nextPractice() {
  practiceIndex++;
  if(practiceIndex >= practiceQuestions.length) {
    document.getElementById("practiceQuestion").textContent = "🎉 Practice complete!";
    document.getElementById("practiceInput").style.display = "none";
    document.getElementById("nextPracticeBtn").style.display = "none";
    document.getElementById("practiceResult").textContent = "";
  } else {
    showPractice();
  }
}

// ================= UNIT TEST =================
let unitTestQuestions = [
  {q:"'Aunque' means:", options:["Although","Because"], correct:"Although", explanation:"Aunque = Although"},
  {q:"'Sin embargo' means:", options:["However","Therefore"], correct:"However", explanation:"Sin embargo = However"},
  {q:"'A pesar de' means:", options:["Despite","Until"], correct:"Despite", explanation:"A pesar de = Despite"},
  {q:"'Lograr' means:", options:["To achieve","To fail"], correct:"To achieve", explanation:"Lograr = To achieve"},
  {q:"'Desarrollar' means:", options:["To develop","To destroy"], correct:"To develop", explanation:"Desarrollar = To develop"},
  {q:"'Rápidamente' means:", options:["Quickly","Slowly"], correct:"Quickly", explanation:"Rápidamente = Quickly"},
  {q:"'Importante' means:", options:["Important","Unimportant"], correct:"Important", explanation:"Importante = Important"},
  {q:"'Fácil' means:", options:["Easy","Hard"], correct:"Easy", explanation:"Fácil = Easy"},
  {q:"'Difícil' means:", options:["Difficult","Simple"], correct:"Difficult", explanation:"Difícil = Difficult"},
  {q:"'Gracias' means:", options:["Thank you","Please"], correct:"Thank you", explanation:"Gracias = Thank you"},
  // Add 15 more questions here to reach 25
  {q:"'Hola' means:", options:["Hello","Goodbye"], correct:"Hello", explanation:"Hola = Hello"},
  {q:"'Adiós' means:", options:["Goodbye","Hi"], correct:"Goodbye", explanation:"Adiós = Goodbye"},
  {q:"'Amigo' means:", options:["Friend","Enemy"], correct:"Friend", explanation:"Amigo = Friend"},
  {q:"'Perro' means:", options:["Dog","Cat"], correct:"Dog", explanation:"Perro = Dog"},
  {q:"'Gato' means:", options:["Cat","Dog"], correct:"Cat", explanation:"Gato = Cat"},
  {q:"'Casa' means:", options:["House","Car"], correct:"House", explanation:"Casa = House"},
  {q:"'Escuela' means:", options:["School","Hospital"], correct:"School", explanation:"Escuela = School"},
  {q:"'Libro' means:", options:["Book","Pen"], correct:"Book", explanation:"Libro = Book"},
  {q:"'Agua' means:", options:["Water","Juice"], correct:"Water", explanation:"Agua = Water"},
  {q:"'Comida' means:", options:["Food","Drink"], correct:"Food", explanation:"Comida = Food"},
  {q:"'Familia' means:", options:["Family","Friend"], correct:"Family", explanation:"Familia = Family"},
  {q:"'Tiempo' means:", options:["Time","Weather"], correct:"Time", explanation:"Tiempo = Time"},
  {q:"'Feliz' means:", options:["Happy","Sad"], correct:"Happy", explanation:"Feliz = Happy"},
  {q:"'Triste' means:", options:["Sad","Happy"], correct:"Sad", explanation:"Triste = Sad"}
];

function renderUnitTest() {
  const form = document.getElementById("unitTestForm");
  form.innerHTML = "";
  unitTestQuestions.forEach((item, i)=>{
    const div = document.createElement("div");
    div.classList.add("test-box");
    div.innerHTML = `<p>${i+1}. ${item.q}</p>` + item.options.map(opt=>
      `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label><br>`).join('');
    form.appendChild(div);
  });
}

// ================= TEST SUBMISSION =================
function submitTest() {
  let score = 0;
  let explanations = "";
  unitTestQuestions.forEach((item,i)=>{
    const selected = document.querySelector(`input[name="q${i}"]:checked`)?.value;
    if(selected === item.correct) score++;
    else explanations += `<p>Q${i+1}: ${item.explanation}</p>`;
  });
  document.getElementById("testScore").innerHTML = `Score: ${score}/${unitTestQuestions.length}`;
  document.getElementById("testExplanations").innerHTML = explanations;
}

// ================= INITIALIZE =================
document.addEventListener("DOMContentLoaded",()=>{
  renderUnitTest();
});
