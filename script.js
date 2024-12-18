let nivelMinimo = 30; // Nivel mínimo de agua (configurable)
let nivelMaximo = 80; // Nivel máximo de agua (configurable)
let bombaEncendida = false;

document.addEventListener("DOMContentLoaded", function () {
  let progressBar = document.getElementById("progress-bar");
  let width = 0;
  let interval = setInterval(function () {
    width += 1;
    progressBar.style.width = width + "%";
    progressBar.setAttribute("aria-valuenow", width);
    if (width >= 100) {
      clearInterval(interval);
      setTimeout(function () {
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("content").style.display = "block";
        showSection("inicio");
        actualizarDatos(); // Inicio de actualización de datos periódica
      }, 500);
    }
  }, 20);
});

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach(section => {
    section.style.display = "none";
  });
  document.getElementById(sectionId).style.display = "block";
}

let sensorAguaActivo = true;
let sensorPhActivo = true;

function actualizarDatos() {
  setInterval(async () => {
    try {
      // Obtener datos desde Arduino
      if (!sensorAguaActivo && !sensorPhActivo) return;

      const response = await fetch("http://192.168.129.160/");
      const data = await response.json();

      // Actualizar datos del sensor de agua
      if (sensorAguaActivo) {
        document.getElementById("valor-agua").innerText = `${data.nivelAgua}%`;
        document.getElementById("barra-agua").style.height = `${data.nivelAgua}%`;
      } else {
        document.getElementById("valor-agua").innerText = "-";
        document.getElementById("barra-agua").style.height = "0%";
      }

      // Actualizar datos del sensor de pH
      if (sensorPhActivo) {
        document.getElementById("valor-ph").innerText = data.nivelPH;
        document.getElementById("barra-ph").style.height = `${data.nivelPH}%`;
      } else {
        document.getElementById("valor-ph").innerText = "-";
        document.getElementById("barra-ph").style.height = "0%";
      }

      verificarNivelesAgua(data.nivelAgua);
    } catch (error) {
      console.error("Error al obtener datos del Arduino:", error);
    }
  }, 3000);
}

function verificarNivelesAgua(nivelAgua) {
  if (nivelAgua < nivelMinimo && !bombaEncendida) {
    controlBomba(true);
    showModal("Nivel de agua bajo. Encendiendo bomba automáticamente.");
    bombaEncendida = true;
  } else if (nivelAgua >= nivelMaximo && bombaEncendida) {
    controlBomba(false);
    showModal("Nivel de agua máximo alcanzado. Apagando bomba automáticamente.");
    bombaEncendida = false;
  }
}

function controlBomba(encender) {
  showModal(encender ? "Encendiendo la bomba de agua" : "Apagando la bomba de agua");
  // Aquí se puede agregar una lógica adicional para comunicar el estado al servidor si es necesario
}

function configurarNiveles() {
  nivelMinimo = parseInt(document.getElementById("nivel-minimo").value);
  nivelMaximo = parseInt(document.getElementById("nivel-maximo").value);
  showModal(`Niveles configurados: Mínimo: ${nivelMinimo}%, Máximo: ${nivelMaximo}%`);
}

function showModal(message) {
  const modalMessage = document.getElementById("modal-message");
  modalMessage.textContent = message;
  const myModal = new bootstrap.Modal(document.getElementById("modal-alert"));
  myModal.show();
}
