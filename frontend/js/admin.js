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
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`http://localhost:3000/api/admin/${endpoint}`, options);
    return response.json();
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();

    async function loadDashboard() {
        const data = await fetchData('dashboard');
        document.querySelector('#dashboard .grid').innerHTML = `
            <div>Total Users: ${data.totalUsers}</div>
            <div>Active Ads: ${data.activeAds}</div>
            <div>Pending Ads: ${data.pendingAds}</div>
            <div>Reports: ${data.reports}</div>
        `;
    }
});

//Ads manager
document.addEventListener("DOMContentLoaded", () => {
    fetchPendingAds();
});

async function fetchPendingAds() {
    try {
        const response = await fetch("/api/service/pending");
        const ads = await response.json();

        const adsContainer = document.getElementById("adsContainer");
        adsContainer.innerHTML = "";

        ads.forEach(ad => {
            const adCard = `
                <div class="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                    <img src="${ad.imageUrls[0]}" alt="${ad.title}" class="w-full h-48 object-cover rounded-t-lg mb-4">
                    <div class="p-4">
                        <h4 class="font-bold text-primary mb-2">${ad.title}</h4>
                        <p class="text-sm text-gray-600 mb-4">${ad.location}</p>
                        <p class="text-sm text-primary font-semibold mb-4">Price: ${ad.price} LKR</p>
                        <div class="flex justify-between">
                            <button onclick="openModal('${ad.id}')" class="text-blue-500 hover:text-blue-700">View Details</button>
                            <button onclick="updateAdStatus('${ad.id}', 'active')" class="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-700">Approve</button>
                            <button onclick="updateAdStatus('${ad.id}', 'rejected')" class="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-700">Reject</button>
                        </div>
                    </div>
                </div>
            `;
            adsContainer.innerHTML += adCard;
        });
    } catch (error) {
        console.error("Error fetching ads:", error);
    }
}

async function updateAdStatus(adId, status) {
    try {
        const response = await fetch(`/api/service/${adId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
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
        const response = await fetch(`/api/service/${adId}`);
        const ad = await response.json();

        document.getElementById("modalTitle").textContent = ad.title;
        document.getElementById("modalDescription").textContent = ad.description;

        const modalDetails = document.getElementById("modalDetails");
        modalDetails.innerHTML = `
            <li><strong>Price:</strong> ${ad.price} LKR</li>
            <li><strong>Location:</strong> ${ad.location}</li>
            <li><strong>Category:</strong> ${ad.Category?.name || "N/A"}</li>
            <li><strong>Contact Email:</strong> ${ad.contactEmail}</li>
            <li><strong>Contact Number:</strong> ${ad.contactNumber}</li>
        `;

        document.getElementById("adDetailsModal").classList.remove("hidden");
    } catch (error) {
        console.error("Error fetching ad details:", error);
    }
}

function closeModal() {
    document.getElementById("adDetailsModal").classList.add("hidden");
}

