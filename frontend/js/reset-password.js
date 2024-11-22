// Function to validate the password
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];

    if (password.length < minLength) {
        errors.push("Password must be at least 8 characters long.");
    }
    if (!hasUpperCase) {
        errors.push("Password must include at least one uppercase letter.");
    }
    if (!hasLowerCase) {
        errors.push("Password must include at least one lowercase letter.");
    }
    if (!hasDigit) {
        errors.push("Password must include at least one number.");
    }
    if (!hasSpecialChar) {
        errors.push("Password must include at least one special character (e.g., !@#$%^&*).");
    }

    return errors;
}

// Main DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
    const resetPasswordForm = document.getElementById("resetPasswordForm");

    resetPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Check if fields are filled
        if (!newPassword || !confirmPassword) {
            alert("Please fill out all fields.");
            return;
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Validate password strength
        const validationErrors = validatePassword(newPassword);
        if (validationErrors.length > 0) {
            alert(validationErrors.join("\n")); // Show validation errors
            return;
        }

        // Proceed with API call if validation passes
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Password has been reset successfully!");
                window.location.href = "/loginpage";
            } else {
                alert(result.message || "Failed to reset password. Please try again.");
            }

            // Optionally, use SweetAlert for better UI (uncomment if using Swal)
            // if (response.ok) {
            //     Swal.fire({
            //         title: "Password has been reset successfully!",
            //         text: "Please log in.",
            //         icon: "success"
            //     }).then(() => {
            //         window.location.href = '/loginpage';
            //     });
            // } else {
            //     Swal.fire({
            //         title: "Failed to reset password. Please try again.",
            //         text: result.message,
            //         icon: "warning"
            //     });
            // }

        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
