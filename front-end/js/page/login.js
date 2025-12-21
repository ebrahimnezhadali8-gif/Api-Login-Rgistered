import { apiPost } from "../public/api.js";
import { showForm } from "../public/change-page.js";
import { showErrorMsg } from "../public/show-message.js";
import { validateMobile, validatePassword } from "../public/validation.js";

const phoneInputLogin = document.getElementById("phone-input-login");
const passwordLogin = document.getElementById("password-input-login");
const errorBoxLogin = document.getElementById("Error-login");
const loginBtn = document.getElementById("button-login");
const loginTowBtn = document.getElementById("button-login-code");
let remainingTime;
let timerInterval;
let phoneUser;
const timerEl = document.querySelector(".timer");
const resendEl = document.querySelector("#recode-tow");
const minutesEl = document.querySelector("#minutes");
const secondsEl = document.querySelector("#seconds");
const inputs = document.querySelectorAll(".otp-input input");
//change form page
document.querySelector("#forgot-password").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("forgot");
});
document.querySelector("#register-go").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("rgister");
});
document.querySelector("#login-go-in-code").addEventListener("click", (e) => {
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
  phoneUser = phoneInputLogin.value;
  loginBtn.disabled = true;
  loginBtn.textContent = "در حال بررسی ...";

  try {
    const data = await apiPost("/api/auth/login", payload);
    remainingTime = 180;
    showForm("login-tow");
    document.getElementById("phone-code-tow").innerHTML = phoneUser;
    inputs[0].focus();
  } catch (error) {
    showErrorMsg(error.message, "login");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "ورود";
  }
});
// inputs code login tow
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
      chechOtp();
    }
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
});
loginTowBtn.addEventListener("click", (e) => {
  e.preventDefault();
  chechOtp();
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
    type: "login",
    phone: phoneUser,
  };

  try {
    const data = await apiPost("/api/auth/resendCode", payload);
    startTimer();
  } catch (error) {
    showErrorMsg(error.message, "login-tow");
  }
});

async function chechOtp() {
  let otp = "";
  for (let input of inputs) {
    if (!input.value) {
      showErrorMsg("لطفا همه فیلد ها را پر کنبد", "login-tow");
    }
    otp += input.value;
  }
  loginTowBtn.disabled = true;
  loginTowBtn.textContent = "در حال بررسی ...";
  const payload = {
    code: otp,
    type: "login",
    phone: phoneUser,
  };

  try {
    const data = await apiPost("/api/auth/codeOtp", payload);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    setTimeout(() => {
      window.location.href = `./${data.role}/dashboard.html`;
    }, 1000);
  } catch (error) {
    showErrorMsg(error.message, "login-tow");
  } finally {
    loginTowBtn.disabled = false;
    loginTowBtn.textContent = "تایید";
  }
}
