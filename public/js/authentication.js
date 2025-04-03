// Initialize FirebaseUI
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            handleAuthSuccess(authResult);
            return false;
        },
        uiShown: function () {
            const loader = document.getElementById('loader');
            if (loader) loader.style.display = 'none';
        }
    },
    signInFlow: 'popup',
    signInSuccessUrl: "/main",
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>'
};

// Check which page we're on and initialize accordingly
document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;
    const isLoginPage = path.includes('/login') || path.endsWith('/login');
    const isSignupPage = path.includes('/signup') || path.endsWith('/signup');

    const authButton = document.getElementById('authButton');
    if (!authButton) {
        console.error('Auth button not found!');
        return;
    }

    if (isLoginPage) {
        // Login page setup
        authButton.textContent = 'Login';
        authButton.addEventListener('click', handleLogin);

        // Initialize FirebaseUI on login page if container exists
        const uiContainer = document.getElementById('firebaseui-auth-container');
        if (uiContainer) {
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    }
    else if (isSignupPage) {
        // Signup page setup
        authButton.textContent = 'Sign Up';
        authButton.addEventListener('click', handleSignup);
    }
});

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('error-message');

    if (!email || !password) {
        errorElement.textContent = 'Please fill in both email and password fields.';
        return;
    }

    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        window.location.assign('/main');
    } catch (error) {
        errorElement.textContent = error.message;
        console.error('Login error:', error);
    }
}

async function handleSignup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value || email.split('@')[0];
    const errorElement = document.getElementById('error-message');

    if (!email || !password) {
        errorElement.textContent = 'Please fill in both email and password fields.';
        return;
    }

    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        await db.collection('user').doc(user.uid).set({
            name: name,
            email: user.email,
            user_delete_fg: 'N'
        });

        window.location.assign('/main');
    } catch (error) {
        errorElement.textContent = error.message;
        console.error('Signup error:', error);
    }
}

function handleAuthSuccess(authResult) {
    const user = authResult.user;
    if (authResult.additionalUserInfo.isNewUser) {
        db.collection("user").doc(user.uid).set({
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            user_delete_fg: "N"
        }).then(() => {
            window.location.assign("/main");
        }).catch((error) => {
            console.log("Error adding new user: " + error);
        });
    } else {
        window.location.assign("/main");
    }
}