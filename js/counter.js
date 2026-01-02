let visits = localStorage.getItem("visits") || 0;
visits++;
localStorage.setItem("visits", visits);
console.log("Visits:", visits);

const views = Number(localStorage.getItem("views") || 0) + 1;
localStorage.setItem("views", views);
document.getElementById("viewCount").textContent =
  `👀 Views: ${views}`;


