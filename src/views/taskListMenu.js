import inquirer from "inquirer";
import { taskListManagerMenu } from "../utils/JSONLoader.js";
import {
  createTaskList,
  updateTaskList,
  deleteTaskList,
  displayTasksLists,
} from "../controllers/taskListController.js";
import { mainMenu } from "./menu.js";
import chalk from "chalk";

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
    case 1:
      await createTaskList(manager);
      break;
    case 2:
      await updateTaskList(manager);
      break;
    case 3:
      await deleteTaskList(manager);
      break;
    case 4:
      await displayTasksLists(manager);
      break;
    case 0:
      await mainMenu(manager);
      break;
    default:
      console.warn(chalk.redBright("❌ Invalid option. Please try again."));
  }
}
