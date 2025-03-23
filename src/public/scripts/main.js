// Client-side JavaScript for the todo application
document.addEventListener('DOMContentLoaded', function() {
    // Add form submission handling
    const taskForm = document.querySelector('form');
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            const taskInput = document.getElementById('taskText');
            if (taskInput && !taskInput.value.trim()) {
                e.preventDefault();
                alert('Please enter a task');
            }
        });
    }

    // Add delete confirmation
    const deleteButtons = document.querySelectorAll('button[type="submit"]');
    deleteButtons.forEach(button => {
        if (button.textContent.includes('Delete')) {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to delete this task?')) {
                    e.preventDefault();
                }
            });
        }
    });
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