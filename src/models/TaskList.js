import crypto from "crypto";

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
  constructor(name, description, isDefault = false, isArchived = false) {
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

    /**
     * An array to store tasks within the TaskList.
     * @type {Array<Object>}
     */
    this.tasks = [];
  }

  updateFields(field, updatedField) {
    if (this.hasOwnProperty(field)) {
      this[field] = updatedField;
      console.log(
        `✅ Field ${field} has been updated to ${updatedField} successfully!`
      );
    } else {
      console.warn(`⚠️  Field "${field}" does not exist in TaskList.`);
    }
  }

  logTaskListState() {
    console.log("📌 TaskList State:", {
      id: this.id,
      name: this.name,
      description: this.description,
      isDefault: this.isDefault,
      isArchived: this.isArchived,
      tasks: this.tasks.length + " tasks",
    });
  }

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
  addTask(task) {
    this.tasks.push(task);
    console.log(`✅ Task added: ${task.description} (${task.priority})`);
  }
}
