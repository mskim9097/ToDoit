function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method #1:  insert with JS
            document.getElementById("name-goes-here").innerText = userName;    

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
            console.log ("No user is logged in");
        }
    });
}
getNameFromAuth(); //run the function

// Function to add new reminder members to Firestore
function writeReminderMembers() {
    var reminderRef = db.collection("reminder_member");

    reminderRef.add({
        reminder_no: "RM001",            // Unique identifier for the reminder
        user_no: "U001",                 // The user who created the reminder
        reminder_member_create_date: firebase.firestore.FieldValue.serverTimestamp(),  // Current timestamp (sysdate)
        reminder_manager: "Y",           // Manager flag (Y/N)
        reminder_member_delete_fg: "N"   // Default to not deleted (N)
    });
    reminderRef.add({
        reminder_no: "RM002",            // Another reminder entry
        user_no: "U002",                 // Another user
        reminder_member_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        reminder_manager: "N",           // Non-manager flag (Y/N)
        reminder_member_delete_fg: "N"   // Default to not deleted
    });
    reminderRef.add({
        reminder_no: "RM003",            // Another reminder entry
        user_no: "U003",                 // Another user
        reminder_member_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        reminder_manager: "Y",           // Manager flag (Y/N)
        reminder_member_delete_fg: "N"   // Default to not deleted
    });
}

// Function to display reminder members dynamically
function displayReminderMembers() {
    let cardTemplate = document.getElementById("reminderCardTemplate"); // Retrieve the HTML element with the ID "reminderCardTemplate"

    db.collection("reminder_member").get()   // The collection called "reminder_member"
        .then(allMembers => {
            allMembers.forEach(doc => { // Iterate through each document
                var docID = doc.id;               // Get the unique ID of the document
                var reminderNo = doc.data().reminder_no;  // Get the "reminder_no" key
                var userNo = doc.data().user_no;  // Get the "user_no" key
                var isManager = doc.data().reminder_manager === "Y" ? "Manager" : "Member";  // Get the "reminder_manager" value
                var createDate = doc.data().reminder_member_create_date.toDate();  // Get the creation date and convert to a JavaScript Date object

                let newCard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card that will be filled with Firestore data

                // Update the card with data from Firestore
                newCard.querySelector('.reminder-title').innerHTML = `Reminder #${reminderNo}`;
                newCard.querySelector('.reminder-user').innerHTML = `User #${userNo}`;
                newCard.querySelector('.reminder-manager').innerHTML = `Role: ${isManager}`;
                newCard.querySelector('.reminder-date').innerHTML = `Created on: ${createDate.toLocaleDateString()}`;

                // Append the new card to the display container
                document.getElementById("reminder-list").appendChild(newCard);
            });
        })
        .catch(error => {
            console.error("Error retrieving reminder members:", error);
        });
}

// Call the function to display reminder members
displayReminderMembers();
