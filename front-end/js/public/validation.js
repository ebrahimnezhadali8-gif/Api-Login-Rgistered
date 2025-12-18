export function validateMobile(phone) {
  if (!phone) return false;

  const regex = /^(09)\d{9}$/;
  return regex.test(phone);
}

export function validatePassword(password) {
  if (!password) return false;

  const isValidLen = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[\W_]/.test(password);

  return (
    isValidLen &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSymbol
  );
}

export function validateNamePersian(name) {
  if (!name) return false;

  name = name.trim();

  const regex = /^[آ-ی]{2,}(?:\s[آ-ی]{2,})*$/;
  return regex.test(name);
}
