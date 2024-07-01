import { mostrarSpinnerLoad, ocultarSpinnerLoad } from "./spinner.js";

const ENDPOINT = "http://localhost:3000/monedas";

function ajaxRequest(method, url, body = null) {

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        ocultarSpinnerLoad();
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject(new Error("ERR " + xhr.status + " :" + xhr.statusText));
        }
      }
    });
    xhr.open(method, url);
    xhr.setRequestHeader("Content-Type", "application/json");
    mostrarSpinnerLoad();
    xhr.send(body);
  });
}

export function obtenerTodos() {
  return ajaxRequest("GET", ENDPOINT);
}

export function crearUno(object) {
  return ajaxRequest("POST", ENDPOINT, JSON.stringify(object));
}

export function eliminaUno(id) {
  return ajaxRequest("DELETE", `${ENDPOINT}/${id}`);
}

export function eliminaTodos() {
  return ajaxRequest("DELETE", ENDPOINT);
}

export function modificaUno(object) {
  return ajaxRequest("PUT", ENDPOINT, JSON.stringify(object));
}