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

document.querySelectorAll("#archivedGroups").addEventListener("click", function(e) {
    console.log(e.target);
})

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
    var colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
    var colorCount = 0;

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
                            let newReminder = reminderTemplate.content.cloneNode(true);

                            newReminder.querySelector('.reminder-title').innerHTML = reminderTitle;
                            newReminder.querySelector('.reminder-title').href = "/reminder?docID="+docId;
                            newReminder.querySelector('.reminder-title').classList.add('list-group-item-' + colors[colorCount % colors.length]);
                            document.getElementById(collection + "-go-here").appendChild(newReminder);

                            colorCount++;
                        }                    
                    }
                }))
            }) 
        }
    })    
}
selectReminder("reminder");



function selectGroupList(collection, statusFilter = 'active') {
    let groupTemplate = document.getElementById("grouplistTemplate");
    var auth = firebase.auth();

    auth.onAuthStateChanged((user) => {
        if (user) {
            db.collection(collection)
                .where("status", "==", statusFilter) // Filter groups based on status
                .orderBy("group_create_date", "desc")
                .onSnapshot((snapshot) => {
                    const groupContainer = document.getElementById("groups-go-here");
                    groupContainer.innerHTML = ''; // Clear the existing list before appending new data

                    snapshot.forEach((doc) => {
                        if (doc.data().members.includes(user.uid)) { // Check if the user is a member
                            let docId = doc.id;
                            let groupName = doc.data().group_name;
                            let groupCreateDate = doc.data().group_create_date;
                            let newGroup = groupTemplate.content.cloneNode(true);

                            // Populate the new group card with data from Firestore
                            newGroup.querySelector('.group-list').innerHTML = `<a>${groupName}</a>`;
                            newGroup.querySelector('.group-create-date').innerHTML = groupCreateDate.toDate().toLocaleDateString();
                            newGroup.querySelector('a').href = `/group-details.html?docID=${docId}`;

                            // Append the new group to the container
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


 