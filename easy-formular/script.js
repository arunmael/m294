document.addEventListener("DOMContentLoaded", function() {
            let form = document.querySelector("form");
            form.addEventListener("submit", function (event) {
                let date = new Date();
                let time = date.getHours();
                event.preventDefault();
                 const nameInput = document.querySelector("#name-input");
                const name = nameInput.value;
                const p = document.querySelector("p");
                if (time < 11 && time >= 5) {
                p.innerText = ("Good morning " + name);
            } else if (time < 17 && time >= 11) {
                p.innerText = ("Good afternoon " + name);
            } else if (time < 21 && time >= 17) {
                p.innerText = ("Good evening " + name);
            } else {
                p.innerText = ("Good night " + name);
            }
            });
        });