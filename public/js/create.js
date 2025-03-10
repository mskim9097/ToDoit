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
});