function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
    });
}

function logo() {
    firebase.auth().onAuthStateChanged(user => {
        var logo = document.querySelector('a.navbar-brand');
    
        if (user) {
            console.log("login");
            logo.href = "/main";
        } else {
            console.log("not login");
            logo.href = "/";
        }
    });
}

logo();



