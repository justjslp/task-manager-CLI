/**
 * @fileoverview Main script for the Task Manager CLI application.
 *
 * This module provides a command-line interface (CLI) for managing Task Lists and Tasks.
 * Current functionality includes creating a new Task List using a TaskListManager.
 * Additional operations such as updating, deleting, viewing, and managing individual tasks
 * are planned for future implementation.
 *
 * @module Main
 */

import inquirer from "inquirer";
import {
  Task,
  TaskList,
  TaskListManager,
  priorityLevels,
  taskListManagerMenu,
} from "./Classes/Importer.js";

/**
 * Freeze JSON configuration objects to prevent accidental modification.
 */
Object.freeze(priorityLevels);
Object.freeze(taskListManagerMenu);

/**
 * Prompts the user to create a new Task List.
 *
 * @async
 * @param {TaskListManager} manager - The instance of TaskListManager where the new TaskList will be added.
 * @returns {Promise<void>}
 *
 * @example
 * // When called, the user is prompted to enter a name for the new Task List.
 * await createTaskList(manager);
 */
async function createTaskList(manager) {
  const { taskListName } = await inquirer.prompt([
    {
      type: "input",
      name: "taskListName",
      message: "Enter the name of the new Task List",
      validate: (input) =>
        input.length <= 20 ||
        "The list name length must not exceed 20 characters.",
    },
  ]);

  const newTaskList = new TaskList(taskListName);
  manager.addTaskList(newTaskList);
}

/**
 * Displays the Task List Manager menu and handles the selected action.
 *
 * @async
 * @param {TaskListManager} manager - The TaskListManager instance used to manage Task Lists.
 * @returns {Promise<void>}
 *
 * @example
 * // Presents options (create, update, delete, view, back) to manage Task Lists.
 * await showTaskListManagerMenu(manager);
 */
async function showTaskListManagerMenu(manager) {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose your Task List Manager action",
      choices: taskListManagerMenu,
    },
  ]);
  switch (action) {
    case "create":
      await createTaskList(manager);
      break;
    case "update":
      // Function to update a Task List (not yet implemented)
      break;
    case "delete":
      // Function to delete a Task List (not yet implemented)
      break;
    case "view":
      // Function to view all Task Lists (not yet implemented)
      break;
    case "back":
      await main();
      break;
  }
}

/**
 * Handles the selection from the main menu options.
 *
 * @async
 * @param {number} option - The numerical option selected by the user.
 * @param {TaskListManager} manager - The TaskListManager instance to operate on.
 * @returns {Promise<void>}
 *
 * @example
 * // Depending on the user's choice, various functions are executed.
 * await handleMenuSelection(1, manager);
 */
async function handleMenuSelection(option, manager) {
  switch (option) {
    case 1:
      await showTaskListManagerMenu(manager);
      break;
    case 2:
      console.log("🚀 Adding a new task...");
      break;
    case 3:
      console.log("🗑 Deleting a task...");
      break;
    case 4:
      console.log("✏️ Updating a task...");
      break;
    case 5:
      console.log("✅ Marking task as completed...");
      break;
    case 6:
      console.log("🔄 Reopening completed task...");
      break;
    case 7:
      console.log("📋 Listing all tasks...");
      break;
    case 8:
      console.log("🔎 Filtering tasks...");
      break;
    case 9:
      console.log("💾 Saving tasks to file...");
      break;
    case 10:
      console.log("📂 Loading tasks from file...");
      break;
    case 11:
      console.log("⚡ Setting task priority...");
      break;
    case 12:
      console.log("📊 Sorting tasks by priority...");
      break;
    case 0:
      console.log("👋 Exiting...");
      process.exit(0);
    default:
      console.log("❌ Invalid option. Please try again.");
  }
}

/**
 * An array of main menu options for the CLI.
 * Each option includes a display name and a corresponding numerical value.
 *
 * @type {Array<{name: string, value: number}>}
 */
const menuOptions = [
  { name: "📝 Task List Manager Menu", value: 1 },
  { name: "🚀 Add Task", value: 2 },
  { name: "🗑️  Delete Task", value: 3 },
  { name: "✏️  Update Task", value: 4 },
  { name: "✅ Mark Task as Completed", value: 5 },
  { name: "🔄 Reopen Completed Task", value: 6 },
  { name: "📋 List All Tasks", value: 7 },
  { name: "🔎 Filter Tasks", value: 8 },
  { name: "💾 Save Tasks to File", value: 9 },
  { name: "📂 Load Tasks from File", value: 10 },
  { name: "⚡ Set Task Priority", value: 11 },
  { name: "📊 Sort Tasks by Priority", value: 12 },
  { name: "👋 Exit", value: 0 },
];

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
  try {
    while (true) {
      const answer = await inquirer.prompt([
        {
          type: "list",
          name: "selectedOption",
          message: "Select an option:",
          choices: menuOptions,
        },
      ]);

      await handleMenuSelection(answer.selectedOption, manager);
    }
  } catch (error) {
    console.error("🚨 Unexpected error occurred!", error);
  }
}

// Start the CLI application.
main();
