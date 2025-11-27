async function getCurrency(code) {
    console.log(code)
    try {
        const response = await fetch("/api/earn/currency?code=" + code, {
            method: "GET"
        });
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.success) {
            const currency = responseData.data;
            document.getElementById("earn_min").value = currency.earn_min;
            document.getElementById("earn_max").value = currency.earn_max;
        } else {
            alertText("Error: " + responseData.message, "warning");
        }
    } catch (error) {
        alertText("Error: an unexpected error occurred", "warning");
    }
}

document.getElementById("currency").addEventListener("change", async () => {
    await getCurrency(document.getElementById("currency").value);
});

document.getElementById("currencySet").addEventListener("submit", async (event) => {
    event.preventDefault();
    let data = {
        "code": document.getElementById("currency").value,
        "earn_min": document.getElementById("earn_min").value,
        "earn_max": document.getElementById("earn_max").value
    };
    await request("/api/earn/set", data, () => {
        setTimeout(() => {
            window.location.href = "/earn/panel"; 
        }, 500);
    });
});

getCurrency(document.getElementById("currency").value);