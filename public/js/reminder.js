const urlParams = new URLSearchParams(window.location.search);
const groupID = urlParams.get('docID');

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
        userListContainer.innerHTML = '';
        return;
    }
    var startValue = inputValue.toLowerCase();
    var endValue = inputValue + '\uf8ff';

    db.collection("user")
        .where("email", ">=", startValue)
        .where("email", "<=", endValue)
        .onSnapshot((snapshot) => {
            var userListContainer = document.getElementById("search-user-go-here");
            userListContainer.innerHTML = '';
            snapshot.forEach((doc => {
                if (doc.data().user_delete_fg == 'N') {
                    var name = doc.data().name;
                    var email = doc.data().email;
                    var docID = doc.id;
                    let newUser = searchedUserTemplate.content.cloneNode(true);

                    newUser.querySelector('.unchecked-user-container').id = docID;
                    newUser.querySelector('.user-name').innerHTML = name;
                    newUser.querySelector('.user-email').innerHTML = email;
                    document.getElementById("search-user-go-here").appendChild(newUser);
                }
            }))
        })
});

document.querySelector("#search-user-go-here").addEventListener("click", function (e) {
    if (e.target.classList.contains('bi-plus-circle')) {
        plusUser(e.target.parentElement.parentElement);
    }
});

function plusUser(clicked) {
    let plusUserTemplate = document.getElementById("plusUserTemplate");
    let plusUser = plusUserTemplate.content.cloneNode(true);
    plusUser.querySelector('.checked-user-container').id = clicked.id;
    plusUser.querySelector('.user-name').innerHTML = clicked.querySelector(".user-name").innerHTML;
    plusUser.querySelector('.user-email').innerHTML = clicked.querySelector(".user-email").innerHTML;
    document.getElementById("plus-user-go-here").appendChild(plusUser);
    clicked.remove();
}

document.querySelector("#plus-user-go-here").addEventListener("click", function (e) {
    if (e.target.classList.contains('bi-dash-circle')) {
        removeUser(e.target.parentElement.parentElement);
    }
});

function removeUser(clicked) {
    let searchedUserTemplate = document.getElementById("searchedUserTemplate");
    let removedUser = searchedUserTemplate.content.cloneNode(true);
    removedUser.querySelector('.unchecked-user-container').id = clicked.id;
    removedUser.querySelector('.user-name').innerHTML = clicked.querySelector(".user-name").innerHTML;
    removedUser.querySelector('.user-email').innerHTML = clicked.querySelector(".user-email").innerHTML;
    var searchContainer = document.getElementById("search-user-go-here");
    searchContainer.insertBefore(removedUser, searchContainer.firstChild);
    clicked.remove();
}

document.querySelector(".inviteBtn").addEventListener("click", function () {
    document.querySelectorAll(".checked").forEach(clickedUser => {
        console.log(clickedUser);
        //const urlParams = new URLSearchParams(window.location.search);
        //const groupID = urlParams.get('docID');

        var params = {
            logo: "/img/cleaned_logo.png",
            userName: clickedUser.querySelector(".user-name").innerHTML,
            userEmail: clickedUser.querySelector(".user-email").innerHTML,
            groupID: groupID
        };
        emailjs.send("service_gb3vuih", "template_lzugtx5", params);
    })
})

displayTaskListInfo();

