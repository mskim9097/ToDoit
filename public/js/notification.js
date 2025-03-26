// login check
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        var groupRef = db.collection("Group");
        var taskRef = db.collection("task");
        var notificationRef = db.collection("notification");
        currentUser = db.collection("user").doc(user.uid);

        // select user's document
        // execute 2 functions to select notification status and time
        currentUser.get()
            .then(userDoc => {
                let currentSwitch = userDoc.data().notification_status;
                let currentAlertTime = userDoc.data().alert_time;
                selectCurrentSwitch(currentSwitch);
                selectCurrentAlertTime(currentAlertTime);
            })

        var notificationSwitch = document.querySelector(".form-check-input");
        var alertTime = document.querySelector(".form-select");

        // select user's notification status
        function selectCurrentSwitch(condition) {
            if (condition == true) {
                notificationSwitch.id = "flexSwitchCheckChecked";
                notificationSwitch.nextElementSibling.setAttribute("for", "flexSwitchCheckChecked");
                notificationSwitch.checked = true;
                alertTime.disabled = false;
                let promise = Notification.requestPermission();
            } else {
                notificationSwitch.id = "flexSwitchCheckDefault";
                notificationSwitch.nextElementSibling.setAttribute("for", "flexSwitchCheckDefault");
                notificationSwitch.checked = false;
                alertTime.disabled = true;
            }
        }

        // select user's alert time
        function selectCurrentAlertTime(currentAlertTime) {
            for (let option of document.getElementById("alert-time")) {
                if (option.value == currentAlertTime) {
                    option.selected = true;
                }
            }
        }

        // notification turn on/off function
        function updateSwitch() {
            if (notificationSwitch.id == "flexSwitchCheckDefault") {
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
        }

        // execute updateSwitch functin when event is occured
        notificationSwitch.addEventListener('change', function () {
            updateSwitch();
        })

        // notification time set function
        alertTime.addEventListener('change', function () {
            var selected = alertTime.value;
            setAlertTime(selected);
            getNotificationInfo(selected);
        })

        // update notification status function
        function setNotificationStatus(condition) {
            currentUser.update({
                notification_status: condition
            })
        }

        // update alert time function
        function setAlertTime(value) {
            if (value == "none") {
                value = null;
            }
            currentUser.update({
                alert_time: value
            })
        }

        // function to get information for notification collection
        function getNotificationInfo(selected) {
            groupRef
                .where("group_member", "array-contains", user.uid)
                .onSnapshot((groupSnapshot) => {
                    groupSnapshot.forEach((group => {
                        var taskIDs = group.data().task;
                        taskIDs.forEach(taskID => {

                            taskRef.doc(taskID)
                                .onSnapshot(task => {
                                    if (task.data().task_status != "done") {
                                        var dueDate = task.data().task_due_date.toDate();
                                        var notificationDate = new Date(dueDate);
                                        notificationDate.setMinutes(dueDate.getMinutes() - selected);
                                        setNotification(user.uid, task.id, notificationDate, selected);
                                    }
                                })
                        })
                    }))
                })
        }

        // setNotification function to update or create document
        // in notification collection        
        function setNotification(userID, taskID, notificationDate, selected) {
            notificationRef
                .where("user_id", "==", userID)
                .where("task_id", "==", taskID)
                .get()
                .then(notificationSnapshot => {
                    if (!notificationSnapshot.empty) {
                        var notificationID = notificationSnapshot.docs[0].id;
                        if (selected != "none") {
                            notificationRef.doc(notificationID).update({
                                notification_time: notificationDate
                            })
                        } else {
                            notificationRef.doc(notificationID).update({
                                notification_time: null
                            })
                        }
                    } else if (notificationSnapshot.empty) {
                        if (selected != "none") {
                            notificationRef.add({
                                task_id: taskID,
                                user_id: user.uid,
                                notification_time: notificationDate
                            })
                        } else {
                            notificationRef.add({
                                task_id: taskID,
                                user_id: user.uid,
                                notification_time: null
                            })
                        }
                    }
                })
        }

        // selectNotificationList function to list user tasks that is not done.
        // sort by due date.
        function selectNotificationList() {
            let taskTemplate = document.getElementById("task-template");
            document.getElementById("task-go-here").innerHTML = "";
        
            db.collection("notification")
            .where("user_id", "==", user.uid)
            .onSnapshot(notificationSnapshot => {
                var taskIds = notificationSnapshot.docs.map(doc => doc.data().task_id);
                db.collection("task")
                .where(firebase.firestore.FieldPath.documentId(), 'in', taskIds)
                .orderBy("task_due_date", "desc")
                .onSnapshot(taskSnapshot => {
                    document.getElementById("task-go-here").innerHTML = 
                    "<tr><th>Title</th><th>Due date</th></tr>";
                    taskSnapshot.forEach(task => {
                        if(task.data().task_status != "done") {
                            var taskTitle = task.data().task_title;
                            var dueDate = task.data().task_due_date.toDate();
                            let newTask = taskTemplate.content.cloneNode(true);
                            newTask.querySelector(".task-title").innerHTML = taskTitle;
                            newTask.querySelector(".task-title").href = "/task?docID=" + task.id;
                            
                            var months = ["January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"];
                            
                            newTask.querySelector(".due-date").innerHTML
                            = months[dueDate.getMonth()] + " "
                            + dueDate.getDate() + ", "
                            + dueDate.getFullYear() + " "
                            + dueDate.getHours() + ":"
                            + dueDate.getMinutes();
                            document.getElementById("task-go-here").appendChild(newTask);
                        }
                    });
                });
            });
        }
        selectNotificationList();


        function sendAlert(userID, taskID, notificationDate) {
            console.log(userID);
            console.log(taskID);
            console.log(notificationDate);
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
        group_name: "notification test group1",
        group_manager: "WzNTfulCWxQwXn7LeIureKK1bSI2",
        group_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        group_delete_fg: "N",
        group_member: firebase.firestore.FieldValue.arrayUnion("WzNTfulCWxQwXn7LeIureKK1bSI2"),
        task: firebase.firestore.FieldValue.arrayUnion("0Xkp49WtT4OtqSJ7hUWC", "1kag3DpEXWfzOwQ4e1kT", "Ycn0FqJ9bBnHktyhk9o7", "IDXgeTtBH4MgbtM6zPmV")
    });

    groupRef.add({
        group_name: "notification test group2",
        group_manager: "WzNTfulCWxQwXn7LeIureKK1bSI2",
        group_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        group_delete_fg: "N",
        group_member: firebase.firestore.FieldValue.arrayUnion("WzNTfulCWxQwXn7LeIureKK1bSI2"),
        task: firebase.firestore.FieldValue.arrayUnion("hzfJ4RrAmwVu3DxSEAJn", "6s8oW7XssLSZs3hjos0e", "wbgtCI6Al59PkoChEhHZ", "z7qo5EsotUQ7KVXPEVUR")
    });
}