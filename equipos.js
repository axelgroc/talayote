document.addEventListener("DOMContentLoaded", () => {

  // CONTRASEÑA

  const PASSWORD = atob("dGFsYXlvdGUxMjM0NQ=="); 

  // LOGIN UI

  const loginContainer = document.createElement("div");
  loginContainer.className = "login-overlay";

  const loginBox = document.createElement("div");
  loginBox.className = "login-box";

  const title = document.createElement("h2");
  title.textContent = "Acceso";

  const input = document.createElement("input");
  input.type = "password";
  input.placeholder = "Ingresa la contraseña";

  const btn = document.createElement("button");
  btn.textContent = "Entrar";

  const error = document.createElement("p");
  error.className = "login-error";

  loginBox.append(title, input, btn, error);
  loginContainer.appendChild(loginBox);
  document.body.appendChild(loginContainer);

  document.body.style.overflow = "hidden";

  // LOGIN

  btn.addEventListener("click", validar);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") validar();
  });

  function validar() {
    error.textContent = "";

    if (input.value.trim() !== PASSWORD) {
      error.textContent = "Contraseña incorrecta";
      return;
    }

    loginContainer.remove();
    document.body.style.overflow = "auto";

    cargarCSV();
  }

  // CARGA CSV

  function cargarCSV() {

    fetch("equipos_talayote.csv")
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar CSV");
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

        // ÁREAS

        select.innerHTML = `<option value="">Selecciona un área</option>`;

        const areas = [...new Set(
          filas.map(f => f[0]).filter(a => a && a.toLowerCase() !== "area")
        )];

        areas.forEach(area => {
          const option = document.createElement("option");
          option.value = area;
          option.textContent = area;
          select.appendChild(option);
        });

        // FILTRADO

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

            // FUNCIÓN CORREGIDA
            const crearCampo = (label, valor, clase = "") => {
              const p = document.createElement("p");
              if (clase) p.classList.add(clase);

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
            const ram = crearCampo("RAM", (e[5] || "0") + " GB", "ram");
            const so = crearCampo("S.O", e[6]);
            const cpu = crearCampo("CPU", e[7]);
            const dhcp = crearCampo("DHCP", e[8]);
            const ip = crearCampo("IP", e[9], "ip");

            card.append(
              titulo,
              marca,
              modelo,
              nombre,
              ram,
              so,
              cpu,
              dhcp,
              ip
            );

            contenedor.appendChild(card);
          });

        };

      })
      .catch(err => {
        console.error("Error CSV:", err);
      });
  }

});
