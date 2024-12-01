// dashboard.js

// Authentication Check
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/loginpage';
        return;
    }

    // Fetch Provider Info            showAddServiceModal
    loadProviderData();

    // Load default section
    showSection('overview');

    // Navigation click handler
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
        });
    });
});

// public/js/addService.js (or wherever your JS is for the form)
document.addEventListener('DOMContentLoaded', async () => {
    const categorySelect = document.getElementById('serviceCategory');

    try {
        // Fetch categories from the API
        const response = await fetch('http://localhost:3000/api/categories');
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        const categories = await response.json();

        // Populate the select element with options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
});


//Show the Add Service model
document.addEventListener('DOMContentLoaded', () => {
    const addServiceButton = document.getElementById('addServiceButton');
    addServiceButton.addEventListener('click', showAddServiceModal);
});

//Close the Add Service model
document.addEventListener('DOMContentLoaded', () => {
    const closebtn = document.getElementById('closebtn');
    closebtn.addEventListener('click', hideAddServiceModal);
});
//Cancel the Add Service model
document.addEventListener('DOMContentLoaded', () => {
    const cancel = document.getElementById('cancel');
    cancel.addEventListener('click', hideAddServiceModal);
});

// Function to show a specific section
function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');

    const sectionTitle = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    document.getElementById('sectionTitle').innerText = sectionTitle;
}

