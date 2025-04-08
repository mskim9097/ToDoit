
firebase.auth().onAuthStateChanged(user => {
    function logo() {
        var logo = document.querySelector('a.navbar-brand');

        if (user) {
            logo.href = "main.html";
        } else {
            logo.href = "/";
        }

    }
    logo();
    if(user) {        
        function selectBadgeCount() {
            const today = new Date();
            let allTasks = [];
        
            db.collection("Group")
                .where("members", "array-contains", user.uid)
                .where("group_delete_fg", "==", "N")
                .get()
                .then(groupSnapshot => {
                    if(groupSnapshot.empty) {
                        document.querySelectorAll(".urgent-badge").forEach(doc => {
                            doc.style.visibility = "hidden";
                        })
                        return;
                    }
                    groupSnapshot.forEach(groupDoc => {
                        db.collection("Group")
                            .doc(groupDoc.id)
                            .collection("task")
                            .orderBy("dueDate", "asc")
                            .onSnapshot(taskSnapshot => {
                                allTasks = allTasks.filter(task => task.groupId !== groupDoc.id);
                                taskSnapshot.forEach(taskDoc => {
                                    allTasks.push({
                                        groupId: groupDoc.id,
                                        id: taskDoc.id,
                                        data: taskDoc.data()
                                    });
                                });
                                let urgent = 0;
                                allTasks.forEach(task => {
                                    const taskData = task.data;
                                    const dueDate = new Date(taskData.dueDate + "T00:00:00");
                                    const diffInTime = dueDate - today;
                                    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
        
                                    if (taskData.status != "completed" &&diffInDays >= 0 && diffInDays <= 2) {
                                        urgent++;
                                    }
                                });
                                document.querySelectorAll(".urgent-badge").forEach(doc => {
                                    if (urgent == 0) {
                                        doc.style.visibility = "hidden";
                                    } else {
                                        doc.style.visibility = "visible";
                                        doc.innerHTML = urgent;
                                    }
                                });
                            });
                    });
                });
        }
        selectBadgeCount();

    }
    
});
