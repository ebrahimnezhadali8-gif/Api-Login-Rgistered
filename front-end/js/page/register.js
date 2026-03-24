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
const phoneInputRegisterPhone = document.getElementById(
  "phone-input-register-phone",
);
const passwordRegister = document.getElementById("password-input-register");
const passwordTowRegister = document.getElementById(
  "password-tow-input-register",
);
const timerEl = document.querySelector("#time-rgister");
const resendEl = document.querySelector("#recode-register-phone");
const minutesEl = document.querySelector("#minutes-register-phone");
const secondsEl = document.querySelector("#seconds-register-phone");
const registerBtnCode = document.getElementById("button-register-code");
let phoneUser, remainingTime, timerInterval;
const inputs = document.querySelectorAll(".otp-input-register input");
const registerBtn = document.getElementById("button-regiter");
const registerPhoneBtn = document.getElementById("button-register-phone");
const errorBoxRegister = document.getElementById("Error-register");
const errorBoxRegisterPhone = document.getElementById("Error-register-phone");
//change Form page
document.querySelector("#login-go").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("login");
});
document
  .querySelector("#login-go-in-register-phone")
  .addEventListener("click", (e) => {
    e.preventDefault();
    showForm("login");
  });
document
  .getElementById("button-register-go-to-login")
  .addEventListener("click", (e) => {
    e.preventDefault();
    showForm("login");
  });
document
  .getElementById("login-go-in-register-phone-code")
  .addEventListener("click", (e) => {
    e.preventDefault();
    showForm("register-phone");
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
    validateNamePersian(nameInputRegister.value),
  );
});

phoneInputRegisterPhone.addEventListener("blur", () => {
  toggleValidation(
    phoneInputRegisterPhone,
    validateMobile(phoneInputRegisterPhone.value),
  );
});

registerPhoneBtn.addEventListener("click", async () => {
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

// inputs code forgot code
inputs[0].focus();
inputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^0-9]/g, ""); //number
    //next focus
    if (input.value && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
    //end input
    if (index === inputs.length - 1 && input.value) {
      chechOtpRgister();
    }
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
});
registerBtnCode.addEventListener("click", (e) => {
  e.preventDefault();
  chechOtpRgister();
});
// Timer resend code
startTimer();
function startTimer() {
  clearInterval(timerInterval);

  timerEl.style.display = "block";
  resendEl.style.display = "none";

  updateUI();

  timerInterval = setInterval(() => {
    remainingTime--;

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerEl.style.display = "none";
      resendEl.style.display = "block";
      return;
    }

    updateUI();
  }, 1000);
}

function updateUI() {
  const m = Math.floor(remainingTime / 60);
  const s = remainingTime % 60;

  minutesEl.textContent = String(m).padStart(2, "0");
  secondsEl.textContent = String(s).padStart(2, "0");
}

resendEl.addEventListener("click", async (e) => {
  if (remainingTime > 0) return;

  e.preventDefault();
  remainingTime = 180;
  const payload = {
    type: "register",
    phone: phoneUser,
  };
  console.log(payload);
  try {
    const data = await apiPost("/api/auth/resendCode", payload);
    startTimer();
  } catch (error) {
    showErrorMsg(error.message, "register-phone-code");
  }
});

async function chechOtpRgister() {
  let otp = "";
  for (let input of inputs) {
    if (!input.value) {
      showErrorMsg("لطفا همه فیلد ها را پر کنبد", "register-phone-code");
    }
    otp += input.value;
  }
  registerBtnCode.disabled = true;
  registerBtnCode.textContent = "در حال بررسی ...";
  const payload = {
    code: otp,
    type: "register",
    phone: phoneUser,
  };

  try {
    const data = await apiPost("/api/auth/forgotOtp", payload);
    showForm("register");
    phoneInputRegister.value = phoneUser;
    lockInput(phoneInputRegister);
    remainingTime = 0;
  } catch (error) {
    showErrorMsg(error.message, "register-phone-code");
  } finally {
    registerBtnCode.disabled = false;
    registerBtnCode.textContent = "تایید";
  }
}

registerBtn.addEventListener("click", async () => {
  errorBoxRegister.style.display = "none";

  const nameValid = validateNamePersian(nameInputRegister.value);
  const phoneValid = validateMobile(phoneInputRegister.value);
  const passwordValid = validatePassword(passwordRegister.value);
  const passwordsMatch = passwordRegister.value === passwordTowRegister.value;

  if (!nameValid) {
    showErrorMsg(
      "نام و نام خانوادگی حداقل سه کارکتر و به صورت صحیح وارد شود",
      "register",
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
      "register",
    );
    return;
  }
  if (!passwordsMatch) {
    showErrorMsg("رمز های عبور یکسان نیستند", "register");
    return;
  }

  const payload = {
    name: nameInputRegister.value.trim(),
    phone: phoneUser,
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
function lockInput(inputEl) {
  inputEl.disabled = true;
  inputElreadOnly = true;

  inputEl.style.backgroundColor = "#f8f9fa";
  inputEl.style.Color = "#585e64";
}
