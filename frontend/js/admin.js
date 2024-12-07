(async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        alert("Please log in to access this page.");
        window.location.href = "/admin/login";
        return;
    }

    try {
        const response = await fetch("/admin/dashboard", {
            headers: {
                "Authorization": `Bearer ${token}`, // Send token
            },
        });

        if (!response.ok) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/login";
        }
    } catch (error) {
        console.error("Error loading dashboard:", error);
        alert("An error occurred. Please try again later.");
    }
})();

const token = localStorage.getItem('adminToken'); // Retrieve token from localStorage

 // Sidebar Toggle Script
 document.getElementById('toggleSidebarButton').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
});

// Tab Switching Script
const links = document.querySelectorAll('[data-section]');
const sections = document.querySelectorAll('.admin-section');
const sectionTitle = document.getElementById('sectionTitle');

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');

        sections.forEach(section => {
            section.classList.remove('active');
        });

        document.getElementById(sectionId).classList.add('active');
        sectionTitle.textContent = link.textContent.trim();
    });
});

function logout() {
    alert('Logging out...');
    // Add logout functionality
}

async function fetchData(endpoint, method = 'GET', body = null) {

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }), // Add Authorization header if token exists
        },
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(`http://localhost:3000/api/admin/${endpoint}`, options);

        // Handle non-2xx responses
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'An error occurred');
        }

        return response.json();
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error.message);
        throw error; // Rethrow error for caller to handle
    }
}


document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();

    async function loadDashboard() {
        const data = await fetchData('dashboard');
    
        if (!data) {
            document.querySelector('#dashboard .grid').innerHTML = `
                <div class="bg-red-100 p-4 rounded-lg shadow-md">
                    <p class="text-red-600">Failed to load dashboard data.</p>
                </div>
            `;
            return;
        }
    
        document.querySelector('#dashboard .grid').innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-gray-500">Total Users</h3>
                <p class="text-3xl font-bold">${data.totalUsers}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-gray-500">Active Ads</h3>
                <p class="text-3xl font-bold">${data.activeAds}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-gray-500">Pending Ads</h3>
                <p class="text-3xl font-bold">${data.pendingAds}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-gray-500">Reports</h3>
                <p class="text-3xl font-bold">${data.reports}</p>
            </div>
        `;
    }
});

//Ads manager
document.addEventListener("DOMContentLoaded", () => {
    fetchPendingAds();
});
async function fetchPendingAds() {
    try {
        const response = await fetch("/api/adminService/pending", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` }), // Include token if it exists
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch pending ads");
        }
        const ads = await response.json();

        const adsContainer = document.getElementById("adsContainer");
        adsContainer.innerHTML = ""; // Clear the container

        ads.forEach(ad => {
            // Create card container
            const card = document.createElement("div");
            card.className = "bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105";

            // Create and append image
            const img = document.createElement("img");
            img.src = `../../${ad.imageUrls[0]}`;
            img.alt = ad.title;
            img.className = "w-full h-48 object-cover rounded-t-lg mb-4";
            card.appendChild(img);

            // Create content container
            const content = document.createElement("div");
            content.className = "p-4";

            // Add title
            const title = document.createElement("h4");
            title.className = "font-bold text-primary mb-2";
            title.textContent = ad.title;
            content.appendChild(title);

            // Add location
            const location = document.createElement("p");
            location.className = "text-sm text-gray-600 mb-4";
            location.textContent = ad.location;
            content.appendChild(location);

            // Add price
            const price = document.createElement("p");
            price.className = "text-sm text-primary font-semibold mb-4";
            price.textContent = `Price: ${ad.price} LKR`;
            content.appendChild(price);

            // Add buttons container
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "flex justify-between";

            // View Details button
            const viewDetailsButton = document.createElement("button");
            viewDetailsButton.className = "text-blue-500 hover:text-blue-700";
            viewDetailsButton.textContent = "View Details";
            viewDetailsButton.addEventListener("click", () => openModal(ad.id));
            buttonContainer.appendChild(viewDetailsButton);

            // Approve button
            const approveButton = document.createElement("button");
            approveButton.className = "bg-green-500 text-white py-1 px-4 rounded hover:bg-green-700";
            approveButton.textContent = "Approve";
            approveButton.addEventListener("click", () => updateAdStatus(ad.id, "active"));
            buttonContainer.appendChild(approveButton);

            // Reject button
            const rejectButton = document.createElement("button");
            rejectButton.className = "bg-red-500 text-white py-1 px-4 rounded hover:bg-red-700";
            rejectButton.textContent = "Reject";
            rejectButton.addEventListener("click", () => updateAdStatus(ad.id, "rejected"));
            buttonContainer.appendChild(rejectButton);

            // Append buttons to content
            content.appendChild(buttonContainer);

            // Append content to card
            card.appendChild(content);

            // Append card to container
            adsContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching ads:", error);

        const adsContainer = document.getElementById("adsContainer");
        adsContainer.innerHTML = `
            <div class="bg-red-100 p-4 rounded">
                <p class="text-red-500 font-semibold">Failed to load pending ads. Please try again later.</p>
            </div>
        `;
    }
}


