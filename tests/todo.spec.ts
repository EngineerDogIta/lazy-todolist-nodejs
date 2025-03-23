import { test, expect } from '@playwright/test';

test.describe('Todo Application', () => {
  test('should manage hierarchical tasks with depth limit', async ({ page }) => {
    // Navigate to the application and wait for network idle
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');

    // Wait for the page to be fully loaded
    await page.waitForSelector('.todo-container');

    // Generate a unique task name to track our test tasks
    const uniquePrefix = `Test_${Date.now()}_`;
    const parentTaskName = `${uniquePrefix}Parent`;

    // Add a parent task
    const taskInput = page.locator('#taskText');
    await taskInput.waitFor({ state: 'visible', timeout: 10000 });
    await taskInput.fill(parentTaskName);
    await taskInput.press('Enter');

    // Wait for the page to reload after task addition
    await page.waitForLoadState('networkidle');

    // Find our newly created task by its unique name
    const parentTaskTitle = page.getByText(parentTaskName);
    await expect(parentTaskTitle).toBeVisible();

    // Get the parent task container and its ID
    const parentContainer = parentTaskTitle.locator('xpath=ancestor::div[contains(@class, "list-group-item")]');
    const parentTaskId = await parentContainer.getAttribute('data-testid');
    expect(parentTaskId).toBeTruthy();
    const parentTaskIdNumber = parentTaskId!.replace('todo-item-', '');

    // Add subtasks up to the maximum depth (3 levels)
    const taskTitles = [
      `${uniquePrefix}Level1`,
      `${uniquePrefix}Level2`,
      `${uniquePrefix}Level3`
    ];

    let currentTaskId = parentTaskIdNumber;

    for (const title of taskTitles) {
      // Click "Add Subtask" button for the current task
      const addSubtaskButton = page.locator(`[data-testid="todo-add-subtask-${currentTaskId}"]`);
      await addSubtaskButton.click();

      // Fill and submit the subtask form
      const subtaskForm = page.locator(`#subtask-form-${currentTaskId}`);
      await subtaskForm.locator('input[name="taskText"]').fill(title);
      await subtaskForm.locator('button[type="submit"]').click();

      // Wait for the page to reload
      await page.waitForLoadState('networkidle');

      // Find the newly created subtask by its unique name
      const subtaskTitle = page.getByText(title);
      await expect(subtaskTitle).toBeVisible();

      // Get the subtask container and its ID
      const subtaskContainer = subtaskTitle.locator('xpath=ancestor::div[contains(@class, "list-group-item")]');
      const subtaskId = await subtaskContainer.getAttribute('data-testid');
      expect(subtaskId).toBeTruthy();
      const subtaskIdNumber = subtaskId!.replace('todo-item-', '');

      // Update currentTaskId for the next iteration
      currentTaskId = subtaskIdNumber;
    }

    // Try to add a 4th level subtask and verify the warning message
    const addSubtaskButton = page.locator(`[data-testid="todo-add-subtask-${currentTaskId}"]`);
    await addSubtaskButton.click();
    const subtaskForm = page.locator(`#subtask-form-${currentTaskId}`);
    await subtaskForm.locator('input[name="taskText"]').fill(`${uniquePrefix}Level4`);
    await subtaskForm.locator('button[type="submit"]').click();

    // Verify the warning message appears
    const warningMessage = page.locator('.alert-danger');
    await expect(warningMessage).toBeVisible();
    await expect(warningMessage).toContainText('Cannot add more subtasks. Maximum depth of 4 levels reached.');

    // Test deletion of tasks at different levels
    // Delete the Level 2 task (which should remove Level 3 as well)
    const level2TaskTitle = page.getByText(taskTitles[1]);
    const level2Container = level2TaskTitle.locator('xpath=ancestor::div[contains(@class, "list-group-item")]');
    const deleteButton = level2Container.locator('button[title="Delete"]');

    // Handle the confirmation dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Are you sure');
      await dialog.accept();
    });

    await deleteButton.click();
    await page.waitForLoadState('networkidle');

    // Verify Level 2 and its subtasks are deleted
    await expect(page.getByText(taskTitles[1])).not.toBeVisible();
    await expect(page.getByText(taskTitles[2])).not.toBeVisible();

    // Verify parent and Level 1 tasks are still visible
    await expect(page.getByText(parentTaskName)).toBeVisible();
    await expect(page.getByText(taskTitles[0])).toBeVisible();

    // Cleanup: Delete all remaining test tasks
    // First, delete Level 1 task
    const level1TaskTitle = page.getByText(taskTitles[0]);
    const level1Container = level1TaskTitle.locator('xpath=ancestor::div[contains(@class, "list-group-item")]');
    const level1DeleteButton = level1Container.locator('button[title="Delete"]');
    await level1DeleteButton.click();
    await page.waitForLoadState('networkidle');

    // Finally, delete the parent task
    const parentDeleteButton = page.locator(`[data-testid="todo-delete-${parentTaskIdNumber}"]`);
    await parentDeleteButton.click();
    await page.waitForLoadState('networkidle');

    // Verify all test tasks are deleted
    await expect(page.getByText(parentTaskName)).not.toBeVisible();
    await expect(page.getByText(taskTitles[0])).not.toBeVisible();
  });
}); 