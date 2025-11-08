async function signout() {
    let data = {};
    try {
        document.getElementById("errorText").style.color = "black";
        document.getElementById("errorText").style.display = "block";
        document.getElementById("errorText").innerHTML = "Sending...";
        const response = await fetch("/api/auth/signout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if (responseData.success) {
            document.getElementById("errorText").style.color = "green";
            document.getElementById("errorText").innerHTML = "Success: " + responseData.message;
            setTimeout(() => {
                window.location.href = "/"; 
            }, 500);
        } else {
            document.getElementById("errorText").style.color = "red";
            document.getElementById("errorText").innerHTML = "Error: " + responseData.message;
        }
    } catch (error) {
        document.getElementById("errorText").style.color = "red";
        document.getElementById("errorText").style.display = "block";
        document.getElementById("errorText").innerHTML = "Error: " + "an unexpected error occurred";
    }
}