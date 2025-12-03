document.getElementById("promoForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    let data = {
        "currency": document.getElementById("promoCurrency").value,
        "amount": document.getElementById("promoAmount").value,
        "quantity": document.getElementById("promoQuantity").value,
        "notes": document.getElementById("promoNotes").value
    };
    await request("/api/settings/panel/promo/new", data, () => {
        setTimeout(() => {
            window.location.href = "/settings/panel"; 
        }, 500);
    });
});

async function deletePromos(codes) {
    let data = {
        "codes": codes
    };
    await request("/api/settings/panel/promo/delete", data, () => {
        setTimeout(() => {
            window.location.href = "/settings/panel"; 
        }, 500);
    });
}