/**
 * Validates a task title
 * @param title The task title to validate
 * @returns {boolean} Whether the title is valid
 */
export const isValidTaskTitle = (title: string): boolean => {
  if (!title || typeof title !== 'string') {
    return false
  }
  
  // Trim whitespace and check if empty
  const trimmedTitle = title.trim()
  if (trimmedTitle.length === 0) {
    return false
  }
  
  // Check maximum length (e.g., 500 characters)
  if (trimmedTitle.length > 500) {
    return false
  }
  
  // Check for potentially harmful characters
  const harmfulPattern = /[<>{}[\]()]/g
  if (harmfulPattern.test(trimmedTitle)) {
    return false
  }
  
  return true
}

/**
 * Validates a task ID
 * @param id The task ID to validate
 * @returns {boolean} Whether the ID is valid
 */
export const isValidTaskId = (id: number | string): boolean => {
  if (typeof id === 'string') {
    const parsedId = parseInt(id)
    if (isNaN(parsedId)) {
      return false
    }
    id = parsedId
  }
  
  return Number.isInteger(id) && id > 0
}

/**
 * Validates task depth
 * @param depth The task depth to validate
 * @returns {boolean} Whether the depth is valid
 */
export const isValidTaskDepth = (depth: number): boolean => {
  return Number.isInteger(depth) && depth >= 0 && depth <= 3 // Maximum depth of 4 levels (0-3)
}

/**
 * Sanitizes a task title
 * @param title The task title to sanitize
 * @returns {string} The sanitized title
 */
export const sanitizeTaskTitle = (title: string): string => {
  if (!title || typeof title !== 'string') {
    return ''
  }
  
  // Trim whitespace
  let sanitized = title.trim()
  
  // Remove potentially harmful characters
  sanitized = sanitized.replace(/[<>{}[\]()]/g, '')
  
  // Truncate to maximum length
  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500)
  }
  
  return sanitized
}

/**
 * Validates task completion status
 * @param isCompleted The completion status to validate
 * @returns {boolean} Whether the status is valid
 */
export const isValidCompletionStatus = (isCompleted: boolean): boolean => {
  return typeof isCompleted === 'boolean'
} 