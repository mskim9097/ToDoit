function displayTaskListInfo() {
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