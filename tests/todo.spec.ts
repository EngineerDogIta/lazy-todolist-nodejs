import { test, expect, type Page, type Locator } from '@playwright/test';

// Create a TodoPage class following the Page Object Model pattern
class TodoPage {
  private readonly taskInput: Locator;
  private readonly addButton: Locator;
  private readonly refreshButton: Locator;
  private createdTaskIds: string[] = []; // Track created task IDs
  private dialogHandler: ((dialog: any) => Promise<void>) | null = null;

  constructor(private page: Page) {
    this.taskInput = page.locator('textarea#taskText');
    this.addButton = page.locator('button.btn.btn-primary:has-text("Aggiungi")');
    this.refreshButton = page.locator('[data-testid="refresh-button"]');
  }

  async goto() {
    await this.page.goto('http://localhost:8080');
    // Wait for the page to be fully loaded
    await this.page.waitForLoadState('networkidle');
  }

  async refresh() {
    await this.refreshButton.click();
    // Wait for the page to reload
    await this.page.waitForLoadState('networkidle');
  }

  private setupDialogHandler() {
    if (this.dialogHandler) {
      this.page.removeListener('dialog', this.dialogHandler);
    }
    this.dialogHandler = async (dialog) => {
      await dialog.accept();
    };
    this.page.on('dialog', this.dialogHandler);
  }

  async addTask(text: string) {
    await this.taskInput.fill(text);
    
    // Wait for both the click and navigation
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
      this.addButton.click()
    ]);
    
    // Wait for the task to appear and get its ID
    const taskElement = await this.page.waitForSelector(`[data-testid^="todo-title-"]:has-text("${text}")`, { timeout: 10000 });
    const taskId = await taskElement.getAttribute('data-testid');
    if (taskId) {
      this.createdTaskIds.push(taskId.replace('todo-title-', ''));
    }
    
    await expect(this.getTaskTitle(text)).toBeVisible();
  }

  async addSubtask(parentTaskText: string, subtaskText: string) {
    // Find the parent task container
    const parentTask = await this.page.waitForSelector(`[data-testid^="todo-title-"]:has-text("${parentTaskText}")`, { timeout: 10000 });
    const parentTaskId = await parentTask.getAttribute('data-testid');
    const taskId = parentTaskId?.replace('todo-title-', '');
    
    if (!taskId) {
      throw new Error(`Could not find parent task with text: ${parentTaskText}`);
    }
    
    // Click the add subtask button
    await this.page.click(`[data-testid="todo-add-subtask-${taskId}"]`);
    
    // Fill and submit the subtask form
    const subtaskForm = this.page.locator(`#subtask-form-${taskId}`);
    await subtaskForm.locator('input[name="taskText"]').fill(subtaskText);
    
    // Wait for both the form submission and navigation
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
      subtaskForm.locator('button[type="submit"]').click()
    ]);
    
    // Wait for the subtask to appear and get its ID
    const subtaskElement = await this.page.waitForSelector(`[data-testid^="todo-title-"]:has-text("${subtaskText}")`, { timeout: 10000 });
    const subtaskId = await subtaskElement.getAttribute('data-testid');
    if (subtaskId) {
      this.createdTaskIds.push(subtaskId.replace('todo-title-', ''));
    }
    
    await expect(this.getTaskTitle(subtaskText)).toBeVisible();
  }

  async deleteTask(taskText: string) {
    // Find the task container by its text and get its ID
    const taskElement = await this.page.waitForSelector(`[data-testid^="todo-title-"]:has-text("${taskText}")`, { timeout: 10000 });
    const taskId = await taskElement.getAttribute('data-testid');
    const id = taskId?.replace('todo-title-', '');
    
    if (!id) {
      throw new Error(`Could not find task with text: ${taskText}`);
    }
    
    // Set up dialog handler before clicking delete
    this.setupDialogHandler();
    
    // Find the delete form and submit it
    const deleteForm = this.page.locator(`[data-testid="todo-item-${id}"] form.d-inline`);
    
    // Submit the form and wait for navigation
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }),
      deleteForm.evaluate((form: HTMLFormElement, taskId: string) => {
        // Set the form data
        const taskIdInput = form.querySelector('input[name="taskId"]') as HTMLInputElement;
        const actionInput = form.querySelector('input[name="action"]') as HTMLInputElement;
        if (taskIdInput && actionInput) {
          taskIdInput.value = taskId;
          actionInput.value = 'delete';
        }
        form.submit();
      }, id)
    ]);
    
    // Wait for the task to be removed from the DOM
    await this.page.waitForSelector(`[data-testid="todo-title-${id}"]`, { state: 'detached', timeout: 10000 });
  }

  async cleanup() {
    // Delete all created tasks in reverse order
    for (const id of [...this.createdTaskIds].reverse()) {
      try {
        // Check if the task still exists
        const taskElement = await this.page.$(`[data-testid="todo-title-${id}"]`);
        if (!taskElement) {
          console.log(`Task ${id} not found during cleanup, skipping...`);
          continue;
        }
        
        const taskText = await taskElement.textContent();
        if (taskText) {
          await this.deleteTask(taskText);
        }
      } catch (error) {
        console.log(`Failed to cleanup task ${id}:`, error);
        // Continue with other tasks even if one fails
      }
    }
    this.createdTaskIds = [];
  }

  getTaskTitle(text: string): Locator {
    return this.page.locator(`[data-testid^="todo-title-"]:has-text("${text}")`);
  }
}

