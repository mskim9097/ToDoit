firebase.auth().onAuthStateChanged(user => {
    function logo() {
        var logo = document.querySelector('a.navbar-brand');

        if (user) {
            logo.href = "/main";
        } else {
            logo.href = "/";
        }

    }
    logo();
    if(user) {
        /*
        function selectBadgeCount() {
            let urgent;
            const today = new Date();
    
            db.collection("Group")
                .where("members", "array-contains", user.uid)
                .get()
                .then(groupSnapshot => {
                    urgent = 0;
                    groupSnapshot.forEach(groupDoc => {
                        db.collection("Group")
                            .doc(groupDoc.id)
                            .collection("task")
                            .orderBy("dueDate", "asc")
                            .onSnapshot(taskSnapshot => {
                                taskSnapshot.forEach(taskDoc => {
                                    let dueDateStr = taskDoc.data().dueDate;
                                    let dueDate = new Date(dueDateStr + "T00:00:00");
                                    let diffInTime = dueDate - today;
                                    let diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
                                    if (diffInDays >= 0 && diffInDays <= 2 && taskDoc.data().status != "completed") {
                                        urgent++;
                                    }
                                });
                                if (urgent == 0) {
                                    document.querySelectorAll(".urgent-badge").forEach(doc => {
                                        doc.style.visibility = "hidden";
                                    })
                                } else {
    
                                    document.querySelectorAll(".urgent-badge").forEach(doc => {
                                        doc.style.visibility = "visible";
                                        doc.innerHTML = "";
                                        doc.innerHTML = urgent;
                                    })
                                }
                            });
                    });
                });
        }
                */
        
        function selectBadgeCount() {
            const today = new Date(); // 시간 설정은 그대로 유지
            let allTasks = [];
        
            db.collection("Group")
                .where("members", "array-contains", user.uid)
                .get()
                .then(groupSnapshot => {
                    groupSnapshot.forEach(groupDoc => {
                        db.collection("Group")
                            .doc(groupDoc.id)
                            .collection("task")
                            .orderBy("dueDate", "asc")
                            .onSnapshot(taskSnapshot => {
                                // 🔄 기존 group에 해당하는 task 제거
                                allTasks = allTasks.filter(task => task.groupId !== groupDoc.id);
        
                                // 🧩 새 task 추가
                                taskSnapshot.forEach(taskDoc => {
                                    allTasks.push({
                                        groupId: groupDoc.id,
                                        id: taskDoc.id,
                                        data: taskDoc.data()
                                    });
                                });
        
                                // ✅ 모든 task 기준으로 urgent 계산
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
        
                                // ✅ 뱃지 한 번만 업데이트
                                document.querySelectorAll(".urgent-badge").forEach(doc => {
                                    if (urgent === 0) {
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

