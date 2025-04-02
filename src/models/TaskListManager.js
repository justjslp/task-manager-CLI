import crypto from "crypto";
import chalk from "chalk";

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
  constructor() {
    /**
     * A unique identifier for the TaskListManager.
     * @type {string}
     */
    this.id = crypto.randomUUID();

    /**
     * An array that holds the TaskList objects.
     * @type {Array<Object>}
     */
    this.taskLists = [];
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
      `✅ Task List "${taskList.name}" has been created successfully!`
    );
  }

  getTaskList(id) {
    return this.taskLists.find((taskList) => taskList.id === id);
  }

  getAllTasksLists() {
    console.log(chalk.blue("\n📋 Available Task Lists:\n"));
    this.taskLists.forEach((list, index) => {
      console.log(
        chalk.green(`  ${index + 1}. ${list.name}`) +
          chalk.gray(` (ID: ${list.id.slice(0, 8)}...)`) // Show only part of ID
      );
    });

    console.log(""); // Add space after the list
  }
}
