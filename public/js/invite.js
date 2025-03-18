

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
                var reminderMemberRef = db.collection("reminder_member");
                reminderMemberRef.add({
                    reminder_manager: "N",
                    reminder_member_create_date: firebase.firestore.FieldValue.serverTimestamp(),
                    reminder_delete_fg: "N",
                    reminder_no: groupID,
                    user_no: docID
                })
            });
        })
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