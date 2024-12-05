// document.addEventListener('DOMContentLoaded', () => {
//     const addServiceForm = document.getElementById('addServiceForm');

//     // Payhere merchant credentials (replace with your actual details)
//     const merchantCredentials = {
//         merchant_id: '4OVxg9CIhUm4JEVO85LIyu3LI', // Your App ID here
//         return_url: 'http://localhost:3000/success', // Localhost success URL
//         cancel_url: 'http://localhost:3000/cancel',  // Localhost cancel URL
//         notify_url: 'http://localhost:3000/notify'   // Localhost notify URL
//     };

//     // Configure Payhere events
//     payhere.onCompleted = function(orderID) {
//         console.log("Payment completed. OrderID:", orderID);
//         submitServiceDetails();
//     };

//     payhere.onDismissed = function() {
//         console.log("Payment dismissed");
//         alert("Payment process was cancelled");
//     };

//     payhere.onError = function(error) {
//         console.error("Payment error:", error);
//         alert("An error occurred during payment");
//     };

//     addServiceForm.addEventListener('submit', function(e) {
//         e.preventDefault();
//         processPayment();
//     });

//     function processPayment() {
//         // Collect form data
//         const formData = collectFormData();
//         const postAddingFee = document.getElementById('postAddingFee').value;

//         // If fee is free, directly submit
//         if (postAddingFee === 'free') {
//             submitServiceDetails();
//             return;
//         }

//         // Prepare Payhere payment
//         const paymentDetails = {
//             sandbox: true, // Enable sandbox mode for testing
//             merchant_id: merchantCredentials.merchant_id,
//             return_url: merchantCredentials.return_url,
//             cancel_url: merchantCredentials.cancel_url,
//             notify_url: merchantCredentials.notify_url,
//             order_id: 'SERVICE_' + Date.now(),
//             items: 'Service Posting Fee',
//             amount: postAddingFee,
//             currency: 'LKR',
//             first_name: formData.serviceTitle,
//             email: formData.contactEmail,
//             phone: formData.contactNumber,
//             address: formData.serviceLocation
//         };

//         // Start Payhere payment
//         payhere.startPayment(paymentDetails);
//     }

//     function collectFormData() {
//         return {
//             serviceTitle: document.getElementById('serviceTitle').value,
//             serviceDescription: document.getElementById('serviceDescription').value,
//             serviceCategory: document.getElementById('serviceCategory').value,
//             workingHoursStart: document.getElementById('workingHoursStart').value,
//             workingHoursEnd: document.getElementById('workingHoursEnd').value,
//             availableDays: Array.from(document.querySelectorAll('input[name="availableDays"]:checked'))
//                 .map(checkbox => checkbox.value),
//             serviceLocation: document.getElementById('serviceLocation').value,
//             serviceArea: document.getElementById('serviceArea').value,
//             contactEmail: document.getElementById('contactEmail').value,
//             contactNumber: document.getElementById('contactNumber').value,
//             servicePrice: document.getElementById('servicePrice').value,
//             servicePriceType: document.getElementById('servicePriceType').value,
//             postAddingFee: document.getElementById('postAddingFee').value
//         };
//     }

//     function submitServiceDetails() {
//         const formData = collectFormData();

//         // Send data to your backend
//         fetch('http://localhost:3000/submit-service', { // Local backend URL
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${btoa('4OVxg9CIhUm4JEVO85LIyu3LI:8bQKKSrOTB24eVKUEjvkyf4pDHF8XHemk8cJkELHYMKa')}` // Base64 encode App ID:Secret
//             },
//             body: JSON.stringify(formData)
//         })
//         .then(response => response.json())
//         .then(data => {
//             alert('Service added successfully');
//             // Close modal or redirect
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             alert('Failed to add service');
//         });
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    const addServiceForm = document.getElementById('addServiceForm');

    // Updated merchant credentials
    const merchantCredentials = {
        merchant_id: '1227206', // Correct
        app_id: '4OVxg9CIhUm4JEVO85LIyu3LI', // Ensure this is the correct app ID
        return_url: 'http://localhost:3000/success', // Correct for localhost testing
        cancel_url: 'http://localhost:3000/cancel', // Correct for localhost testing
        notify_url: 'http://localhost:3000/notify' // Correct for localhost testing
        // return_url: 'https://your-ngrok-domain/success',
        // cancel_url: 'https://your-ngrok-domain/cancel',
        // notify_url: 'https://your-ngrok-domain/notify',
    };

    // Configure Payhere
    payhere.onCompleted = function (orderID) {
        console.log("Payment completed. OrderID:", orderID);
        alert("Payment completed successfully. Order ID: " + orderID);
        // Add your service submission logic here
    };

    payhere.onDismissed = function () {
        console.log("Payment dismissed");
        alert("Payment process was cancelled");
    };

    payhere.onError = function (error) {
        console.error("Payment error:", error);
        alert("An error occurred during payment. Details: " + JSON.stringify(error));
    };

    function processPayment() {
        const postAddingFee = document.getElementById('postAddingFee').value;

        // If the fee is "free", display an alert and skip payment processing
        if (postAddingFee === 'free') {
            alert("No payment is required for free services.");
            return;
        }

        // Prepare Payhere payment with more detailed information
        const paymentDetails = {
            sandbox: true,
            merchant_id: '1227206',
            app_id: '4OVxg9CIhUm4JEVO85LIyu3LI',
            return_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            notify_url: 'http://localhost:3000/payhere-proxy',

            order_id: 'SERVICE_' + Date.now(),
            items: 'Service Posting Fee',
            amount: postAddingFee,
            currency: 'LKR',

            // More detailed customer information
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            phone: '+94769259694',
            address: 'No. 123, Test Street',
            city: 'Colombo',
            country: 'Sri Lanka',

            // Additional optional parameters
            delivery_address: 'No. 123, Test Street',
            delivery_city: 'Colombo',
            delivery_country: 'Sri Lanka',

            // Custom data
            custom_1: 'Service Posting',
            custom_2: ''
        };

        try {
            console.log("Payment Details:", paymentDetails);
            payhere.startPayment(paymentDetails);
        } catch (error) {
            console.error("Payment initialization error:", error);
            alert("Failed to initialize payment. Please try again.");
        }
    }

    // Attach event listener to form submission
    addServiceForm.addEventListener('submit', function (e) {
        e.preventDefault();
        processPayment();
    });
});
