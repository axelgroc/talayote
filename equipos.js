document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("areaSelect");
  const contenedor = document.getElementById("contenedorEquipos");

  // Validación de seguridad para evitar errores de 'null'
  if (!select || !contenedor) {
    console.error("Error: Asegúrate de que los IDs 'areaSelect' y 'contenedorEquipos' existan en tu HTML.");
    return;
  }

  // Llamada al PHP
  fetch("datos.php")
    .then(res => {
      if (!res.ok) throw new Error("No se pudo obtener el archivo CSV.");
      return res.text();
    })
    .then(csvRaw => {
      // 1. Convertir el texto en un array de datos
      const filas = csvRaw
        .trim()
        .split("\n")
        .map(linea => linea.split(";"))
        // Filtramos líneas vacías o la fila de encabezados
        .filter(f => f.length > 1 && f[0].trim().toLowerCase() !== "area");

      if (filas.length === 0) {
        contenedor.innerHTML = "<p>El archivo CSV está vacío o no tiene el formato correcto.</p>";
        return;
      }

      // 2. Extraer áreas únicas para el menú desplegable
      const areas = [...new Set(filas.map(f => f[0].trim()))];

      // Limpiar y llenar el select
      select.innerHTML = '<option value="">-- Seleccione un Área --</option>';
      areas.forEach(area => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = area;
        select.appendChild(option);
      });

      // 3. Escuchar cambios en el select
      select.addEventListener("change", () => {
        const areaSeleccionada = select.value;
        contenedor.innerHTML = ""; // Limpiar pantalla

        if (!areaSeleccionada) return;

        // Filtrar solo los equipos del área elegida
        const filtrados = filas.filter(f => f[0].trim() === areaSeleccionada);

        // 4. Crear las tarjetas
        filtrados.forEach(e => {
          const card = document.createElement("div");
          card.className = "equipo-card";
          card.innerHTML = `
            <h3>${e[1] || "Equipo"}</h3>
            <div class="card-body">
              <p><b>Marca:</b> ${e[2] || "N/A"}</p>
              <p><b>Modelo:</b> ${e[3] || "N/A"}</p>
              <p><b>Nombre:</b> ${e[4] || "N/A"}</p>
              <p><b>RAM:</b> ${e[5] || "0"} GB</p>
              <p><b>S.O:</b> ${e[6] || "N/A"}</p>
              <p><b>CPU:</b> ${e[7] || "N/A"}</p>
              <p><b>IP:</b> ${e[9] || "N/A"}</p>
            </div>
          `;
          contenedor.appendChild(card);
        });
      });
    })
    .catch(error => {
      console.error("Error crítico:", error);
      contenedor.innerHTML = `<p style="color:red">Error al cargar datos: ${error.message}</p>`;
    });
});