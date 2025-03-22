firebase.auth().onAuthStateChanged(user => {
    if(user) {
        currentUser = db.collection("user").doc(user.uid);
        var notificationSwitch = document.querySelector(".form-check-input");
        var alertTime = document.querySelector(".form-select");
        notificationSwitch.addEventListener('change', function() {
            if(notificationSwitch.id == "flexSwitchCheckDefault") {
                notificationSwitch.id = "flexSwitchCheckChecked";
                notificationSwitch.nextElementSibling.setAttribute("for", "flexSwitchCheckChecked");
                notificationSwitch.checked = true;
                alertTime.disabled = false;
                setNotificationStatus(true);
            } else {
                notificationSwitch.id = "flexSwitchCheckDefault";
                notificationSwitch.nextElementSibling.setAttribute("for", "flexSwitchCheckDefault");
                notificationSwitch.checked = false;
                alertTime.disabled = true;
                setNotificationStatus(false);
            }
        })

        alertTime.addEventListener('change', function() {
            var selected = alertTime.value;
            setAlertTime(selected);
            if(selected != "none") {
                setNotification(currentUser);
            }
        })

        function setNotificationStatus(condition) {
            currentUser.update({
                notification_status: condition
            })
        }

        function setAlertTime(value) {
            if (value == "none") {
                value = null;
            }
            currentUser.update({
                alert_time: value
            })
        }
// WzNTfulCWxQwXn7LeIureKK1bSI2
        function setNotification() {
            db.collection("Group")
            .where("group_member", "array-contains", user.uid)
            .onSnapshot((snapshot) => {
                snapshot.forEach((group => {
                    var groupID = group.id;
                    var tasks = group.data().task;

                    tasks.forEach(task => {
                        console.log(task);
                        db.collection("task")
                        .orderBy("task_due_date", "desc")
                        .onSnapshot((snapshot) => {
                            snapshot.forEach(doc => {
                                var docID = doc.id;
                                if(docID == task) {
                                    if(doc.data().task_delete_fg == "N") {
                                        if(doc.data().task_status != "done") {
                                            console.log(doc.data().task_title);
                                            console.log(doc.data().task_due_date);
                                            var notificationRef = db.collection("notification");
                                            //if(notificationRef)
                                        }
                                    }
                                }
                            })
                        })
                        if(task.task_delete_fg == "N") {
                            if(task.data().task_status != "done") {
                            }
                        }
                    })
                }))
            })
        }
/*
        setInterval(function() {
            console.log("test");
        }, 5000);
*/




    } else {
        alert("session is out. please login again.");
        window.location.href = "/";
    }
});

/**
 * currentUser = db.collection("user").doc();
            //currentUser.update({
            db.colection("group")
            .where().onSnapshot((snapshot) => {

            })
 */














// test code
function writeTask() {
    var taskRef = db.collection("task");

    taskRef.add({
        task_title: "task3",
        task_summary: "summary",
        task_status: "done",
        task_due_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_delete_fg: "N"
    });
    taskRef.add({
        task_title: "task4",
        task_summary: "summary",
        task_status: "not started",
        task_due_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_delete_fg: "Y"
    });
    taskRef.add({
        task_title: "task5",
        task_summary: "summary",
        task_status: "not started",
        task_due_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_delete_fg: "N"
    });
    taskRef.add({
        task_title: "task6",
        task_summary: "summary",
        task_status: "not started",
        task_due_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_delete_fg: "N"
    });
    taskRef.add({
        task_title: "task7",
        task_summary: "summary",
        task_status: "done",
        task_due_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_delete_fg: "N"
    });
    taskRef.add({
        task_title: "task8",
        task_summary: "summary",
        task_status: "not started",
        task_due_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        task_delete_fg: "Y"
    });
}
function writeGroup() {
    // 1kag3DpEXWfzOwQ4e1kT
    // Ycn0FqJ9bBnHktyhk9o7
    // IDXgeTtBH4MgbtM6zPmV

    var groupRef = db.collection("Group");
    groupRef.add({
        group_name: "notification test group",
        group_manager: "WzNTfulCWxQwXn7LeIureKK1bSI2",
        group_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        group_delete_fg: "N",
        group_Member: firebase.firestore.FieldValue.arrayUnion("WzNTfulCWxQwXn7LeIureKK1bSI2"),
        task: firebase.firestore.FieldValue.arrayUnion("hzfJ4RrAmwVu3DxSEAJn", "6s8oW7XssLSZs3hjos0e", "wbgtCI6Al59PkoChEhHZ" ,"z7qo5EsotUQ7KVXPEVUR")
    });
}