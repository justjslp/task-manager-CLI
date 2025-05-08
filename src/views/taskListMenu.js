import inquirer from "inquirer";
import { taskListMenu } from "../utils/JSONLoader.js";
import {
  createTaskList,
  updateTaskList,
  deleteTaskList,
  unarchiveTaskList,
  displayTasksLists,
  saveTaskListsToFile,
  loadTaskListsFromFile,
} from "../controllers/taskListController.js";
import { mainMenu } from "./menu.js";
import chalk from "chalk";
import { printBanner } from "../index.js";

/**
 * Displays the Task List Manager menu and handles the selected action.
 *
 * @async
 * @returns {Promise<void>}
 *
 * @example
 * // Presents options (create, update, delete, view, back) to manage Task Lists.
 * await showTaskListMenu(manager);
 */
export async function showTaskListMenu(manager) {
  console.clear();
  await printBanner();

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose your Task List Manager action",
      choices: taskListMenu,
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
      await unarchiveTaskList(manager);
      break;
    case 5:
      await displayTasksLists(manager);
      break;
    case 6:
      await saveTaskListsToFile(manager);
      break;
    case 7:
      await loadTaskListsFromFile(manager);
      break;
    case "menu":
      await mainMenu(manager);
      break;
    default:
      console.warn(chalk.redBright("❌ Invalid option. Please try again."));
  }
}
