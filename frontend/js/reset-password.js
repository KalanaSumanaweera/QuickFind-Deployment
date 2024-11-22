document.addEventListener("DOMContentLoaded", () => {
    const resetPasswordForm = document.getElementById("resetPasswordForm");

    resetPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!newPassword || !confirmPassword) {
            alert("Please fill out all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

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
                Swal.fire({
                    title: "Password Reset Successful",
                    text: "Your password has been reset successfully.",
                    icon: "success",
                })
                // alert("Password has been reset successfully!");
                window.location.href = "/loginpage";
            } else {
                alert(result.message || "Failed to reset password. Please try again.");
            }


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
            //         // text: data.message,
            //         icon: "warning"
            //     });
            // }

        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
