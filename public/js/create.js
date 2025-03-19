document.querySelector("#createGroupButton").addEventListener("click", function () {
  var groupRef = db.collection("Group");
  var auth = firebase.auth();
  console.log("test");
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log(document.getElementById("groupName").value);
      groupRef
        .add({
          group_name: document.getElementById("groupName").value,
          group_privacy: document.getElementById("groupPrivacy").value,
          group_create_date: firebase.firestore.FieldValue.serverTimestamp(), // Create timestamp
          user_no: user.uid, // Use the authenticated user's ID
        })
        .then(() => {
          //window.location.href = "/group?docID=" + docRef.id;
        })
        .catch((error) => {
          console.error("failed creating reminder");
        });
        console.log(db.collection("Group").doc(groupRef.id));
        user.update({
          group: firebase.firestore.FieldValue.arrayUnion(groupRef.id)
        })
    }
  });
});
