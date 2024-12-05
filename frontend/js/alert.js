window.onload = function () {
    renderCustomAlert();
};

function renderCustomAlert() {
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
  <div id="customAlert" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 sm:p-6 md:p-8 sm:w-3/4 md:w-1/2 lg:w-1/4 mx-auto text-center">
      <div class="flex justify-center items-center mb-4">
        <div
          id="alertIcon"
          class="flex justify-center items-center w-16 h-16 md:w-20 md:h-20"
        ></div>
      </div>
      <p id="alertMessage" class="text-gray-700 text-sm md:text-base mb-4">
        This is a message.
      </p>
      <div id="alertButtons" class="flex justify-center space-x-4">
        <!-- Buttons will be added dynamically -->
      </div>
    </div>
  </div>
    `;
    document.body.appendChild(alertDiv);
}

function showAlert(type, message, buttons = ['ok']) {
    return new Promise((resolve, reject) => {
        const alertBox = document.getElementById("customAlert");
        const alertMessage = document.getElementById("alertMessage");
        const alertIcon = document.getElementById("alertIcon");
        const alertButtonsContainer = document.getElementById("alertButtons");

        // Set the message
        alertMessage.textContent = message || 'No message available';

        // Set the icon based on type
        alertIcon.innerHTML = ''; // Clear the previous icon
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
        }else if (type === "question") {
            alertIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" width="80" height="80">
                    <circle
                        cx="26"
                        cy="26"
                        r="25"
                        fill="none"
                        stroke="#3b82f6"
                        stroke-width="2"
                    >
                        <animate
                            attributeName="stroke-dasharray"
                            from="0,150"
                            to="150,0"
                            dur="0.6s"
                            fill="freeze"
                        />
                    </circle>
                    <path
                        d="M20 22 c0-4 3-6 6-6 s6 2 6 6 c0 3-2 4-3 5 -2 1-2 2-2 3 v2"
                        fill="none"
                        stroke="#3b82f6"
                        stroke-width="3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <animate
                            attributeName="stroke-dasharray"
                            from="0,50"
                            to="50,0"
                            dur="0.6s"
                            fill="freeze"
                        />
                    </path>
                    <circle
                        cx="26"
                        cy="38"
                        r="1.5"
                        fill="#3b82f6"
                    >
                        <animate
                            attributeName="r"
                            from="0"
                            to="1.5"
                            dur="0.6s"
                            fill="freeze"
                        />
                    </circle>
                </svg>
            `;
        }
        

        // Clear existing buttons
        alertButtonsContainer.innerHTML = '';

        // Dynamically add buttons based on the buttons array
        buttons.forEach((button) => {
            const btn = document.createElement('button');
            btn.classList.add(
                'text-sm',
                'md:text-base',
                'px-4',
                'py-2',
                'rounded-lg',
                'focus:outline-none',
                'focus:ring-2'
            );

            if (button === 'ok') {
                btn.textContent = 'OK';
                btn.classList.add(
                    'bg-blue-600',
                    'text-white',
                    'hover:bg-blue-700',
                    'focus:ring-blue-400'
                );
                btn.onclick = () => {
                    alertBox.classList.add("hidden");
                    alertIcon.innerHTML = ""; // Clear the icon
                    resolve('ok');
                };
            } else if (button === 'cancel') {
                btn.textContent = 'Cancel';
                btn.classList.add(
                    'bg-red-600',
                    'text-white',
                    'hover:bg-red-700',
                    'focus:ring-red-400'
                );
                btn.onclick = () => {
                    alertBox.classList.add("hidden");
                    alertIcon.innerHTML = ""; // Clear the icon
                    reject('cancel');
                };
            } else if (button === 'delete') {
                btn.textContent = 'Delete';
                btn.classList.add(
                    'bg-yellow-600',
                    'text-white',
                    'hover:bg-yellow-700',
                    'focus:ring-yellow-400'
                );
                btn.onclick = () => {
                    alertBox.classList.add("hidden");
                    alertIcon.innerHTML = ""; // Clear the icon
                    resolve('delete');
                };
            }
            alertButtonsContainer.appendChild(btn);
        });

        // Show the alert
        alertBox.classList.remove("hidden");
    });
}