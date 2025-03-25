document.querySelector("#createGroupButton").addEventListener("click", function () {
    var groupRef = db.collection("Group");
    var auth = firebase.auth();
    var storageRef = firebase.storage().ref();

    auth.onAuthStateChanged((user) => {
        if (user) {
            const groupName = document.getElementById("groupName").value;
            const groupPrivacy = document.getElementById("groupPrivacy").value;
            const selectedImage = document.querySelector('input[name="groupImage"]:checked')?.value;
            const customImageFile = document.getElementById("customImageUpload").files[0];

            let imageUrl = selectedImage || "/img/default.jpg"; // Default image if none is selected

            // If a custom image is uploaded, upload it to Firebase Storage
            if (customImageFile) {
                const fileRef = storageRef.child(`group_images/${customImageFile.name}`);
                fileRef.put(customImageFile).then((snapshot) => {
                    return snapshot.ref.getDownloadURL(); // Get the download URL of the uploaded image
                }).then((downloadURL) => {
                    imageUrl = downloadURL; // Use the uploaded image URL
                    createGroup(groupRef, user.uid, groupName, groupPrivacy, imageUrl); // Create the group with the uploaded image
                }).catch((error) => {
                    console.error("Error uploading image:", error);
                });
            } else {
                // If no custom image is uploaded, use the selected predefined image
                createGroup(groupRef, user.uid, groupName, groupPrivacy, imageUrl);
            }
        }
    });
});

function createGroup(groupRef, userId, groupName, groupPrivacy, imageUrl) {
    groupRef
        .add({
            group_name: groupName,
            group_privacy: groupPrivacy,
            group_image: imageUrl, // Store the image URL
            group_create_date: firebase.firestore.FieldValue.serverTimestamp(),
            user_no: userId,
        })
        .then(function (docRef) {
            console.log("Document written with ID:", docRef.id);
            console.log("Group created successfully:", docRef);

            window.location.href = `/group?docID=${docRef.id}&groupName=${encodeURIComponent(groupName)}`;
        })
        .catch(function (error) {
            console.error("Failed creating group:", error);
        });
}

// Trigger file input when the upload button is clicked
document.getElementById("uploadImageButton").addEventListener("click", function () {
    document.getElementById("customImageUpload").click();
});