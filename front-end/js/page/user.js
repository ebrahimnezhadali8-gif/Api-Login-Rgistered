import { apiGet } from "../api/api.js";
import { logout } from "../auth/logout.js";
//import { clearAuth } from "../auth/auth-store.js";
//import { logout } from "../auth/logout.js";
let phoneUser = null;
let roleUser = null;
const eye = document.getElementById("eye");
const nameUser = document.getElementById("name");
const uneye = document.getElementById("uneye");
const phone = document.getElementById("phone");
const role = document.getElementById("role-user");
// const phoneUpdate = document.getElementById("phone-update");
// const roleUpdate = document.getElementById("role-update");
const buttonLogout = document.querySelector("#button-login");
const userDataStr = sessionStorage.getItem("userData");
const userData = userDataStr ? JSON.parse(userDataStr) : {};
phoneUser = userData.phone || "";
roleUser = userData.role === "user" ? "کاربر" : "ادمین";
nameUser.innerHTML = userData.name || "";
role.innerHTML = roleUser;
phone.innerHTML = maskPhone(phoneUser);
function maskPhone(phone) {
  return phone.slice(0, 4) + "***" + phone.slice(-3);
}

/*document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});*/


eye.addEventListener("click", () => {
  eye.classList.remove("active");
  uneye.classList.add("active");
  phone.innerHTML = phoneUser;
});

uneye.addEventListener("click", () => {
  uneye.classList.remove("active");
  eye.classList.add("active");
  phone.innerHTML = maskPhone(phoneUser);
});

document.getElementById("button-data-user").addEventListener("click" , async()=>{
  try {
    const data = await apiGet("/api/user/me");
    console.log(data)
  } catch (error) {
  }
})

buttonLogout.addEventListener("click", () => {
  logout();
  window.location.href = "../index.html";
});
