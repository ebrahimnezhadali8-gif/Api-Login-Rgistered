export function showForm(type) {
  document.querySelectorAll(".auth-form").forEach((form) => {
    form.classList.remove("active");
    form.reset();
  });
  if (type === "login")
    document.querySelector("#login-form").classList.add("active");

  if (type === "rgister")
    document.querySelector("#register").classList.add("active");

  if (type === "forgot")
    document.querySelector("#forgot").classList.add("active");

  if (type === "forgot-key")
    document.querySelector("#forgot-key").classList.add("active");

  if (type === "change-password")
    document.querySelector("#change-password").classList.add("active");

  if (type === "login-tow")
    document.querySelector("#login-tow").classList.add("active");

  if (type === "sucesfull-password")
    document.querySelector("#sucesfull-password").classList.add("active");

  if (type === "sucesfull-registered")
    document.querySelector("#sucesfull-registered").classList.add("active");
}
