document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const titleField = document.querySelector("#input-title");
    const completedField = document.querySelector("#completed-button");
    const url = "http://localhost/tasks";
    const reminderDiv = document.querySelector("#aufgaben-liste");
    const reload = document.querySelector("#reload");
    const newReminder = document.querySelector("#new");
    const goHome = document.querySelector("#back");
    const updateReminder = document.querySelector(".update-button");
    let editId = null;
    document.querySelector("#submit-update").style.display = "none";

    document.querySelectorAll("#aufgabe-erstellen *").forEach((element) => {
        element.style.display = "none";
    });
    document.querySelector("#back").style.display = "none";





    async function getReminders() {
        try {
            const response = await fetch(url);
            if (response.ok) {
                reminderDiv.replaceChildren()
                const data = await response.json();
                data.forEach((i) => {
                    const newDiv = document.createElement("div");

                    newDiv.classList.add("aufgabe");
                    const titleElement = document.createElement("h3");
                    const completedElement = document.createElement("p");
                    const deleteReminder = document.createElement("button");
                    const updateReminder = document.createElement("button");
                    deleteReminder.textContent = "delete";
                    updateReminder.textContent = "update";

                    reminderDiv.append(newDiv);

                    const title = i.title;
                    let completed = "";
                    if (i.completed === true) {
                        completed = "erledigt";
                    } else { completed = "anstehend"; };
                    titleElement.textContent = title;
                    completedElement.textContent = completed;
                    deleteReminder.classList.add("delete-button");
                    updateReminder.classList.add("update-button");

                    newDiv.append(titleElement, completedElement, deleteReminder, updateReminder);






                    deleteReminder.onclick = async () => {
                        await fetch(`http://localhost/task/${i.id}`, { method: "DELETE" });
                        newDiv.remove();
                    };


                    updateReminder.onclick = () => {

                        document.querySelectorAll("#aufgabe-erstellen *").forEach((element) => {
                            element.style.display = "";
                        });
                        document.querySelectorAll("#aufgaben *").forEach((element) => {
                            element.style.display = "none";
                        });
                        document.querySelector("#back").style.display = "";
                        document.querySelector("#new").style.display = "none";
                        document.querySelector("#submit").style.display = "none";
                        document.querySelector("#submit-update").style.display = "";

                        editId = i.id;
                        titleField.value = i.title;
                        completedField.checked = i.completed;
                    };


                });
                editId = null;
                form.reset();

            } else {
                console.error("Error submitting post:", response.status);
            }
        } catch (error) {
            console.error("Error submitting post:", error);
        }
    }

    // Weil ich reload button geloescht habe fals der wieder genutz wird code wieder aktivieren.
    getReminders();
    //reload.onclick = () => {
    // getReminders()
    //}










    // FEHLER (auskommentiert): "updateReminder" ist die Konstante aus Zeile 10 (querySelector(".update-button")).
    // Beim Laden gibt es noch keinen Update-Button in der Liste, die Konstante ist also null, und
    // "null.onclick = ..." wirft einen Fehler. Ausserdem gehoert "Speichern" (neuer Eintrag) nicht an einen
    // Update-Button, sondern an den Speichern-Button aus dem Formular (id="submit").
    // updateReminder.onclick = async () => {

    // ANPASSUNG: Der Handler haengt jetzt per addEventListener("click") am Speichern-Button (#submit).
    // - "event" steht als Parameter in der Klammer, sonst kennt die Funktion "event" nicht.
    // - event.preventDefault() verhindert, dass der Button (type="submit") das Formular normal absendet
    //   und die Seite neu laedt. Ohne das wuerden auch noch andere Handler am Formular ausgeloest.
    // - Das Ende dieses Handlers ist weiter unten mit "});" geschlossen (siehe dort).
    document.querySelector("#submit").addEventListener("click", async (event) => {
        event.preventDefault();
        const titleValue = titleField.value;
        const completedValue = completedField.checked;
        const newReminder = {
            completed: completedValue,
            title: titleValue
        };

        async function submitReminder() {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newReminder)
                });

                if (response.ok) {
                    const data = await response.json();
                    titleField.value = "";
                    document.querySelectorAll("#aufgabe-erstellen *").forEach((element) => {
                        element.style.display = "none";
                    });
                    document.querySelectorAll("#aufgaben *").forEach((element) => {
                        element.style.display = "";
                    });
                    document.querySelector("#back").style.display = "none";
                    document.querySelector("#new").style.display = "";
                    getReminders();
                } else {
                    console.error("Error submitting post:", response.status);
                }
            } catch (error) {
                console.error("Error submitting post:", error);
            }
        };

        submitReminder();






        // ANPASSUNG: Hier fehlte die schliessende Klammer des Speichern-Handlers von oben. Ohne "});" lag
        // alles Folgende (dieser Handler, "+"-Klick, "<"-Klick) IN dem Speichern-Handler, und die Klammern
        // der Datei gingen nicht mehr auf. Es ist "});" und nicht "};", weil der Handler mit
        // addEventListener( ... ) angelegt wurde und die Klammer von addEventListener mitgeschlossen werden muss.
        // Der nachfolgende Code steht jetzt wieder auf oberster Ebene (die Einrueckung ist nur Optik).
    });

    // FEHLER (auskommentiert): Dieser Handler hing am ganzen Formular ("submit"). Beide Buttons
    // (Speichern und Update) sind type="submit", ein Klick auf einen der beiden loest das Formular-Absenden
    // aus, und dieser Handler wuerde jedes Mal mitlaufen. Dann gaebe es bei jedem Speichern auch einen PUT.
    // form.addEventListener("submit", (event) => {
    //     event.preventDefault();
    //     const titleValue = titleField.value;
    //     const completedValue = completedField.checked;
    //     const updateReminder = {
    //         completed: completedValue,
    //         title: titleValue
    //     };

    // ANPASSUNG: Der Handler haengt jetzt am Update-Button (#submit-update) und reagiert nur auf dessen Klick.
    // event.preventDefault() verhindert das normale Absenden des Formulars.
    document.querySelector("#submit-update").addEventListener("click", (event) => {
        event.preventDefault();
        const titleValue = titleField.value;
        const completedValue = completedField.checked;
        // FEHLER (auskommentiert): "updateReminder" war hier doppelt vergeben, als Konstante (Objekt) und
        // weiter unten als Funktion "async function updateReminder()". Ein Name darf im selben Block
        // nur einmal vorkommen (SyntaxError "already been declared"). Ausserdem fehlte die id, die der
        // Server beim PUT braucht, um zu wissen, welche Aufgabe geaendert wird.
        // const updateReminder = {
        //     completed: completedValue,
        //     title: titleValue
        // };

        // ANPASSUNG: Das Objekt heisst jetzt "updatedData" und enthaelt zusaetzlich die id. "editId"
        // wird im Klick auf "update" in der Liste gesetzt (siehe oben). Beim PUT steht die id im Body.
        const updatedData = {
            id: editId,
            completed: completedValue,
            title: titleValue
        };

        async function updateReminder() {
            try {
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // FEHLER (auskommentiert): "newReminder" ist an dieser Stelle der "+"-Button aus Zeile 8
                    // (ein HTML-Element). JSON.stringify macht daraus ein leeres {}, der Server bekaeme
                    // weder id noch Titel. Das Objekt mit den Daten gibt es hier nur im Speichern-Handler.
                    // body: JSON.stringify(newReminder)

                    // ANPASSUNG: Es wird das Objekt "updatedData" von oben geschickt (id, Titel, Status).
                    body: JSON.stringify(updatedData)
                });

                if (response.ok) {
                    const data = await response.json();
                    titleField.value = "";
                    document.querySelectorAll("#aufgabe-erstellen *").forEach((element) => {
                        element.style.display = "none";
                    });
                    document.querySelectorAll("#aufgaben *").forEach((element) => {
                        element.style.display = "";
                    });
                    document.querySelector("#back").style.display = "none";
                    document.querySelector("#new").style.display = "";
                    getReminders();
                } else {
                    console.error("Error submitting post:", response.status);
                }
            } catch (error) {
                console.error("Error submitting post:", error);
            }
        }

        updateReminder();

    });


    newReminder.onclick = () => {
        document.querySelectorAll("#aufgabe-erstellen *").forEach((element) => {
            element.style.display = "";
        });
        document.querySelectorAll("#aufgaben *").forEach((element) => {
            element.style.display = "none";
        });
        document.querySelector("#back").style.display = "";
        document.querySelector("#new").style.display = "none";
        editId = null;
        form.reset();
        document.querySelector("#submit-update").style.display = "none";
    };


    goHome.onclick = () => {
        document.querySelectorAll("#aufgabe-erstellen *").forEach((element) => {
            element.style.display = "none";
        });
        document.querySelectorAll("#aufgaben *").forEach((element) => {
            element.style.display = "";
        });
        document.querySelector("#back").style.display = "none";
        document.querySelector("#new").style.display = "";
        editId = null;
        form.reset();
        document.querySelector("#submit-update").style.display = "none";
    };

});
