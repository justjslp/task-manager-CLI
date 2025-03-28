# To-Do List CLI Use Cases

This document outlines the primary use cases for the To-Do List Command-Line Interface (CLI) application. Each task is represented as an object with properties such as description, status, and creation date, and is stored in an array.

## 1. Task Management

### 1.1 Add a New Task

**Actor:** User  
**Preconditions:**

- The CLI application is running.

**Main Flow:**

1. The user enters the command to add a new task.
2. The system prompts the user for a task description.
3. The user optionally provides a due date and priority level.
4. A new task object is created with the provided details, a default status (e.g., "pending"), and the current creation date.
5. The task is added to the tasks array.

**Postconditions:**

- The new task is stored and visible in the list of tasks.

### 1.2 Delete a Task

**Actor:** User  
**Preconditions:**

- At least one task exists in the tasks array.

**Main Flow:**

1. The user enters the command to delete a task, specifying the task’s ID or index.
2. The system removes the specified task from the tasks array.

**Postconditions:**

- The task is no longer present in the list, and the array is updated accordingly.

### 1.3 Update a Task

**Actor:** User  
**Preconditions:**

- The task to be updated exists in the tasks array.

**Main Flow:**

1. The user enters the command to update a task’s details (description, due date, or priority).
2. The system prompts for the new details.
3. The system updates the selected task with the new information.

**Postconditions:**

- The task displays the updated details.

## 2. Task Status Management

### 2.1 Mark Task as Completed

**Actor:** User  
**Preconditions:**

- At least one task exists in the tasks array.

**Main Flow:**

1. The user enters the command to mark a task as completed (typically specifying a task ID or index).
2. The system updates the corresponding task's status to "completed."
3. The system logs the completion timestamp.

**Postconditions:**

- The task's status is updated, and it is clearly indicated as completed in the list.

### 2.2 Reopen a Completed Task

**Actor:** User  
**Preconditions:**

- The task exists in the array and is marked as "completed."

**Main Flow:**

1. The user enters the command to reopen a completed task.
2. The system updates the task’s status back to "pending."

**Postconditions:**

- The task is now marked as "pending" again and can be modified.

## 3. Task Viewing and Filtering

### 3.1 List All Tasks

**Actor:** User  
**Preconditions:**

- The tasks array may contain one or more tasks.

**Main Flow:**

1. The user enters the command to list all tasks.
2. The system retrieves and displays all tasks from the array with their details (description, status, due date, priority, creation date).

**Alternate Flow:**

- If no tasks exist, the system displays an appropriate message indicating an empty task list.

**Postconditions:**

- The user is informed of all current tasks and their statuses.

### 3.2 Filter Tasks

**Actor:** User  
**Preconditions:**

- Tasks exist in the tasks array.

**Main Flow:**

1. The user enters the command to filter tasks based on a criterion (e.g., status such as "pending" or "completed", due date, or priority level).
2. The system applies the filter using array methods (e.g., `filter`).
3. The filtered list of tasks is displayed to the user.

**Postconditions:**

- The user can view tasks that match the specified criteria.

## 4. Task Persistence and Data Management

### 4.1 Save Tasks to a File

**Actor:** System  
**Preconditions:**

- The user has added at least one task.

**Main Flow:**

1. The system automatically saves the task list to a local file when tasks are added, removed, or updated.
2. The data is stored in a structured format (e.g., JSON or CSV).

**Postconditions:**

- Task data is persisted and remains available even after the CLI is closed.

### 4.2 Load Tasks from a File

**Actor:** System  
**Preconditions:**

- A saved task file exists.

**Main Flow:**

1. When the application starts, the system loads the saved task file.
2. The tasks array is populated with previously saved tasks.

**Postconditions:**

- The user sees previously stored tasks upon launching the application.

## 5. Task Prioritization

### 5.1 Set Task Priority

**Actor:** User  
**Preconditions:**

- At least one task exists in the tasks array.

**Main Flow:**

1. The user enters the command to set or modify the priority of a task.
2. The system updates the priority level (e.g., Low, Medium, High).

**Postconditions:**

- The task now has an assigned priority level.

### 5.2 Sort Tasks by Priority

**Actor:** User  
**Preconditions:**

- At least one task exists in the tasks array.

**Main Flow:**

1. The user enters the command to sort tasks by priority.
2. The system sorts tasks in descending order (e.g., High > Medium > Low).

**Postconditions:**

- Tasks are displayed in order of priority.
