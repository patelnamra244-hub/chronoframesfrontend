const API = "https://chronoframesbackend.onrender.com/api/templates";

const grid = document.getElementById("templateList");
const lightbox = document.getElementById("lightbox");

let currentPrompt = "";

// Load templates
fetch(API)
  .then(res => res.json())
  .then(data => {
    grid.innerHTML = data.map(t => `
      <div class="tile" onclick='openLightbox(${JSON.stringify(t)})'>
        <img src="${t.afterImg}" alt="AI Result" />
      </div>
    `).join("");
  });

// Open popup
function openLightbox(t) {
  document.getElementById("lightboxBefore").src = t.beforeImg;
  document.getElementById("lightboxAfter").src = t.afterImg;
  document.getElementById("lightboxPrompt").innerText = t.prompt;
  currentPrompt = t.prompt;
  lightbox.style.display = "flex";
}

// Close popup
function closeLightbox() {
  lightbox.style.display = "none";
}

// Copy prompt (bulletproof)
function copyPrompt() {
  const ta = document.createElement("textarea");
  ta.value = currentPrompt;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  alert("Prompt copied to clipboard");
}

// Click outside to close
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});
