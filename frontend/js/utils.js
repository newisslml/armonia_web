export function money(n) {
  return '$' + Math.round(Number(n)).toLocaleString('es-CL');
}

export function imgUrl(apiUrl, path) {
  if (!path) return null;
  return /^https?:\/\//.test(path) ? path : `${apiUrl}${path}`;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
