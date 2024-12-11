import knowledgeBase from './knowledgeBase.js';

document.addEventListener("DOMContentLoaded", function() {
  const loader = document.getElementById("loader");
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggle = document.querySelector(".sidebar-toggle");

  setTimeout(() => {
    loader.style.display = "none";
  }, 3000);

  window.toggleSidebar = function () {
    if (sidebar.style.left === "0px") {
      sidebar.style.left = "-220px";
      sidebarToggle.style.left = "-30px";
    } else {
      sidebar.style.left = "0";
      sidebarToggle.style.left = "200px";
      
      window.scrollTo({
        top: 0,
        behavior: "smooth" 
      });
    }
  };

  window.showSection = function (sectionId) {
    document.querySelectorAll(".section").forEach(section => section.classList.add("hidden"));
    document.getElementById(sectionId).classList.remove("hidden");

    sidebar.style.left = "-220px";
    sidebarToggle.style.left = "-30px";

    // Desplaza automáticamente hacia la parte superior si la sección es "inicio"
    if (sectionId === "inicio") {
      document.getElementById("inicio").scrollIntoView({
        behavior: "smooth",
        block: "start"  // Asegura que la sección de inicio se muestre desde la parte superior
      });
    }
  };

  window.toggleWaterSensor = function() {
    const status = document.getElementById("water-sensor-status");
    status.textContent = status.textContent === "ON" ? "OFF" : "ON";
  };

  window.togglePHSensor = function() {
    const status = document.getElementById("ph-sensor-status");
    status.textContent = status.textContent === "ON" ? "OFF" : "ON";
  };

  window.togglePump = function() {
    alert("Bomba encendida/apagada");
  };

  // Función de simulación de niveles en tiempo real
  function updateSensorData(data) {
    const [distance, ph] = data.split(';').map(item => item.split(':')[1]);
    updateWaterLevel(distance);
    updatePHLevel(ph);
  }

  // Simulación de recepción de datos
  setInterval(() => {
    fetch('https://seniormistvern.github.io/update')
      .then(response => response.text())
      .then(data => {
        updateSensorData(data);
      });
  }, 3000);
});

// Funciones del modal
window.openModal = function() {
  document.getElementById("modal").style.display = "flex";
};

window.closeModal = function() {
  document.getElementById("modal").style.display = "none";
};

window.saveLevels = function() {
  const minLevel = document.getElementById("min-level").value;
  const maxLevel = document.getElementById("max-level").value;

  if (minLevel && maxLevel) {
    alert(`Niveles guardados:\nNivel Mínimo: ${minLevel}%\nNivel Máximo: ${maxLevel}%`);
    closeModal();
  } else {
    alert("Por favor, ingrese ambos niveles.");
  }
};

window.sendChat = function() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  const chatMessages = document.getElementById("chat-messages");

  if (message) {
    // Mostrar el mensaje del usuario
    const userMessage = document.createElement("div");
    userMessage.textContent = `Tú: ${message}`;
    chatMessages.appendChild(userMessage);

    // Buscar respuesta en la base de conocimiento
    const response = knowledgeBase[message] || "Lo siento, no tengo una respuesta para esa pregunta.";

    // Mostrar la respuesta
    setTimeout(() => {
      const aiMessage = document.createElement("div");
      aiMessage.textContent = `IA: ${response}`;
      chatMessages.appendChild(aiMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);

    // Limpiar el campo de entrada
    input.value = "";
  }
};

// Añadir el evento para enviar con Enter
document.getElementById("chat-input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    window.sendChat();
  }
});
