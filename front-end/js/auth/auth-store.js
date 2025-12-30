export function setAuth(token, role) {
  sessionStorage.setItem("accessToken", token);
  sessionStorage.setItem("userRole", role);
}

export function getAccessToken() {
  return sessionStorage.getItem("accessToken");
}

export function getRole() {
  return sessionStorage.getItem("userRole");
}

export function clearAuth() {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("userRole");
}