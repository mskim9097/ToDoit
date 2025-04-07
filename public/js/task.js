// Function to retrieve query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.getElementById('taskForm').addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent form from refreshing the page

            // Retrieve form data
            const taskTitle = document.querySelector('input[placeholder="Enter task title"]').value.trim();
            const taskDescription = document.querySelector('textarea[placeholder="Task description"]').value;
            const dueDate = document.querySelector('input[type="date"]').value;
            const dueTime = document.querySelector('input[type="time"]').value;
            const status = document.querySelector("#task-status").value;
            const priority = document.querySelector("#prioritySelect").value
            const deleteIcon = document.querySelector('.delete-icon'); // Assuming you have a delete icon in your HTML


            // Validate taskTitle
            if (!taskTitle) {
                alert('Task title is required. Please enter a title.');
                return; // Stop form submission if title is empty
            }

            // Create a task object
            const task = {
                title: taskTitle,
                description: taskDescription,
                dueDate: dueDate,
                dueTime: dueTime,
                priority: priority,
                status: status,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Add a timestamp
                createdBy: user.uid, // Associate task with the logged-in user
                delete_fg: false // Default value for delete_fg

            };

            // Retrieve the group ID from the URL
            const groupId = getQueryParam("docID");
            if (!groupId) {
                alert("Group ID is missing. Cannot save the task.");
                return;
            }

            // Save the task to the Group subcollection in Firestore
            db.collection('Group')
                .doc(groupId) // Reference the specific group document
                .collection('task') // Reference the 'activities' subcollection
                .add(task) // Add the task object
                .then((docRef) => {
                    alert("Task saved successfully!");

                    // Create a dynamic card for the task
                    const taskList = document.querySelector('.row.g-4');
                    const taskCard = document.createElement('div');
                    taskCard.className = 'col-12 col-md-6 col-xl-4 task-card-container';
                    taskCard.innerHTML = `
                        <div class="task-card p-3 position-relative" style="cursor: pointer;">
                            <!-- Delete Icon -->
                            <button class="btn btn-danger btn-sm position-absolute top-0 end-0 delete-task-btn" style="margin: 5px;">
                                <i class="fas fa-trash"></i>
                            </button>

                            <div class="d-flex align-items-center mb-2">
                                <span class="priority-indicator priority-${task.reminders ? 'high' : 'low'} me-2"></span>
                                <small class="text-muted">${task.reminders ? 'High Priority' : 'Low Priority'}</small>
                                <span class="ms-auto badge bg-primary">New</span>
                            </div>
                            <h5 class="mb-1">${task.title}</h5>
                            <p class="text-muted mb-2">${task.description}</p>
                            <div class="d-flex align-items-center text-muted">
                                <small class="me-3">
                                    <i class="fas fa-calendar me-1"></i>${task.dueDate}
                                </small>
                                <small>
                                    <i class="fas fa-clock me-1"></i>${task.dueTime}
                                </small>
                            </div>
                        </div>
                    `;
                    taskCard.addEventListener('click', () => {
                        const taskDetailsModal = document.getElementById('taskDetailsModal');
                        taskDetailsModal.dataset.taskId = docRef.id;
                        taskDetailsModal.dataset.groupId = groupId; // Pass the group ID as well
                        if (!taskDetailsModal) {
                            console.error("Task details modal not found!");
                            return;
                        }

                        // Populate the modal with task details
                        document.getElementById('taskTitle').value = task.title;
                        document.getElementById('taskDescription').value = task.description;
                        document.getElementById('taskDueDate').value = task.dueDate;
                        document.getElementById('taskDueTime').value = task.dueTime;
                        document.getElementById('taskStatus').value = task.status;
                        document.getElementById('taskPriority').value = task.priority;

                        // Show the modal
                        const modalInstance = new bootstrap.Modal(taskDetailsModal);
                        modalInstance.show();

                        // Set the task ID in the modal's dataset
                        taskDetailsModal.dataset.taskId = docRef.id; // Use the generated ID from Firestore
                        taskDetailsModal.dataset.groupId = groupId; // Pass the group ID as well
                    });

                    taskCard.querySelector('.delete-task-btn').addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent triggering the card's click event

                        // Confirm deletion
                        if (!confirm("Are you sure you want to delete this task?")) return;

                        // Check if the current user is the creator of the task
                        if (task.createdBy !== firebase.auth().currentUser.uid) {
                            alert("You can only delete tasks you created.");
                            return;
                        }

                        // Update the task in Firestore to set `delete_fg: true`
                        db.collection("Group")
                            .doc(groupId)
                            .collection("task")
                            .doc(doc.id)
                            .update({ delete_fg: true })
                            .then(() => {
                                alert("Task deleted successfully!");
                                loadActivitiesFromFirestore();
                            })
                            .catch((error) => {
                                console.error("Error deleting task:", error);
                            });
                    });

                    taskList.appendChild(taskCard);

                    // Reset the form
                    document.getElementById('taskForm').reset();

                    // Close the modal and clean up
                    const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
                    modal.hide();
                    document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
                    document.body.classList.remove('modal-open');
                    location.reload();
                })
                .catch((error) => {
                    console.error('Error saving task:', error);
                });
        });
    } else {
        alert("Session is out. Please log in again.");
        window.location.href = "/";
    }
});

