

function addGroupMember() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const groupID = urlParams.get('groupID');
    console.log(email);

    db.collection("user")
        .where("email", "==", email)
        .onSnapshot((snapshot) => {
            snapshot.forEach(doc => {
                var docID = doc.id;
                var groupRef = db.collection("Group").doc(groupID);

                groupRef.get().then((groupDoc) => {
                    var memberCount = groupDoc.data().member_count;

                    groupRef.update({
                        member_count: memberCount + 1
                    }).then(() => {
                        return groupRef.update({
                            members: firebase.firestore.FieldValue.arrayUnion(docID),
                        });
                    }).then(() => {
                        firebase.auth().onAuthStateChanged(user => {
                            if(user) {
                                window.location.href = "group.html?docID=" + groupID; 
                            } else {
                                window.location.href = "/";
                            }
                        })
                    }).catch((error) => {
                        console.error("Error updating group: ", error);
                    });
                });
            });
        });
};
addGroupMember();
/*
    var reminderMemberRef = db.collection("reminder_member");
    reminderMemberRef.add({
        reminder_manager: "N",
        reminder_member_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        reminder_delete_fg: "N",
        reminder_no: groupID,


    })
  */
/*
document.querySelector(".reminder-btn").addEventListener("click", function() {
    var reminderRef = db.collection("reminder");
    var auth = firebase.auth();

    auth.onAuthStateChanged((user) => {
        if(user) {
            reminderRef.add({
                reminder_title: document.getElementById("reminder-title").value,
                reminder_create_date: firebase.firestore.FieldValue.serverTimestamp(),
                reminder_delete_fg: "N",
                user_no: user.uid
            }).then((docRef) => {
                window.location.href = "/reminder?docID=" + docRef.id; 
            }).catch ((error) => {
            console.error("failed creating reminder");
            });
        }
    });
});*/