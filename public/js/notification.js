// login check
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("user").doc(user.uid);
        let upcoming = 0;
        urgent = 0;
        let completed = 0;

        // selectNotificationList function to list user tasks that is not done.
        // sort by due date.
        function selectNotificationList() {
            const today = new Date();

            let taskTemplate = document.getElementById("task-template");
            document.querySelector(".task-go-here").innerHTML = "";

            db.collection("Group")
                .where("members", "array-contains", user.uid)
                .get()
                .then(groupSnapshot => {
                    groupSnapshot.forEach(groupDoc => {
                        db.collection("Group")
                            .doc(groupDoc.id)
                            .collection("task")
                            .orderBy("dueDate")
                            .onSnapshot(taskSnapshot => {
                                taskSnapshot.forEach(taskDoc => {
                                    let taskList = taskTemplate.content.cloneNode(true);

                                    let dueDateStr = taskDoc.data().dueDate;
                                    let dueDate = new Date(dueDateStr + "T00:00:00");
                                    let diffInTime = dueDate - today;
                                    let diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

                                    if (diffInDays >= 0 && diffInDays <= 2) {
                                        urgent++;
                                        document.querySelector("#urgentCount").innerHTML = urgent;
                                    } else if (diffInDays > 2) {
                                        upcoming++;
                                        document.querySelector("#upcomingCount").innerHTML = upcoming;
                                    }

                                    taskList.querySelector(".task-id").href = "group?docID=" + groupDoc.id;
                                    taskList.querySelector(".task-title").innerHTML = taskDoc.data().title;
                                    taskList.querySelector(".due-date").innerHTML
                                        = taskDoc.data().dueDate + " " + taskDoc.data().dueTime;
                                    if(taskDoc.data().status == "not started") {
                                        taskList.querySelector(".task-status").classList.add("btn-outline-secondary");
                                        taskList.querySelector(".task-status").innerHTML = "<i class='bi bi-dash-circle'></i> Not Started";
                                    } else if(taskDoc.data().status == "in progress") {
                                        taskList.querySelector(".task-status").classList.add("btn-outline-primary");
                                        taskList.querySelector(".task-status").innerHTML = "<i class='bi bi-three-dots'></i> In Progress"
                                    } else if(taskDoc.data().status == "completed") {
                                        taskList.querySelector(".task-status").classList.add("btn-outline-success");
                                        taskList.querySelector(".task-status").innerHTML = "<i class='bi bi-check-circle'></i>&nbsp; Completed";
                                    }


                                    document.querySelector(".task-go-here").appendChild(taskList);
                                });

                            });
                    });
                });
        }
        selectNotificationList();
    } else {
        alert("session is out. please login again.");
        window.location.href = "/";
    }
});