async function updateAdStatus(adId, status) {
    try {
        const response = await fetch(`/api/service/${adId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` }), // Include Authorization header if token exists
            },
            body: JSON.stringify({ status }), // Send status in the request body
        });

        if (response.ok) {
            alert(`Ad ${status === "active" ? "approved" : "rejected"} successfully!`);
            fetchPendingAds();
        } else {
            alert("Failed to update ad status.");
        }
    } catch (error) {
        console.error("Error updating ad status:", error);
    }
}

async function openModal(adId) {
    try {
        // Fetch ad details by ID
        const response = await fetch(`/api/service/${adId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(localStorage.getItem("adminToken") && { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }),
            },
        });
        
        const ad = await response.json();

        // Set modal title and description
        document.getElementById("modalTitle").textContent = ad.title;
        document.getElementById("modalDescription").textContent = ad.description;

        // Set modal details
        const modalDetails = document.getElementById("modalDetails");
        modalDetails.innerHTML = `
            <li><strong>Price:</strong> ${ad.price} LKR</li>
            <li><strong>Location:</strong> ${ad.location}</li>
            <li><strong>Category:</strong> ${ad.category || "N/A"}</li>
            <li><strong>Contact Email:</strong> ${ad.contactEmail}</li>
            <li><strong>Contact Number:</strong> ${ad.contactNumber}</li>
        `;

        // Display images in a carousel or grid
        const modalImages = document.getElementById("modalImages");
        modalImages.innerHTML = ''; // Clear any existing images

        if (ad.image && ad.image.length > 0) {
            ad.image.forEach((imageUrl, index) => {
                const imgElement = document.createElement("img");
                imgElement.src = `../../${imageUrl}`; // Adjust path if necessary
                imgElement.alt = `Image ${index + 1}`;
                imgElement.className = "w-full h-48 object-cover rounded mb-2";
                modalImages.appendChild(imgElement);
            });
        } else {
            modalImages.innerHTML = '<p class="text-gray-500">No images available</p>';
        }

        // Show the modal
        document.getElementById("adDetailsModal").classList.remove("hidden");
    } catch (error) {
        console.error("Error fetching ad details:", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const closeButton = document.getElementById("closeModalButton");
    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }
});

function closeModal() {
    document.getElementById("adDetailsModal").classList.add("hidden");
}

async function loadCategories() {
    try {
        const response = await fetch('/api/admin/categories', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(localStorage.getItem("adminToken") && { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }),
            },
        });
        
        const categories = await response.json();

        const categoriesContainer = document.getElementById('categoriesContainer');
        categoriesContainer.innerHTML = '';

        categories.forEach(category => {
            const categoryCard = `
                <div class="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                    <img src="/icons/${category.name.toLowerCase()}.png" alt="${category.name}" class="w-16 h-16 mr-4">
                    <div>
                        <h4 class="font-bold text-gray-800">${category.name}</h4>
                        <p class="text-sm text-gray-600">${category.description || 'No description available'}</p>
                    </div>
                </div>
            `;
            categoriesContainer.innerHTML += categoryCard;
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const openModalButton = document.getElementById('openAddCategoryModalButton'); // Button to open modal
    const closeModalButton = document.getElementById('closeAddCategoryModalButton'); // Button to close modal
    const overlay = document.getElementById('modalOverlay'); // Optional: overlay click to close

    if (openModalButton) {
        openModalButton.addEventListener('click', openAddCategoryModal);
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeAddCategoryModal);
    }

    // Close modal when clicking on overlay
    if (overlay) {
        overlay.addEventListener('click', closeAddCategoryModal);
    }
});


async function addCategory(event) {
    event.preventDefault();

    const formData = new FormData();
    const name = document.getElementById('categoryName').value.trim();
    const description = document.getElementById('categoryDescription').value.trim();
    const icon = document.getElementById('categoryIcon').files[0];

    if (!name || !icon) return alert('Category name and icon are required.');

    formData.append('name', name);
    formData.append('description', description);
    formData.append('icon', icon);

    try {
        const response = await fetch('/api/admin/categories', {
            method: 'POST',
            body: formData,
            headers: {
                ...(localStorage.getItem("adminToken") && { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }),
            },
        });
        

        if (response.ok) {
            closeAddCategoryModal();
            loadCategories();
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to add category.');
        }
    } catch (error) {
        console.error('Error adding category:', error);
    }
}

// Event Listener
document.getElementById('addCategoryForm').addEventListener('submit', addCategory);

// Load categories on page load
window.addEventListener('DOMContentLoaded', loadCategories);

function openAddCategoryModal() {
    document.getElementById('addCategoryModal').classList.remove('hidden');
}

function closeAddCategoryModal() {
    document.getElementById('addCategoryModal').classList.add('hidden');
}

document.getElementById("logoutButton").addEventListener("click", () => {
    // Remove token and any sensitive information from localStorage
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("rememberMe");

    // Redirect to the login page
    window.location.href = "/admin/login";
});
