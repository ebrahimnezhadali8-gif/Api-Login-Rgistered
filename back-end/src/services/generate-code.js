import crypto from "crypto";
//generate code with nummber and alefba
export function generateCode() {
  return crypto.randomInt(100000, 999999).toString();
}

//hash
export function hashCode(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

