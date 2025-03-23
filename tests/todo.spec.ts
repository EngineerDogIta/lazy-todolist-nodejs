import { test, expect } from '@playwright/test';

test.describe('Todo Application', () => {
  test('should add and delete a task', async ({ page }) => {
    // Generate a unique task title using timestamp
    const uniqueTaskTitle = `Test task ${Date.now()}`;

    // Navigate to the application and wait for network idle
    await page.goto('http://localhost:8080');
    await page.waitForLoadState('networkidle');

    // Wait for the page to be fully loaded
    await page.waitForSelector('.todo-container');

    // Add a new task
    const taskInput = page.locator('#taskText');
    await taskInput.waitFor({ state: 'visible', timeout: 10000 });
    await taskInput.fill(uniqueTaskTitle);
    await taskInput.press('Enter');

    // Wait for the page to reload after task addition
    await page.waitForLoadState('networkidle');

    // Verify task was added
    const taskList = page.locator('.list-group');
    await expect(taskList).toBeVisible();
    await expect(page.getByText(uniqueTaskTitle)).toBeVisible();

    // Find the specific task container
    const taskContainer = page.locator(`.list-group-item:has-text("${uniqueTaskTitle}")`);
    await expect(taskContainer).toBeVisible();

    // Get the task ID
    const taskId = await taskContainer.getAttribute('data-testid').then(id => id?.replace('todo-item-', ''));
    expect(taskId).toBeTruthy();

    // Handle the confirmation dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Are you sure');
      await dialog.accept();
    });

    // Click delete button and wait for the page to reload
    const deleteButton = page.locator(`[data-testid="todo-delete-${taskId}"]`);
    await deleteButton.click();
    await page.waitForLoadState('networkidle');

    // Verify task was deleted - multiple checks
    await expect(page.getByText(uniqueTaskTitle)).not.toBeVisible();
    await expect(taskContainer).not.toBeVisible();
    await expect(page.locator(`[data-testid="todo-item-${taskId}"]`)).not.toBeVisible();

    // Additional verification - check if the task exists in the list
    const allTasks = await page.locator('.task-title').allTextContents();
    expect(allTasks).not.toContain(uniqueTaskTitle);
  });
}); 