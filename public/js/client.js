import { addReminderMember, getReminderMembers, updateReminderMember, deleteReminderMember } from "./reminderMember.js";

// Example usage: Adding a reminder member
document.getElementById("addMemberBtn").addEventListener("click", () => {
    const reminderNo = 101;
    const userNo = 202;
    const isManager = true;

    addReminderMember(reminderNo, userNo, isManager);
});

// Example usage: Fetch all members
document.getElementById("viewMembersBtn").addEventListener("click", () => {
    getReminderMembers();
});
