function alertText(text, type = "info") {
    const alertNode = document.getElementById("alertText");
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