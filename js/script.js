
JS CODE: // SCROLLING
function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

// SCHEDULE FILTER
function filterSchedule(day){
  const events = document.querySelectorAll('.event');
  events.forEach(event=>{
    event.style.display = (day==="all" || event.classList.contains(day)) ? "block" : "none";
  });
}

// WORLD CLOCKS
function updateClocks(){
  const now = new Date();
  document.getElementById("nj-time").textContent = now.toLocaleTimeString("en-US",{timeZone:"America/New_York"});
  document.getElementById("ca-time").textContent = now.toLocaleTimeString("en-US",{timeZone:"America/Los_Angeles"});
  document.getElementById("uk-time").textContent = now.toLocaleTimeString("en-GB",{timeZone:"Europe/London"});
}
setInterval(updateClocks,1000);
updateClocks();

// PET XP / LEVEL / STREAK
let xp = localStorage.getItem("xp") ? parseInt(localStorage.getItem("xp")) : 0;
let level = localStorage.getItem("level") ? parseInt(localStorage.getItem("level
