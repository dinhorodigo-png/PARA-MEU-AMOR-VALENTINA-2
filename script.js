// ==============================
// ✍️ EDITE AQUI (opcional):
// Coloque um MP3 na pasta e escreva o nome aqui.
// Ex.: const MUSIC_FILE = "musica.mp3";
// Se não quiser música, deixe "".
// ==============================
const MUSIC_FILE = ""; // ex: "musica.mp3"

// Util
const $ = (s) => document.querySelector(s);

// ===== Modais Surpresa / Carta =====
const modalSurpresa = $("#modalSurpresa");
const modalCarta = $("#modalCarta");

$("#btnSurpresa").addEventListener("click", () => modalSurpresa.showModal());
$("#fecharSurpresa").addEventListener("click", () => modalSurpresa.close());

$("#btnCarta").addEventListener("click", () => modalCarta.showModal());
$("#fecharCarta").addEventListener("click", () => modalCarta.close());

// fechar modal clicando fora do conteúdo
[modalSurpresa, modalCarta].forEach((dlg) => {
  dlg.addEventListener("click", (e) => {
    const rect = dlg.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inside) dlg.close();
  });
});

// Outra surpresa (só troca texto)
const frases = [
  "Você é meu pedacinho de paz 💗",
  "Seu sorriso melhora meu dia inteiro 😊",
  "Que hoje seja doce igual você 🍰",
  "Você é raridade boa ✨",
  "Te amo mais que ontem e menos que amanhã ♾️"
];
$("#btnOutro").addEventListener("click", () => {
  const el = $("#textoSurpresa");
  el.textContent = frases[Math.floor(Math.random() * frases.length)];
});

// Barra de “amor” animada (não são partículas)
const amorBar = $("#amorBar");
let w = 78;
setInterval(() => {
  w += (Math.random() * 6 - 3);
  w = Math.max(62, Math.min(98, w));
  amorBar.style.width = w.toFixed(0) + "%";
}, 1200);

// ===== Música (opcional) =====
const musicBtn = $("#musicBtn");
const music = $("#music");
let musicOn = false;

if (MUSIC_FILE) {
  music.src = MUSIC_FILE;
}

function setMusicLabel(){
  musicBtn.textContent = musicOn ? "🎵 Música: ON" : "🎵 Música: OFF";
  musicBtn.setAttribute("aria-pressed", musicOn ? "true" : "false");
}
setMusicLabel();

musicBtn.addEventListener("click", async () => {
  if (!MUSIC_FILE) {
    alert("Para usar música: coloque um MP3 na pasta e escreva o nome dele em MUSIC_FILE no script.js 🙂");
    return;
  }
  try {
    if (!musicOn) {
      await music.play();
      musicOn = true;
    } else {
      music.pause();
      musicOn = false;
    }
    setMusicLabel();
  } catch {
    alert("Seu navegador bloqueou a reprodução. Clique de novo 🙂");
  }
});

// ===== Lightbox da galeria =====
const lightbox = $("#lightbox");
const lbImg = $("#lbImg");
const lbCaption = $("#lbCaption");
const lbClose = $("#lbClose");

// Ao abrir uma foto, se existir música, começa (uma vez)
let startedGalleryMusic = false;

document.querySelectorAll(".love-photo").forEach((card) => {
  card.addEventListener("click", async () => {
    const full = card.getAttribute("data-full");
    const caption = card.getAttribute("data-caption") || "";

    lbImg.src = full;
    lbCaption.textContent = caption;
    lightbox.showModal();

    if (MUSIC_FILE && !startedGalleryMusic) {
      try {
        await music.play();
        musicOn = true;
        startedGalleryMusic = true;
        setMusicLabel();
      } catch {}
    }
  });
});

lbClose.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => {
  const rect = lightbox.getBoundingClientRect();
  const inside =
    e.clientX >= rect.left && e.clientX <= rect.right &&
    e.clientY >= rect.top && e.clientY <= rect.bottom;
  if (!inside) lightbox.close();
});

// ==============================
// 🌹 PÉTALAS CAINDO (SEM partículas por clique/mouse)
// ==============================
const canvas = $("#petals");
const ctx = canvas.getContext("2d");

let W, H;
function resize(){
  W = canvas.width = window.innerWidth * devicePixelRatio;
  H = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", resize);
resize();

const petals = [];
const petalEmoji = ["🌹","🌸","❤️","💗"];

function addPetal(x, y){
  petals.push({
    x, y,
    vx: (Math.random()*2 - 1) * 0.55 * devicePixelRatio,
    vy: (Math.random()*1 + 0.8) * 0.9 * devicePixelRatio,
    rot: Math.random()*Math.PI*2,
    vr: (Math.random()*0.04 - 0.02),
    s: (16 + Math.random()*10) * devicePixelRatio,
    life: 320 + Math.random()*220,
    emoji: petalEmoji[Math.floor(Math.random()*petalEmoji.length)]
  });
}

// Chuva contínua suave
function petalRain(){
  const amount = 2 + Math.floor(Math.random() * 2); // 2-3
  for(let i=0;i<amount;i++){
    const x = Math.random() * W;
    const y = -30 * devicePixelRatio;
    addPetal(x, y);
  }
}

function loop(){
  ctx.clearRect(0,0,W,H);

  // gera de forma constante e leve
  petalRain();

  for(let i=petals.length-1;i>=0;i--){
    const p = petals[i];
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.font = `${p.s}px "Fredoka", system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life/260));
    ctx.fillText(p.emoji, 0, 0);
    ctx.restore();

    if (p.life <= 0 || p.y > H + 80*devicePixelRatio) petals.splice(i,1);
  }

  requestAnimationFrame(loop);
}
loop();
