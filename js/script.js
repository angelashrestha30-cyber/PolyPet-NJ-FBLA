function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

function filterSchedule(day){
  const events = document.querySelectorAll('.event');
  events.forEach(event=>{
    if(day === "all"){
      event.style.display = "block";
    } else {
      event.style.display = event.classList.contains(day) ? "block" : "none";
    }
  });
}

function updateClocks(){
  const now = new Date();
  
  document.getElementById("nj-time").textContent =
    now.toLocaleTimeString("en-US",{timeZone:"America/New_York"});
    
  document.getElementById("ca-time").textContent =
    now.toLocaleTimeString("en-US",{timeZone:"America/Los_Angeles"});
    
  document.getElementById("uk-time").textContent =
    now.toLocaleTimeString("en-GB",{timeZone:"Europe/London"});
}

setInterval(updateClocks,1000);
updateClocks();
function setGreeting(){
  const hour = new Date().getHours();
  let greeting;

  if(hour < 12){
    greeting = "Good Morning, Emma ☀️";
  } else if(hour < 18){
    greeting = "Good Afternoon, Emma 🌸";
  } else {
    greeting = "Good Evening, Emma 🌙";
  }

  document.getElementById("dynamicGreeting").textContent = greeting;
}

setGreeting();
