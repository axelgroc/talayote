document.addEventListener("DOMContentLoaded", () => {

  const BASE_URL = "https://validacion.infinityfreeapp.com";
  let TOKEN = null;

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

// LOGIN

  btn.addEventListener("click", login);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
  });

  async function login() {
    try {
      const res = await fetch(`${BASE_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: input.value })
      });

      const data = await res.json();

      if (!data.success) {
        error.textContent = "Contraseña incorrecta";
        return;
      }

      TOKEN = data.token;
      loginContainer.remove();
      iniciarSistema();

    } catch (err) {
      error.textContent = "Error de conexión";
      console.error(err);
    }
  }

// SISTEMA

  async function iniciarSistema() {

    const res = await fetch(`${BASE_URL}/datos.php?token=${TOKEN}`);
    const json = await res.json();

    const filas = json.data
      .trim()
      .split("\n")
      .map(f => f.split(";"));

    const select = document.getElementById("areaSelect");
    const contenedor = document.getElementById("contenedorEquipos");

    const areas = [...new Set(filas.map(f => f[0]).filter(a => a !== "area"))];

    select.innerHTML = `<option value="">Selecciona un área</option>`;

    areas.forEach(a => {
      const opt = document.createElement("option");
      opt.value = a;
      opt.textContent = a;
      select.appendChild(opt);
    });

    select.onchange = () => {

      contenedor.innerHTML = "";

      const filtrados = filas.filter(f => f[0] === select.value);

      filtrados.forEach(e => {

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

    };
  }

});