document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const titleField = document.querySelector("#input-title");
    const completedField = document.querySelector("#completed-button");
    const createUrl = "http://localhost/tasks";
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const titleValue = titleField.value;
        const completedValue = completedField.checked;
        const newReminder = {
            completed: completedValue,
            title: titleValue
        };

        async function submitReminder() {
            try {
                const response = await fetch(createUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newReminder)
                });

                if (response.ok) {
                    const data = await response.json();
                } else {
                    console.error("Error submitting post:", error);
                }
            } catch (error) {
                console.error("Error submitting post:", error);
            }
        }
        submitReminder();

    });

});