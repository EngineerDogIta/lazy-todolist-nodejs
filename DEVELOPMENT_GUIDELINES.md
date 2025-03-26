# Todo List Application Development Guidelines

## Table of Contents
- [Intended Audience](#intended-audience)
- [Overview](#overview)
- [Core Features](#core-features)
- [Development Rules](#development-rules)
- [Code Organization](#code-organization)
- [Performance Guidelines](#performance-guidelines)
- [Error Prevention](#error-prevention)
- [Database Schema](#database-schema)
- [TODO & Future Improvements](#todo)

## Intended Audience
This document serves as a reference for:
- Developers implementing todo list features
- Code reviewers evaluating changes
- Project managers tracking technical requirements
- QA engineers validating implementations

## Overview

This document outlines the development guidelines and rules for the hierarchical Todo List application. These guidelines ensure:
- Consistent code quality across the project
- Maintainable and scalable architecture
- Reduced technical debt
- Faster onboarding for new team members

## Core Features

### Task Management System

1. **Task Creation**
   - New tasks via "Nuovo Task" input field
   - Support for standalone and child tasks
   - Input validation required

2. **Task Hierarchy**
   - Maximum 4 levels of nesting (depth-0 through depth-3)
   - Visual level indicators:
     - Level 1: Primary blue (`--color-primary`)
     - Level 2: Success green (`--color-success`)
     - Level 3: Warning yellow (`--color-warning`)
     - Level 4: Danger red (`--color-danger`)

3. **Task Actions**
   - Complete/uncomplete functionality
   - Delete capability
   - Subtask counter
   - List refresh feature

### Task Validation Rules
- Title length: 3-255 characters
- Allowed characters: alphanumeric, basic punctuation
- No HTML/script injection
- Examples:
  ✅ "Complete project report"
  ❌ "<script>alert(1)</script>"

### Error Handling
- Invalid input: Display inline validation message
- Network failure: Retry mechanism with user feedback
- Maximum depth reached: Clear warning with explanation

### Task Types
- Standalone: Top-level tasks with no parent
- Child: Subtasks that belong to a parent task
Example hierarchy:
- Project Plan (standalone)
  - Research (child)
    - Market Analysis (child)

## Technical Requirements
- Browsers: Latest 2 versions of Chrome, Firefox, Safari, Edge
- Mobile: iOS 14+, Android 10+
- Minimum screen size: 320px width

### Testing Requirements
- Unit test coverage: >80%
- E2E test scenarios:
  - Task CRUD operations
  - Nested task management
  - Error handling

## Development Rules

### Layout Constraints

```css
/* Container maximum width */
.todo {
    max-width: 900px;
    margin: 0 auto;
}

/* Task list height */
.todo__list {
    height: calc(100vh - 180px);
    overflow-y: auto;
}
```

### Responsive Design Rules

1. **Breakpoints**
   - Mobile: < 768px (single column)
   - Tablet: 768px - 1024px
   - Desktop: > 1024px

2. **Mobile Adaptations**
   - Hide button text
   - Adjust task indentation
   - Stack columns vertically

3. **Accessibility Requirements**
   - Support reduced motion
   - Keyboard navigation
   - ARIA labels for interactive elements
   - Minimum contrast ratio: 4.5:1

### ARIA Implementation
- Task items: role="listitem"
- Buttons: aria-label="[action description]"
- Status updates: aria-live="polite"
- Focus management for nested tasks

### Color Contrast
- Primary text: 7:1 ratio
- Secondary text: 4.5:1 ratio
Example combinations:
- Text #2c3e50 on #ffffff = 7.72:1 ✅
- Text #6c757d on #f8f9fa = 3.28:1 ❌

## Code Organization

### CSS Structure

1. **Variable Naming**
   ```css
   :root {
       /* Spacing */
       --spacing-xs: 0.25rem;
       --spacing-sm: 0.5rem;
       --spacing-md: 0.75rem;
       --spacing-lg: 1rem;
       --spacing-xl: 1.5rem;

       /* Colors */
       --color-border: #e9ecef;
       --color-bg-hover: #f8f9fa;
       --color-text: #2c3e50;
       --color-text-muted: #6c757d;
       --color-primary: #4a90e2;
       --color-success: #50b83c;
       --color-warning: #f4b400;
       --color-danger: #db4437;
   }
   ```

2. **Class Naming Convention**
   - Follow BEM methodology
   - Use descriptive, functional names
   - Maintain consistent prefixing

### BEM Examples
✅ Good:
.task-list {}
.task-list__item {}
.task-list__item--completed {}

❌ Bad:
.taskList {}
.task_list__item-completed {}

### Project Structure
src/
  components/
    Task/
      Task.tsx
      Task.test.tsx
      Task.styles.css
  hooks/
  utils/
  types/

### Component Documentation
Required for each component:
- Purpose
- Props interface
- Usage examples
- Known limitations

### Component Rules

1. **Task Component Structure**
   ```css
   .task {
       position: relative;
       display: grid;
       grid-template-columns: 1fr auto;
       min-height: 2rem;
       margin: var(--spacing-xs) 0;
       border-radius: var(--border-radius);
   }
   ```

2. **Nesting Guidelines**
   - Maximum depth: 4 levels
   - Visual indicators per level
   - Consistent indentation

## Performance Guidelines

### Animation Rules

1. **Transitions**
   - Duration: ≤ 200ms
   - Use hardware acceleration
   - Implement reduced motion alternatives

2. **Layout Performance**
   - Avoid nested animations
   - Use CSS Grid for layouts
   - Implement virtual scrolling

### Resource Management

1. **Image Optimization**
   - Use appropriate formats
   - Implement lazy loading
   - Compress assets

2. **Code Splitting**
   - Lazy load components
   - Bundle optimization
   - Tree shaking

## Error Prevention

### Task Validation

1. **Input Validation**
   - No empty tasks
   - Maximum character limit: 255
   - Sanitize input

2. **Nesting Validation**
   - Prevent excess nesting
   - Validate parent-child relations
   - Maintain hierarchy integrity

### UI Protection

1. **Boundary Protection**
   - Overflow handling
   - Responsive safeguards
   - Minimum touch targets: 44x44px

2. **Error Handling**
   - Clear error messages
   - Fallback UI states
   - Recovery mechanisms

### Input Sanitization
- Strip HTML tags
- Encode special characters
- Validate UTF-8 encoding
- Maximum length enforcement

### Security Guidelines
- CSRF protection on forms
- XSS prevention in task content
- Rate limiting: 100 requests/minute
- Input validation on both client and server

## Database Schema

### Task Table Structure

```sql
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    createdAt DATETIME,
    updatedAt DATETIME,
    parentId TEXT,
    depth INTEGER,
    FOREIGN KEY (parentId) REFERENCES tasks(id)
);
```

### Indexing Rules

1. **Required Indexes**
   - Primary key (id)
   - Parent relationship (parentId)
   - Creation date (createdAt)

2. **Constraints**
   - NOT NULL on required fields
   - Cascade delete for child tasks
   - Maximum depth validation

## Branch Management
- main: Production code
- develop: Integration branch
- feature/*: New features
- hotfix/*: Emergency fixes

### Code Review Checklist
- Follows naming conventions
- Implements error handling
- Includes tests
- Meets accessibility requirements
- Performance impact considered

## TODO & Future Improvements
- Implement internationalization (i18n) support
- Add query optimization for large datasets
- Implement caching strategy
- Define documentation update process
- Add comprehensive troubleshooting guides

---

*Note: These guidelines should be reviewed and updated as the project evolves. All team members should follow these rules to maintain consistency and quality across the codebase.* 