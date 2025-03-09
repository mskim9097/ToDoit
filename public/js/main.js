function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method #1:  insert with JS
            document.getElementById("name-goes-here").innerText = userName;    

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
            console.log ("No user is logged in");
        }
    });
}
getNameFromAuth(); //run the function




























function selectReminder(collection) {
    let reminderTemplate = document.getElementById("reminderTemplate");
    var auth = firebase.auth();
    
    auth.onAuthStateChanged((user) => {
        if(user) {
            db.collection(collection)
            .orderBy("reminder_create_date", "desc").get()
            .then(allReminders => {
                allReminders.forEach(doc => {
                    if(doc.data().user_no == user.uid) {
                        if(doc.data().reminder_delete_fg == 'N') {
                            var docId = doc.id;
                            var reminderTitle = doc.data().reminder_title;
                            var reminderCreateDate = doc.data().reminder_create_date;
                            let newReminder = reminderTemplate.content.cloneNode(true);

                            newReminder.querySelector('.reminder-title').innerHTML = "<a>" + reminderTitle + "</a>";
                            newReminder.querySelector('.reminder-create-date').innerHTML = reminderCreateDate.toDate();
                            newReminder.querySelector('a').href = "/reminder?docID="+docId;
                            document.getElementById(collection + "-go-here").appendChild(newReminder);
                        }                    
                    }
                })
            })
        }
    })

    
}
selectReminder("reminder");