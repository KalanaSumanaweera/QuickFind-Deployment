// Load email from local storage if "Remember Me" was checked previously
window.addEventListener("load", () => {
    const savedEmail = localStorage.getItem("adminEmail");
    const rememberChecked = localStorage.getItem("rememberMe") === "true";

    if (savedEmail && rememberChecked) {
        document.getElementById("email").value = savedEmail;
        document.getElementById("remember").checked = true;
    }
});

document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const rememberMe = document.getElementById("remember").checked;

    if (!email || !password) {
        alert("Please fill in both fields.");
        return;
    }

    try {
        const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            const { token } = data;

            // Store token
            localStorage.setItem("adminToken", token);

            if (rememberMe) {
                localStorage.setItem("adminEmail", email);
                localStorage.setItem("rememberMe", "true");
            } else {
                localStorage.removeItem("adminEmail");
                localStorage.removeItem("rememberMe");
            }

            alert("Login successful!");
            window.location.href = "/admin/dashboard";
        } else {
            alert(data.message || "Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred. Please try again later.");
    }
});

