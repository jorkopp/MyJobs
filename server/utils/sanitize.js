/**
 * Plain-text fields: strip angle brackets to reduce stored XSS if data is ever
 * rendered unsafely. Prefer React's default escaping for all UI output.
 */
function sanitizePlainText(input, maxLen = 80000) {
  if (input == null) return "";
  const s = String(input).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
  return s.replace(/[<>]/g, "").slice(0, maxLen);
}

module.exports = { sanitizePlainText };
