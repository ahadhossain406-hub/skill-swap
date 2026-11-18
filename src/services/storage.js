// localStorage-e data rakhar choto helper.
// Baki app kokhono shorashori localStorage chhuy na, ei file-er maddhome kore.
export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Could not save to localStorage', error);
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Could not remove from localStorage', error);
  }
}