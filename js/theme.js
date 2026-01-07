const selectBtn = document.querySelector(".custom-select-btn");
const customSelect = document.querySelector(".custom-select-wrapper");
const optionsList = document.querySelectorAll(".custom-options li");
const body = document.body;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.className = savedTheme;
  selectBtn.querySelector(".arrow").textContent = "▼";
}

selectBtn.addEventListener("click", () => {
  customSelect.classList.toggle("open");
});

optionsList.forEach(option => {
  option.addEventListener("click", () => {
    const theme = option.getAttribute("data-value");
    body.className = theme;
    localStorage.setItem("theme", theme);

    selectBtn.firstChild.textContent = option.textContent + " ";
    customSelect.classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove("open");
  }
});
