let errorTimer = null;

export function showErrorMsg(message, type) {
  const errorBox = document.getElementById(`Error-${type}`);
  const errorMessage = document.getElementById(`error-message-${type}`);
  if (errorTimer) clearTimeout(errorTimer);
  errorBox.style.display = "block";
  errorMessage.innerHTML = message;
  errorTimer = setTimeout(() => {
    errorBox.style.display = "none";
  }, 7000);
}
