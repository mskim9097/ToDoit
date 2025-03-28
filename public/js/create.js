firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.querySelector("#createGroupButton").addEventListener("click", function (e) {
            e.preventDefault(); // Prevent default form behavior
            
            const groupName = document.getElementById("groupName").value.trim();
            const selectedImage = document.querySelector('input[name="groupImage"]:checked')?.value;
            const customImageFile = document.getElementById("customImageUpload").files[0];
            
            // Validate group name
            if (!groupName) {
                alert("Please enter a group name");
                return;
            }

            let imageUrl = selectedImage || "/img/default.jpg";
            const groupRef = db.collection("Group");
            const storageRef = firebase.storage().ref();

            // Handle image upload if exists
            const createGroupWithImage = (imageUrl) => {
                groupRef.add({
                    group_name: groupName,
                    group_image: imageUrl,
                    group_create_date: firebase.firestore.FieldValue.serverTimestamp(),
                    created_by: user.uid,
                    members: [user.uid], // Add creator as first member
                    member_count: 1 // Track member count
                })
                .then((docRef) => {
                    console.log("Group created with ID:", docRef.id);
                    
                    // Close modal
                    bootstrap.Modal.getInstance(document.getElementById('groupModal')).hide();
                    
                    // Reset form
                    document.getElementById("createGroupForm").reset();
                    
                    // Refresh group list (assuming you have this function)
                    if (typeof selectGroupList === 'function') {
                        selectGroupList("Group");
                    }
                })
                .catch((error) => {
                    console.error("Error creating group:", error);
                    alert("Failed to create group. Please try again.");
                });
            };

            if (customImageFile) {
                const fileRef = storageRef.child(`group_images/${user.uid}/${Date.now()}_${customImageFile.name}`);
                fileRef.put(customImageFile)
                    .then((snapshot) => snapshot.ref.getDownloadURL())
                    .then((downloadURL) => createGroupWithImage(downloadURL))
                    .catch((error) => {
                        console.error("Error uploading image:", error);
                        alert("Failed to upload image. Using default image.");
                        createGroupWithImage("/img/default.jpg");
                    });
            } else {
                createGroupWithImage(imageUrl);
            }
        });

        // Trigger file input when upload button is clicked
        document.getElementById("uploadImageButton").addEventListener("click", function () {
            document.getElementById("customImageUpload").click();
        });
    } else {
        alert("Session expired. Please login again.");
        window.location.href = "/";
    }
});