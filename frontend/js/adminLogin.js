document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

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
