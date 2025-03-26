// Client-side JavaScript for the todo application
document.addEventListener('DOMContentLoaded', function() {
    // Add form submission handling for the add task form only
    const taskForm = document.querySelector('form#add-task-form');  // Update selector to target specific form
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            const taskInput = document.getElementById('taskText');
            if (taskInput && !taskInput.value.trim()) {
                e.preventDefault();
                alert('Please enter a task');
            }
        });
    }
});

// Function to toggle subtask form visibility
function toggleSubtaskForm(taskId) {
    const form = document.getElementById(`subtask-form-${taskId}`);
    if (form) {
        form.classList.toggle('d-none');
        if (!form.classList.contains('d-none')) {
            form.querySelector('input[name="taskText"]').focus();
        }
    }
}

async function toggleTaskCompletion(taskId) {
    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                taskId: taskId,
                action: 'toggle-completion'
            })
        });

        if (response.ok) {
            const taskTitle = document.querySelector(`[data-testid="todo-title-${taskId}"]`);
            taskTitle.classList.toggle('task__title--completed');
            taskTitle.setAttribute('aria-checked', taskTitle.classList.contains('task__title--completed'));
        }
    } catch (error) {
        console.error('Error toggling task completion:', error);
    }
} 