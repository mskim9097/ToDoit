function displayTaskListInfo() {
    let params = new URL(window.location.href); // get URL
    let ID = params.searchParams.get("docID"); // get docID
    console.log(ID); // check ID

    db.collection("task")
        .doc(ID)
        .get()
        .then(doc => {
            if (doc.exists) {
                let thisTaskList = doc.data();
                let taskListName = thisTaskList.name; // get name field
                
                document.getElementById("taskName").innerHTML = taskListName;
            } else {
                console.log("No such document!");
            }
        })
        .catch(error => {
            console.error("Error getting document:", error);
        });
}

displayTaskListInfo();
