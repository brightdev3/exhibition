async function signup() {
    let data = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
        "password_repeat": document.getElementById("password_repeat").value,
        "email": document.getElementById("email").value
    }
    try {
        document.getElementById("errorText").style.color = "black";
        document.getElementById("errorText").style.display = "block";
        document.getElementById("errorText").innerHTML = "Sending...";
        const response = await fetch('https://exhibition-economy.vercel.app/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if (responseData.success) {
            document.getElementById("errorText").style.color = "green";
            document.getElementById("errorText").innerHTML = "Success: " + responseData.message;
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

document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await signup();
});