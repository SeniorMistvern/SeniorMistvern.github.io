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

    if (sectionId === "inicio") {
      document.getElementById("inicio").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  window.toggleWaterSensor = function() {
    const status = document.getElementById("water-sensor-status");
    if (status.textContent === "ON") {
      status.textContent = "OFF";
      updateWaterLevel(0); // Poner el indicador en 0
    } else {
      status.textContent = "ON";
      startSensorDataUpdate(); // Iniciar la detección de datos
    }
  };

  window.togglePHSensor = function() {
    const status = document.getElementById("ph-sensor-status");
    if (status.textContent === "ON") {
      status.textContent = "OFF";
      updatePHLevel(0); // Poner el indicador en 0
    } else {
      status.textContent = "ON";
      startSensorDataUpdate(); // Iniciar la detección de datos
    }
  };

  window.togglePump = function() {
    alert("Bomba encendida/apagada");
  };

  function updateSensorData(data) {
    const [distance, ph] = data.split(';').map(item => item.split(':')[1]);
    updateWaterLevel(distance);
    updatePHLevel(ph);
  }

  function updateWaterLevel(level) {
    const waterFill = document.getElementById("water-fill");
    waterFill.style.height = `${level}%`;
    document.getElementById("water-level-percentage").textContent = `${level}%`;
    document.getElementById("water-level-volume").textContent = `${Math.round(level * 11)} L`;
  }

  function updatePHLevel(level) {
    const needle = document.getElementById("needle");
    document.getElementById("ph-level-value").textContent = `${level}`;
    const angle = ((level - 6.5) / 2) * 180;
    needle.style.transform = `rotate(${angle}deg)`;
  }

  function startSensorDataUpdate() {
    setInterval(() => {
      fetch('https://seniormistvern.github.io/update')
        .then(response => response.text())
        .then(data => {
          updateSensorData(data);
        });
    }, 3000);
  }

  // Iniciar la simulación con datos reales
  startSensorDataUpdate();
});

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
    const userMessage = document.createElement("div");
    userMessage.textContent = `Tú: ${message}`;
    chatMessages.appendChild(userMessage);

    const response = knowledgeBase[message] || "Lo siento, no tengo una respuesta para esa pregunta.";

    setTimeout(() => {
      const aiMessage = document.createElement("div");
      aiMessage.textContent = `IA: ${response}`;
      chatMessages.appendChild(aiMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);

    input.value = "";
  }
};

document.getElementById("chat-input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    window.sendChat();
  }
});
