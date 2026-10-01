window.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const usernameInput = document.querySelector("#username");
        const commentInput = document.querySelector("#comment");
        let token = null;

        async function getToken() {
            try {
                const response = await fetch("http://10.68.4.3/challenges/1", {
                    method: "POST"
                });

                if (response.headers.get("authorization")) {

                    token = response.headers.get("authorization");
                    console.log("Token received:", token);

                } else {
                    console.error("Error fetching token:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching token:", error);
            }
        }

        getToken().then(() => {
            const comment = commentInput.value;
            const username = usernameInput.value;
            const postData = {
                message: comment,
                username: username,
            };
            fetch("http://10.68.4.3/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },
                body: JSON.stringify(postData)
            });
        });
    });
});