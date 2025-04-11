import crypto from "crypto";
import chalk from "chalk";

/**
 * Represents an individual Task.
 *
 * A Task is a single unit of work with a unique identifier, description, due date, priority, and creation date.
 * It also tracks whether the task has been completed.
 *
 * @example
 * // Assuming priorityLevels is defined and contains a NON_URGENT property
 * const task = new Task("Finish the report", "2023-12-31", priorityLevels.NON_URGENT);
 * console.log(task.description); // "Finish the report"
 */
export class Task {
  constructor(
    title,
    description,
    dueDate,
    priority = 6,
    createdAt = Date.now(),
    updatedAt = null
  ) {
    /**
     * A unique identifier for the Task.
     * @type {string}
     */
    this.id = crypto.randomUUID();

    // Future implementation category for choose a category inside a Task List
    // this.category = [];

    /** A short title for the task for easily identifying
     * @type {string}
     */

    this.title = title;

    /**
     * A description of the task.
     * @type {string}
     */
    this.description = description;

    /**
     * The due date for the task as a Date object.
     * @type {Date}
     */

    this.dueDate = dueDate;

    /**
     * The priority level of the task.
     * @type {string}
     */
    this.priority = priority;

    /**
     * Indicates whether the task is completed.
     * @type {boolean}
     */
    this.completed = false;

    /**
     * The timestamp representing when the task was created.
     * @type {Date}
     */
    this.createdAt = createdAt;

    this.updatedAt = updatedAt;
  }

  updatedTaskFields(field, updatedField) {
    if (this.hasOwnProperty(field)) {
      this[field] = updatedField;
      this.updatedAt = Date.now();
      console.log(
        "✅ Field " +
          chalk.rgb(101, 101, 255).bold(field) +
          " has been updated to " +
          chalk.rgb(101, 101, 255).bold(updatedField) +
          " successfully!"
      );
    } else {
      console.warn(
        `⚠️ Field "${field}" does not exist in Task "${this.title}".`
      );
    }
  }

  deleteTaskSelf(selectedTaskList) {
    selectedTaskList.tasks = selectedTaskList.tasks.filter(
      (task) => task.id !== this.id
    );
    console.log(
      "✅ Task " +
        chalk.rgb(101, 101, 255).bold(this.title) +
        " has been deleted from " +
        chalk.rgb(101, 101, 255).bold(selectedTaskList.name) +
        " successfully!"
    );
  }
}
