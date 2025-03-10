function displayReminderMemberInfo() {
  let params = new URL(window.location.href); // Get URL of search bar
  let ID = params.searchParams.get("docID"); // Get value for key "docID"
  console.log(ID);

  // Fetch data from Firestore for reminder_member collection
  db.collection("reminder_member")
      .doc(ID)
      .get()
      .then(doc => {
          if (doc.exists) {
              let reminderMember = doc.data();
              let reminderNo = reminderMember.reminder_no;
              let userNo = reminderMember.user_no;
              let isManager = reminderMember.reminder_manager === "Y" ? true : false;

              // Display relevant information in HTML
              document.getElementById("reminderNo").innerHTML = reminderNo;
              document.getElementById("userNo").innerHTML = userNo;
              document.getElementById("isManager").innerHTML = isManager ? "Manager" : "Member";
          } else {
              console.log("No such reminder member!");
          }
      })
      .catch(error => {
          console.log("Error getting reminder member:", error);
      });
}

displayReminderMemberInfo();
