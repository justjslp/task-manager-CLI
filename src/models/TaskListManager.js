import crypto from "crypto";
import chalk from "chalk";
import { formatLocalDate } from "../utils/dateFormat.js";

/**
 * Represents the manager of all the Task Lists.
 *
 * The TaskListManager is responsible for holding and managing multiple TaskList instances.
 * It provides methods to add, update, delete, and retrieve Task Lists.
 *
 * @example
 * // Create a new TaskListManager
 * const manager = new TaskListManager();
 *
 * // Assuming you have a TaskList instance named `workTaskList`
 * manager.addTaskList(workTaskList);
 */

export class TaskListManager {
  /**
   * Creates a new TaskListManager instance.
   *
   * The constructor initializes a unique identifier for the manager
   * and creates an empty array to store the TaskList objects.
   */
  constructor(
    id = crypto.randomUUID(),
    taskLists = [],
    archivedTaskLists = [],
    createdAt = Date.now()
  ) {
    /**
     * A unique identifier for the TaskListManager.
     * @type {string}
     */
    this.id = id;

    /**
     * An array that holds the TaskList objects.
     * @type {Array<Object>}
     */
    this.taskLists = taskLists;

    this.archivedTaskLists = archivedTaskLists;

    this.createdAt = createdAt;
  }

  /**
   * Adds a new TaskList to the manager.
   *
   * @param {Object} taskList - The TaskList object to be added.
   * The TaskList should have at least a `name` property.
   *
   * @example
   * // Add a new task list named "Work"
   * manager.addTaskList({ name: "Work", tasks: [] });
   */
  addTaskList(taskList) {
    this.taskLists.push(taskList);
    console.log(
      "✅ Task List " +
        chalk.bold.green(taskList.name) +
        " has been created successfully!"
    );
  }

  getTaskList(id) {
    return this.taskLists.find((taskList) => taskList.id === id);
  }

  getAllTasksLists() {
    console.log(chalk.bold.blue("📋 Available Task Lists:"));
    this.taskLists.forEach((list, index) => {
      const tasks = list.tasks.length;
      const uncompletedTasks = list.nonCompletedTasks.length;
      const completedTasks = list.completedTasks.length;
      const id = list.id;
      const name = list.name;
      const isDefault = list.isDefault
        ? chalk.rgb(194, 191, 188).bold("🔧 Default")
        : "";
      const isArchived = list.isArchived
        ? chalk.rgb(251, 200, 70).bold("🗃️ Archived")
        : "";
      const createdAt = list.createdAt
        ? chalk.blackBright(`📅 ${formatLocalDate(list.createdAt)}`)
        : "";
      const updatedAt = list.updatedAt
        ? chalk.blackBright(`📝 ${formatLocalDate(list.updatedAt)}`)
        : chalk.blackBright("Not updated so far.");

      console.log(
        chalk.cyan(index + 1 + ". ") +
          chalk.bold.green(`${name} `) +
          chalk.gray(`(ID: ${id.slice(0, 8)}...) `) +
          chalk.rgb(167, 167, 169).bold(`${tasks} tasks. `) +
          chalk.redBright.bold(`${uncompletedTasks} Uncompleted. `) +
          chalk.greenBright.bold(`${completedTasks} Completed. `) +
          chalk.whiteBright(`Created at: ${createdAt} `) +
          chalk.whiteBright(`Updated at: ${updatedAt} `) +
          chalk(`${isDefault} `) +
          chalk(`${isArchived}`)
      );
    });
  }
}
