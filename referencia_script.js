/* ============================================================
   ART REFERENCE GENERATOR
   ============================================================ */

// ---------- CONFIG ----------
const CONFIG = {
  API_KEY: "YOUR_API_KEY_HERE",
  API_ENDPOINT: "YOUR_API_ENDPOINT_HERE",
  IMAGE_COUNT: 4,
  USE_MOCK_DATA: true, // Set to false when you have a real API
};

// ---------- SUBJECT LIST ----------
const SUBJECTS = [
  "scenery", "godzilla", "goku", "dragon", "castle",
  "forest", "cyberpunk city", "portrait", "samurai", "still life",
  "mountain landscape", "old fisherman", "astronaut", "tiger",
  "owl", "flower bouquet", "vintage car", "lighthouse",
  "medieval knight", "koi fish", "sunset beach", "snowy cabin",
  "steampunk robot", "ancient ruins", "market street", "eagle",
];

// ---------- STATE ----------
let currentMedium = null;
let currentSubject = null;
let isFetching = false;
let seenImageUrls = new Set(); 

// ---------- DOM ----------
const mediumButtons = document.querySelectorAll(".medium-btn");
const subjectDisplay = document.getElementById("subjectDisplay");
const generateBtn = document.getElementById("generateBtn");
const imageGrid = document.getElementById("imageGrid");
const disclaimer = document.getElementById("disclaimer");
const floatingFramesContainer = document.getElementById("floatingFrames");

// ============================================================
// 1. GENERATE FLOATING FRAMES
// ============================================================
function createFloatingFrames() {
  const frameCount = 8;
  for (let i = 0; i < frameCount; i++) {
    const frame = document.createElement("div");
    frame.classList.add("frame");
    
    const size = Math.random() * 80 + 60;
    frame.style.width = `${size}px`;
    frame.style.height = `${size}px`;
    
    frame.style.left = `${Math.random() * 90}vw`;
    frame.style.top = `${Math.random() * 80}vh`;
    
    frame.style.animationDuration = `${Math.random() * 6 + 6}s`;
    frame.style.animationDelay = `${Math.random() * -10}s`;
    
    floatingFramesContainer.appendChild(frame);
  }
}

// ============================================================
// 2. MEDIUM SELECTION
// ============================================================
mediumButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    mediumButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMedium = btn.dataset.medium;

    currentSubject = pickRandomSubject();
    subjectDisplay.textContent = currentSubject;
    subjectDisplay.classList.add("active");

    generateBtn.disabled = false;
  });
});

// ============================================================
// 3. GENERATE BUTTON CLICK
// ============================================================
generateBtn.addEventListener("click", async () => {
  if (isFetching || !currentMedium) return;

  currentSubject = pickRandomSubject();
  subjectDisplay.textContent = currentSubject;
  subjectDisplay.classList.add("active");

  isFetching = true;
  generateBtn.disabled = true;
  generateBtn.textContent = "Searching...";
  imageGrid.innerHTML = "";
  disclaimer.textContent = "";
  seenImageUrls.clear();

  const query = `${currentSubject} ${currentMedium}`;

  try {
    const results = await fetchReferences(query);
    renderResults(results);
  } catch (err) {
    console.error(err);
    imageGrid.innerHTML = `
      <p style="grid-column: 1/-1; text-align:center; color:#7a7a99;">
        Something went wrong. Check the console.
      </p>`;
  } finally {
    isFetching = false;
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate";
  }
});

// ============================================================
// 4. HELPERS
// ============================================================
function pickRandomSubject() {
  return SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
}

function renderResults(results) {
  if (!results || results.length === 0) {
    imageGrid.innerHTML = `
      <p style="grid-column: 1/-1; text-align:center; color:#7a7a99;">
        No results found. Try a different medium.
      </p>`;
    return;
  }

  const uniqueResults = results.filter(item => {
    if (seenImageUrls.has(item.image)) return false;
    seenImageUrls.add(item.image);
    return true;
  }).slice(0, CONFIG.IMAGE_COUNT);

  imageGrid.innerHTML = uniqueResults
    .map((item) => {
      const pinnerName = item.pinner || "Unknown";
      const pinnerUrl = item.pinnerUrl || "#";
      return `
        <div class="image-card">
          <img src="${item.image}" alt="Reference for ${currentSubject}" loading="lazy" />
          <div class="credit">
            Pinned by <a href="${pinnerUrl}" target="_blank" rel="noopener noreferrer">${pinnerName}</a>
          </div>
        </div>
      `;
    })
    .join("");

  disclaimer.textContent =
    "All images belong to their original creators. Click a name to view the pinner's profile.";
}

// ============================================================
// 5. FETCH REFERENCES (Plug your API in here)
// ============================================================
async function fetchReferences(query) {
  if (CONFIG.USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 800));
    
    const timestamp = Date.now();
    return Array.from({ length: CONFIG.IMAGE_COUNT }).map((_, i) => ({
      image: `https://picsum.photos/seed/${timestamp}-${i}-${Math.random()}/600/500`,
      pinner: `Artist_${Math.floor(Math.random() * 9999)}`,
      pinnerUrl: `https://pinterest.com/artist_${Math.floor(Math.random() * 9999)}`,
      pinUrl: "https://pinterest.com",
    }));
  }

  // REAL API MODE (Uncomment when ready)
  // const res = await fetch(CONFIG.API_ENDPOINT, { ... });
  // return data.items.map(...);

  throw new Error("No API configured.");
}

// ============================================================
// INIT
// ============================================================
createFloatingFrames();