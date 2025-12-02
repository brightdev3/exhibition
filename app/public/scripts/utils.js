function alertText(text, type = "primary") {
    let alertContainer = document.getElementById("toast-container");
    let code = "";
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }
    alertContainer.insertAdjacentHTML("beforeend", `
        <div id="toast-${code}" class="toast align-items-center text-bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${text}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `);
    const toast = new bootstrap.Toast(document.getElementById("toast-" + code), {
        autohide: true,
        delay: 4000
    });
    toast.show();
}

async function request(path, data, callback, alert = true) {
    try {
        // alertText("Sending...", "primary");
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
            if (alert) {
                alertText(responseData.message ? "Success: " + responseData.message : "Success!", "success");
            }
            return true;
        } else {
            if (alert) {
                alertText(responseData.message ? "Error: " + responseData.message : "Error!", "warning");
            }
            return false;
        }
    } catch (error) {
        console.error(error);
        if (alert) {
            alertText("Error: an unexpected error occurred", "warning");
        }
        return false;
    }
}