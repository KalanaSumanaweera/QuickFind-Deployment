window.onload = function () {
  renderCustomAlert();
};

function renderCustomAlert() {
  const alertDiv = document.createElement('div');
  alertDiv.innerHTML = `
<div id="customAlert" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
<div class="bg-white rounded-lg shadow-lg p-6 sm:p-6 md:p-8 sm:w-3/4 md:w-1/2 mx-auto text-center">
  <div class="flex justify-center items-center mb-4">
    <div
      id="alertIcon"
      class="flex justify-center items-center w-16 h-16 md:w-20 md:h-20"
    ></div>
  </div>
  <p id="alertMessage" class="text-gray-700 text-sm md:text-base mb-4">
    This is a message.
  </p>
  <button
    id="alertOkButton"
    class="bg-blue-600 text-white text-sm md:text-base px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    OK
  </button>
</div>
</div>



  `;

  document.body.appendChild(alertDiv);

}

function showAlert(type, message) {
  return new Promise((resolve) => {
      const alertBox = document.getElementById("customAlert");
      const alertMessage = document.getElementById("alertMessage");
      const alertIcon = document.getElementById("alertIcon");

      // Set the message and icon
          message = message || 'No message available';
      alertMessage.textContent = message;
      

      if (type === "done") {
          alertIcon.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="#10b981" stroke-width="2" />
                  <path
                      fill="none"
                      stroke="#10b981"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 26 l8 8 l14 -14"
                  >
                      <animate attributeName="stroke-dasharray" from="0,50" to="50,0" dur="0.6s" fill="freeze" />
                  </path>
                  <circle
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                      stroke="#10b981"
                      stroke-width="2"
                      stroke-dasharray="0,150"
                  >
                      <animate attributeName="stroke-dasharray" from="0,150" to="150,0" dur="0.6s" fill="freeze" />
                  </circle>
              </svg>
          `;
      } else if (type === "error") {
          alertIcon.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="#ef4444" stroke-width="2" />
                  <line
                      x1="16"
                      y1="16"
                      x2="36"
                      y2="36"
                      stroke="#ef4444"
                      stroke-width="3"
                      stroke-linecap="round"
                  >
                      <animate attributeName="stroke-dasharray" from="0,30" to="30,0" dur="0.6s" fill="freeze" />
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
                      <animate attributeName="stroke-dasharray" from="0,30" to="30,0" dur="0.6s" fill="freeze" />
                  </line>
              </svg>
          `;
      } else if (type === "warning") {
          alertIcon.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="#fbbf24" stroke-width="2" />
                  <line
                      x1="26"
                      y1="14"
                      x2="26"
                      y2="32"
                      stroke="#fbbf24"
                      stroke-width="3"
                      stroke-linecap="round"
                  >
                      <animate attributeName="stroke-dasharray" from="0,20" to="20,0" dur="0.6s" fill="freeze" />
                  </line>
                  <circle cx="26" cy="38" r="2" fill="#fbbf24">
                      <animate attributeName="r" from="0" to="2" dur="0.6s" fill="freeze" />
                  </circle>
              </svg>
          `;
      }
      

      // Show the alert
      alertBox.classList.remove("hidden");

      // Handle OK button click
      const okButton = document.getElementById("alertOkButton");
      okButton.onclick = function () {
          alertBox.classList.add("hidden");
          alertIcon.innerHTML = ""; // Clear the icon
          resolve(); // Resolve the promise
      };
  });
}