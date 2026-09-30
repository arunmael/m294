document.addEventListener("DOMContentLoaded", function () {
    let form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const emailInput = document.querySelector("#user-email");
        const passwordInput = document.querySelector("#password");
        const confirmPasswordInput = document.querySelector("#confirm-password");
        let email = emailInput.value;
        let password = passwordInput.value;
        let confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword || password.length < 8) {
            alert("Die Passwörter stimmen nicht über ein oder das gewählte Passwort ist zu kurz")
            passwordInput.style.borderColor = "red";
            confirmPasswordInput.style.borderColor = "red";
        } else {
            p = document.querySelector("p");
            p.innerText = "Willkommen"
        }

    })







})