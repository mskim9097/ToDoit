// login check
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("user").doc(user.uid);
        let upcoming;
        let urgent;
        let completed;

        const today = new Date();
        const taskTemplate = document.getElementById("task-template");
        const taskContainer = document.querySelector(".task-go-here");
        let allTasks = [];

        function renderTaskList() {
            allTasks.sort((a, b) => new Date(a.data.dueDate) - new Date(b.data.dueDate));
            taskContainer.innerHTML = "";
            upcoming = 0;
            urgent = 0;
            completed = 0;

            allTasks.forEach(task => {
                const dueDate = new Date(task.data.dueDate + "T00:00:00");
                const diffInDays = Math.ceil((dueDate - today) / (1000 * 3600 * 24));

                if (diffInDays >= 0 && diffInDays <= 2 && task.data.status != "completed") {
                    urgent++;
                    document.querySelector("#urgentCount").innerHTML = urgent;
                } else if (diffInDays > 2 && task.data.status != "completed") {
                    upcoming++;
                    document.querySelector("#upcomingCount").innerHTML = upcoming;
                } else if (task.data.status == "completed") {
                    completed++;
                    document.querySelector("#completedCount").innerHTML = completed;
                }
                const taskList = taskTemplate.content.cloneNode(true);
                taskList.querySelector(".task-id").href = "group?docID=" + task.groupId;
                taskList.querySelector(".task-title").innerHTML = task.data.title;
                taskList.querySelector(".due-date").innerHTML = task.data.dueDate + " " + task.data.dueTime;

                const taskStatus = taskList.querySelector(".task-status");
                if (task.data.status === "not started") {
                    taskStatus.classList.add("btn-outline-secondary");
                    taskStatus.innerHTML = "<i class='bi bi-dash-circle'></i> Not Started";
                } else if (task.data.status === "in progress") {
                    taskStatus.classList.add("btn-outline-primary");
                    taskStatus.innerHTML = "<i class='bi bi-three-dots'></i> In Progress";
                } else if (task.data.status === "completed") {
                    taskStatus.classList.add("btn-outline-success");
                    taskStatus.innerHTML = "<i class='bi bi-check-circle'></i>&nbsp; Completed";
                }
                taskContainer.appendChild(taskList);
            });
        }
        db.collection("Group")
            .where("members", "array-contains", user.uid)
            .get()
            .then(groupSnapshot => {
                groupSnapshot.forEach(groupDoc => {
                    db.collection("Group")
                        .doc(groupDoc.id)
                        .collection("task")
                        .onSnapshot(taskSnapshot => {
                            taskSnapshot.forEach(taskDoc => {
                                const taskData = taskDoc.data();
                                const taskId = taskDoc.id;

                                allTasks = allTasks.filter(task =>
                                    !(task.groupId === groupDoc.id && task.id === taskId)
                                );
                                allTasks.push({
                                    groupId: groupDoc.id,
                                    id: taskId,
                                    data: taskData
                                });
                            });
                            renderTaskList();
                        });
                });
            });
    } else {
        alert("session is out. please login again.");
        window.location.href = "/";
    }
});