test.describe('Todo Application', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  // Add afterEach hook to clean up after each test
  test.afterEach(async () => {
    await todoPage.cleanup();
  });

  test('should add and remove a task', async () => {
    const taskName = `Test Task ${Date.now()}`;
    await todoPage.addTask(taskName);
    await todoPage.refresh();
    await expect(todoPage.getTaskTitle(taskName)).toBeVisible();
    await todoPage.deleteTask(taskName);
    await todoPage.refresh();
    await expect(todoPage.getTaskTitle(taskName)).toHaveCount(0);
  });

  test('should manage first level subtask', async () => {
    const parentName = `Parent ${Date.now()}`;
    const childName = `Child ${Date.now()}`;
    
    await todoPage.addTask(parentName);
    await todoPage.refresh();
    await expect(todoPage.getTaskTitle(parentName)).toBeVisible();
    
    await todoPage.addSubtask(parentName, childName);
    await todoPage.refresh();
    await expect(todoPage.getTaskTitle(childName)).toBeVisible();
    
    await todoPage.deleteTask(parentName);
    await todoPage.refresh();
    
    await expect(todoPage.getTaskTitle(parentName)).toHaveCount(0);
    await expect(todoPage.getTaskTitle(childName)).toHaveCount(0);
  });

  test('should manage multiple levels of subtasks up to 3rd depth', async () => {
    const timestamp = Date.now();
    const level1Name = `Level1_${timestamp}`;
    const level2Name = `Level2_${timestamp}`;
    const level3Name = `Level3_${timestamp}`;
    
    await todoPage.addTask(level1Name);
    await todoPage.refresh();
    await expect(todoPage.getTaskTitle(level1Name)).toBeVisible();
    
    await todoPage.addSubtask(level1Name, level2Name);
    await todoPage.refresh();
    await expect(todoPage.getTaskTitle(level2Name)).toBeVisible();
    
    await todoPage.addSubtask(level2Name, level3Name);
    await todoPage.refresh();
    await expect(todoPage.getTaskTitle(level3Name)).toBeVisible();
    
    await todoPage.deleteTask(level1Name);
    await todoPage.refresh();
    
    await expect(todoPage.getTaskTitle(level1Name)).toHaveCount(0);
    await expect(todoPage.getTaskTitle(level2Name)).toHaveCount(0);
    await expect(todoPage.getTaskTitle(level3Name)).toHaveCount(0);
  });
}); 