import crypto from "crypto";
import { formatLocalDate } from "../utils/dateFormat.js";
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
    updatedAt = null,
    nonCompletedTasks = [],
    completedTasks = []
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
    this.isDefault = isDefault;

    /**
     * Mark a Task List as inactive instead of deleting it.
     * @type {boolean}
     */
    this.isArchived = isArchived;

    this.createdAt = createdAt;

    this.updatedAt = updatedAt;

    /**
     * An array to store non completed tasks within the TaskList.
     * @type {Array<Object>}
     */
    this.nonCompletedTasks = nonCompletedTasks;

    this.completedTasks = completedTasks;
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
    this.nonCompletedTasks.push(task);
    const priority = priorityLevels.find(
      (priority) => priority.value === task.priority
    );
    console.log(
      chalk.whiteBright("✅ Task ") +
        chalk.gray.bold(`${task.title} `) +
        chalk.whiteBright("added to the Task List ") +
        chalk.bold.green.bold(`${this.name}`) +
        chalk.whiteBright(". Priority: ") +
        chalk.yellowBright(`${priority.name}.`)
    );
  }

  getTask(taskId) {
    return this.nonCompletedTasks.find((task) => task.id === taskId);
  }

  updateTaskListFields(field, updatedField) {
    if (this.hasOwnProperty(field)) {
      this[field] = updatedField;
      this.updatedAt = Date.now();
      console.log(
        "✅ Field " +
          chalk.rgb(150, 124, 46).bold(field) +
          " has been updated to " +
          (field === "description"
            ? chalk.rgb(101, 101, 255).bold(`${updatedField.slice(0, 16)}...`)
            : field === "isDefault"
            ? updatedField
              ? chalk.rgb(101, 101, 255).bold("Default Task List")
              : chalk.rgb(101, 101, 255).bold("Task List Not Default")
            : field === "isArchived"
            ? updatedField
              ? chalk.rgb(101, 101, 255).bold("Task List Archived")
              : chalk.rgb(101, 101, 255).bold("Task List Not Archived")
            : chalk.rgb(101, 101, 255).bold(updatedField) + " successfully!")
      );
    } else {
      console.warn(
        chalk.redBright(
          `⚠️ Field "${field}" does not exist in TaskList "${this.name}".`
        )
      );
    }
  }

  deleteTaskListSelf(manager) {
    manager.taskLists = manager.taskLists.filter(
      (taskList) => taskList.id !== this.id
    );
    console.log(
      "✅ Task List " +
        chalk.green.bold(this.name) +
        " has been deleted successfully!"
    );
  }

  getCompletedTasks() {
    console.log(chalk.bold.blue("✅ Completed Task Lists:"));
    this.completedTasks.forEach((task, index) => {
      const foundPriority = priorityLevels.find(
        (priority) => priority.value === task.priority
      );
      const now = Date.now();
      const id = task.id;
      const title = task.title;
      const dueDate =
        task.dueDate < now.getTime()
          ? chalk.redBright(`📅 ${formatLocalDate(task.dueDate)}`)
          : chalk.blackBright(`📅 ${formatLocalDate(task.dueDate)}`);
      const priority = chalk.yellow(foundPriority.name);
      const completedAt = task.completedAt
        ? chalk.blackBright(`📅 ${formatLocalDate(task.completedAt)}`)
        : chalk.blackBright("Not completed so far.");
      const createdAt = task.createdAt
        ? chalk.blackBright(`📅 ${formatLocalDate(task.createdAt)}`)
        : "";
      const updatedAt = task.updatedAt
        ? chalk.blackBright(`📝 ${formatLocalDate(task.updatedAt)}`)
        : chalk.blackBright("Not updated so far.");

      console.log(
        chalk.cyan(index + 1 + ". ") +
          chalk.bold.green(`${title} `) +
          chalk.gray(`(ID: ${id.slice(0, 8)}...) `) +
          chalk.whiteBright(`Due date: ${dueDate} `) +
          chalk.whiteBright(`Priority: ${priority}. `) +
          chalk.whiteBright(`Completed at: ${completedAt} `) +
          chalk.whiteBright(`Created at: ${createdAt} `) +
          chalk.whiteBright(`Updated at: ${updatedAt} `)
      );
    });
  }

  getNonCompletedTasks() {
    console.log(chalk.bold.blue("⏳ Non-Completed Task Lists:"));
    this.nonCompletedTasks.forEach((task, index) => {
      const foundPriority = priorityLevels.find(
        (priority) => priority.value === task.priority
      );
      console.log(foundPriority);
      const id = task.id;
      const now = Date.now();
      const title = task.title;
      const dueDate =
        task.dueDate < now.getTime()
          ? chalk.redBright(`📅 ${formatLocalDate(task.dueDate)}`)
          : chalk.blackBright(`📅 ${formatLocalDate(task.dueDate)}`);
      const priority = chalk.yellow(foundPriority.name);
      const completedAt = task.completedAt
        ? chalk.blackBright(`📅 ${formatLocalDate(task.completedAt)}`)
        : chalk.blackBright("Not completed so far.");
      const createdAt = task.createdAt
        ? chalk.blackBright(`📅 ${formatLocalDate(task.createdAt)}`)
        : "";
      const updatedAt = task.updatedAt
        ? chalk.blackBright(`📝 ${formatLocalDate(task.updatedAt)}`)
        : chalk.blackBright("Not updated so far.");

      console.log(
        chalk.cyan(index + 1 + ". ") +
          chalk.bold.green(`${title} `) +
          chalk.gray(`(ID: ${id.slice(0, 8)}...) `) +
          chalk.whiteBright(`Due date: ${dueDate} `) +
          chalk.whiteBright(`Priority: ${priority}. `) +
          chalk.whiteBright(`Completed at: ${completedAt} `) +
          chalk.whiteBright(`Created at: ${createdAt} `) +
          chalk.whiteBright(`Updated at: ${updatedAt} `)
      );
    });
  }

  logTaskListState() {
    console.log("📌 TaskList State:", {
      id: this.id,
      name: this.name,
      description: this.description,
      isDefault: this.isDefault,
      isArchived: this.isArchived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt ? this.updatedAt : null,
      tasks: this.nonCompletedTasks,
    });
  }
}
