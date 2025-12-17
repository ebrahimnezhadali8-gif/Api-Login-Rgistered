import { showForm } from "../public/change-page.js";
import {
  validateMobile,
  validateNamePersian,
  validatePassword,
} from "../public/validation.js";
const nameInputRegister = document.getElementById("name-input-register");
const phoneInputRegister = document.getElementById("phone-input-register");
const passwordRegister = document.getElementById("password-input-register");
const passwordTowRegister = document.getElementById(
  "password-tow-input-register"
);
const registerBtn = document.getElementById("button-regiter");
const errorMsgRegister = document.getElementById("error-message-register");
const errorBoxRegister = document.getElementById("Error-register");
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
document.querySelector("#login-go").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("login");
});
document.querySelector("#login-go-in-forgot").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("login");
});
//function class input
function toggleValidation(input, isValid) {
  input.classList.remove("is-valid", "is-invalid");
  input.classList.add(isValid ? "is-valid" : "is-invalid");
}
//validation register
passwordRegister.addEventListener("input", () => {
  toggleValidation(passwordRegister, validatePassword(passwordRegister.value));
});

nameInputRegister.addEventListener("blur", () => {
  toggleValidation(
    nameInputRegister,
    validateNamePersian(nameInputRegister.value)
  );
});

phoneInputRegister.addEventListener("blur", () => {
  toggleValidation(
    phoneInputRegister,
    validateMobile(phoneInputRegister.value)
  );
});

registerBtn.addEventListener("click", () => {
  errorBoxRegister.style.display = "none";

  const nameValid = validateNamePersian(nameInputRegister.value);
  const phoneValid = validateMobile(phoneInputRegister.value);
  const passwordValid = validatePassword(passwordRegister.value);
  const passwordsMatch = passwordRegister.value === passwordTowRegister.value;

  if (!nameValid) {
    errorMsgRegister.textContent =
      "نام و نام خانوادگی حداقل سه کارکتر و به صورت صحیح وارد شود";
    errorBoxRegister.style.display = "block";
    return;
  }
  if (!phoneValid) {
    errorMsgRegister.textContent = "شماره تلفن صحیح نیست";
    errorBoxRegister.style.display = "block";
    return;
  }
  if (!passwordValid) {
    errorMsgRegister.textContent =
      "رمز عبور باید حداقل 6 کاراکتر , حداقل یک حرف بزرگ , یک حرف کوچک , یک عدد ,یک نماد ویژه داشته باشد";
    errorBoxRegister.style.display = "block";
    return;
  }
  if (!passwordsMatch) {
    errorMsgRegister.textContent = "رمز های عبور یکسان نیستند";
    errorBoxRegister.style.display = "block";
    return;
  }

  const payload = {
    name: nameInputRegister.value.trim(),
    phone: phoneInputRegister.value,
    password: passwordRegister.value,
  };

  console.log("READY FOR BACKEND", payload);
});
//validation login
loginBtn.addEventListener("click", () => {
  errorBoxLogin.style.display = "none";

  const phoneValid = validateMobile(phoneInputLogin.value);
  const passwordValid = validatePassword(passwordLogin.value);

  if (!phoneValid || !passwordValid) {
    errorBoxLogin.style.display = "block";
    errorMsgLogin.innerHTML = "شماره تلفن و رمز عبور را به شکل صحیح وارد کنید";
    return;
  }
  const payload = {
    phone: phoneInputLogin.value,
    password: passwordLogin.value,
  };

  console.log("READY FOR BACKEND", payload);
});
