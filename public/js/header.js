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

    function selectBadgeCount() {
        let urgent = 0;
        const today = new Date();

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
                            taskSnapshot.forEach(taskDoc => {
                                let dueDateStr = taskDoc.data().dueDate;
                                let dueDate = new Date(dueDateStr + "T00:00:00");
                                let diffInTime = dueDate - today;
                                let diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
                                if (diffInDays >= 0 && diffInDays <= 2) {
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
    selectBadgeCount();
});

