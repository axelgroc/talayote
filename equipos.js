document.addEventListener("DOMContentLoaded", () => {

  fetch("equipos_talayote.csv")
    .then(response => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el archivo CSV");
      }
      return response.text();
    })
    .then(data => {

      // Convertir CSV a array
      const filas = data
        .trim()
        .split("\n")
        .map(f => f.split(";"))
        .filter(f => f.length > 1 && f[0].trim() !=="");

      const select = document.getElementById("areaSelect");
      const contenedor = document.getElementById("contenedorEquipos");

      if (!select || !contenedor) {
        console.error("No se encontró el select o el contenedor en el HTML");
        return;
      }

      // Obtener áreas únicas (sin vacíos)
      const areas = [...new Set(filas.map(f => f[0]).filter(a => a && a !== "area"))];

      // Llenar el select
      areas.forEach(area => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = area;
        select.appendChild(option);
      });

      // Evento al cambiar área
      select.addEventListener("change", () => {

        const areaSeleccionada = select.value;
        contenedor.innerHTML = "";

        if (!areaSeleccionada) return;

        // Filtrar equipos por área
        const equipos = filas.filter(f => f[0] === areaSeleccionada);

        if (equipos.length === 0) {
          contenedor.innerHTML = "<p>No hay equipos en esta área.</p>";
          return;
        }

        // Crear tarjetas
        equipos.forEach(e => {

          const card = document.createElement("div");
          card.className = "equipo-card";

          card.innerHTML = `
            <h3>${e[1] || "Equipo"}</h3>

            <p><b>Marca:</b> ${e[2] || "N/A"}</p>
            <p><b>Modelo:</b> ${e[3] || "N/A"}</p>
            <p><b>Nombre:</b> ${e[4] || "N/A"}</p>

            <p class="ram"><b>RAM:</b> ${e[5] || "0"} GB</p>
            <p><b>S.O:</b> ${e[6] || "N/A"}</p>
            <p><b>CPU:</b> ${e[7] || "N/A"}</p>

            <p><b>DHCP:</b> ${e[8] || "N/A"}</p>
            <p class="ip"><b>IP:</b> ${e[9] || "N/A"}</p>
          `;

          contenedor.appendChild(card);
        });

      });

    })
    .catch(error => {
      console.error("Error cargando CSV:", error);
      document.getElementById("contenedorEquipos").innerHTML =
        "<p>Error cargando los datos.</p>";
    });

});