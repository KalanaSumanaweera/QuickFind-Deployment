// frontend/src/js/auth.js
function gotoSignup() {
    alert("test");
    window.location.href = "/signuppage";
}

//Show this alert after verified email
document.addEventListener("DOMContentLoaded", () => {
    // Function to get query parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Show alert if 'message' query parameter is present
    const message = getQueryParam('message');
    if (message) {
        showAlert('done', message).then(() => {
            // Remove 'message' parameter from the URL
            const url = new URL(window.location.href);
            url.searchParams.delete('message');
            window.history.replaceState(null, '', url);
        });
    }
});



document.addEventListener('DOMContentLoaded', function () {
    // const forgotPasswordLink = document.querySelector('a[href="forgotPassword.html"]'); // Forgot Password Link
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgetPasswordLink = document.getElementById('forgetPassword');  // Get the "Forgot password?" link+

    function isValidEmail(email) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    }

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
        else if (!hasUpperCase) {
            errors.push("Password must include at least one uppercase letter.");
        }
        else if (!hasLowerCase) {
            errors.push("Password must include at least one lowercase letter.");
        }
        else if (!hasDigit) {
            errors.push("Password must include at least one number.");
        }
        else if (!hasSpecialChar) {
            errors.push("Password must include at least one special character (e.g., !@#$%^&*).");
        }

        return errors;
    }

    function isValidPhoneNumber(phone) {
        return /^(0?77|0?76|0?74|0?71|0?72|0?75|0?78|0?79|0?70)\d{6,7}$/.test(phone);// For Sri Lankan numbers starting with 0 and 10 digits
    }

    // function showAlert(title, text, icon) {
    //     Swal.fire({ title, text, icon });
    // }

    // Login functionality
    if (loginForm) {
        // Check if there are saved credentials in localStorage
        const savedEmail = localStorage.getItem('savedEmail');
        const savedPassword = localStorage.getItem('savedPassword');

        if (savedEmail && savedPassword) {
            document.getElementById('email').value = savedEmail;
            document.getElementById('password').value = savedPassword;
            document.getElementById('remember').checked = true;
        }

        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;

            if (!isValidEmail(email)) return showAlert("warning", "Please enter a valid email.");

            try {
                const response = await fetch('api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Save or clear login details based on Remember Me checkbox
                    if (rememberMe) {
                        localStorage.setItem('savedEmail', email);
                        localStorage.setItem('savedPassword', password);
                    } else {
                        localStorage.removeItem('savedEmail');
                        localStorage.removeItem('savedPassword');
                    }

                    showAlert('done', 'Login Successful!').then(() => {
                        if (data.user.role == "customer") {
                            window.location.href = '/';
                        } else if (data.user.role == "service_provider") {
                            window.location.href = '/provider-dashboard';
                        }
                    });
                } else {
                    showAlert('warning', data.message || 'Invalid credentials!');
                }
            } catch (error) {
                console.error('Login error:', error);
                showAlert('error', 'Login Failed!')
            }
        });
    }

    // Signup functionality
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.querySelector('input[name="accountType"]:checked').value;

            if (!isValidEmail(email)) return showAlert("warning", "Please enter a valid email.");
            if (!isValidPhoneNumber(phone)) return showAlert("warning", "Please enter a valid Sri Lankan number.");
            if (password !== confirmPassword) return showAlert('warning', 'Please recheck your passwords.');

            // Validate password rules
            const errors = validatePassword(password);
            if (errors.length > 0) {
                const passwordErrorContainer = document.getElementById("passwordError");
                passwordErrorContainer.innerHTML = errors.map(err => `<p class="text-red-500 text-sm">${err}</p>`).join("");
                return false;
            }

            try {
                const response = await fetch('api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        phone,
                        password,
                        role,
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showAlert('done', 'Registration successful! Please log in.')
                        .then(() => {
                            setTimeout(() => {
                                window.location.href = '/loginpage';
                            }, 2000); // Delay the redirection by 2 seconds
                        });
                } else {
                    showAlert('warning', 'Registration failed.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showAlert('warning', 'Registration failed. Please try again')
            }
        });
    }

    // const loginForm = document.getElementById("loginForm");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    // const forgetPasswordLink = document.getElementById("forgetPassword");
    const backToLogin = document.getElementById("backToLogin");

    const toggleVisibility = (hideForm, showForm) => {
        hideForm.classList.add("hidden");
        showForm.classList.remove("hidden");
    };

    // Show Forgot Password Form
    forgetPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        toggleVisibility(loginForm, forgotPasswordForm);
    });

    // Go Back to Login Form
    backToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        toggleVisibility(forgotPasswordForm, loginForm);
    });

    // Handle Forgot Password Form Submission
    forgotPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("forgotEmail").value.trim();

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            // Disable the form and show loader (optional)
            forgotPasswordForm.querySelector("button").disabled = true;

            const response = await fetch("api/auth/request-password-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            // if (response.ok) {
            //     alert("Password reset link has been sent to your email!");
            //     forgotPasswordForm.reset();
            //     toggleVisibility(forgotPasswordForm, loginForm);
            // } else {
            //     alert(result.message || "Failed to send reset link. Please try again.");
            // }


            if (response.ok) {
                showAlert('done', 'Password reset link has been sent to your email!')
                .then(() => {
                    forgotPasswordForm.reset();
                    toggleVisibility(forgotPasswordForm, loginForm);
                });
            } else {
                showAlert('error', data.message)
            }


        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            // Re-enable the form
            forgotPasswordForm.querySelector("button").disabled = false;
        }
    });

});

// //Forgot Password
// document.addEventListener("DOMContentLoaded", () => {
//     const loginForm = document.getElementById("loginForm");
//     const forgotPasswordForm = document.getElementById("forgotPasswordForm");
//     const forgetPasswordLink = document.getElementById("forgetPassword");
//     const backToLogin = document.getElementById("backToLogin");

//     const toggleVisibility = (hideForm, showForm) => {
//         hideForm.classList.add("hidden");
//         showForm.classList.remove("hidden");
//     };

//     // Show Forgot Password Form
//     forgetPasswordLink.addEventListener("click", (e) => {
//         e.preventDefault();
//         toggleVisibility(loginForm, forgotPasswordForm);
//     });

//     // Go Back to Login Form
//     backToLogin.addEventListener("click", (e) => {
//         e.preventDefault();
//         toggleVisibility(forgotPasswordForm, loginForm);
//     });

//     // Handle Forgot Password Form Submission
//     forgotPasswordForm.addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const email = document.getElementById("forgotEmail").value.trim();

//         if (!email || !/\S+@\S+\.\S+/.test(email)) {
//             alert("Please enter a valid email address.");
//             return;
//         }

//         try {
//             // Disable the form and show loader (optional)
//             forgotPasswordForm.querySelector("button").disabled = true;

//             const response = await fetch("http://localhost:3000/api/auth/request-password-reset", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ email }),
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 alert("Password reset link has been sent to your email!");
//                 forgotPasswordForm.reset();
//                 toggleVisibility(forgotPasswordForm, loginForm);
//             } else {
//                 alert(result.message || "Failed to send reset link. Please try again.");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             alert("An error occurred. Please try again.");
//         } finally {
//             // Re-enable the form
//             forgotPasswordForm.querySelector("button").disabled = false;
//         }
//     });
// });