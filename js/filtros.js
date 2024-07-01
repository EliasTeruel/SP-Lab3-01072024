export function filtrarItems(items, filterType, tipoTransaccion) {
    let datosFiltrados = [];
    if (filterType === 'algoritmo') {
        datosFiltrados = items.filter(item => item[filterType].toLowerCase() === tipoTransaccion.toLowerCase());
    }
    return datosFiltrados;
}

function calcularPromedioPrecios(datosFiltrados) {
    if (datosFiltrados.length > 0) {
        const precios = datosFiltrados.map(item => parseFloat(item.precioActual));
       const promedioPrecio = precios.reduce((sum, precio) => sum + precio, 0) / precios.length;
       return promedioPrecio.toFixed(2);
    }
    return "N/A";
}

export function actualizarTablaYPrecio(datosFiltrados) {
    const promedioPrecio = calcularPromedioPrecios(datosFiltrados);
    document.getElementById("algoritmo-price").textContent = promedioPrecio;
    const tabla = document.getElementById("table-items").getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    const celdas = ["id", "nombre", "simbolo", "fechaCreacion", "precioActual", "consenso", "cantidadCirculacion", "algoritmo", "sitioWeb"];
    
    datosFiltrados.forEach((item) => {
        let nuevaFila = document.createElement("tr");
        celdas.forEach((celda) => {
            let nuevaCelda = document.createElement("td");
            nuevaCelda.textContent = item[celda];
            nuevaFila.appendChild(nuevaCelda);
        });
        nuevaFila.addEventListener('click', () => {
            actualizarFormulario(item);
        });
        tabla.appendChild(nuevaFila);
    });
}