// Function to load activities from Firestore
function loadActivitiesFromFirestore() {
    const docID = getQueryParam("docID");
    if (!docID) {
        console.error("Group docID is missing!");
        return;
    }

    console.log("Loading tasks for group docID:", docID);

    // Reference the 'task' subcollection in Firestore
    db.collection("Group")
        .doc(docID)
        .collection("task") // Reference the 'task' subcollection
        .orderBy("createdAt", "desc") // Order tasks by creation time (most recent first)
        .get()
        .then((querySnapshot) => {
            const taskList = document.querySelector('.row.g-4'); // Ensure this matches your HTML structure
            if (!taskList) {
                console.error("Task list container not found!");
                return;
            }

            // Clear the task list before loading new tasks
            taskList.innerHTML = "";

            // Iterate through each task document
            querySnapshot.forEach((doc) => {
                const task = doc.data();
                const taskId = doc.id; // Store the document ID
                console.log("Loaded task:", task);

                // Create a dynamic card for the task 
                const taskCard = document.createElement('div');
                taskCard.className = 'col-12 col-md-6 col-xl-4 task-card-container';
                taskCard.innerHTML = `
                    <div class="task-card p-3 position-relative" style="cursor: pointer;">
                        <!-- Delete Icon -->
                        <button class="btn btn-danger btn-sm position-absolute top-0 end-0 delete-task-btn" style="margin: 5px;">
                            <i class="fas fa-trash"></i>
                        </button>

                        <div class="d-flex align-items-center mb-2">
                            <span class="priority-indicator priority-${task.priority} me-2"></span>
                            <small class="text-muted">${task.priority}</small>
                            <span class="ms-auto badge bg-primary"></span>
                        </div>
                        <h5 class="mb-1">${task.title}</h5>
                        <p class="text-muted mb-2">${task.description}</p>
                        <div class="d-flex align-items-center text-muted">
                            <small class="me-3">
                                <i class="fas fa-calendar me-1"></i>${task.dueDate}
                            </small>
                            <small>
                                <i class="fas fa-clock me-1"></i>${task.dueTime}
                            </small>
                            <small class="ms-auto">${task.status}</small>
                        </div>
                    </div>
                `;

                // Add a click event listener for task actions
                taskCard.addEventListener('click', () => {
                    const taskDetailsModal = document.getElementById('taskDetailsModal');


                    if (!taskDetailsModal) {
                        console.error("Task details modal not found!");
                        return;
                    }

                    // Populate the modal with task details
                    document.getElementById('taskTitle').value = task.title;
                    document.getElementById('taskDescription').value = task.description;
                    document.getElementById('taskDueDate').value = task.dueDate;
                    document.getElementById('taskDueTime').value = task.dueTime;
                    document.getElementById('taskStatus').value = task.status;
                    document.getElementById('taskPriority').value = task.priority;

                    // Show the modal
                    const modalInstance = new bootstrap.Modal(taskDetailsModal);
                    modalInstance.show();

                    // Set the task ID in the modal's dataset
                    taskDetailsModal.dataset.taskId = taskId;
                    taskDetailsModal.dataset.groupId = docID;
                });

                // Add a click event listener for the delete button
                taskCard.querySelector('.delete-task-btn').addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent triggering the card's click event

                    // Confirm deletion
                    if (!confirm("Are you sure you want to delete this task?")) return;

                    // Check if the current user is the creator of the task
                    if (task.createdBy !== firebase.auth().currentUser.uid) {
                        alert("You can only delete tasks you created.");
                        return;
                    }

                    // Update the task in Firestore to set `delete_fg: true`
                    db.collection("Group")
                        .doc(docID) // Use the group document ID
                        .collection("task")
                        .doc(taskId) // Use the task's document ID
                        .delete() // Delete the task document
                        .then(() => {
                            alert("Task deleted successfully!");
                            loadActivitiesFromFirestore(); // Refresh the task list
                        })
                        .catch((error) => {
                            console.error("Error deleting task:", error);
                        });
                });

                // Append the task card to the task list
                taskList.appendChild(taskCard);
            });
        })
        .catch((error) => {
            console.error("Error loading tasks:", error);
        });



    taskList.appendChild(taskCard);


}

