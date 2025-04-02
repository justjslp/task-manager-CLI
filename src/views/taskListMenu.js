import inquirer from "inquirer";
import { taskListManagerMenu } from "../utils/JSONLoader.js";
import {
  createTaskList,
  updateTaskList,
} from "../controllers/taskListController.js";
import { mainMenu } from "./menu.js";

/**
 * Freeze JSON configuration objects to prevent accidental modification.
 */
Object.freeze(taskListManagerMenu);

/**
 * Displays the Task List Manager menu and handles the selected action.
 *
 * @async
 * @returns {Promise<void>}
 *
 * @example
 * // Presents options (create, update, delete, view, back) to manage Task Lists.
 * await showTaskListManagerMenu(manager);
 */
export async function showTaskListManagerMenu(manager) {
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
      await updateTaskList(manager);
      break;
    case "delete":
      // Function to delete a Task List (not yet implemented)
      break;
    case "view":
      // Function to view all Task Lists (not yet implemented)
      break;
    case "back":
      await mainMenu(manager);
      break;
  }
}
