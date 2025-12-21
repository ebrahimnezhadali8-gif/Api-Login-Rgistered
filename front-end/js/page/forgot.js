import { apiPost } from "../public/api.js";
import { showForm } from "../public/change-page.js";
import { showErrorMsg } from "../public/show-message.js";
import { validateMobile, validatePassword } from "../public/validation.js";
const phoneInput = document.getElementById("phone-input-forgot");
const errorBoxForgot = document.getElementById("Error-forgot");
const forgotBtn = document.getElementById("button-forgot");
const forgotCodeBtn = document.getElementById("button-forgot-code");
let remainingTime;
let timerInterval;
let phoneUser;
const timerEl = document.querySelector(".timer");
const resendEl = document.querySelector("#recode-tow-forgot");
const minutesEl = document.querySelector("#minutes-f");
const secondsEl = document.querySelector("#seconds-f");
const inputs = document.querySelectorAll(".otp-input-forgot input");
const passwordFogot = document.querySelector("#password-input-forgot");
const passwordTowFogot = document.querySelector("#password-tow-input-forgot");
const changePasswordBtn = document.querySelector("#button-change-password");
const errorChangePasswordBox = document.querySelector("#Error-change-password")

//change form page
document.querySelector("#login-go-in-forgot").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("login");
});
document
  .querySelector("#phone-go-in-forgot-code")
  .addEventListener("click", (e) => {
    e.preventDefault();
    showForm("forgot");
  });

document
  .querySelector("#phone-go-in-change-password")
  .addEventListener("click", (e) => {
    e.preventDefault();
    showForm("forgot-key");
  });
document.querySelector("#button-go-to-login").addEventListener("click", (e) => {
  e.preventDefault();
  showForm("login");
});
//validation forgot
forgotBtn.addEventListener("click", async () => {
  errorBoxForgot.style.display = "none";

  const phoneValid = validateMobile(phoneInput.value);

  if (!phoneValid) {
    showErrorMsg("شماره تلفن  را به شکل صحیح وارد کنید", "forgot");
    return;
  }
  const payload = {
    phone: phoneInput.value,
    type: "forgot",
  };
  phoneUser = phoneInput.value;
  forgotBtn.disabled = true;
  forgotBtn.textContent = "در حال بررسی ...";

  try {
    const data = await apiPost("/api/auth/resendCode", payload);
    remainingTime = 180;
    showForm("forgot-key");
    document.getElementById("phone-code").innerHTML = phoneUser;
    inputs[0].focus();
  } catch (error) {
    showErrorMsg(error.message, "forgot");
  } finally {
    forgotBtn.disabled = false;
    forgotBtn.textContent = "ورود";
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
      chechOtpForgot();
    }
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
});
forgotCodeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  chechOtpForgot();
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
    type: "forgot",
    phone: phoneUser,
  };

  try {
    const data = await apiPost("/api/auth/resendCode", payload);
    startTimer();
  } catch (error) {
    showErrorMsg(error.message, "forgot-code");
  }
});

async function chechOtpForgot() {
  let otp = "";
  for (let input of inputs) {
    if (!input.value) {
      showErrorMsg("لطفا همه فیلد ها را پر کنبد", "forgot-code");
    }
    otp += input.value;
  }
  forgotCodeBtn.disabled = true;
  forgotCodeBtn.textContent = "در حال بررسی ...";
  const payload = {
    code: otp,
    type: "forgot",
    phone: phoneUser,
  };

  try {
    const data = await apiPost("/api/auth/forgotOtp", payload);
    showForm("change-password");
    remainingTime = 0;
  } catch (error) {
    showErrorMsg(error.message, "forgot-code");
  } finally {
    forgotCodeBtn.disabled = false;
    forgotCodeBtn.textContent = "تایید";
  }
}
//function class input
function toggleValidationForgot(input, isValid) {
  input.classList.remove("is-valid", "is-invalid");
  input.classList.add(isValid ? "is-valid" : "is-invalid");
}
//validation change password
passwordFogot.addEventListener("input", () => {
  toggleValidationForgot(passwordFogot, validatePassword(passwordFogot.value));
});

changePasswordBtn.addEventListener("click", async () => {
  errorChangePasswordBox.style.display = "none";

  const passwordValid = validatePassword(passwordFogot.value);
  const passwordsMatch = passwordFogot.value === passwordTowFogot.value;

  if (!passwordValid) {
    showErrorMsg(
      "رمز عبور باید شامل حرف بزرگ، حرف کوچک، عدد و کاراکتر خاص باشد",
      "change-password"
    );
    return;
  }
  if (!passwordsMatch) {
    showErrorMsg("رمز های عبور یکسان نیستند", "change-password");
    return;
  }

  const payload = {
    phone: phoneUser,
    password: passwordFogot.value,
  };
  changePasswordBtn.disabled = true;
  changePasswordBtn.textContent = "در حال ارسال ...";

  console.log("READY FOR BACKEND", payload);
  try {
    const data = await apiPost("/api/auth/changePassword", payload);
    console.log(data);
    showForm("sucesfull-password");
  } catch (error) {
    showErrorMsg(error.message, "change-password");
  } finally {
    changePasswordBtn.disabled = false;
    changePasswordBtn.innerHTML = "ثبت نام";
  }
});
