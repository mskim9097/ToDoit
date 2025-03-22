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
                  group_create_date: firebase.firestore.FieldValue.serverTimestamp(),
                  user_no: user.uid
              })
              .then(function (docRef) { 
                  console.log("Document written with ID:", docRef.id);
                  console.log("Group created successfully:", docRef);

                  console.log("Document reference:", db.collection("Group").doc(docRef.id));

                  selectGroupList("Group");

                   console.log("Group created successfully:", docRef);

                  // Redirect user after creating the group (optional)
                  window.location.href = "/group?docID=" + docRef.id;
              })
              .catch(function (error) {
                  console.error("Failed creating reminder:", error);
              });
      }
  });
});
