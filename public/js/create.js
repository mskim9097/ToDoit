document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "/login";
            return;
        }

        // Create Group Button Handler
        document.getElementById("createGroupButton").addEventListener("click", async function(e) {
            e.preventDefault();
            
            const createBtn = e.target;
            const groupName = document.getElementById("groupName").value.trim();
            const selectedImage = document.querySelector('input[name="groupImage"]:checked')?.value;
            const customImageFile = document.getElementById("customImageUpload").files[0];

            if (!groupName) {
                alert("Please enter a group name");
                return;
            }

            try {
                // UI Feedback
                createBtn.disabled = true;
                createBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Creating...';

                // Handle image upload
                let imageUrl = selectedImage || "/img/default.jpg";
                if (customImageFile) {
                    const storageRef = firebase.storage().ref();
                    const fileRef = storageRef.child(`group_images/${user.uid}/${Date.now()}_${customImageFile.name}`);
                    await fileRef.put(customImageFile);
                    imageUrl = await fileRef.getDownloadURL();
                }

                // Create group document
                await db.collection("Group").add({
                    group_name: groupName,
                    group_image: imageUrl,
                    group_delete_fg: "N",
                    group_create_date: firebase.firestore.FieldValue.serverTimestamp(),
                    created_by: user.uid,
                    members: [user.uid],
                    admins: [user.uid],
                    member_count: 1
                });

                // Reset form
                document.getElementById("createGroupForm").reset();
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('groupModal'));
                if (modal) modal.hide();

            } catch (error) {
                console.error("Group creation error:", error);
                alert(`Failed to create group: ${error.message}`);
            } finally {
                createBtn.disabled = false;
                createBtn.innerHTML = "Create Group";
            }
        });

        // Image Upload Button
        document.getElementById("uploadImageButton").addEventListener("click", function() {
            document.getElementById("customImageUpload").click();
        });
    });
});