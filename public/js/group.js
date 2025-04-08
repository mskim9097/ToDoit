populateUserInfo();


function populateUserInfo() {
    firebase.auth().onAuthStateChanged((user) => {
        // Check if user is signed in:
        if (user) {
            function addItem() {
                let itemList = document.getElementById("itemList");
                let li = document.createElement("li");
                li.innerHTML = '<input type="radio"> New Item';
                itemList.appendChild(li);
            }

            // writeaddItem();

            // Function to get query parameters from the URL
            function getQueryParam(param) {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get(param);
            }


            // Function to fetch and display group details
            function getGroupDetails() {
                const docID = getQueryParam("docID");
                if (docID) {
                    db.collection("Group")
                        .doc(docID)
                        .get()
                        .then((doc) => {
                            if (doc.exists) {
                                const groupData = doc.data(); // Define groupData here

                                // Display group name
                                document.getElementById("group-name").innerText =
                                    groupData.group_name || "No group name";

                                const memberCount = groupData.member_count || 0;
                                document.getElementById("member-count").innerText =
                                    `${memberCount} ${memberCount === 1 ? "member" : "members"}`;

                                // Display group image
                                const groupImage = document.getElementById("group-image");
                                if (groupData.group_image) {
                                    groupImage.src = groupData.group_image;
                                    groupImage.onerror = function () {
                                        this.src = "/img/default.jpg"; // Fallback if image fails to load
                                    };
                                } else {
                                    groupImage.src = "/img/default.jpg"; // Fallback image
                                }
                            } else {
                                console.log("No such document!"); //
                            }
                        })
                        .catch((error) => {
                            console.error("Error getting document:", error);
                        });
                } else {
                    console.log("No docID found in URL");
                }
            }

            //  Call the function to fetch and display group details
            getGroupDetails();
        }
    });
}
let groupName;
const urlParams = new URLSearchParams(window.location.search);
const groupID = urlParams.get("docID");
db.collection("Group")
    .doc(groupID)
    .onSnapshot((snapshot) => {
        groupName = snapshot.data().group_name;
    });

function displayTaskListInfo() {
    let params = new URL(window.location.href); // get URL
    let ID = params.searchParams.get("docID"); // get docID

    db.collection("task")
        .doc(ID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                let thisTaskList = doc.data();
                let taskListName = thisTaskList.name; // get name field

                document.getElementById("taskName").innerHTML = taskListName;
            } else {
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
        });
}

displayTaskListInfo();
/*
$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })*/

var searchUser = document.querySelector(".search-user");
searchUser.addEventListener("keyup", function () {
    let searchedUserTemplate = document.getElementById("searchedUserTemplate");
    var inputValue = searchUser.value.trim();
    if (inputValue.length < 2) {
        var userListContainer = document.getElementById("user-go-here");
        userListContainer.innerHTML = "";
        return;
    }
    var startValue = inputValue.toLowerCase();
    var endValue = inputValue + "\uf8ff";

    db.collection("user")
        .where("email", ">=", startValue)
        .where("email", "<=", endValue)
        .onSnapshot((snapshot) => {
            var userListContainer = document.getElementById("search-user-go-here");
            userListContainer.innerHTML = "";
            db.collection("Group").doc(groupID).get().then(doc => {
                groupMembers = doc.data().members;

                snapshot.forEach((doc) => {
                    if (doc.data().user_delete_fg == "N") {
                        if (!groupMembers.includes(doc.id)) {
                            var email = doc.data().email;
                            var name = doc.data().name;
                            var docID = doc.id;
                            let newUser = searchedUserTemplate.content.cloneNode(true);

                            newUser.querySelector(".unchecked-user-container").id = docID;
                            newUser.querySelector(".user-name").innerHTML = name;
                            newUser.querySelector(".user-email").innerHTML = email;
                            document.getElementById("search-user-go-here").appendChild(newUser);
                        }

                    }
                });

            })


        });
});

document
    .querySelector("#search-user-go-here")
    .addEventListener("click", function (e) {
        if (e.target.classList.contains("bi-plus-circle")) {
            plusUser(e.target.parentElement.parentElement);
        }
    });

function plusUser(clicked) {
    let plusUserTemplate = document.getElementById("plusUserTemplate");
    let plusUser = plusUserTemplate.content.cloneNode(true);
    plusUser.querySelector(".checked-user-container").id = clicked.id;
    plusUser.querySelector(".user-name").innerHTML =
        clicked.querySelector(".user-name").innerHTML;
    plusUser.querySelector(".user-email").innerHTML =
        clicked.querySelector(".user-email").innerHTML;
    document.getElementById("plus-user-go-here").appendChild(plusUser);
    clicked.remove();
}

document
    .querySelector("#plus-user-go-here")
    .addEventListener("click", function (e) {
        if (e.target.classList.contains("bi-dash-circle")) {
            removeUser(e.target.parentElement.parentElement);
        }
    });

function removeUser(clicked) {
    let searchedUserTemplate = document.getElementById("searchedUserTemplate");
    let removedUser = searchedUserTemplate.content.cloneNode(true);
    removedUser.querySelector(".unchecked-user-container").id = clicked.id;
    removedUser.querySelector(".user-name").innerHTML =
        clicked.querySelector(".user-name").innerHTML;
    removedUser.querySelector(".user-email").innerHTML =
        clicked.querySelector(".user-email").innerHTML;
    var searchContainer = document.getElementById("search-user-go-here");
    searchContainer.insertBefore(removedUser, searchContainer.firstChild);
    clicked.remove();
}

document.querySelector(".inviteBtn").addEventListener("click", function () {
    document.querySelectorAll(".checked").forEach((clickedUser) => {
        console.log(clickedUser);
        //const urlParams = new URLSearchParams(window.location.search);
        //const groupID = urlParams.get('docID');

        var params = {
            logo: "/img/cleaned_logo.png",
            userName: clickedUser.querySelector(".user-name").innerHTML,
            userEmail: clickedUser.querySelector(".user-email").innerHTML,
            groupID: groupID,
            groupTitle: groupName,
        };
        emailjs.send("service_gb3vuih", "template_lzugtx5", params);
    });
    alert("The invitation email has sent successfully!");
    location.reload();
});

function accessInvite() {
    var currentGroup = db.collection("Group").doc(groupID);
    currentGroup.get().then(doc => {
        var manager = doc.data().created_by;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                var userID = user.uid;
                if (userID == manager) {
                    document.getElementById("invite-btn").style.display = "inline-block";
                    document.getElementById("leave-group-btn").style.display = "none";
                } else {
                    document.getElementById("invite-btn").style.display = "none";
                    document.getElementById("leave-group-btn").style.display = "inline-block";

                }
            }
        })

    })

}
accessInvite();

document.getElementById("leave-group-btn").addEventListener("click", function () {
    let userResponse = confirm("Are you sure you want to leave the group?");
    if (userResponse) {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const group = db.collection("Group").doc(groupID);
                    const doc = await group.get();

                    if (doc.exists) {
                        let memberCount = doc.data().member_count;

                        await group.update({
                            members: firebase.firestore.FieldValue.arrayRemove(user.uid),
                            member_count: memberCount - 1
                        });
                        alert("You have successfully left this group.");
                        window.location.href = "/main";
                    } else {
                    }
                } catch (error) {
                    console.error("Error updating group: ", error);
                }
            }
        });
    }
});