import { Task } from '../models/Task';
import logger from '../config/logger';

export class AITaskService {
    // Placeholder for actual LLM integration
    async generateTasksFromPrompt(prompt: string): Promise<Task[]> {
        logger.info('Generating tasks from prompt', { prompt });
        // TODO: Implement actual LLM integration
        
        // Map the generated tasks to the Task model

        // Create the task objects
        const tasks: Task[] = [];
        const getUniqueId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        const task = new Task();
        task.title = `Example task from AI (${getUniqueId()})`;
        task.isCompleted = false;
        tasks.push(task);

        const task2 = new Task();
        task2.title = `Example task 2 from AI (${getUniqueId()})`;
        task2.isCompleted = false;
        tasks.push(task2);

        const task3 = new Task();
        task3.title = `Example task 3 from AI (${getUniqueId()})`;
        task3.isCompleted = false;
        tasks.push(task3);

        const task4 = new Task();
        task4.title = `Example task 4 from AI (${getUniqueId()})`;
        task4.isCompleted = false;
        tasks.push(task4);

        const task5 = new Task();
        task5.title = `Example task 5 from AI (${getUniqueId()})`;
        task5.isCompleted = false;
        tasks.push(task5);

        // Define the root task, it is always the first task
        const rootTask = task;
        
        // Assign the parentTask attribute to the tasks
        // Assign first last child task to the root task
        task3.parentTask = task2;
        task2.parentTask = rootTask

        task4.parentTask = rootTask;
        task5.parentTask = rootTask;

        // Return the tasks
        return tasks;
    }

    async generateRandomPrompt(): Promise<string> {
        logger.info('Generating random prompt example');
        // TODO: Implement actual prompt generation
        const examplePrompts = [
            "Create a study plan for learning TypeScript",
            "Plan a weekend home cleaning routine",
            "Organize a small team meeting agenda"
        ];
        return examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    }
}

export const aiTaskService = new AITaskService();