function addItem() {
    let itemList = document.getElementById("itemList");
    let li = document.createElement("li");
    li.innerHTML = '<input type="radio"> New Item';
    itemList.appendChild(li);
}

writeaddItem();

function getGroupDetails() {
    let params = new URL(window.location.href); // Get the URL
    let docID = params.searchParams.get("docID"); // Get the docID from the URL

    if (docID) {
        db.collection("Group").doc(docID).get().then((doc) => {
            if (doc.exists) {
                // Display group details
                console.log("Group Data:", doc.data());
                document.getElementById("group-name").innerText = doc.data().group_name;
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.error("Error getting document:", error);
        });
    } else {
        console.log("No docID found in URL");
    }
}

getGroupDetails(); // Call the function when the page loads

console.log("Group ID:", docID);
console.log("Group Data:", doc.data());