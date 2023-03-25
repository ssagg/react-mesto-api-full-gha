export const BASE_URL = "https://api.nomoredomains.work" || "http://api.nomoredomains.work" ;
const getResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка ${res.status}`);
};

export const signup = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(password, email),
  }).then(getResponse);
};

export const signin = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(password, email),
  }).then(getResponse);
};

export const userValidation = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(getResponse);
};
