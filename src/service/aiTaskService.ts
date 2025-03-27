import { Task } from '../models/Task';
import logger from '../config/logger';
import ollama from 'ollama';

export class AITaskService {
    // Placeholder for actual LLM integration
    async generateTasksFromPrompt(prompt: string): Promise<Task[]> {
        logger.info('Generating tasks from prompt', { prompt });
        
        // Implement actual LLM integration
        try {
            const systemPrompt = `You are a task breakdown assistant. Given a high-level task or goal, break it down into 3-5 logical subtasks. 
            Format your response as a JSON array of tasks, where each task has a 'title' property. Example:
            [
                {"title": "Main task"},
                {"title": "Subtask 1"},
                {"title": "Subtask 2"}
            ]`;

            const response = await ollama.chat({
                model: 'gemma3:4b', // or your preferred model
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
            });

            // Parse the JSON response
            const generatedTasks = JSON.parse(response.message.content);
            logger.info('Generated tasks from LLM', { generatedTasks });

            // Convert generated tasks to Task entities
            const tasks: Task[] = [];

            // Create Task entities from generated tasks
            for (const generatedTask of generatedTasks) {
                const task = new Task();
                task.title = generatedTask.title;
                task.isCompleted = false;
                task.depth = 0;
                tasks.push(task);
            }

            // If we have tasks, set up parent-child relationships
            if (tasks.length > 0) {
                const rootTask = tasks[0];
                rootTask.depth = 0;

                // Make remaining tasks children of root task
                for (let i = 1; i < tasks.length; i++) {
                    tasks[i].parentTask = rootTask;
                    tasks[i].depth = 1; // Fixed depth of 1 for all subtasks
                }
            }
            // Return the tasks
            return tasks;
        } catch (error) {
            logger.error('Error generating tasks from prompt', { error });
            throw error;
        }
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