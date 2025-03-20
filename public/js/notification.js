function test() {
    firebase.auth().onAuthStateChanged(user => {        
        if(user) {
            var groupRef = db.collection("Group");
            groupRef.where("group_member", "array-contains", user.uid)
            .onSnapshot((snapshot) => {
                snapshot.forEach((doc => {
                    
                    console.log(doc.id);
                    
                    
                }))
            })
            
            
         /*   GroupRef.add({
                group_name: "notification test group",
                group_manager: user.uid,
                group_create_date: firebase.firestore.FieldValue.serverTimestamp(),
                group_delete_fg: "N",
                group_Member: firebase.firestore.FieldValue.arrayUnion(user.uid),
                task: firebase.firestore.FieldValue.arrayUnion("0Xkp49WtT4OtqSJ7hUWC")
    });*/
            // currentUser = db.collection("Group").doc("snTU4HRO6WUNfdItJfCi");
            // currentUser.update({
            // task: firebase.firestore.FieldValue.arrayUnion("1K8VylKdmCxTyHPae1I1")
            // })
        }
    });
}

test();

/**
 * currentUser = db.collection("user").doc();
            //currentUser.update({
            db.colection("group")
            .where().onSnapshot((snapshot) => {

            })
 */