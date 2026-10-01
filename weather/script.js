window.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#weather-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const plzInput = document.querySelector("#plz");
        if (isNaN(Number(plzInput.value))) {
            alert("Keine gueltige Postleitzahl");
            plzInput.style.border = "2px solid red";
            return;
        } else {
            plzInput.style.border = "2px solid green";
            const apiKey = "5ac5c2b2"
            const plz = plzInput.value.trim();
            const url = `https://app-prod-ws.meteoswiss-app.ch/v1/plzDetail?plz=${plz}00`;
            const localUrl = `https://corsproxy.io/?key=${apiKey}&url=${encodeURIComponent(url)}`;
            async function fetchWeather() {
                try {
                    const response = await fetch(localUrl);
                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
                        const p = document.querySelector("p");
                        let today = data.forecast[0];
                        p.textContent = `Postleitzahl: ${plz}, Temperatur-max: ${today.temperatureMax}°C, Temperatur-min: ${today.temperatureMin}°C, Wetter: ${today.precipitationMax}`;
                    } else {
                        console.error("Error fetching weather data:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching weather data:", error);
                }
            }
            fetchWeather();
        }


    });


});
