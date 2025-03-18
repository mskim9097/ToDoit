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
function displayReminderMembers(collection) {
    let reminderTemplate = document.getElementById("reminderCardTemplate"); // Retrieve the HTML element with the ID "reminderCardTemplate"
    var auth = firebase.auth();
  auth.onAuthStateChanged((user) => {
    if(user) {
    db.collection("reminder_member").get()   // The collection called "reminder_member"
        .then(allMembers => {
            allMembers.forEach(doc => { // Iterate through each document
                var docID = doc.id;               // Get the unique ID of the document
                var reminderNo = doc.data().reminder_no;  // Get the "reminder_no" key
                var userNo = doc.data().user_no;  // Get the "user_no" key
                var isManager = doc.data().reminder_manager === "Y" ? "Manager" : "Member";  // Get the "reminder_manager" value
                var createDate = doc.data().reminder_member_create_date.toDate();  // Get the creation date and convert to a JavaScript Date object'

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
});
}

// Call the function to display reminder members
displayReminderMembers();

function selectReminder(collection) {
    let reminderTemplate = document.getElementById("reminderTemplate");
    var auth = firebase.auth();
    
    auth.onAuthStateChanged((user) => {
        if(user) {
            db.collection(collection)
            .orderBy("reminder_create_date", "desc")
            .onSnapshot((snapshot) => {
                const reminderContainer = document.getElementById(collection + "-go-here");
                    reminderContainer.innerHTML = '';

                snapshot.forEach((doc => {
                    if(doc.data().user_no == user.uid) {
                        if(doc.data().reminder_delete_fg == 'N') {
                            var docId = doc.id;
                            var reminderTitle = doc.data().reminder_title;
                            var reminderCreateDate = doc.data().reminder_create_date;
                            let newReminder = reminderTemplate.content.cloneNode(true);

                            newReminder.querySelector('.reminder-title').innerHTML = "<a>" + reminderTitle + "</a>";
                            newReminder.querySelector('.reminder-create-date').innerHTML = reminderCreateDate.toDate();
                            newReminder.querySelector('a').href = "/reminder?docID="+docId;
                            document.getElementById(collection + "-go-here").appendChild(newReminder);
                        }                    
                    }
                }))
            }) 
        }
    })    
}
selectReminder("reminder");

console.log("test");
// Function to add new task list members to Firestore
function writeGroupList() {
    var groupListRef = db.collection("Group");

    groupListRef.add({
        group_no: "G001",                  // Unique identifier for the group
        user_no: "U001",                   // The user assigned to the group
        group_member_create_date: firebase.firestore.FieldValue.serverTimestamp(),  // Current timestamp
        group_manager: "Y",                 // Manager flag (Y/N)
        group_member_delete_fg: "N",        // Default to not deleted (N)
        status: "active"                    // Set status as active
    });

    groupListRef.add({
        group_no: "G002",                  
        user_no: "U002",                  
        group_member_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        group_manager: "N",                 
        group_member_delete_fg: "N",
        status: "active"                    // Set status as active
    });

    groupListRef.add({
        group_no: "G003",                  
        user_no: "U003",                  
        group_member_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        group_manager: "Y",                 
        group_member_delete_fg: "N",
        status: "archived"                  // Set status as archived
    });

    groupListRef.add({
        group_no: "G004",                  
        user_no: "U004",                  
        group_member_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        group_manager: "N",                 
        group_member_delete_fg: "N",
        status: "active"                    // Set status as active
    });

    groupListRef.add({
        group_no: "G005",                  
        user_no: "U005",                  
        group_member_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        group_manager: "Y",                 
        group_member_delete_fg: "N",
        status: "archived"                  // Set status as archived
    });

    groupListRef.add({
        group_no: "G006",                  
        user_no: "U006",                  
        group_member_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        group_manager: "N",                 
        group_member_delete_fg: "N",
        status: "active"                    // Set status as active
    });
}

function selectGroupList(collection, statusFilter = 'active') {
    let groupTemplate = document.getElementById("grouplistTemplate");
    var auth = firebase.auth();

    auth.onAuthStateChanged((user) => {
        if(user) {
            db.collection(collection)
            .where("status", "==", statusFilter) // Filter groups based on status
            .orderBy("group_create_date", "desc")
            .onSnapshot((snapshot) => {
                const groupContainer = document.getElementById("groups-go-here");
                groupContainer.innerHTML = '';

                snapshot.forEach((doc) => {
                    if(doc.data().members.includes(user.uid)) {
                        let docId = doc.id;
                        let groupName = doc.data().group_name;
                        let groupCreateDate = doc.data().group_create_date;
                        let newGroup = groupTemplate.content.cloneNode(true);

                        newGroup.querySelector('.group-list').innerHTML = `<a>${groupName}</a>`;
                        newGroup.querySelector('.group-create-date').innerHTML = groupCreateDate.toDate().toLocaleDateString();
                        newGroup.querySelector('a').href = `/group-details.html?docID=${docId}`;
                        groupContainer.appendChild(newGroup);
                    }
                });
            });
        }
    });
}

// Function to read the quote of the day from the Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name
function readQuote(day) {
    db.collection("quotes").doc(day)                                                         //name of the collection and documents should matach excatly with what you have in Firestore
        .onSnapshot(dayDoc => {                                                              //arrow notation
            console.log("current document data: " + dayDoc.data());                          //.data() returns data object
            document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;      //using javascript to display the data on the right place

            //Here are other ways to access key-value data fields
            //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
            //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
            //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;

        }, (error) => {
            console.log ("Error calling onSnapshot", error);
        });
    }
 readQuote("tuesday");        //calling the function