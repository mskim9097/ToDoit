function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
    });
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    try {
        // Sign in with Firebase Authentication
        await firebase.auth().signInWithEmailAndPassword(email, password);
        // Redirect to the main page or dashboard
        window.location.href = "/main";
    } catch (error) {
        // Display error message
        errorMessage.textContent = `Login failed: ${error.message}`;
        errorMessage.style.color = "red";
    }
});





