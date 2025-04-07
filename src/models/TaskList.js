import crypto from "crypto";
import { formatTimestamp } from "../utils/formatTimestamp.js";
import { priorityLevels } from "../utils/JSONLoader.js";
import chalk from "chalk";

/**
 * Represents an individual Task List.
 *
 * A TaskList is a collection of tasks, identified by a unique ID and a name.
 * It provides methods to manage tasks such as adding new tasks.
 *
 * @example
 * // Create a new TaskList instance for "Work Tasks"
 * const workTaskList = new TaskList("Work Tasks");
 *
 * // Add a new task to the work task list
 * workTaskList.addTask({ description: "Finish report", priority: "High" });
 */
export class TaskList {
  /**
   * Creates a new TaskList instance.
   *
   * @param {string} name - The name of the task list.
   */
  constructor(
    name,
    description,
    isDefault = false,
    isArchived = false,
    createdAt = Date.now(),
    updatedAt = null
  ) {
    /**
     * A unique identifier for the TaskList.
     * @type {string}
     */
    this.id = crypto.randomUUID();

    /**
     * The name of the TaskList.
     * @type {string}
     */
    this.name = name;

    /**
     * Set a description for the Task List.
     * @type {string}
     */
    this.description = description;

    /**
     * Indicates if this is the default task list.
     * @type {boolean}
     */
    this.isDefault = false;

    /**
     * Mark a Task List as inactive instead of deleting it.
     * @type {boolean}
     */
    this.isArchived = false;

    this.createdAt = createdAt;

    this.updatedAt = updatedAt;

    /**
     * An array to store tasks within the TaskList.
     * @type {Array<Object>}
     */
    this.tasks = [];
  }

  addTask(task) {
    /**
     * Adds a new task to the task list.
     *
     * @param {Object} task - The task object to add. It should include properties like:
     *   - description {string}: A short text describing the task.
     *   - priority {string}: The priority level of the task.
     *
     * @example
     * // Adding a task to the task list
     * taskList.addTask({ description: "Finish report", priority: "High" });
     */
    this.tasks.push(task);
    const priority = priorityLevels.find(
      (priority) => priority.value === task.priority
    );
    console.log(
      chalk.whiteBright("✅ Task added: ") +
        chalk.gray(`${task.description.slice(0, 36)}... `) +
        chalk.whiteBright("To ") +
        chalk.bold.green(`${this.name}.`) +
        chalk.whiteBright("Priority: ") +
        chalk.blueBright(`${priority.name}.`)
    );
  }

  updateFields(field, updatedField) {
    if (this.hasOwnProperty(field)) {
      this[field] = updatedField;
      this.updatedAt = Date.now();
      console.log(
        `✅ Field ${field} has been updated to ${updatedField} successfully!`
      );
    } else {
      console.warn(`⚠️  Field "${field}" does not exist in TaskList.`);
    }
  }

  deleteTaskListSelf(manager, selectedTaskList) {
    manager.taskLists = manager.taskLists.filter(
      (task) => task.id !== selectedTaskList.id
    );
    console.log(`✅ Task List ${selectedTaskList.name} has been deleted.`);
  }

  logTaskListState() {
    console.log("📌 TaskList State:", {
      id: this.id,
      name: this.name,
      description: this.description,
      isDefault: this.isDefault,
      isArchived: this.isArchived,
      createdAt: formatTimestamp(this.createdAt),
      updatedAt: this.updatedAt ? formatTimestamp(this.updatedAt) : null,
      tasks: this.tasks,
    });
  }
}
