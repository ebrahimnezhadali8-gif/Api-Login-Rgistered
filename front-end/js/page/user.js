import { apiGet } from "../api/api.js";
let phoneUser = null;
let roleUser = null;
const eye = document.getElementById("eye");
const uneye = document.getElementById("uneye");
const phone = document.getElementById("phone");
const role = document.getElementById("role-user");
const phoneUpdate = document.getElementById("phone-update");
const roleUpdate = document.getElementById("role-update") 

function maskPhone(phone) {
  return phone.slice(0, 4) + "***" + phone.slice(-3);
}

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});

async function loadProfile() {
  uneye.classList.remove("active");
  eye.classList.add("active");
  const name = document.getElementById("name");
  try {
    const data = await apiGet("/api/user/me");
    name.innerHTML = data.name;
    role.innerHTML = data.role;
    phoneUser = data.phone;
    roleUser = data.role ==="user" ? "کاربر" : "ادمین" 
    role.innerHTML = roleUser;
    const phoneMask = maskPhone(phoneUser);
    phone.innerHTML = phoneMask;
  } catch (error) {}
}
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

