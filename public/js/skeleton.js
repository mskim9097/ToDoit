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
            $('#navbarPlaceholder').load('/nav_after_login');
            $('#footerPlaceholder').load('/footer');
        } else {
            // No user is signed in.
            $('#navbarPlaceholder').load('/nav_before_login');
            $('#footerPlaceholder').load('/footer');
        }
    });
}
loadSkeleton(); //invoke the function