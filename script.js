
let currentLight = 0;
let lights = [];
let startTime = 0;
let allowClick = false;
let jumpStart = false;
let timeouts = [];

document.addEventListener("DOMContentLoaded", () => {
  for (let i = 1; i <= 5; i++) {
    lights.push(document.getElementById("light" + i));
  }
  startLights();
});

function startLights() {
  clearAll();
  currentLight = 0;
  jumpStart = false;
  timeouts = [];
  for (let i = 0; i < 5; i++) {
    timeouts.push(setTimeout(() => {
      lights[i].classList.add("on");
      new Audio(`assets/lights/light${i+1}.mp3`).play();
    }, i * 1000));
  }
  const randomDelay = 1000 + Math.random() * 2000;
  timeouts.push(setTimeout(() => {
    lights.forEach(light => light.classList.remove("on"));
    allowClick = true;
    startTime = new Date().getTime();
    new Audio('assets/start.mp3').play();
  }, 5000 + randomDelay));
}

function handleClick() {
  if (jumpStart || document.getElementById('try-again').style.display === 'block') return;

  if (!allowClick) {
    jumpStart = true;
    document.getElementById("jump-start").style.display = "block";
    new Audio('assets/jumpstart.mp3').play();
    document.getElementById("try-again").style.display = "block";
  } else {
    const reaction = new Date().getTime() - startTime;
    document.getElementById("result").innerText = `⏱️ Tiempo de reacción: ${reaction} ms`;
    allowClick = false;
    document.getElementById("try-again").style.display = "block";
    // Aquí puedes guardar en Google Sheets si quieres
    fetch(API_URL, {
  method: "POST",
  body: JSON.stringify({
    nombre: prompt("Introduce tu nombre:"),
    correo: prompt("Introduce tu correo:"),
    tiempo: reaction
  }),
  headers: {
    "Content-Type": "application/json"
  }
});
  }
}

function resetGame() {
  clearAll();
  document.getElementById("jump-start").style.display = "none";
  document.getElementById("result").innerText = "";
  document.getElementById("try-again").style.display = "none";
  startLights();
}

function clearAll() {
  timeouts.forEach(to => clearTimeout(to));
  lights.forEach(light => light.classList.remove("on"));
  allowClick = false;
  jumpStart = false;
}

const API_URL = 'https://script.google.com/macros/s/AKfycbx9gUL0RjhYtCs6NAFWjqlD041HIr27dJGJyUa__baqFCwAagia5mY-wZWVG4BSlR9tag/exec';
async function fetchTop10() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const ul = document.getElementById('leaderboard');
    ul.innerHTML = '';
    data.forEach((item, idx) => {
      ul.innerHTML += `<li>#${idx+1} – ${item.nombre}: ${item.tiempo} ms</li>`;
    });
  } catch (e) {
    console.error('Error al obtener ranking:', e);
  }
}
fetchTop10();
setInterval(fetchTop10, 10000);
