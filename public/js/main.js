//Global variable pointing to the current user's Firestore document
var currentUser;

//Function that calls everything needed for the main page
function doAll() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid); //global
      console.log(currentUser);

      // figure out what day of the week it is today
      const weekday = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const d = new Date();
      let day = weekday[d.getDay()];

      // the following functions are always called when someone is logged in
      readQuote(day);
      insertNameFromFirestore();
      selectGroupList("Group");
      selectReminder("reminder");
      displayReminderMembers("reminder_member");
    } else {
      // No user is signed in.
      console.log("No user is signed in");
      window.location.href = "login.html";
    }
  });
}
doAll();

// displays the quote based in input param string "tuesday", "monday", etc.
function readQuote(day) {
  db.collection("quote")
    .doc(day)
    .onSnapshot((doc) => {
      console.log("inside");
      console.log(doc.data());
      document.getElementById("quote-goes-here").innerHTML = doc.data().quote;
    });
}
// Comment out the next line (we will call this function from doAll())
// readQuote("tuesday");

// Insert name function using the global variable "currentUser"
function insertNameFromFirestore() {
  currentUser.get().then((userDoc) => {
    //get the user name
    var user_Name = userDoc.data().name;
    console.log(user_Name);
    $("#name-goes-here").text(user_Name); //jquery
    // document.getElementByID("name-goes-here").innetText=user_Name;
  });
}
// Comment out the next line (we will call this function from doAll())
// insertNameFromFirestore();

function getNameFromAuth() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      // Do something for the currently logged-in user here:
      console.log(user.uid); //print the uid in the browser console
      console.log(user.displayName); //print the user name in the browser console
      userName = user.displayName;

      //method #1:  insert with JS
      document.getElementById("name-goes-here").innerText = userName;

      //method #2:  insert using jquery
      //$("#name-goes-here").text(userName); //using jquery

      //method #3:  insert using querySelector
      //document.querySelector("#name-goes-here").innerText = userName
    } else {
      // No user is signed in.
      console.log("No user is logged in");
    }
  });
}
getNameFromAuth(); //run the function

// Function to display reminder members dynamically
function displayReminderMembers(collection) {
  let reminderTemplate = document.getElementById("reminderCardTemplate"); // Retrieve the HTML element with the ID "reminderCardTemplate"
  var auth = firebase.auth();
  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection("reminder_member")
        .get() // The collection called "reminder_member"
        .then((allMembers) => {
          allMembers.forEach((doc) => {
            // Iterate through each document
            var docID = doc.id; // Get the unique ID of the document
            var reminderNo = doc.data().reminder_no; // Get the "reminder_no" key
            var userNo = doc.data().user_no; // Get the "user_no" key
            var isManager =
              doc.data().reminder_manager === "Y" ? "Manager" : "Member"; // Get the "reminder_manager" value
            var createDate = doc.data().reminder_member_create_date.toDate(); // Get the creation date and convert to a JavaScript Date object'

            let newCard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card that will be filled with Firestore data

            // Update the card with data from Firestore
            newCard.querySelector(
              ".reminder-title"
            ).innerHTML = `Reminder #${reminderNo}`;
            newCard.querySelector(
              ".reminder-user"
            ).innerHTML = `User #${userNo}`;
            newCard.querySelector(
              ".reminder-manager"
            ).innerHTML = `Role: ${isManager}`;
            newCard.querySelector(
              ".reminder-date"
            ).innerHTML = `Created on: ${createDate.toLocaleDateString()}`;

            // Append the new card to the display container
            document.getElementById("reminder-list").appendChild(newCard);
          });
        })
        .catch((error) => {
          console.error("Error retrieving reminder members:", error);
        });
    }
  });
}

// Call the function to display reminder members
//displayReminderMembers();

function selectReminder(collection) {
  let reminderTemplate = document.getElementById("reminderTemplate");
  var auth = firebase.auth();
  var colors = ["primary", "secondary", "success", "danger", "warning", "info"];
  var colorCount = 0;

  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection(collection)
        .orderBy("reminder_create_date", "desc")
        .onSnapshot((snapshot) => {
          const reminderContainer = document.getElementById(
            collection + "-go-here"
          );
          reminderContainer.innerHTML = "";

          snapshot.forEach((doc) => {
            if (doc.data().user_no == user.uid) {
              if (doc.data().reminder_delete_fg == "N") {
                var docId = doc.id;
                var reminderTitle = doc.data().reminder_title;
                let newReminder = reminderTemplate.content.cloneNode(true);

                newReminder.querySelector(".reminder-title").innerHTML =
                  reminderTitle;
                newReminder.querySelector(".reminder-title").href =
                  "/reminder?docID=" + docId;
                newReminder
                  .querySelector(".reminder-title")
                  .classList.add(
                    "list-group-item-" + colors[colorCount % colors.length]
                  );
                document
                  .getElementById(collection + "-go-here")
                  .appendChild(newReminder);

                colorCount++;
              }
            }
          });
        });
    }
  });
}
selectReminder("reminder");

function selectGroupList(collection) {
  let groupTemplate = document.getElementById("grouplistTemplate");
  var auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection(collection)
        .orderBy("group_create_date", "desc")
        .onSnapshot((snapshot) => {
          const groupContainer = document.getElementById("group-go-here");
          groupContainer.innerHTML = "";

          snapshot.forEach((doc) => {
            let data = doc.data();
            let docId = doc.id;
            let groupName = data.group_name || "Unnamed Group";
            let memberCount = data.members ? data.members.length : 0;
            let groupPrivacy = data.group_privacy === "public" ? "Public Group" : "Private Group";
            let groupImage = data.group_image || "/img/default.avif"; // Use default image if none is selected

            // Clone the template
            let newGroup = groupTemplate.content.cloneNode(true);
            newGroup.querySelector(".card-title").textContent = groupName;
            newGroup.querySelector(".card-length").textContent = `Members: ${memberCount}`;
            newGroup.querySelector(".card-text").textContent = groupPrivacy;
            newGroup.querySelector("a").href = `/group?docID=${docId}`;
            newGroup.querySelector(".card-img-top").src = groupImage; // Set the group image

            // Append the new group card to the container
            groupContainer.appendChild(newGroup);
          });
        }, (error) => {
          console.error("Error fetching groups:", error);
        });
    } else {
      console.log("No user is signed in.");
    }
  });
}

// Call the function to display groups
//selectGroupList("Group");


// // Function to read the quote of the day from the Firestore "quotes" collection
// // Input param is the String representing the day of the week, aka, the document name
// function readQuote(day) {
//     db.collection("quotes").doc(day)                                                         //name of the collection and documents should matach excatly with what you have in Firestore
//         .onSnapshot(dayDoc => {                                                              //arrow notation
//             console.log("current document data: " + dayDoc.data());                          //.data() returns data object
//             document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;      //using javascript to display the data on the right place

//             //Here are other ways to access key-value data fields
//             //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
//             //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
//             //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;

//         }, (error) => {
//             console.log ("Error calling onSnapshot", error);
//         });
//     }
// //  readQuote("tuesday");        //calling the function

// Mock data

// Filter groups as the user types in the search bar
document.getElementById("searchInput").addEventListener("input", function () {
  let query = this.value.toLowerCase();
  let groups = document.querySelectorAll("#group-go-here .col");

  groups.forEach((group) => {
    let title = group.querySelector(".card-title").textContent.toLowerCase();
    group.style.display = title.includes(query) ? "block" : "none";
  });
});
