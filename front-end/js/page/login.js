import { apiPost } from "../public/api.js";
import { showForm } from "../public/change-page.js";
import { showErrorMsg } from "../public/show-message.js";
import { validateMobile, validatePassword } from "../public/validation.js";

const phoneInputLogin = document.getElementById("phone-input-login");
const passwordLogin = document.getElementById("password-input-login");
const errorBoxLogin = document.getElementById("Error-login");
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
loginBtn.addEventListener("click", async () => {
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
  loginBtn.disabled = true;
  loginBtn.textContent = "در حال بررسی ...";

  console.log("READY FOR BACKEND", payload);
  try {
    const data = await apiPost("/api/auth/login", payload);
    showForm("login-tow");
    document.getElementById("phone-code-tow").innerHTML = "091536387383"
  } catch (error) {
    showErrorMsg(error.message, "login");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "ورود";
  }
});
