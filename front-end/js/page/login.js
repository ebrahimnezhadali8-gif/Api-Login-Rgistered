import { showForm } from "../public/change-page.js";
import { showErrorMsg } from "../public/show-message.js";
import { validateMobile, validatePassword } from "../public/validation.js";

const phoneInputLogin = document.getElementById("phone-input-login");
const passwordLogin = document.getElementById("password-input-login");
const errorBoxLogin = document.getElementById("Error-login");
const errorMsgLogin = document.getElementById("error-message-login");
const loginBtn = document.getElementById("button-login");
//change form page
document.querySelector("#forgot-password").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("forgot");
});
document.querySelector("#register-go").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("rgister");
});
document.querySelector("#login-go-in-forgot").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("login");
});

//validation login
loginBtn.addEventListener("click", () => {
  errorBoxLogin.style.display = "none";

  const phoneValid = validateMobile(phoneInputLogin.value);
  const passwordValid = validatePassword(passwordLogin.value);

  if (!phoneValid || !passwordValid) {
    showErrorMsg("شماره تلفن و رمز عبور را به شکل صحیح وارد کنید", "login");
    return;
  }
  const payload = {
    phone: phoneInputLogin.value,
    password: passwordLogin.value,
  };

  console.log("READY FOR BACKEND", payload);
});
