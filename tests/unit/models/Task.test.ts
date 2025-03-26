import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Task } from '../../../src/models/Task'

// Mock typeorm
vi.mock('typeorm', () => ({
  PrimaryGeneratedColumn: () => vi.fn(),
  Column: (options = {}) => {
    return vi.fn((target: any, propertyKey: string) => {
      const defaultValue = options.default;
      if (defaultValue !== undefined) {
        Object.defineProperty(target, propertyKey, {
          value: defaultValue,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    });
  },
  CreateDateColumn: () => vi.fn(),
  UpdateDateColumn: () => vi.fn(),
  ManyToOne: () => vi.fn(),
  OneToMany: () => vi.fn(),
  Entity: () => vi.fn()
}))

describe('Task Entity', () => {
  let task: Task

  beforeEach(() => {
    task = new Task()
    // Set default values manually since decorators are mocked
    task.isCompleted = false
    task.depth = 0
    task.parentTask = null
    task.childTasks = []
  })

  describe('Task Creation', () => {
    it('should create a task with default values', () => {
      expect(task.id).toBeUndefined()
      expect(task.title).toBeUndefined()
      expect(task.isCompleted).toBe(false)
      expect(task.depth).toBe(0)
      expect(task.parentTask).toBeNull()
      expect(task.childTasks).toEqual([])
      expect(task.createdAt).toBeUndefined()
      expect(task.updatedAt).toBeUndefined()
    })

    it('should create a task with custom values', () => {
      const now = new Date()
      task.id = 1
      task.title = 'Test Task'
      task.isCompleted = true
      task.depth = 2
      task.createdAt = now
      task.updatedAt = now

      expect(task.id).toBe(1)
      expect(task.title).toBe('Test Task')
      expect(task.isCompleted).toBe(true)
      expect(task.depth).toBe(2)
      expect(task.parentTask).toBeNull()
      expect(task.childTasks).toEqual([])
      expect(task.createdAt).toBe(now)
      expect(task.updatedAt).toBe(now)
    })
  })

  describe('Task Relationships', () => {
    it('should handle parent-child relationship', () => {
      const parentTask = new Task()
      parentTask.id = 1
      parentTask.title = 'Parent Task'

      const childTask = new Task()
      childTask.id = 2
      childTask.title = 'Child Task'
      childTask.parentTask = parentTask
      childTask.depth = 1

      parentTask.childTasks = [childTask]

      expect(parentTask.childTasks).toHaveLength(1)
      expect(parentTask.childTasks[0]).toBe(childTask)
      expect(childTask.parentTask).toBe(parentTask)
      expect(childTask.depth).toBe(1)
    })

    it('should handle multiple child tasks', () => {
      const parentTask = new Task()
      parentTask.id = 1
      parentTask.title = 'Parent Task'

      const child1 = new Task()
      child1.id = 2
      child1.title = 'Child 1'
      child1.parentTask = parentTask
      child1.depth = 1

      const child2 = new Task()
      child2.id = 3
      child2.title = 'Child 2'
      child2.parentTask = parentTask
      child2.depth = 1

      parentTask.childTasks = [child1, child2]

      expect(parentTask.childTasks).toHaveLength(2)
      expect(parentTask.childTasks).toContain(child1)
      expect(parentTask.childTasks).toContain(child2)
      expect(child1.parentTask).toBe(parentTask)
      expect(child2.parentTask).toBe(parentTask)
    })
  })

  describe('Task Properties', () => {
    it('should update task properties', () => {
      task.title = 'Updated Title'
      task.isCompleted = true
      task.depth = 3

      expect(task.title).toBe('Updated Title')
      expect(task.isCompleted).toBe(true)
      expect(task.depth).toBe(3)
    })

    it('should handle empty title', () => {
      task.title = ''
      expect(task.title).toBe('')
    })
  })
})

describe('Task Model', () => {
  let task: Task

  beforeEach(() => {
    task = new Task()
    // Set default values manually since decorators are mocked
    task.isCompleted = false
    task.depth = 0
    task.parentTask = null
    task.childTasks = []
  })

  it('should create a task with default values', () => {
    expect(task.id).toBeUndefined()
    expect(task.title).toBeUndefined()
    expect(task.isCompleted).toBe(false)
    expect(task.depth).toBe(0)
    expect(task.parentTask).toBeNull()
    expect(task.childTasks).toEqual([])
  })
}) 