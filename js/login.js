import { showForm } from "./change-page.js";

document.querySelector("#forgot-password").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("forgot");
});

document.querySelector("#register-go").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("rgister");
});

document.querySelector("#login-go").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("login");
});

document.querySelector("#login-go-in-forgot").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("login");
});