// Function to fetch provider data
function loadProviderData() {
    // Simulating a fetch from an API
    const provider = {
        name: "John Doe",
        role: "Service Provider",
        stats: {
            activeServices: 5,
            pendingBookings: 3,
            totalReviews: 12
        },
        recentActivity: [
            { action: "Service 'Plumbing Fix' booked", timestamp: "2 hours ago" },
            { action: "Review received: 'Great work!'", timestamp: "1 day ago" },
        ]
    };

    // Update provider info
    document.getElementById('providerName').innerText = provider.name;
    document.getElementById('providerRole').innerText = provider.role;

    // Update dashboard stats
    document.getElementById('activeServicesCount').innerText = provider.stats.activeServices;
    document.getElementById('totalReviewsCount').innerText = provider.stats.totalReviews;

    // Update recent activity
    const recentActivity = document.getElementById('recentActivity');
    recentActivity.innerHTML = '';
    provider.recentActivity.forEach(activity => {
        const div = document.createElement('div');
        div.classList.add('p-4', 'bg-gray-50', 'rounded', 'flex', 'justify-between');
        div.innerHTML = `<span>${activity.action}</span><span class="text-sm text-gray-400">${activity.timestamp}</span>`;
        recentActivity.appendChild(div);
    });
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Add Service Modal Functions
function showAddServiceModal() {
    document.getElementById('addServiceModal').classList.remove('hidden');
}

function hideAddServiceModal() {
    document.getElementById('addServiceModal').classList.add('hidden');
}

// Add New Service Handler
document.getElementById('addServiceForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData();

    // Helper function to display validation error
    const showValidationError = (message) => {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: message,
        });
    };

    // Collect available days
    const availableDays = Array.from(
        document.querySelectorAll('input[name="availableDays"]:checked')
    ).map((checkbox) => checkbox.value);
    if (availableDays.length === 0) {
        return showValidationError('Please select at least one available day.');
    }
    formData.append('availableDays', JSON.stringify(availableDays));

    // Collect service images
    const serviceImages = document.getElementById('serviceImages').files;
    if (serviceImages.length === 0) {
        return showValidationError('Please upload at least one service image.');
    }
    Array.from(serviceImages).forEach((file) => {
        formData.append('serviceImages', file);
    });

    // Collect and validate other form data
    const title = document.getElementById('serviceTitle').value.trim();
    if (!title) return showValidationError('Service title is required.');
    formData.append('title', title);

    const description = document.getElementById('serviceDescription').value.trim();
    if (!description) return showValidationError('Service description is required.');
    formData.append('description', description);

    const categoryId = document.getElementById('serviceCategory').value;
    if (!categoryId) return showValidationError('Please select a service category.');
    formData.append('categoryId', categoryId);

    const serviceArea = document.getElementById('serviceArea').value.trim();
    if (!serviceArea) return showValidationError('Service area is required.');
    formData.append('serviceArea', serviceArea);

    const location = document.getElementById('serviceLocation').value.trim();
    if (!location) return showValidationError('Service location is required.');
    formData.append('location', location);

    const price = parseFloat(document.getElementById('servicePrice').value);
    if (isNaN(price) || price <= 0) return showValidationError('Please enter a valid price.');
    formData.append('price', price);

    const priceType = document.getElementById('servicePriceType').value;
    if (!priceType) return showValidationError('Please select a price type.');
    formData.append('priceType', priceType);

    const contactEmail = document.getElementById('contactEmail').value.trim();
    if (!/\S+@\S+\.\S+/.test(contactEmail)) {
        return showValidationError('Please enter a valid email address.');
    }
    formData.append('contactEmail', contactEmail);

    const contactNumber = document.getElementById('contactNumber').value.trim();
    if (!/^\d{10,15}$/.test(contactNumber)) {
        return showValidationError('Please enter a valid contact number.');
    }
    formData.append('contactNumber', contactNumber);

    const workingHoursStart = document.getElementById('workingHoursStart').value;
    const workingHoursEnd = document.getElementById('workingHoursEnd').value;
    if (!workingHoursStart || !workingHoursEnd) {
        return showValidationError('Working hours start and end time are required.');
    }
    if (workingHoursStart >= workingHoursEnd) {
        return showValidationError('Working hours start time must be before end time.');
    }
    formData.append('workingHoursStart', workingHoursStart);
    formData.append('workingHoursEnd', workingHoursEnd);

    var userData = localStorage.getItem('user');
    var userDeatails = JSON.parse(userData);
    const userId = userDeatails.id; // user id
    formData.append('providerId', userId);

    try {
        const response = await fetch('http://localhost:3000/api/service/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Service Added',
                text: result.message,
            });

            // Hide the modal and reset the form
            hideAddServiceModal();
            e.target.reset();

            // Add a delay before reloading the page
            setTimeout(() => {
                console.log('Reloading after delay...');
                window.location.reload(); // Reload the page after 2 seconds
            }, 2000);
        } else {
            const error = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to add service',
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to communicate with the server',
        });
        console.error('Error:', error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const userData = localStorage.getItem('user');
    const userDetails = JSON.parse(userData);
    const userId = userDetails.id;

    async function loadServices() {
        const response = await fetch(`http://localhost:3000/api/service/provider/${userId}`);
        const services = await response.json();

        const servicesList = document.getElementById('servicesList');
        servicesList.innerHTML = ''; // Clear the list

        services.forEach((service) => {
            // Check if there are images and display the first one or a placeholder
            const firstImage = service.image && service.image.length > 0 ? service.image[0] : 'https://via.placeholder.com/300x150';
        
            const card = `
                <div class="bg-white shadow-md rounded-lg overflow-hidden">
                    <img src="${firstImage}" alt="Service Image" class="w-full h-40 object-cover" />
                    <div class="p-4">
                        <h4 class="text-lg font-bold mb-2">${service.title}</h4>
                        <p class="text-gray-500 text-sm mb-4">${service.description}</p>
                        <div class="flex justify-between items-center">
                            <span class="text-primary font-bold">LKR ${service.price}/${service.priceType}</span>
                            <span class="text-sm text-gray-500">Status: <span class="${service.status === 'active' ? 'text-green-500' : 'text-red-500'}">${service.status}</span></span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center p-4 border-t">
                        <button class="text-blue-500 hover:text-blue-700 text-sm font-bold edit-service-button" data-id="${service.id}">
                            Edit
                        </button>
                        <button class="text-red-500 hover:text-red-700 text-sm font-bold delete-service-button" data-id="${service.id}">
                            Delete
                        </button>
                    </div>
                </div>
            `;
            servicesList.innerHTML += card;
        });
        
    }

    loadServices();

    // Delegated event listener for the edit button
    document.getElementById('servicesList').addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-service-button')) {
            const serviceId = event.target.getAttribute('data-id');
            openEditServiceModal(serviceId);
        }
    });

    // Delegated event listener for the delete button
    document.getElementById('servicesList').addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-service-button')) {
            const serviceId = event.target.getAttribute('data-id');
            deleteService(serviceId);
        }
    });
});



