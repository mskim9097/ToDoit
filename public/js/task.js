document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from refreshing the page

    // Store the form data for firestore
    const taskTitle = document.querySelector('input[placeholder="Enter task title"]').value.trim();
    const taskDescription = document.querySelector('textarea[placeholder="Task description"]').value;
    const dueDate = document.querySelector('input[type="date"]').value;
    const dueTime = document.querySelector('input[type="time"]').value;
    const remindersEnabled = document.querySelector('input[type="checkbox"]').checked;

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
        reminders: remindersEnabled,
        userId: firebase.auth().currentUser.uid // Associate task with the logged-in user
    };

    // Saves the task to firestore
    db.collection('task').add(task)
        .then(() => {
            alert('Task saved successfully!');


            // Creates dynamic cards for each task
            const taskList = document.querySelector('.row.g-4');
            const taskCard = document.createElement('div');
            taskCard.className = 'col-12 col-md-6 col-xl-4 task-card-container';
            taskCard.innerHTML = `
                <div class="task-card p-3" style="cursor: pointer;">
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
                // Navigate to a task details page or perform an action
                window.location.href = `/task-details.html?taskId=${task.id}`;
            });
            taskList.appendChild(taskCard);

            // Optionally reset the form
            document.getElementById('taskForm').reset();
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
            modal.hide();
        })
        .catch((error) => {
            console.error('Error saving task:', error);
        });
});

