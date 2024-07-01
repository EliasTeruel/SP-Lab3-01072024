import Crypto from './crypto.js';
import { eliminaUno, crearUno, eliminaTodos, obtenerTodos } from "./api.js";
import { fetchCrearUno, fetchEliminaUno, fetchModificaUno } from "./api-fetch-async.js";
import { actualizarTablaYPrecio, filtrarItems } from "./filtros.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

const items = [];
const formulario = document.getElementById("form-item");

document.addEventListener('DOMContentLoaded', function () {
    loadItems();
    escuchandoFormulario();
    escuchandoFiltro();
    escuchandoBtnDeleteAll();
    masAcciones();
    cancelar();

});

async function loadItems() {
    mostrarSpinner();
    let str = await obtenerTodos();
    ocultarSpinner();
    const objetos = str || [];
    objetos.forEach(obj => {
        const model = new Crypto(
            obj.id,
            obj.nombre,
            obj.simbolo,
            obj.fechaCreacion,
            obj.precioActual,
            obj.consenso,
            obj.cantidadCirculacion,
            obj.algoritmo,
            obj.sitioWeb
        );
        items.push(model);
    });
    rellenarTabla();
}


export async function rellenarTabla(array = null) {
    if (array == null) {
        const tabla = document.getElementById("table-items");
        let tbody = tabla.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        const celdas = ["id", "nombre", "simbolo", "fechaCreacion", "precioActual", "consenso", "cantidadCirculacion", "algoritmo", "sitioWeb"];

        items.forEach((item) => {
            let nuevaFila = document.createElement("tr");
            celdas.forEach((celda) => {
                let nuevaCelda = document.createElement("td");
                nuevaCelda.textContent = item[celda];
                nuevaFila.appendChild(nuevaCelda);
            });
            nuevaFila.addEventListener('click', () => {
                actualizarFormulario(item);
            });
            tbody.appendChild(nuevaFila);
        });
    } else {
        const tabla = document.getElementById("table-items");
        let tbody = tabla.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        const celdas = ["id", "nombre", "simbolo", "fechaCreacion", "precioActual", "consenso", "cantidadCirculacion", "algoritmo", "sitioWeb"];

        array.forEach((item) => {
            let nuevaFila = document.createElement("tr");
            celdas.forEach((celda) => {
                let nuevaCelda = document.createElement("td");
                nuevaCelda.textContent = item[celda];
                nuevaFila.appendChild(nuevaCelda);
            });
            nuevaFila.addEventListener('click', () => {
                actualizarFormulario(item);
            });
            tbody.appendChild(nuevaFila);
        });
    }
}


function escuchandoFormulario() {
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = formulario.querySelector("#id").value;
        const nombre = formulario.querySelector("#nombre").value;
        const simbolo = formulario.querySelector("#simbolo").value;
        const fechaCreacion = new Date().toISOString().slice(0, 10);
        const precioActual = formulario.querySelector("#precio").value;
        const consenso = formulario.querySelector("#tipo-de-concenso").value;
        const cantidadCirculacion = formulario.querySelector("#cantidad-de-circulacion").value;
        const algoritmo = formulario.querySelector("#algoritmo").value;
        const sitioWeb = formulario.querySelector("#sitio-web-oficial").value;
        const model = new Crypto(
            id || generarNuevoId(),
            nombre,
            simbolo,
            fechaCreacion,
            precioActual,
            consenso,
            cantidadCirculacion,
            algoritmo,
            sitioWeb
        );
        const respuesta = model.verify();

        if (respuesta.success) {
            if (id) {
                const index = items.findIndex(item => item.id == id);
                if (index !== -1) {
                    items[index] = model;
                    try {
                        await fetchModificaUno(model);
                    } catch (error) {
                        alert(error);
                        return;
                    }
                }
            } else {
                items.push(model);
                try {
                    await fetchCrearUno(model);
                } catch (error) {
                    alert(error);
                    return;
                }
            }
            actualizarFormulario();
            rellenarTabla();
        } else {
            alert(respuesta.rta);
        }
    });
}


