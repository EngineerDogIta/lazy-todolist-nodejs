import { describe, it, expect } from 'vitest'
import {
  isValidTaskTitle,
  isValidTaskId,
  isValidTaskDepth,
  sanitizeTaskTitle,
  isValidCompletionStatus
} from '../../../src/utils/validation'

describe('Validation Utilities', () => {
  describe('isValidTaskTitle', () => {
    it('should validate valid task titles', () => {
      expect(isValidTaskTitle('Valid Task')).toBe(true)
      expect(isValidTaskTitle('Another valid task')).toBe(true)
      expect(isValidTaskTitle('Task with numbers 123')).toBe(true)
    })

    it('should reject empty or whitespace-only titles', () => {
      expect(isValidTaskTitle('')).toBe(false)
      expect(isValidTaskTitle('   ')).toBe(false)
      expect(isValidTaskTitle('\t\n\r')).toBe(false)
    })

    it('should reject titles with harmful characters', () => {
      expect(isValidTaskTitle('Task with <script>')).toBe(false)
      expect(isValidTaskTitle('Task with {brackets}')).toBe(false)
      expect(isValidTaskTitle('Task with [brackets]')).toBe(false)
      expect(isValidTaskTitle('Task with (parentheses)')).toBe(false)
    })

    it('should reject titles exceeding maximum length', () => {
      const longTitle = 'a'.repeat(501)
      expect(isValidTaskTitle(longTitle)).toBe(false)
    })

    it('should reject non-string inputs', () => {
      expect(isValidTaskTitle(null as any)).toBe(false)
      expect(isValidTaskTitle(undefined as any)).toBe(false)
      expect(isValidTaskTitle(123 as any)).toBe(false)
    })
  })

  describe('isValidTaskId', () => {
    it('should validate valid task IDs', () => {
      expect(isValidTaskId(1)).toBe(true)
      expect(isValidTaskId(123)).toBe(true)
      expect(isValidTaskId('1')).toBe(true)
      expect(isValidTaskId('123')).toBe(true)
    })

    it('should reject invalid task IDs', () => {
      expect(isValidTaskId(0)).toBe(false)
      expect(isValidTaskId(-1)).toBe(false)
      expect(isValidTaskId(1.5)).toBe(false)
      expect(isValidTaskId('0')).toBe(false)
      expect(isValidTaskId('-1')).toBe(false)
      expect(isValidTaskId('abc')).toBe(false)
      expect(isValidTaskId('')).toBe(false)
    })
  })

  describe('isValidTaskDepth', () => {
    it('should validate valid task depths', () => {
      expect(isValidTaskDepth(0)).toBe(true)
      expect(isValidTaskDepth(1)).toBe(true)
      expect(isValidTaskDepth(2)).toBe(true)
      expect(isValidTaskDepth(3)).toBe(true)
    })

    it('should reject invalid task depths', () => {
      expect(isValidTaskDepth(-1)).toBe(false)
      expect(isValidTaskDepth(4)).toBe(false)
      expect(isValidTaskDepth(1.5)).toBe(false)
    })
  })

  describe('sanitizeTaskTitle', () => {
    it('should sanitize valid task titles', () => {
      expect(sanitizeTaskTitle('Valid Task')).toBe('Valid Task')
      expect(sanitizeTaskTitle('  Task with spaces  ')).toBe('Task with spaces')
    })

    it('should remove harmful characters', () => {
      expect(sanitizeTaskTitle('Task with <script>')).toBe('Task with script')
      expect(sanitizeTaskTitle('Task with {brackets}')).toBe('Task with brackets')
      expect(sanitizeTaskTitle('Task with [brackets]')).toBe('Task with brackets')
      expect(sanitizeTaskTitle('Task with (parentheses)')).toBe('Task with parentheses')
    })

    it('should truncate long titles', () => {
      const longTitle = 'a'.repeat(501)
      expect(sanitizeTaskTitle(longTitle)).toBe('a'.repeat(500))
    })

    it('should handle invalid inputs', () => {
      expect(sanitizeTaskTitle('')).toBe('')
      expect(sanitizeTaskTitle(null as any)).toBe('')
      expect(sanitizeTaskTitle(undefined as any)).toBe('')
      expect(sanitizeTaskTitle(123 as any)).toBe('')
    })
  })

  describe('isValidCompletionStatus', () => {
    it('should validate valid completion statuses', () => {
      expect(isValidCompletionStatus(true)).toBe(true)
      expect(isValidCompletionStatus(false)).toBe(true)
    })

    it('should reject invalid completion statuses', () => {
      expect(isValidCompletionStatus(null as any)).toBe(false)
      expect(isValidCompletionStatus(undefined as any)).toBe(false)
      expect(isValidCompletionStatus(1 as any)).toBe(false)
      expect(isValidCompletionStatus('true' as any)).toBe(false)
    })
  })
}) 