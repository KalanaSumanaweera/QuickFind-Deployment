document.addEventListener('DOMContentLoaded', () => {
    let isPhoneVerified = false; // Track phone verification status
    let pendingFormData = null; // Store form data temporarily if needed

    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    const updateSlideVisibility = () => {
        slides.forEach((slide, index) => {
            slide.classList.toggle('hidden', index !== currentSlide);
        });

        // Show or hide buttons based on the current slide
        prevBtn.classList.toggle('hidden', currentSlide === 0);
        nextBtn.classList.toggle('hidden', currentSlide === slides.length - 1 || currentSlide === 1); // Hide nextBtn on slide 1
        submitBtn.classList.toggle('hidden', currentSlide !== slides.length - 1);
    };

    const validateCurrentSlide = () => {
        const currentFields = slides[currentSlide].querySelectorAll('input, select, textarea');

        for (const field of currentFields) {
            // Skip optional fields like description
            if (field.id === 'serviceDescription') continue;

            // Check required status and validity
            if (field.required && !field.checkValidity()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Validation Error',
                    text: `Please fill in all required fields and ensure they are valid.`,
                });
                field.focus(); // Highlight the invalid field
                return false;
            }
        }

        return true;
    };

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide -= 1;
            updateSlideVisibility();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (!validateCurrentSlide()) return; // Stop if validation fails
        if (currentSlide < slides.length - 1) {
            currentSlide += 1;
            updateSlideVisibility();
        }
    });

    updateSlideVisibility();

    // Listen for phone verification success
    document.addEventListener('phoneVerified', (event) => {
        const { success, phoneNumber, error } = event.detail;
        if (success) {
            console.log('Phone number verified successfully:', phoneNumber);

            const emailField = document.getElementById('contactEmail');
            const email = emailField.value.trim();

            // Check email validity
            if (!/\S+@\S+\.\S+/.test(email)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Validation Error',
                    text: 'Please enter a valid email address before proceeding.',
                });
                emailField.focus(); // Highlight the invalid email field
                return; // Stop further steps
            }

            isPhoneVerified = true; // Mark phone as verified

            if (pendingFormData) {
                // If there is pending form data, submit it now
                submitServiceForm(pendingFormData);
                pendingFormData = null; // Clear pending data
            }

            alert(`Phone number verified successfully: ${phoneNumber}`);
            currentSlide = slides.length - 1; // Move to the last slide
            updateSlideVisibility();
        } else {
            console.error('Phone verification failed:', error);
            alert(`Phone verification failed: ${error}`);
        }
    });

    // Function to handle service form submission
    const submitServiceForm = async (formData) => {
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
                document.getElementById('addServiceForm').reset();

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
    };

    // Enhanced Service Form Submission Handler
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
        formData.append('description', description); // Optional field

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

        const userData = localStorage.getItem('user');
        const userDetails = JSON.parse(userData);
        const userId = userDetails.id; // User ID
        formData.append('providerId', userId);

        if (!isPhoneVerified) {
            Swal.fire({
                icon: 'warning',
                title: 'Phone Verification Required',
                text: 'Please verify your phone number before submitting the service.',
            });

            // Store form data for later submission
            pendingFormData = formData;
            return;
        }

        // Proceed with form submission
        submitServiceForm(formData);
    });
});