function generarNuevoId() {
    const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
    return maxId + 1;
}


function cancelar() {
    const btn = document.getElementById("btn-cancelar");
    btn.addEventListener("click", async (e) => {
        actualizarFormulario();
    });
}


function escuchandoBtnDeleteAll() {
    const btn = document.getElementById("btn-delete-all");
    btn.addEventListener("click", async (e) => {
        const rta = confirm('Desea eliminar todos los Items?');
        if (rta) {
            items.splice(0, items.length);
            try {
                await eliminaTodos();
                actualizarFormulario();
                rellenarTabla();
            }
            catch (error) {
                alert(error);
            }
        }
    });
}


function actualizarFormulario(model = null) {
    const form = document.getElementById("form-item");
    if (model) {
        form.querySelector("#id").value = model.id;
        form.querySelector("#nombre").value = model.nombre;
        form.querySelector("#simbolo").value = model.simbolo;
        form.querySelector("#precio").value = model.precioActual;
        form.querySelector("#tipo-de-concenso").value = model.consenso;
        form.querySelector("#cantidad-de-circulacion").value = model.cantidadCirculacion;
        form.querySelector("#algoritmo").value = model.algoritmo;
        form.querySelector("#sitio-web-oficial").value = model.sitioWeb;
    } else {
        form.reset();
    }
}


async function eliminarPorId(id) {
    const index = items.findIndex(item => item.id == id);
    if (index !== -1) {
        try {
            await fetchEliminaUno(id);
            items.splice(index, 1);
            actualizarFormulario();
            rellenarTabla();
        } catch (error) {
            alert(`Error al eliminar el elemento: ${error.message}`);
        }
    }
}


function buscarPorId(id) {
    return items.find(item => item.id == id);
}

function masAcciones() {
    const btnMasAcciones = document.getElementById('btn-mas-acciones');
    const panel = document.getElementById('acciones-panel');
    btnMasAcciones.addEventListener('click', function () {
        panel.classList.toggle('d-none');
    });
    document.getElementById('btn-ocultar').addEventListener('click', function () {
        panel.classList.add('d-none');
    });
    document.getElementById('btn-modificar').addEventListener('click', function () {
        const id = document.getElementById("ID").value;
        const item = buscarPorId(id);
        if (item) {
            actualizarFormulario(item);
        } else {
            alert("No se encontró ningún elemento con el ID proporcionado.");
        }
    });
    document.getElementById('btn-borrar').addEventListener('click', function () {
        const id = document.getElementById("ID").value;
        const item = buscarPorId(id);
        if (item) {
            if (confirm("Desea eliminar el ID? " + id)) {
                eliminarPorId(id);
                actualizarFormulario();
                rellenarTabla();
            }
        } else {
            alert("No se encontró ningún elemento con el ID proporcionado.");
        }
    });
    document.getElementById('btn-delete-all').addEventListener('click', function () {
        const rta = confirm('Desea eliminar todos los Items?');
        if (rta) {
            items.splice(0, items.length);
            try {
                eliminaTodos();
                actualizarFormulario();
                rellenarTabla();
            }
            catch (error) {
                alert(error);
            }
        }
    });
}


function escuchandoFiltro() {
    const filterButton = document.getElementById("filter-button");
    const algoritmoSelect = document.getElementById("select-type");
    filterButton.addEventListener("click", function (event) {
        event.preventDefault();
        const selectedAlgoritmo = algoritmoSelect.value.trim();
        let datosFiltrados = [];
        if (selectedAlgoritmo) {
            datosFiltrados = filtrarItems(items, "algoritmo", selectedAlgoritmo);
        } else {
            datosFiltrados = items;
        }
        actualizarTablaYPrecio(datosFiltrados);
    });
}