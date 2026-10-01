document.addEventListener("DOMContentLoaded", function () {
    form = document.querySelector("form")
    firstDiv = document.querySelectorAll("div")[0]
    const plzInput = document.querySelector("#plz");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const div = document.createElement("div");
        const hTwo = document.createElement("h2");
        const addressElement = document.createElement("p");
        const emailElement = document.createElement("p");
        const duziElement = document.createElement("p");
        const verbindungElement = document.createElement("p");
        const fName = document.querySelector("#fname").value;
        const lName = document.querySelector("#lname").value;
        const street = document.querySelector("#street").value;
        const plz = document.querySelector("#plz").value;
        const location = document.querySelector("#ort").value;
        const email = document.querySelector("#email").value;
        const duzi = document.querySelector("#duzi").checked;
        const verbindung = document.querySelector("#verbindung").value;
        const name = fName + " " + lName;
        const address = street + ", " + plz + " " + location;


        if (isNaN(Number(plz))) {
            alert("Keine gueltige Postleitzahl");
            document.querySelector("#plz").style.border = "2px solid red";
        } else {
            hTwo.textContent = name;
            addressElement.textContent = address;
            emailElement.textContent = email;
            duziElement.textContent = duzi ? "Duzi: Ja" : "Duzi: Nein";
            verbindungElement.textContent = "Bekannt durch: " + verbindung;

            firstDiv.prepend(div);
            currentDiv = div;
            currentDiv.append(hTwo);
            currentDiv.append(addressElement);
            currentDiv.append(emailElement);
            currentDiv.append(duziElement);
            currentDiv.append(verbindungElement);
        }

    });


    plzInput.addEventListener("blur", function () {
        const plzValue = plzInput.value;
        const ortInput = document.querySelector("#ort");
        async function fetchLocation() {
            url = `https://api.zippopotam.us/CH/${plzValue}`;
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    const location = data.places[0]["place name"];
                    ortInput.value = location;


                } else {
                    console.error("Error fetching location:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching location:", error);
            }
        }

        fetchLocation();
    });


});