document.getElementById("promoRedeem").addEventListener("submit", async (event) => {
    event.preventDefault();
    let data = {
        "code": document.getElementById("promoCode").value,
    };
    await request("/api/settings/promo/redeem", data, () => {
        setTimeout(() => {
            window.location.href = "/settings"; 
        }, 500);
    });
});