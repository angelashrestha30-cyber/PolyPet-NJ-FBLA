// ----------------------------
// PET SYSTEM
// ----------------------------

let petCollection = JSON.parse(localStorage.getItem("petCollection")) || ["Fox"];
let equippedPet = localStorage.getItem("equippedPet") || "Fox";
let petName = localStorage.getItem("petName") || "Your Pet";

const petDisplay = document.getElementById("pet-display");
const petNameDisplay = document.getElementById("pet-name");
const nameInput = document.getElementById("pet-name-input");
const nameBtn = document.getElementById("pet-name-btn");
const petCollectionDiv = document.getElementById("pet-collection");

const petAvatars = {
  Fox: "🦊",
  Wolf: "🐺"
};

function updatePetUI() {
  if (petDisplay) petDisplay.textContent = petAvatars[equippedPet];
  if (petNameDisplay) petNameDisplay.textContent = petName;
}

function renderPetCollection() {
  if (!petCollectionDiv) return;

  petCollectionDiv.innerHTML = "";

  petCollection.forEach(pet => {
    const btn = document.createElement("button");
    btn.className = "pet-btn";
    btn.textContent = petAvatars[pet] + " " + pet;

    btn.onclick = () => {
      equippedPet = pet;
      localStorage.setItem("equippedPet", pet);
      updatePetUI();
    };

    petCollectionDiv.appendChild(btn);
  });
}

function collectPet(unitName) {
  let petToUnlock = null;

  if (unitName === "German") {
    petToUnlock = "Wolf";
  }

  if (petToUnlock && !petCollection.includes(petToUnlock)) {
    petCollection.push(petToUnlock);
    localStorage.setItem("petCollection", JSON.stringify(petCollection));
    renderPetCollection();
  }
}

if (nameBtn) {
  nameBtn.addEventListener("click", function () {
    const newName = nameInput.value.trim();

    if (newName) {
      petName = newName;
      localStorage.setItem("petName", newName);
      updatePetUI();

      const renameBox = document.querySelector(".pet-name-input-container");
      if (renameBox) renameBox.style.display = "none";

      nameInput.value = "";
    }
  });
}

updatePetUI();
renderPetCollection();


// ----------------------------
// CONFETTI
// ----------------------------

function launchConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });

    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}


// ----------------------------
// UNIT TEST SYSTEM
// ----------------------------

const unitTestContainer = document.getElementById("unit-test-container");
const submitBtn = document.getElementById("submit-test");

const unitTestQuestions = [

{question:"What does hola mean?",options:["Hello","Bye","Thanks","Please"],answer:"Hello",exp:"Hola means Hello."},
{question:"Translate perro",options:["Dog","Cat","Fish","Bird"],answer:"Dog",exp:"Perro means Dog."},
{question:"Translate gato",options:["Dog","Cat","Fish","Bird"],answer:"Cat",exp:"Gato means Cat."},
{question:"Translate libro",options:["Book","Pen","Desk","Chair"],answer:"Book",exp:"Libro means Book."},
{question:"Translate agua",options:["Water","Milk","Bread","Juice"],answer:"Water",exp:"Agua means Water."},

{question:"Translate casa",options:["House","Car","Door","Tree"],answer:"House",exp:"Casa means House."},
{question:"Translate amigo",options:["Enemy","Friend","Teacher","Dog"],answer:"Friend",exp:"Amigo means Friend."},
{question:"Translate escuela",options:["School","Park","Library","Market"],answer:"School",exp:"Escuela means School."},
{question:"Translate comida",options:["Food","Drink","Sleep","Run"],answer:"Food",exp:"Comida means Food."},
{question:"Translate beber",options:["Eat","Drink","Walk","Sleep"],answer:"Drink",exp:"Beber means Drink."},

{question:"Translate feliz",options:["Sad","Happy","Angry","Hungry"],answer:"Happy",exp:"Feliz means Happy."},
{question:"Translate triste",options:["Happy","Sad","Fast","Slow"],answer:"Sad",exp:"Triste means Sad."},
{question:"Translate grande",options:["Small","Big","Tall","Wide"],answer:"Big",exp:"Grande means Big."},
{question:"Translate pequeño",options:["Big","Small","Tall","Fast"],answer:"Small",exp:"Pequeño means Small."},
{question:"Translate rojo",options:["Red","Blue","Green","Yellow"],answer:"Red",exp:"Rojo means Red."},

{question:"Translate verde",options:["Blue","Green","Red","Black"],answer:"Green",exp:"Verde means Green."},
{question:"Translate día",options:["Night","Day","Morning","Evening"],answer:"Day",exp:"Día means Day."},
{question:"Translate noche",options:["Morning","Day","Night","Afternoon"],answer:"Night",exp:"Noche means Night."},
{question:"Translate mañana",options:["Morning","Night","Day","Food"],answer:"Morning",exp:"Mañana means Morning."},
{question:"Translate familia",options:["Friend","Family","Teacher","Dog"],answer:"Family",exp:"Familia means Family."}

];

function renderTest() {

  if (!unitTestContainer) return;

  unitTestContainer.innerHTML = "";

  unitTestQuestions.forEach((q, i) => {

    const div = document.createElement("div");
    div.className = "test-question";

    let html = `<p>${i+1}. ${q.question}</p>`;

    q.options.forEach(opt => {
      html += `
      <label>
      <input type="radio" name="q${i}" value="${opt}">
      ${opt}
      </label><br>
      `;
    });

    div.innerHTML = html;

    unitTestContainer.appendChild(div);

  });

}

if (submitBtn) {

  submitBtn.onclick = function () {

    let score = 0;
    let explanations = "";

    unitTestQuestions.forEach((q, i) => {

      const selected = document.querySelector(`input[name="q${i}"]:checked`);

      if (selected && selected.value === q.answer) {
        score++;
      } else {
        explanations += `<p><b>Q${i+1}</b>: ${q.exp}</p>`;
      }

    });

    const percent = Math.round((score / unitTestQuestions.length) * 100);

    unitTestContainer.innerHTML =
      `<h2>Your Score: ${score}/${unitTestQuestions.length} (${percent}%)</h2>`
      + explanations;

    if (percent >= 80) {
      launchConfetti();
    }

  };

}

renderTest();
