/*function displayTaskListInfo() {
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    console.log( ID );

    // doublecheck: is your collection called "Reviews" or "reviews"?
    // spelling matters
    db.collection( "task" )
        .doc( ID )
        .get()
        .then( doc => {
            thisTaskList = doc.data();
            taskListCode = thisTaskList.code;
            taskListName = doc.data().name;
            
            // only populate title, and image
            document.getElementById( "taskName" ).innerHTML = taskName;
        } );
}
displayHikeInfo();
*/
/*
$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })*/

var searchUser = document.querySelector(".search-user");
searchUser.addEventListener("keyup", function() {

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
                if(doc.data().user_delete_fg == 'N') {
                    var name = doc.data().name;
                    var email = doc.data().email;
                    var docID = doc.id;
                    let newUser = searchedUserTemplate.content.cloneNode(true);
                    
                    newUser.querySelector('.user-container').id = docID;
                    newUser.querySelector('.user-name').innerHTML = name;
                    newUser.querySelector('.user-email').innerHTML = email;
                    document.getElementById("search-user-go-here").appendChild(newUser);
                }
            }))
        })
});

document.querySelector("#search-user-go-here").addEventListener("click", function(e) {
    console.log(e.target);
    if (e.target.classList.contains('bi-plus-circle')) {
        plusUser(e.target.parentElement.parentElement);
    }
});

function plusUser(clicked) {
    let plusUserTemplate = document.getElementById("plusUserTemplate");
    let plusUser = plusUserTemplate.content.cloneNode(true);
    plusUser.querySelector('.user-container').id = clicked.id;
    plusUser.querySelector('.user-name').innerHTML = clicked.querySelector(".user-name").innerHTML;
    plusUser.querySelector('.user-email').innerHTML = clicked.querySelector(".user-email").innerHTML;
    document.getElementById("plus-user-go-here").appendChild(plusUser);
}

// Test code to create dummy user data
/*
function writeUser() {
    //define a variable for the collection you want to create in Firestore to populate data
    var userRef = db.collection("user");

    userRef.add({
        email: "mskim909777@gmail.com",
        name: "minsu Kim777",
        user_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        user_delete_fg: "N"
    });
    userRef.add({
        email: "ms@gmail.com",
        name: "minsu Kim ms",
        user_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        user_delete_fg: "N"
    });
    userRef.add({
        email: "mskmp@gmail.com",
        name: "minsu kmp",
        user_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        user_delete_fg: "N"
    });
    userRef.add({
        email: "mskim9@gmail.com",
        name: "minsu9",
        user_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        user_delete_fg: "N"
    });
    userRef.add({
        email: "mskim90@gmail.com",
        name: "minsu 90",
        user_create_date: firebase.firestore.FieldValue.serverTimestamp(),
        user_delete_fg: "N"
    });
    
}
*/