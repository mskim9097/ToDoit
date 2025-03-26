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




          // Get group name from URL
          const params = new URLSearchParams(window.location.search);
          const groupName = params.get("group") || "Unnamed Group";
          document.getElementById("group-name").textContent = groupName;
      
          // Function to add a new activity
          function addActivity() {
            const newActivityInput = document.getElementById("new-activity");
            const activityText = newActivityInput.value.trim();
      
            if (activityText === "") return;
      
            const li = document.createElement("li");
            li.className = "activity";
            li.innerHTML = `<input type="checkbox" /> ${activityText}`;
            
            const activityList = document.getElementById("activity-list");
            activityList.appendChild(li);
      
            // Clear input
            newActivityInput.value = "";
          }

          

          
        




