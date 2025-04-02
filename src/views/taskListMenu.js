import inquirer from "inquirer";
import { taskListManagerMenu } from "../utils/JSONLoader.js";
import {
  createTaskList,
  updateTaskList,
  deleteTaskList,
  displayTasksLists,
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
      await deleteTaskList(manager);
      break;
    case "view":
      await displayTasksLists(manager);
      break;
    case "back":
      await mainMenu(manager);
      break;
  }
}
