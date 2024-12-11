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

  let sensorDataInterval;

  window.toggleWaterSensor = function() {
    const status = document.getElementById("water-sensor-status");
    if (status.textContent === "ON") {
      status.textContent = "OFF";
      updateWaterLevel(0); // Poner el indicador en 0
      clearInterval(sensorDataInterval); // Detener la actualización de datos
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
      clearInterval(sensorDataInterval); // Detener la actualización de datos
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

    if (distance !== undefined && ph !== undefined) {
      updateWaterLevel(distance);
      updatePHLevel(ph);
    } else {
      console.error("Datos recibidos son undefined:", data);
    }
  }

  function updateWaterLevel(level) {
    const waterFill = document.getElementById("water-fill");
    const levelNumber = parseFloat(level);

    if (!isNaN(levelNumber)) {
      waterFill.style.height = `${levelNumber}%`;
      document.getElementById("water-level-percentage").textContent = `${levelNumber}%`;
      document.getElementById("water-level-volume").textContent = `${Math.round(levelNumber * 11 / 100)} L`;
    } else {
      console.error("Nivel de agua no es un número válido:", level);
    }
  }

  function updatePHLevel(level) {
    const needle = document.getElementById("needle");
    const levelNumber = parseFloat(level);

    if (!isNaN(levelNumber)) {
      document.getElementById("ph-level-value").textContent = `${levelNumber}`;
      const angle = ((levelNumber - 6.5) / 2) * 180;
      needle.style.transform = `rotate(${angle}deg)`;
    } else {
      console.error("Nivel de pH no es un número válido:", level);
    }
  }

  function startSensorDataUpdate() {
  sensorDataInterval = setInterval(() => {
    fetch('https://seniormistvern.github.io/update') // Verifica que esta URL sea correcta
      .then(response => {
        console.log("Estado de la respuesta:", response.status);
        return response.text();
      })
      .then(data => {
        console.log("Datos recibidos:", data); // Verifica los datos recibidos en la consola
        if (data && data.includes("DIST:") && data.includes("PH:")) {
          updateSensorData(data);
        } else {
          console.error("Datos recibidos son incorrectos:", data);
        }
      })
      .catch(error => console.error("Error al obtener datos:", error));
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
