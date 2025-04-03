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
                .then(() => {
                    alert('Task saved successfully!');

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
                        window.location.href = `/task-details.html?taskId=${task.id}`;
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
                            .doc(doc.id) // Use the task's document ID
                            .update({ delete_fg: true })
                            .then(() => {
                                alert("Task deleted successfully!");
                                loadActivitiesFromFirestore(); // Refresh the task list
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

function loadActivitiesFromFirestore() {
    const docID = getQueryParam("docID"); // Get the group document ID from the URL
    if (!docID) {
        console.error("Group docID is missing!");
        return;
    }

    console.log("Loading tasks for group docID:", docID);

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

            taskList.innerHTML = ""; // Clear the task list before loading new tasks

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
                            <span class="priority-indicator priority-${task.reminders ? 'high' : 'low'} me-2"></span>
                            <small class="text-muted">${task.reminders ? 'High Priority' : 'Low Priority'}</small>
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
}

// Ensure the function runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadActivitiesFromFirestore();
});

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

taskList.appendChild(taskCard);






