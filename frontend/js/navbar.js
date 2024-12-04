document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = !!localStorage.getItem("token"); // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user") || "{}"); // Get user data

    const navbarHTML = `
    <!-- Header Section -->
    <header class="bg-primary text-white p-2 animate-fadeIn">
      <div class="container mx-auto flex justify-between items-center flex-wrap sm:flex-nowrap">
        <!-- Logo Section -->
        <div class="flex items-center space-x-2">
          <!-- Logo -->
          <img src="../icons/quickfind logo .png" class="h-12 sm:h-16 lg:ms-3" alt="logo">
        </div>
  
        <!-- Hamburger Icon for Small Devices -->
        <button id="menu-toggle" class="block lg:hidden text-white text-2xl focus:outline-none">
          <i class="fa-solid fa-bars"></i>
        </button>
  
        <!-- Navigation Section for Large Devices -->
        <nav class="hidden lg:flex items-center space-x-4">
                  <!-- Post Your Ad Button -->
          <a href="#"
            class="text-xs bg-green-500 text-white py-1 px-2 rounded hover:bg-green-700 transition duration-300 lg:text-base lg:py-2 lg:px-4">
            Post Your Ad
          </a>
          <!-- Language Buttons -->
          <div class="flex space-x-2">
            <a href="#"
              class="text-xs py-1 px-2 bg-white text-primary rounded hover:bg-gray-200 transition duration-300 lg:text-base lg:py-2 lg:px-4">
              සිංහල
            </a>
            <a href="#"
              class="text-xs py-1 px-2 bg-white text-primary rounded hover:bg-gray-200 transition duration-300 lg:text-base lg:py-2 lg:px-4">
              தமிழ்
            </a>
          </div>

          ${isLoggedIn ? `
          <!-- Profile Section -->
          <div class="relative">
            <button id="profile-button" class="flex items-center space-x-2 text-xs hover:text-primary-light transition duration-300 lg:text-base">
              <img id="profile-picture" src="${user.profilePicture || 'default-profile.png'}" alt="Profile Picture" class="w-6 h-6 rounded-full border lg:w-7 lg:h-7">
              <i class="fa-solid fa-chevron-down text-xs"></i>
            </button>
            <!-- Dropdown Menu -->
            <ul id="profile-dropdown" class="hidden absolute right-0 mt-2 bg-white shadow-lg rounded w-40">
              <li>
                <a href="userProfile.html"
                  class="block text-xs py-2 px-4 bg-white text-primary rounded hover:bg-gray-100 transition duration-300">
                  Profile
                </a>
              </li>
              ${user.role === 'service_provider' ? `
              <li>
                <a href="providerDashboard.html"
                  class="block text-xs py-2 px-4 bg-white text-primary rounded hover:bg-gray-100 transition duration-300">
                  Provider Dashboard
                </a>
              </li>` : ''}
              <li>
                <button id="logout-button-lg" class="block w-full text-left text-xs py-2 px-4 bg-white text-red-500 rounded hover:bg-gray-100 transition duration-300">
                  Logout
                </button>
              </li>
            </ul>
          </div>
          ` : `
          <!-- Log In Button -->
          <a href="/loginpage" class="text-xs bg-primary-light text-white py-1 px-2 rounded hover:bg-blue-300 transition duration-300 lg:text-base lg:py-2 lg:px-4">
            Log In
          </a>
          `}
        </nav>
      </div>
    </header>
  
    <!-- Off-Canvas Dropdown Menu -->
    <nav id="navbar" class="fixed top-0 left-0 w-64 h-full bg-primary-light transform -translate-x-full transition-transform duration-300 z-50 shadow-lg">
      <ul class="flex flex-col space-y-2 mt-4 p-4">
        ${isLoggedIn ? `
        <!-- Profile Image -->
        <li class="flex items-center space-x-2 py-2 px-4 bg-white text-primary rounded">
          <img src="${user.profilePicture || 'default-profile.png'}" alt="Profile Picture" class="w-8 h-8 rounded-full border">
          <span class="text-xs">${user.name || "User"}</span>
        </li>
        ` : ''}
        <!-- Language Buttons -->
        <li>
          <a href="#"
            class="block text-xs py-2 px-4 bg-white text-primary rounded hover:bg-gray-100 transition duration-300">
            සිංහල
          </a>
        </li>
        <li>
          <a href="#"
            class="block text-xs py-2 px-4 bg-white text-primary rounded hover:bg-gray-100 transition duration-300">
            தமிழ்
          </a>
        </li>
        <!-- Post Your Ad Button -->
        <li>
          <a href="#"
            class="block text-xs py-2 px-4 bg-primary-light text-white rounded hover:bg-blue-300 transition duration-300">
            Post Your Ad
          </a>
        </li>
        ${isLoggedIn ? `
        <!-- Profile Button -->
        <li>
          <a href="userProfile.html"
            class="block text-xs py-2 px-4 bg-white text-primary rounded hover:bg-gray-100 transition duration-300">
            Profile
          </a>
        </li>
        ${user.role === 'service_provider' ? `
        <!-- Provider Dashboard Button -->
        <li>
          <a href="providerDashboard.html"
            class="block text-xs py-2 px-4 bg-white text-primary rounded hover:bg-gray-100 transition duration-300">
            Provider Dashboard
          </a>
        </li>` : ''}
        <!-- Logout Button -->
        <li>
          <button id="logout-button-offcanvas" class="block w-full text-left text-xs py-2 px-4 bg-red-500 text-white rounded hover:bg-red-400 transition duration-300">
            Logout
          </button>
        </li>
        ` : `
        <!-- Log In Button -->
        <li>
          <a href="/loginpage"
            class="block text-xs py-2 px-4 bg-primary-light text-white rounded hover:bg-blue-300 transition duration-300">
            Log In
          </a>
        </li>
        `}
      </ul>
    </nav>
    `;

    // Inject the HTML into the body
    document.body.insertAdjacentHTML("afterbegin", navbarHTML);

    // Add functionality for the off-canvas menu
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    // Toggle the navbar and overlay
    menuToggle.addEventListener("click", () => {
        navbar.classList.toggle("active");
        overlay.classList.toggle("active");
    });

    // Close navbar when clicking on the overlay
    overlay.addEventListener("click", () => {
        navbar.classList.remove("active");
        overlay.classList.remove("active");
    });

    // Profile dropdown functionality for large screens
    const profileButton = document.getElementById("profile-button");
    const profileDropdown = document.getElementById("profile-dropdown");

    profileButton?.addEventListener("click", () => {
        profileDropdown.classList.toggle("hidden");
    });

    // Logout functionality
    const logoutHandler = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    };

    const logoutButtonLg = document.getElementById("logout-button-lg");
    const logoutButtonOffcanvas = document.getElementById("logout-button-offcanvas");

    logoutButtonLg?.addEventListener("click", logoutHandler);
    logoutButtonOffcanvas?.addEventListener("click", logoutHandler);

    // Close dropdown if clicking outside
    document.addEventListener("click", (event) => {
        if (!profileButton.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.classList.add("hidden");
        }
    });
});
