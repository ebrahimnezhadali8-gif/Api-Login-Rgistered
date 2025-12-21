import { apiPost } from "../public/api.js";
import { showForm } from "../public/change-page.js";
import { showErrorMsg } from "../public/show-message.js";
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
const errorBoxRegister = document.getElementById("Error-register");
//change Form page
document.querySelector("#login-go").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("login");
});
document
  .getElementById("button-register-go-to-login")
  .addEventListener("click", (e) => {
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

registerBtn.addEventListener("click", async () => {
  errorBoxRegister.style.display = "none";

  const nameValid = validateNamePersian(nameInputRegister.value);
  const phoneValid = validateMobile(phoneInputRegister.value);
  const passwordValid = validatePassword(passwordRegister.value);
  const passwordsMatch = passwordRegister.value === passwordTowRegister.value;

  if (!nameValid) {
    showErrorMsg(
      "نام و نام خانوادگی حداقل سه کارکتر و به صورت صحیح وارد شود",
      "register"
    );
    return;
  }
  if (!phoneValid) {
    showErrorMsg("شماره تلفن صحیح نیست", "register");
    return;
  }
  if (!passwordValid) {
    showErrorMsg(
      "رمز عبور باید شامل حرف بزرگ، حرف کوچک، عدد و کاراکتر خاص باشد",
      "register"
    );
    return;
  }
  if (!passwordsMatch) {
    showErrorMsg("رمز های عبور یکسان نیستند", "register");
    return;
  }

  const payload = {
    name: nameInputRegister.value.trim(),
    phone: phoneInputRegister.value,
    password: passwordRegister.value,
  };
  registerBtn.disabled = true;
  registerBtn.textContent = "در حال ارسال ...";

  try {
    const data = await apiPost("/api/auth/register", payload);
    showForm("sucesfull-registered");
    document.getElementById("message-succesfull-register").innerHTML =
      data.message;
  } catch (error) {
    showErrorMsg(error.message, "register");
  } finally {
    registerBtn.disabled = false;
    registerBtn.innerHTML = "ثبت نام";
  }
});
