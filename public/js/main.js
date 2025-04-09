//Global variable pointing to the current user's Firestore document
var currentUser;

//Function that calls everything needed for the main page
function doAll() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = db.collection("user").doc(user.uid); //global

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
        } else {
            // No user is signed in.
            alert("Please sign in.");
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
            document.getElementById("quote-goes-here").innerHTML = doc.data().quote;
        });
}
// Comment out the next line (we will call this function from doAll())
// readQuote("tuesday");

// Insert name function using the global variable "currentUser"
function insertNameFromFirestore() {
    currentUser.get().then((userDoc) => {
        if (userDoc.exists) {  // Add this check
            const userData = userDoc.data();
            const userName = userData?.name || "User";  // Safe access with fallback
            $("#name-goes-here").text(userName);
        } else {
            console.log("No user document found");
            $("#name-goes-here").text("User");
        }
    });
}
// Comment out the next line (we will call this function from doAll())
// insertNameFromFirestore();

function getNameFromAuth() {
    firebase.auth().onAuthStateChanged((user) => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here:
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

let unsubscribeGroups = null;

function selectGroupList(collection) {
    // Clean up previous listener
    if (unsubscribeGroups) {
        unsubscribeGroups();
    }

    const groupTemplate = document.getElementById("grouplistTemplate");
    if (!groupTemplate) return;

    const user = firebase.auth().currentUser;
    if (!user) return;

    // Show loading state
    document.getElementById("group-go-here").innerHTML =
        '<div class="text-center py-5"><div class="spinner-border"></div><p>Loading groups...</p></div>';

    // Set up real-time listener
    unsubscribeGroups = db.collection(collection)
        .where("members", "array-contains", user.uid)
        .where("group_delete_fg", "==", "N")
        .onSnapshot((snapshot) => {
            const groupContainer = document.getElementById("group-go-here");
            groupContainer.innerHTML = "";

            if (snapshot.empty) {
                groupContainer.innerHTML = '<p class="text-center py-5">No groups found</p>';
                return;
            }

            // Process groups
            const groups = [];
            snapshot.forEach(doc => {
                groups.push({
                    id: doc.id,
                    data: doc.data(),
                    timestamp: doc.data().group_create_date?.toMillis() || 0
                });
            });

            // Sort by newest first
            groups.sort((a, b) => b.timestamp - a.timestamp);

            // Render groups
            groups.forEach(group => {
                const newGroup = groupTemplate.content.cloneNode(true);

                // Set group data
                newGroup.querySelector(".card-title").textContent = group.data.group_name || "Unnamed Group";
                newGroup.querySelector(".card-length").textContent = `Members: ${group.data.members?.length || 0}`;
                newGroup.querySelector("a").href = `group.html?docID=${group.id}`;
                newGroup.querySelector(".card-img-top").src = group.data.group_image || "/img/default.jpg";

                // Configure delete button
                const deleteBtn = newGroup.querySelector(".delete-group");
                deleteBtn.dataset.groupId = group.id;

                // Only show for managers/admins
                const isManager = group.data.created_by === user.uid ||
                    (group.data.admins && group.data.admins.includes(user.uid));
                deleteBtn.style.display = isManager ? 'block' : 'none';

                groupContainer.appendChild(newGroup);
            });

            // Set up fresh delete handlers
            setupDeleteHandlers();
            setupEditHandlers(); // Set up edit handlers for each group card
        });
}

// Clean up listener when leaving page
window.addEventListener('beforeunload', function () {
    if (unsubscribeGroups) {
        unsubscribeGroups();
    }
});

// Global variable to track delete state
let isDeleting = false;

function setupDeleteHandlers() {
    // Remove any existing click listeners on the document
    document.removeEventListener('click', handleDeleteClick);

    // Add fresh event delegation
    document.addEventListener('click', handleDeleteClick);
}

// Single delegated handler for all delete buttons
async function handleDeleteClick(e) {
    // Check if we're already processing a deletion
    if (isDeleting) return;

    // Find the closest delete button (works with icon clicks too)
    const deleteBtn = e.target.closest('.delete-group');
    if (!deleteBtn) return;

    const groupId = deleteBtn.dataset.groupId;
    const groupCard = deleteBtn.closest('.col');

    if (!confirm("Are you sure you want to delete this group?")) return;

    try {
        // Set deleting state
        isDeleting = true;

        // Visual feedback
        deleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        deleteBtn.disabled = true;
        groupCard.style.opacity = '0.5';

        // Perform deletion
        await db.collection("Group").doc(groupId).update({
            group_delete_fg: "Y",
            last_updated: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Optimistic removal
        groupCard.style.transition = 'opacity 0.3s';
        groupCard.style.opacity = '0';
        setTimeout(() => groupCard.remove(), 300);

    } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete group. Please try again.");

        // Reset UI
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.disabled = false;
        groupCard.style.opacity = '1';
    } finally {
        isDeleting = false;
    }
}

// Global variable to track which group is being edited
let currentEditingGroupId = null;

function setupEditHandlers() {
    // Click handler for group cards (opens modal)
    document.addEventListener('click', function (e) {
        const card = e.target.closest('.card');
        if (!card) return;

        // Don't open if clicking on delete button or links
        if (e.target.closest('.delete-group') || e.target.closest('a')) {
            return;
        }

        const deleteBtn = card.querySelector('.delete-group');
        if (!deleteBtn) return;

        currentEditingGroupId = deleteBtn.dataset.groupId;
        const groupName = card.querySelector('.card-title').textContent;
        const groupImage = card.querySelector('.card-img-top').src;

        // Populate modal fields
        document.getElementById('editGroupName').value = groupName;
        const previewImg = document.getElementById('editGroupImagePreview');
        previewImg.src = groupImage;

        // Reset file input
        document.getElementById('editGroupImageInput').value = '';
        document.getElementById('editGroupImageBtn').innerHTML =
            '<i class="bi bi-upload me-2"></i>Change Image';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editGroupModal'));
        modal.show();
    });

    // Image upload button handler
    document.getElementById('editGroupImageBtn').addEventListener('click', function () {
        document.getElementById('editGroupImageInput').click();
    });

    // Image preview handler
    document.getElementById('editGroupImageInput').addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                document.getElementById('editGroupImagePreview').src = event.target.result;
                document.getElementById('editGroupImageBtn').innerHTML =
                    '<i class="bi bi-check-circle me-2"></i>Image Selected';
            };
            reader.readAsDataURL(file);
        }
    });

    // Save changes handler
    document.getElementById('saveGroupChanges').addEventListener('click', async function () {
        const saveBtn = document.getElementById('saveGroupChanges');
        const saveText = document.getElementById('saveButtonText');
        const spinner = document.getElementById('saveButtonSpinner');

        const newName = document.getElementById('editGroupName').value.trim();
        const imageFile = document.getElementById('editGroupImageInput').files[0];

        if (!newName) {
            alert("Please enter a group name");
            return;
        }

        try {
            // Show loading state
            saveBtn.disabled = true;
            saveText.textContent = "Saving...";
            spinner.classList.remove('d-none');

            const updateData = { group_name: newName };

            // Handle image upload if new image was selected
            if (imageFile) {
                const user = firebase.auth().currentUser;
                const storageRef = firebase.storage().ref();
                const fileRef = storageRef.child(`group_images/${user.uid}/${Date.now()}_${imageFile.name}`);
                await fileRef.put(imageFile);
                updateData.group_image = await fileRef.getDownloadURL();
            }

            // Update Firestore document
            await db.collection("Group").doc(currentEditingGroupId).update(updateData);

            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('editGroupModal')).hide();

        } catch (error) {
            console.error("Error updating group:", error);
            alert("Failed to update group. Please try again.");
        } finally {
            // Reset button state
            saveBtn.disabled = false;
            saveText.textContent = "Save Changes";
            spinner.classList.add('d-none');
        }
    });
}

// Filter groups as the user types in the search bar

document.getElementById("searchInput").addEventListener("input", function () {
    let query = this.value.toLowerCase();
    let groups = document.querySelectorAll("#group-go-here .col");

    groups.forEach((group) => {
        let title = group.querySelector(".card-title").textContent.toLowerCase();
        group.style.display = title.includes(query) ? "block" : "none";
    });
    
});
