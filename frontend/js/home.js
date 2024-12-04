//Remove the token from the URL
document.addEventListener("DOMContentLoaded", () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.replaceState(null, '', url);
});

document.getElementById("menu-toggle").addEventListener("click", function () {
    const navbar = document.getElementById("navbar");
    navbar.classList.toggle("hidden");
  });