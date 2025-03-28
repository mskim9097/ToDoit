var currentUser;
//points to the document of the user who is logged in
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("user").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userName = userDoc.data().name;
                    let userSchool = userDoc.data().school;
                    let userCity = userDoc.data().city;
                    let userProgram = userDoc.data().program;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolInput").value = userSchool;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userProgram != null) {
                        document.getElementById("programInput").value = userProgram;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            location.href = "/";
        }
    });
}

//call the function to run it 
populateUserInfo();


function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}


function saveUserInfo() {
    //enter code here

    //a) get user entered values
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userSchool = document.getElementById('schoolInput').value;     //get the value of the field with id="schoolInput"
    userCity = document.getElementById('cityInput').value;       //get the value of the field with id="cityInput"
    userProgram = document.getElementById('programInput').value;       //get the value of the field with id="programInput"


    //b) update user's document in Firestore
    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity,
        program: userProgram,
    })
        .then(() => {
            console.log("Document successfully updated!");
        })

    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}

function deleteAccount() {
    // Confirm the user really wants to delete their account
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const userId = user.uid;

                // Step 1: Delete user document from Firestore
                db.collection("user").doc(userId).delete()
                    .then(() => {
                        console.log("User document deleted from Firestore");

                        // Step 2: Delete user authentication account
                        user.delete()
                            .then(() => {
                                console.log("User account deleted from Firebase Auth");
                                alert("Your account has been successfully deleted.");
                                location.href = "/";  // redirect to homepage or login page
                            })
                            .catch(error => {
                                console.error("Error deleting Firebase Auth user:", error);
                                alert("Error deleting your account. Please re-authenticate and try again.");
                            });

                    })
                    .catch(error => {
                        // Handle error in deleting Firestore document
                        console.error("Error deleting Firestore document:", error);
                        alert("Error deleting your user data. Please try again.");
                    });
            }
        });
    }
}
