window.onload = function() {
    renderCustomAlert();
  };
  
  function renderCustomAlert() {
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
  <div id="customAlert" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
          <div class="flex justify-center items-center mb-4">
              <div id="alertIcon" class="w-20 h-20"></div>
          </div>
          <p id="alertMessage" class="text-text-secondary mb-4">This is a message.</p>
          <button id="alertOkButton"
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light focus:outline-none">
              OK
          </button>
      </div>
  </div>
  
    `;
    
    document.body.appendChild(alertDiv);
    
  }
  
  
  function showAlert(type, message) {
      const alertBox = document.getElementById("customAlert");
      const alertMessage = document.getElementById("alertMessage");
      const alertIcon = document.getElementById("alertIcon");
    
  
      alertMessage.textContent = message;
    
  
      if (type === "done") {
        alertIcon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
            <circle cx="26" cy="26" r="25" fill="none" stroke="#1e40af" stroke-width="2" />
            <path
              fill="none"
              stroke="#3b82f6"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 26 l8 8 l14 -14"
            >
              <animate attributeName="stroke-dasharray" from="0,50" to="50,0" dur="0.5s" fill="freeze" />
            </path>
          </svg>
        `;
      } else if (type === "error") {
        alertIcon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
            <circle cx="26" cy="26" r="25" fill="none" stroke="#dc2626" stroke-width="2" />
            <line
              x1="16"
              y1="16"
              x2="36"
              y2="36"
              stroke="#ef4444"
              stroke-width="3"
              stroke-linecap="round"
            >
              <animate attributeName="stroke-dasharray" from="0,30" to="30,0" dur="0.5s" fill="freeze" />
            </line>
            <line
              x1="36"
              y1="16"
              x2="16"
              y2="36"
              stroke="#ef4444"
              stroke-width="3"
              stroke-linecap="round"
            >
              <animate attributeName="stroke-dasharray" from="0,30" to="30,0" dur="0.5s" fill="freeze" />
            </line>
          </svg>
        `;
      }
    
  
      alertBox.classList.remove("hidden");
    
  
      const okButton = document.getElementById("alertOkButton");
      okButton.onclick = function () {
        alertBox.classList.add("hidden");
        alertIcon.innerHTML = ""; 
      };
    }