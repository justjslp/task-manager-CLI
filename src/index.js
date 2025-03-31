/**
 * @fileoverview Main script for the Task Manager CLI application.
 *
 * This module provides a command-line interface (CLI) for managing Task Lists and Tasks.
 * Current functionality includes creating a new Task List using a TaskListManager.
 * Additional operations such as updating, deleting, viewing, and managing individual tasks
 * are planned for future implementation.
 *
 * @module Index
 */

import { mainMenu } from "./views/menu.js";
import { TaskListManager } from "./models/TaskListManager.js";

/**
 * Initializes and runs the CLI Task Manager application.
 *
 * This function creates an instance of `TaskListManager` and continuously prompts
 * the user to select actions from the main menu. It ensures that the application
 * runs in a loop, allowing users to manage tasks and task lists interactively.
 *
 * The function also includes error handling to catch unexpected runtime issues.
 *
 * @async
 * @function main
 * @returns {Promise<void>} Resolves when the user exits the application.
 *
 * @example
 * // Start the CLI application
 * main();
 */
async function main() {
  const manager = new TaskListManager();
  await mainMenu(manager);
}

main();
