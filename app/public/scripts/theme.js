let initTheme = localStorage.getItem("color-theme") ? localStorage.getItem("color-theme") == "true" : true;

function refreshDarkMode() {
    let dark = document.getElementById("color-theme") ? document.getElementById("color-theme").checked : initTheme;
    document.documentElement.setAttribute("data-bs-theme", dark ? "dark" : "light");
    if (document.querySelector("nav")) {
        document.querySelector("nav").classList.remove("navbar-light", "bg-light", "navbar-dark", "bg-dark");
        document.querySelector("nav").classList.add(dark ? "bg-dark" : "bg-light", dark ? "navbar-dark" : "navbar-light");
    }
    localStorage.setItem("color-theme", dark);
}

function initDarkMode() {
    if (document.getElementById("color-theme")) {
        document.getElementById("color-theme").addEventListener("change", () => {
            refreshDarkMode();
        });
        document.getElementById("color-theme").checked = initTheme;
    }
    refreshDarkMode();
}