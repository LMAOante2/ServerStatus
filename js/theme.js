const select = document.getElementById("themeSelect");
const body = document.body;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.className = savedTheme;
  select.value = savedTheme;
}

select.addEventListener("change", () => {
  body.className = select.value;
  localStorage.setItem("theme", select.value);
});
