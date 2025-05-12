const modal = document.getElementById("gameModal");
const modalContent = document.getElementById("modal-details");
const closeBtn = document.querySelector(".close-btn");
const recentSearchesContainer = document.getElementById("recent-searches");
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const gameContainer = document.getElementById("game-container");

// Load new releases on page load
window.addEventListener("DOMContentLoaded", () => {
  fetchGames("new");
});
function saveRecentSearch(query) {
  let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  searches = [query, ...searches.filter(q => q !== query)].slice(0, 3); // Keep only 3
  localStorage.setItem("recentSearches", JSON.stringify(searches));
  renderRecentSearches();
}

function renderRecentSearches() {
  const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  recentSearchesContainer.innerHTML = searches.map(
    (q) => `<button class="recent-btn">${q}</button>`
  ).join("");
}
function openGameModal(game) {
  modalContent.innerHTML = `
    <h2>${game.name}</h2>
    <img src="${game.background_image}" alt="${game.name}" />
    <p><strong>Released:</strong> ${game.released}</p>
    <p><strong>Rating:</strong> ${game.rating} / 5</p>
    <p><strong>Platforms:</strong> ${game.platforms.map(p => p.platform.name).join(", ")}</p>
  `;
  modal.style.display = "block";
}

// Handle click on a recent search
recentSearchesContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("recent-btn")) {
    input.value = e.target.textContent;
    fetchGames("search", input.value);
  }
});

// Handle search form
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;
  fetchGames("search", query);
  saveRecentSearch(query);
});
// Main function to fetch games
async function fetchGames(type, query = "") {
  let url = "";

  if (type === "search") {
    url = `https://api.rawg.io/api/games?key=a0728be45b1c405993ac5a891143a390&search=${query}`;
  } else if (type === "new") {
    const today = new Date().toISOString().split("T")[0];
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStr = lastMonth.toISOString().split("T")[0];

    url = `https://api.rawg.io/api/games?key=a0728be45b1c405993ac5a891143a390&dates=${lastMonthStr},${today}&ordering=-released&page_size=10`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayGames(data.results);
  } catch (error) {
    console.error("Error fetching games:", error);
    gameContainer.innerHTML = "<p>Could not load games.</p>";
  }
}

function displayGames(games) {
  gameContainer.innerHTML = "";
  if (!games || games.length === 0) {
    gameContainer.innerHTML = "<p>No games found.</p>";
    return;games.forEach(game => {
  const card = document.createElement("div");
  card.className = "game-card";

  card.innerHTML = `
    <img src="${game.background_image}" alt="${game.name}">
    <h3>${game.name}</h3>
  `;

  // Make it open a popup
  card.addEventListener("click", () => {
    openGameModal(game);
  });

  gameContainer.appendChild(card);
});
  }
  const modal = document.getElementById("gameModal");
const modalContent = document.getElementById("modal-details");
const closeBtn = document.querySelector(".close-btn");

function openGameModal(game) {
  modalContent.innerHTML = `
    <h2>${game.name}</h2>
    <img src="${game.background_image}" alt="${game.name}" style="width:100%;border-radius:8px;" />
    <p><strong>Release Date:</strong> ${game.released}</p>
    <p><strong>Rating:</strong> ${game.rating}</p>
    <p><strong>Platforms:</strong> ${game.platforms.map(p => p.platform.name).join(", ")}</p>
  `;
  modal.style.display = "block";
}

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

  games.forEach((game) => {
    const card = document.createElement("div");
    card.className = "game-card";

    card.innerHTML = `
      <img src="${game.background_image || ''}" alt="${game.name}">
      <div class="game-info">
        <h3>${game.name}</h3>
        <p>Released: ${game.released}</p>
        <p>Rating: ${game.rating}</p>
      </div>
    `;

    gameContainer.appendChild(card);
  });
}
window.addEventListener("DOMContentLoaded", () => {
  renderRecentSearches();
});
// Close modal on X button
closeBtn.onclick = () => {
  modal.style.display = "none";
};

// Close modal if user clicks outside content
window.onclick = (e) => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
};