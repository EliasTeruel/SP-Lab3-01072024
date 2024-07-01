import {mostrarSpinnerLoad, ocultarSpinnerLoad } from "./spinner.js";

const ENDPOINT = "http://localhost:3000/monedas";

async function fetchRequest(url, options) {
    mostrarSpinnerLoad();
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return {};
        }
    } catch (error) {
        throw new Error(`Fetch error: ${error.message}`);
    } finally {
        ocultarSpinnerLoad();
    }
}

export function fetchObtenerTodos() {
  return fetchRequest(ENDPOINT);
}

export function fetchCrearUno(object) {
  return fetchRequest(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });
}

export function fetchEliminaUno(id) {
  return fetchRequest(`${ENDPOINT}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function fetchEliminaTodos() {
  return fetchRequest(ENDPOINT, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function fetchModificaUno(object) {
    return fetchRequest(`${ENDPOINT}/${object.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    });
  }
  