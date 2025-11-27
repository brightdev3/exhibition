function alertText(text, type = "info", elementId = "alertText") {
    const alertNode = document.getElementById(elementId);
    if (!alertNode) {
        return;
    }
    alertNode.classList.forEach(className => {
        if (className.startsWith("alert-")) {
            alertNode.classList.remove(className);
        }
    });
    alertNode.classList.add("alert-" + type);
    alertNode.innerHTML = text;
    alertNode.style.display = "block";
}

async function request(path, data, callback) {
    try {
        alertText("Sending...", "primary");
        const response = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if (responseData.success) {
            if (callback) {
                callback(responseData);
            }
            alertText(responseData.message ? "Success: " + responseData.message : "Success!", "success");
            return true;
        } else {
            alertText(responseData.message ? "Error: " + responseData.message : "Error!", "warning");
            return false;
        }
    } catch (error) {
        alertText("Error: an unexpected error occurred", "warning");
        return false;
    }
}

function refreshDarkMode() {
    let dark = document.getElementById("color-theme").checked;
    document.documentElement.setAttribute("data-bs-theme", dark ? "dark" : "light");
    document.querySelector('nav').classList.remove("navbar-light", "bg-light", "navbar-dark", "bg-dark");
    document.querySelector('nav').classList.add(dark ? "bg-dark" : "bg-light", dark ? "navbar-dark" : "navbar-light");
    localStorage.setItem("color-theme", dark);
}

document.getElementById("color-theme").addEventListener("change", () => {
    refreshDarkMode();
});

document.getElementById("color-theme").checked = localStorage.getItem("color-theme") == "true";
refreshDarkMode();