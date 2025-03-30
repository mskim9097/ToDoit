function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            function addItem() {
                let itemList = document.getElementById("itemList");
                let li = document.createElement("li");
                li.innerHTML = '<input type="radio"> New Item';
                itemList.appendChild(li);
            }

            // writeaddItem();

            // Function to get query parameters from the URL
            function getQueryParam(param) {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get(param);
            }

            // Function to fetch and display group details
            function getGroupDetails() {
                const docID = getQueryParam("docID");
                if (docID) {
                    db.collection("Group")
                        .doc(docID)
                        .get()
                        .then((doc) => {
                            if (doc.exists) {
                                const groupData = doc.data(); // Define groupData here

                                // Display group name
                                document.getElementById("group-name").innerText = groupData.group_name;

                                // Display group image
                                const groupImage = document.getElementById("group-image");
                                if (groupData.group_image) {
                                    groupImage.src = groupData.group_image;
                                } else {
                                    groupImage.src = "/img/default.avif"; // Fallback image
                                }
                            } else {
                                console.log("No such document!"); // 
                            }
                        })
                        .catch((error) => {
                            console.error("Error getting document:", error);
                        });
                } else {
                    console.log("No docID found in URL");
                }
            }

            // Call the function to fetch and display group details
            getGroupDetails();

            getGroupDetails(); // Fetch additional group details from Firestore



            // Get query param from URL
            function getQueryParam(param) {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get(param);
            }

            // Fetch and display group details
            function getGroupDetails() {
                const docID = getQueryParam("docID");
                if (docID) {
                    db.collection("Group")
                        .doc(docID)
                        .get()
                        .then((doc) => {
                            if (doc.exists) {
                                const groupData = doc.data();

                                document.getElementById("group-name").innerText = groupData.group_name;

                                const groupImage = document.getElementById("group-image");
                                groupImage.src = groupData.group_image || "/img/default.avif";
                            } else {
                                console.log("No such document!");
                            }
                        })
                        .catch((error) => {
                            console.error("Error getting document:", error);
                        });
                } else {
                    console.log("No docID found in URL");
                }
            }

            //   // Display an activity in the DOM
            //   function addActivityToDOM(activity) {
            //       const li = document.createElement("li");
            //       li.className = "activity";

            //       const checkbox = document.createElement("input");
            //       checkbox.type = "checkbox";
            //       checkbox.checked = activity.done;

            //       const span = document.createElement("span");
            //       span.textContent = activity.text;
            //       if (activity.done) span.style.textDecoration = "line-through";

            //       checkbox.addEventListener("change", () => {
            //           span.style.textDecoration = checkbox.checked ? "line-through" : "none";
            //           // Optional: update Firestore if needed
            //       });

            //       li.appendChild(checkbox);
            //       li.appendChild(document.createTextNode(" "));
            //       li.appendChild(span);
            //       document.getElementById("activity-list").appendChild(li);
            //   }

            //   // Add activity to Firestore and UI
            //   function addActivity() {
            //       const input = document.getElementById("new-activity");
            //       const text = input.value.trim();
            //       if (text === "") return;

            //       const docID = getQueryParam("docID");
            //       if (!docID) {
            //           console.error("No group docID found in URL.");
            //           return;
            //       }

            //       const activityObj = {
            //           text: text,
            //           done: false,
            //           createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            //           createdBy: firebase.auth().currentUser?.uid || "anonymous"
            //       };

            db.collection("Group")
                .doc(docID)
                .collection("activities")// change to task subcollection
                .add(activityObj)
                .then(() => {
                    console.log("Activity added to Firestore!");
                    addActivityToDOM(activityObj);
                    input.value = "";
                })
                .catch((error) => {
                    console.error("Error adding activity:", error);
                });
        }

        // Load activities from Firestore
        function loadActivitiesFromFirestore() {
            const docID = getQueryParam("docID");
            if (!docID) return;

            db.collection("Group")
                .doc(docID)
                .collection("activities")
                .orderBy("createdAt")
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const activity = doc.data();
                        addActivityToDOM(activity);
                    });
                })
                .catch((error) => {
                    console.error("Error loading activities:", error);
                });
        }

        // On page load
        window.onload = () => {
            getGroupDetails();
            loadActivitiesFromFirestore();
        };
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        location.href = "/";
    }
});