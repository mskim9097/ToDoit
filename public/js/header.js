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

