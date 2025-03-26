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




const params = new URLSearchParams(window.location.search);
const groupName = params.get("group") || "Unnamed Group";
document.getElementById("group-name").textContent = groupName;

const storageKey = `activities_${groupName}`;
const activityList = document.getElementById("activity-list");

// Load saved activities on page load
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
  saved.forEach((item, index) => addActivityToDOM(item, index));
};

function addActivity() {
  const input = document.getElementById("new-activity");
  const text = input.value.trim();
  if (text === "") return;

  const activityObj = { text: text, done: false };
  const activities = JSON.parse(localStorage.getItem(storageKey)) || [];
  activities.push(activityObj);
  localStorage.setItem(storageKey, JSON.stringify(activities));

  addActivityToDOM(activityObj, activities.length - 1);
  input.value = "";
}

function addActivityToDOM(activity, index) {
  const li = document.createElement("li");
  li.className = "activity";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = activity.done;

  const span = document.createElement("span");
  span.textContent = activity.text;
  if (activity.done) span.style.textDecoration = "line-through";

  // When checkbox changes, update localStorage and UI
  checkbox.addEventListener("change", () => {
    const activities = JSON.parse(localStorage.getItem(storageKey)) || [];
    activities[index].done = checkbox.checked;
    localStorage.setItem(storageKey, JSON.stringify(activities));

    span.style.textDecoration = checkbox.checked ? "line-through" : "none";
  });

  li.appendChild(checkbox);
  li.appendChild(document.createTextNode(" "));
  li.appendChild(span);
  activityList.appendChild(li);
}

          

          
        




