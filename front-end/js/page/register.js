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
const phoneInputRegisterPhone = document.getElementById("phone-input-register-phone");
const passwordRegister = document.getElementById("password-input-register");
const passwordTowRegister = document.getElementById(
  "password-tow-input-register"
);
let phoneUser ,remainingTime;
const inputs = document.querySelectorAll(".otp-input-forgot input");
const registerBtn = document.getElementById("button-regiter");
const registerPhoneBtn = document.getElementById("button-register-phone");
const errorBoxRegister = document.getElementById("Error-register");
const errorBoxRegisterPhone = document.getElementById("Error-register-phone");
//change Form page
document.querySelector("#login-go").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("login");
});
document.querySelector("#login-go-in-register-phone").addEventListener("click", (e) => {
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

registerPhoneBtn.addEventListener("click", async() => {
  errorBoxRegisterPhone.style.display = "none";

  const phoneValid = validateMobile(phoneInputRegisterPhone.value);

  if (!phoneValid) {
    showErrorMsg("شماره تلفن صحیح نیست", "register-phone");
    return;
  }
  const payload = {
    phone: phoneInputRegisterPhone.value,
    type: "register",
  };
  phoneUser = phoneInputRegisterPhone.value;
  registerPhoneBtn.disabled = true;
  registerPhoneBtn.textContent = "در حال بررسی ...";
  try {
    const data = await apiPost("/api/auth/resendCode", payload);
    remainingTime = 180;
    showForm("register-phone-code");
    document.getElementById("phone-register-code").innerHTML = phoneUser;
    inputs[0].focus();
  } catch (error) {
    console.log(error);
    showErrorMsg(error.message, "register-phone");
  } finally {
    registerPhoneBtn.disabled = false;
    registerPhoneBtn.textContent = "ارسال کد تایید";
  }
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
