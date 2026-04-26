document.addEventListener("DOMContentLoaded", () => {

// LOGIN

  const PASSWORD = "12345";

  const loginContainer = document.createElement("div");
  loginContainer.style.position = "fixed";
  loginContainer.style.top = "0";
  loginContainer.style.left = "0";
  loginContainer.style.width = "100%";
  loginContainer.style.height = "100%";
  loginContainer.style.display = "flex";
  loginContainer.style.justifyContent = "center";
  loginContainer.style.alignItems = "center";
  loginContainer.style.background = "rgba(0,0,0,0.8)";
  loginContainer.style.zIndex = "9999";

  const loginBox = document.createElement("div");
  loginBox.style.background = "white";
  loginBox.style.padding = "25px";
  loginBox.style.borderRadius = "10px";
  loginBox.style.textAlign = "center";

  const input = document.createElement("input");
  input.type = "password";
  input.placeholder = "Ingresa la contraseña";
  input.style.padding = "8px";

  const btn = document.createElement("button");
  btn.textContent = "Entrar";
  btn.style.marginLeft = "10px";
  btn.style.padding = "8px 12px";

  const error = document.createElement("p");
  error.style.color = "red";
  error.style.marginTop = "10px";

  loginBox.append(input, btn, error);
  loginContainer.appendChild(loginBox);
  document.body.appendChild(loginContainer);

  btn.addEventListener("click", validar);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") validar();
  });

  function validar() {
    if (input.value !== PASSWORD) {
      error.textContent = "Contraseña incorrecta";
      return;
    }

    loginContainer.remove();
    cargarDatos();
  }

// SISTEMA PRINCIPAL

  function cargarDatos() {

    fetch("equipos_talayote.csv")
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar el CSV");
        return res.text();
      })
      .then(data => {

        const limpiar = (txt) =>
          String(txt || "")
            .replace(/</g, "")
            .replace(/>/g, "")
            .replace(/script/gi, "")
            .trim();

        const filas = data
          .trim()
          .split("\n")
          .map(f => f.split(";").map(c => limpiar(c)))
          .filter(f => f.length >= 10 && f[0] && f[1]);

        const select = document.getElementById("areaSelect");
        const contenedor = document.getElementById("contenedorEquipos");

        if (!select || !contenedor) {
          console.error("Faltan elementos HTML");
          return;
        }

// LIMPIAR SELECT

        select.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Selecciona un área";
        select.appendChild(defaultOption);

        const areas = [...new Set(
          filas.map(f => f[0]).filter(a => a && a.toLowerCase() !== "area")
        )];

        areas.forEach(area => {
          const option = document.createElement("option");
          option.value = area;
          option.textContent = area;
          select.appendChild(option);
        });

// 📌 FILTRO DE EQUIPOS

        select.onchange = () => {

          const area = select.value;
          contenedor.innerHTML = "";

          if (!area) return;

          const equipos = filas.filter(f => f[0] === area);

          if (equipos.length === 0) {
            contenedor.textContent = "No hay equipos en esta área.";
            return;
          }

          equipos.forEach(e => {

            const card = document.createElement("div");
            card.className = "equipo-card";

            const titulo = document.createElement("h3");
            titulo.textContent = e[1] || "Equipo";

            const crearCampo = (label, valor) => {
              const p = document.createElement("p");
              const b = document.createElement("b");
              b.textContent = label + ": ";
              const span = document.createElement("span");
              span.textContent = valor || "N/A";
              p.append(b, span);
              return p;
            };

            const marca = crearCampo("Marca", e[2]);
            const modelo = crearCampo("Modelo", e[3]);
            const nombre = crearCampo("Nombre", e[4]);
            const ram = crearCampo("RAM", (e[5] || "0") + " GB");
            const so = crearCampo("S.O", e[6]);
            const cpu = crearCampo("CPU", e[7]);
            const dhcp = crearCampo("DHCP", e[8]);
            const ip = crearCampo("IP", e[9]);

            card.append(titulo, marca, modelo, nombre, ram, so, cpu, dhcp, ip);
            contenedor.appendChild(card);
          });

        };

      })
      .catch(error => {
        console.error("Error cargando CSV:", error);

        const contenedor = document.getElementById("contenedorEquipos");
        if (contenedor) {
          contenedor.textContent = "Error cargando los datos.";
        }
      });
  }

});