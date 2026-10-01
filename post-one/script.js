document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#form");
    const deleteButton = document.querySelector("#delete");
    const userId = 1;
    let lastPostId = null;
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const body = document.querySelector("#body");
        const title = document.querySelector("#title");
        const bodyValue = body.value;
        const titleValue = title.value;

        const newPost = {
            userId: userId,
            title: titleValue,
            body: bodyValue
        };

        async function submitPost() {
            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newPost)
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Post submitted successfully:", data);
                    lastPostId = data.id; // Speichere die neu erhaltene ID
                } else {
                    console.error("Error submitting post:", response.statusText);
                }
            } catch (error) {
                console.error("Error submitting post:", error);
            }
        }

        submitPost();
    });
    deleteButton.addEventListener("click", async function () {
        if (lastPostId === null) {
            alert("No post to delete.");
            return;
        }

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${lastPostId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                console.log("Post deleted successfully");
                lastPostId = null; // ID zurücksetzen
            } else {
                console.error("Error deleting post:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    });
});