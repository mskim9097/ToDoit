document.querySelector("createGroupButton").addEventListener("click", function () {
  var groupRef = db.collection("groups");
  var auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    if (user) {
      groupRef
        .add({
          group_name: document.getElementById("groupName").value,
          group_cover: document.getElementById("groupCover").files[0]
            ? document.getElementById("groupCover").files[0].name
            : "", // Handle file upload
          group_privacy: document.getElementById("groupPrivacy").value,
          group_roles: document.getElementById("groupRoles").value,
          group_color: document.getElementById("groupColor").value,
          group_description: document.getElementById("groupDescription").value,
          group_create_date: firebase.firestore.FieldValue.serverTimestamp(), // Create timestamp
          user_no: user.uid, // Use the authenticated user's ID
        })
        .then((docRef) => {
          window.location.href = "/group?docID=" + docRef.id;
        })
        .catch((error) => {
          console.error("failed creating reminder");
        });
    }
  });
});
