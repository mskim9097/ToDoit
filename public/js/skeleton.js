//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // If the "user" variable is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            console.log($('#navbarPlaceholder').load('nav_after_login.html'));
            console.log($('#footerPlaceholder').load('footer.html'));
        } else {
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('nav_before_login.html'));
            console.log($('#footerPlaceholder').load('footer.html'));
        }
    });
    /*
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {                   
                    // If the "user" variable is not null, then someone is logged in
                // User is signed in.
                // Do something for the user here.
                console.log($('#navbarPlaceholder').load('/app/html/nav_after_login.html'));
                console.log($('#footerPlaceholder').load('/app/html/footer.html'));
            } else {
                // No user is signed in.
                console.log($('#navbarPlaceholder').load('/app/html/nav_before_login.html'));
                console.log($('#footerPlaceholder').load('/app/html/footer.html'));
            }
        });*/
}
loadSkeleton(); //invoke the function