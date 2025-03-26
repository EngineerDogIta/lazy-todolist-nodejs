import { vi, describe, it, expect, beforeEach } from 'vitest'
import { Request, Response } from 'express'
import taskController from '../../../src/controllers/task'
import logger from '../../../src/config/logger'
import { Task } from '../../../src/models/Task'

const ERROR_MESSAGES = {
  MAX_DEPTH: 'Maximum task depth exceeded',
  MISSING_TASK_TEXT: 'GET request attempted without task text'
} as const;

interface MockTask extends Task {
  id: number;
  title: string;
  isCompleted: boolean;
  depth: number;
  parentTask: MockTask | null;
  childTasks: MockTask[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock logger
vi.mock('../../../src/config/logger', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }
}))

// Mock TypeORM repository
vi.mock('../../../src/config/typeorm.config', () => ({
  AppDataSource: {
    getRepository: vi.fn().mockReturnValue({
      save: vi.fn(),
      findOne: vi.fn(),
      remove: vi.fn(),
      createQueryBuilder: vi.fn().mockReturnThis(),
      leftJoinAndSelect: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      getMany: vi.fn().mockResolvedValue([]),
      getOne: vi.fn().mockResolvedValue(null)
    })
  }
}))

describe('Task Controller', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockTask: MockTask

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup mock task
    mockTask = {
      id: 1,
      title: 'Test Task',
      isCompleted: false,
      depth: 0,
      parentTask: null,
      childTasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Setup mock request
    mockReq = {
      body: {},
      query: {},
      xhr: false,
      headers: {}
    }

    // Setup mock response
    mockRes = {
      redirect: vi.fn().mockReturnThis(),
      render: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    }
  })

  describe('postAddTask', () => {
    it('should create a new task successfully', async () => {
      const taskText = 'New Task'
      mockReq.body = { taskText }
      
      await taskController.postAddTask(mockReq as Request, mockRes as Response)

      expect(mockRes.redirect).toHaveBeenCalledWith('/')
      expect(logger.info).toHaveBeenCalledWith('Task created successfully', expect.any(Object))
    })

    it('should handle task deletion', async () => {
      const taskId = 1
      mockReq.body = { 
        action: 'delete',
        taskId: taskId.toString()
      }

      // Mock repository responses
      const { AppDataSource } = await import('../../../src/config/typeorm.config')
      const mockRepository = AppDataSource.getRepository(Task)
      const mockFindOne = mockRepository.findOne as unknown as ReturnType<typeof vi.fn>
      const mockRemove = mockRepository.remove as unknown as ReturnType<typeof vi.fn>
      
      mockFindOne.mockResolvedValueOnce(mockTask)
      mockRemove.mockResolvedValueOnce(mockTask)

      await taskController.postAddTask(mockReq as Request, mockRes as Response)

      expect(mockRes.redirect).toHaveBeenCalledWith('/')
      expect(logger.info).toHaveBeenCalledWith('Task deleted successfully', expect.any(Object))
    })

    it('should handle task completion toggle', async () => {
      const taskId = 1
      mockReq.body = {
        action: 'toggle-completion',
        taskId: taskId.toString()
      }

      // Mock repository responses
      const { AppDataSource } = await import('../../../src/config/typeorm.config')
      const mockRepository = AppDataSource.getRepository(Task)
      const mockFindOne = mockRepository.findOne as unknown as ReturnType<typeof vi.fn>
      const mockSave = mockRepository.save as unknown as ReturnType<typeof vi.fn>
      
      mockFindOne.mockResolvedValueOnce(mockTask)
      mockSave.mockResolvedValueOnce({ ...mockTask, isCompleted: true })

      await taskController.postAddTask(mockReq as Request, mockRes as Response)

      expect(mockRes.redirect).toHaveBeenCalledWith('/')
    })

    it('should handle subtask creation', async () => {
      const taskText = 'Subtask'
      const parentId = 1
      mockReq.body = {
        action: 'add-subtask',
        taskText,
        parentId: parentId.toString()
      }

      // Mock repository responses
      const { AppDataSource } = await import('../../../src/config/typeorm.config')
      const mockRepository = AppDataSource.getRepository(Task)
      const mockQueryBuilder = mockRepository.createQueryBuilder()
      const mockGetOne = mockQueryBuilder.getOne as unknown as ReturnType<typeof vi.fn>
      const mockSave = mockRepository.save as unknown as ReturnType<typeof vi.fn>
      
      // Mock parent task with depth 0
      const parentTask = { ...mockTask, depth: 0 }
      mockGetOne.mockResolvedValueOnce(parentTask)
      mockSave.mockResolvedValueOnce({ ...mockTask, title: taskText, depth: 1, parentTask })

      await taskController.postAddTask(mockReq as Request, mockRes as Response)

      expect(mockRes.redirect).toHaveBeenCalledWith('/')
      expect(logger.info).toHaveBeenCalledWith('Subtask created successfully', expect.any(Object))
    })

    it('should handle maximum depth exceeded error', async () => {
      const taskText = 'Deep Subtask'
      const parentId = 1
      mockReq.body = {
        action: 'add-subtask',
        taskText,
        parentId: parentId.toString()
      }

      // Mock repository responses
      const { AppDataSource } = await import('../../../src/config/typeorm.config')
      const mockRepository = AppDataSource.getRepository(Task)
      
      // Create a deeply nested task structure
      const deepTask = {
        ...mockTask,
        depth: 4,
        parentTask: {
          ...mockTask,
          depth: 3,
          parentTask: {
            ...mockTask,
            depth: 2,
            parentTask: {
              ...mockTask,
              depth: 1,
              parentTask: {
                ...mockTask,
                depth: 0
              }
            }
          }
        }
      }

      // Mock the createQueryBuilder chain for both the initial query and the error handling
      const createQueryBuilderMock = vi.fn().mockReturnValue({
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([mockTask]),
        getOne: vi.fn().mockResolvedValue(deepTask)
      })

      mockRepository.createQueryBuilder = createQueryBuilderMock

      await taskController.postAddTask(mockReq as Request, mockRes as Response)

      expect(logger.error).toHaveBeenCalledWith('Attempted to exceed maximum task depth', expect.any(Object))
      expect(createQueryBuilderMock).toHaveBeenCalledTimes(2)
      expect(mockRes.render).toHaveBeenCalledWith('home', {
        tasklist: [mockTask],
        error: ERROR_MESSAGES.MAX_DEPTH,
        pageTitle: 'Giornalino a puntini'
      })
    })
  })

  describe('getAddTask', () => {
    it('should create a task via GET request', async () => {
      const taskText = 'GET Task'
      mockReq.query = { taskText }

      await taskController.getAddTask(mockReq as Request, mockRes as Response)

      expect(mockRes.redirect).toHaveBeenCalledWith('/')
      expect(logger.info).toHaveBeenCalledWith('Task created successfully via GET', expect.any(Object))
    })

    it('should handle missing task text', async () => {
      mockReq.query = {}

      await taskController.getAddTask(mockReq as Request, mockRes as Response)

      expect(mockRes.redirect).toHaveBeenCalledWith('/error')
      expect(logger.warn).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_TASK_TEXT, expect.any(Object))
    })
  })

  describe('getHomeTasks', () => {
    it('should retrieve and render tasks', async () => {
      const mockTasks = [mockTask]
      const { AppDataSource } = await import('../../../src/config/typeorm.config')
      const mockRepository = AppDataSource.getRepository(Task)
      
      // Mock the createQueryBuilder chain
      mockRepository.createQueryBuilder = vi.fn().mockReturnValue({
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(mockTasks)
      })

      await taskController.getHomeTasks(mockReq as Request, mockRes as Response)
      
      expect(mockRes.render).toHaveBeenCalledWith('home', {
        tasklist: mockTasks,
        pageTitle: 'Giornalino a puntini',
        error: null
      })
    })

    it('should handle error messages in query params', async () => {
      const mockTasks = [mockTask]
      const errorMessage = 'Test error'
      mockReq.query = { error: encodeURIComponent(errorMessage) }
      
      const { AppDataSource } = await import('../../../src/config/typeorm.config')
      const mockRepository = AppDataSource.getRepository(Task)
      
      // Mock the createQueryBuilder chain
      mockRepository.createQueryBuilder = vi.fn().mockReturnValue({
        leftJoinAndSelect: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(mockTasks)
      })

      await taskController.getHomeTasks(mockReq as Request, mockRes as Response)

      expect(mockRes.render).toHaveBeenCalledWith('home', {
        tasklist: mockTasks,
        pageTitle: 'Giornalino a puntini',
        error: errorMessage
      })
    })
  })
}) 