// Ensure the function runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadActivitiesFromFirestore();
});

// Close the modal and clean up
const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
modal.hide();

// Remove any remaining backdrops
document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
document.getElementById("cardExample").style.display = "none"; // Hide the card example

// Append dynamic task cards to the correct container
const taskList = document.getElementById('dynamicTaskCards');
const taskCard = document.createElement('div');
taskCard.className = 'col-12 col-md-6 col-xl-4 task-card-container';
taskCard.innerHTML = `
    <div class="task-card p-3 position-relative" style="cursor: pointer;">
        <!-- Delete Icon -->
        <button class="btn btn-danger btn-sm position-absolute top-0 end-0 delete-task-btn" style="margin: 5px;">
            <i class="fas fa-trash"></i>
        </button>

        <div class="d-flex align-items-center mb-2">
            <span class="priority-indicator priority-${task.reminders ? 'high' : 'low'} me-2"></span>
            <small class="text-muted">${task.reminders ? 'High Priority' : 'Low Priority'}</small>
            <span class="ms-auto badge bg-primary">New</span>
        </div>
        <h5 class="mb-1">${task.title}</h5>
        <p class="text-muted mb-2">${task.description}</p>
        <div class="d-flex align-items-center text-muted">
            <small class="me-3">
                <i class="fas fa-calendar me-1"></i>${task.dueDate}
            </small>
            <small>
                <i class="fas fa-clock me-1"></i>${task.dueTime}
            </small>
        </div>
    </div>
`;



document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('updatetaskbtn').addEventListener('click', async (e) => {
        e.preventDefault();

        const taskDetailsModal = document.getElementById('taskDetailsModal');
        const taskId = taskDetailsModal.dataset.taskId;
        const groupId = taskDetailsModal.dataset.groupId; // Get from dataset

        console.log("groupId:", groupId, "taskId:", taskId);

        // Validate both IDs
        if (!taskId || !groupId) {
            alert("Missing task/group ID!");
            return;
        }

        // Rest of your update logic...


        // Get updated values from modal inputs
        const updatedTask = {
            title: document.getElementById('taskTitle').value.trim(),
            description: document.getElementById('taskDescription').value.trim(),
            dueDate: document.getElementById('taskDueDate').value,
            dueTime: document.getElementById('taskDueTime').value,
            status: document.getElementById('taskStatus').value,
            priority: document.getElementById('taskPriority').value,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            // Update specific task document (like delete does)
            await db.collection("Group")
            await db.collection("Group")
                .doc(taskDetailsModal.dataset.groupId)
                .collection("task")
                .doc(taskDetailsModal.dataset.taskId)
                .update(updatedTask)


            alert("Task updated successfully!");
            loadActivitiesFromFirestore(); // Refresh list like delete

            // Close modal properly
            const modal = bootstrap.Modal.getInstance(taskDetailsModal);
            modal.hide();
        } catch (error) {
            console.error("Update error:", error);
            alert(`Update failed: ${error.message}`);
        }
    });
});








