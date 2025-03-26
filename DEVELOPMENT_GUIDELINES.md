# Todo List Application Development Guidelines

## Table of Contents
- [Overview](#overview)
- [Core Features](#core-features)
- [Development Rules](#development-rules)
- [Code Organization](#code-organization)
- [Performance Guidelines](#performance-guidelines)
- [Error Prevention](#error-prevention)
- [Database Schema](#database-schema)

## Overview

This document outlines the development guidelines and rules for the hierarchical Todo List application. These guidelines ensure consistent development practices and maintain code quality across the project.

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

---

*Note: These guidelines should be reviewed and updated as the project evolves. All team members should follow these rules to maintain consistency and quality across the codebase.* 