// login check
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("user").doc(user.uid);

        // selectNotificationList function to list user tasks that is not done.
        // sort by due date.
        function selectNotificationList() {

            let urgent = 0;
            let upcoming = 0;
            let completed = 0;
            const today = new Date();

            let taskTemplate = document.getElementById("task-template");
            document.querySelector(".task-go-here").innerHTML = "";
            
            db.collection("Group")
            .where("members", "array-contains", user.uid)
            .get()
            .then(groupSnapshot => {
                groupSnapshot.forEach(groupDoc => {
                    db.collection("Group")
                    .doc(groupDoc.id)
                    .collection("task")
                    .orderBy("dueDate")
                    .onSnapshot(taskSnapshot => {
                        taskSnapshot.forEach(taskDoc => {
                            let taskList = taskTemplate.content.cloneNode(true);

                            let dueDateStr = taskDoc.data().dueDate;
                            let dueDate = new Date(dueDateStr + "T00:00:00");
                            let diffInTime = dueDate - today;
                            let diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

                            if (diffInDays >= 0 && diffInDays <= 2) {
                                urgent++;
                                document.querySelector("#urgentCount").innerHTML = urgent;
                            } else {
                                upcoming++;
                                document.querySelector("#upcomingCount").innerHTML = upcoming;
                            }

                            taskList.querySelector(".task-id").href = "group?docID=" + groupDoc.id;
                            taskList.querySelector(".task-title").innerHTML = taskDoc.data().title;
                            taskList.querySelector(".due-date").innerHTML
                                = taskDoc.data().dueDate + " " + taskDoc.data().dueTime;
                            document.querySelector(".task-go-here").appendChild(taskList);
                        });
                    });
                });
            });
        }
        selectNotificationList();
    } else {
        alert("session is out. please login again.");
        window.location.href = "/";
    }
});
/*
// Task Template
const taskTemplate = document.createElement('template');
taskTemplate.innerHTML = `
<div class="td-task-item">
    <div class="form-check td-task-check">
        <input class="form-check-input td-task-checkbox" type="checkbox">
    </div>
    <div class="td-task-content">
        <div class="d-flex align-items-center">
            <h6 class="td-task-title mb-0">Task Title</h6>
            <span class="td-task-priority td-priority-high ms-2">HIGH</span>
        </div>
        <div class="td-task-due">
            <i class="bi bi-calendar me-1"></i>
            <span class="due-date">Due Date</span>
        </div>
    </div>
    <div class="td-task-actions">
        <button class="btn btn-sm td-btn-icon">
            <i class="bi bi-three-dots-vertical"></i>
        </button>
    </div>
</div>
`;

function renderTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = `
        <div class="td-empty-state">
            <i class="bi bi-check2-circle td-empty-icon"></i>
            <h5>All caught up!</h5>
            <p class="td-text-muted">No tasks requiring attention</p>
        </div>
        `;
        return;
    }

    // Categorize tasks
    let urgentCount = 0;
    let upcomingCount = 0;
    let completedCount = 0;

    tasks.forEach(task => {
        const clone = taskTemplate.content.cloneNode(true);
        const now = new Date();
        const dueDate = new Date(task.dueDate);
        
        // Set task content
        clone.querySelector('.td-task-title').textContent = task.title;
        clone.querySelector('.due-date').textContent = formatDueDate(dueDate);
        
        // Set priority
        const priorityBadge = clone.querySelector('.td-task-priority');
        if (task.priority) {
            priorityBadge.textContent = task.priority.toUpperCase();
            priorityBadge.className = `td-task-priority td-priority-${task.priority.toLowerCase()} ms-2`;
        } else {
            priorityBadge.remove();
        }

        // Set status
        if (task.completed) {
            completedCount++;
            clone.querySelector('.td-task-item').classList.add('td-task-completed');
            clone.querySelector('.td-task-checkbox').checked = true;
        } 
        else if (dueDate < now) {
            urgentCount++;
            clone.querySelector('.td-task-item').classList.add('td-task-urgent');
        } 
        else if ((dueDate - now) < (24 * 60 * 60 * 1000)) {
            upcomingCount++;
            clone.querySelector('.td-task-item').classList.add('td-task-upcoming');
        }

        // Add event listeners
        clone.querySelector('.td-task-checkbox').addEventListener('change', () => {
            toggleTaskComplete(task.id);
        });

        taskList.appendChild(clone);
    });

    // Update counters
    document.getElementById('urgentCount').textContent = urgentCount;
    document.getElementById('upcomingCount').textContent = upcomingCount;
    document.getElementById('completedCount').textContent = completedCount;
}

function formatDueDate(date) {
    const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load tasks from Firebase
    loadTasks().then(tasks => {
        renderTasks(tasks);
    });

    // Setup filter buttons
    document.querySelectorAll('.td-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.td-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Add filtering logic here
        });
    });
});*/