import { showForm } from "../public/change-page.js";
import {
  validateMobile,
  validateNamePersian,
  validatePassword,
} from "../public/validation.js";

const nameInput = document.getElementById("name-input-register");
const phoneInput = document.getElementById("phone-input-register");
const password = document.getElementById("password-input-register");
const passwordTow = document.getElementById("password-tow-input-register");
const registerBtn = document.getElementById("button-regiter");
const errorMsg = document.getElementById("error-message-register");
const errorBox = document.getElementById("Error-register")
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

function toggleValidation(input, isValid) {
  input.classList.remove("is-valid", "is-invalid");
  input.classList.add(isValid ? "is-valid" : "is-invalid");
}

password.addEventListener("input", () => {
  toggleValidation(password, validatePassword(password.value));
});

nameInput.addEventListener("blur", () => {
  toggleValidation(nameInput, validateNamePersian(nameInput.value));
});

phoneInput.addEventListener("blur", () => {
  toggleValidation(phoneInput, validateMobile(phoneInput.value));
});

registerBtn.addEventListener("click", () => {
  errorBox.style.display  = "none";

  const nameValid = validateNamePersian(nameInput.value);
  const phoneValid = validateMobile(phoneInput.value);
  const passwordValid = validatePassword(password.value);
  const passwordsMatch = password.value === passwordTow.value;

  if (!nameValid) {
    errorMsg.textContent =
      "نام و نام خانوادگی حداقل سه کارکتر و به صورت صحیح وارد شود";
    errorBox.style.display = "block";
    return;
  }
  if (!phoneValid) {
    errorMsg.textContent = "شماره تلفن صحیح نیست";
    errorBox.style.display = "block";
    return;
  }
  if (!passwordValid) {
    errorMsg.textContent =
      "رمز عبور باید حداقل 6 کاراکتر , حداقل یک حرف بزرگ , یک حرف کوچک , یک عدد ,یک نماد ویژه داشته باشد";
    errorBox.style.display  = "block";
    return;
  }
  if (!passwordsMatch) {
    errorMsg.textContent = "رمز های عبور یکسان نیستند";
    errorBox.style.display = "block";
    return;
  }

  const payload = {
    name: nameInput.value.trim(),
    phone: phoneInput.value,
    password: passwordInput.value,
  };

  console.log("READY FOR BACKEND", payload);
});