function openEditServiceModal(serviceId) {
    fetch(`http://localhost:3000/api/service/${serviceId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch service with ID: ${serviceId}`);
            }
            return response.json();
        })
        .then((service) => {
            // Populate form fields
            document.getElementById('editServiceId').value = service.id || '';
            document.getElementById('editServiceTitle').value = service.title || '';
            document.getElementById('editServiceDescription').value = service.description || '';
            document.getElementById('editServicePrice').value = service.price || '';
            document.getElementById('editServicePriceType').value = service.priceType || '';
            document.getElementById('editServiceContactEmail').value = service.contactEmail || '';
            document.getElementById('editServiceContactNumber').value = service.contactNumber || '';
            document.getElementById('editServiceArea').value = service.serviceArea || '';

            // Display uploaded images
            const uploadedImagesContainer = document.getElementById('uploadedImages');
            uploadedImagesContainer.innerHTML = '';

            if (service.image && Array.isArray(service.image) && service.image.length > 0) {
                service.image.forEach((imageUrl, index) => {
                    const imgElement = document.createElement('div');
                    imgElement.classList.add('relative', 'w-24', 'h-24', 'border', 'rounded', 'overflow-hidden', 'm-2');
            
                    imgElement.innerHTML = `
                        <img src="${imageUrl}" alt="Uploaded Image" class="w-full h-full object-cover">
                        <button class="remove-image-btn absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            ×
                        </button>
                    `;
            
                    // Attach event listener to the remove button
                    const removeButton = imgElement.querySelector('.remove-image-btn');
                    removeButton.addEventListener('click', () => removeImage(index));
            
                    uploadedImagesContainer.appendChild(imgElement);
                });
            } else {
                uploadedImagesContainer.innerHTML = `<p class="text-gray-500">No images available for this service.</p>`;
            }

            // Show the modal
            document.getElementById('editServiceModal').classList.remove('hidden');
        })
        .catch((error) => console.error('Error loading service:', error));
}



function closeEditServiceModal() {
    document.getElementById('editServiceModal').classList.add('hidden');
}

document.getElementById('cancelEditService').addEventListener('click', closeEditServiceModal);


document.getElementById('editServiceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const serviceId = document.getElementById('editServiceId').value;
    const files = document.getElementById('editServiceImages').files;
    const totalImages = files.length + document.getElementById('uploadedImages').children.length - removedImages.length;

    // Validate image count
    if (totalImages > 5) {
        Swal.fire('Error', 'You can only have up to 5 images.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('title', document.getElementById('editServiceTitle').value);
    formData.append('description', document.getElementById('editServiceDescription').value);
    formData.append('price', document.getElementById('editServicePrice').value);
    formData.append('priceType', document.getElementById('editServicePriceType').value);
    formData.append('contactEmail', document.getElementById('editServiceContactEmail').value);
    formData.append('contactNumber', document.getElementById('editServiceContactNumber').value);
    formData.append('serviceArea', document.getElementById('editServiceArea').value);
    formData.append('removedImages', JSON.stringify(removedImages));

    // Append new files
    Array.from(files).forEach((file) => {
        formData.append('images', file);
    });

    try {
        const response = await fetch(`http://localhost:3000/api/service/${serviceId}`, {
            method: 'PUT',
            body: formData,
        });

        if (response.ok) {
            Swal.fire('Success', 'Service updated successfully', 'success');
            closeEditServiceModal();
            location.reload();
        } else {
            const error = await response.json();
            Swal.fire('Error', error.message || 'Failed to update service', 'error');
        }
    } catch (error) {
        console.error('Error updating service:', error);
    }
});


function deleteService(serviceId) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won’t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
        if (result.isConfirmed) {
            const response = await fetch(`http://localhost:3000/api/service/${serviceId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                Swal.fire('Deleted!', 'Service has been deleted.', 'success');
                location.reload();
            } else {
                Swal.fire('Error', 'Failed to delete service', 'error');
            }
        }
    });
}

const removedImages = []; // Track removed images

function removeImage(index) {
    const uploadedImagesContainer = document.getElementById('uploadedImages');
    const imageDiv = uploadedImagesContainer.children[index];

    if (imageDiv) {
        uploadedImagesContainer.removeChild(imageDiv);
        removedImages.push(index); // Keep track of removed indexes
    }

    // Update the form hidden input with removed image indexes
    document.getElementById('removedImages').value = JSON.stringify(removedImages);
}



