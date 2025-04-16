import inquirer from "inquirer";
import { taskMenu } from "../utils/JSONLoader.js";
import { mainMenu } from "./menu.js";
import {
  addTask,
  updateTask,
  deleteTask,
  reopenCompletedTask,
  displayTasks,
  filterTasks,
  sortTasks,
} from "../controllers/taskController.js";
import chalk from "chalk";

Object.freeze(taskMenu);

/**
 * Displays the Task Manager menu and handles the selected action.
 *
 * @async
 * @returns {Promise<void>}
 *
 * @example
 * // Presents options (add, update, delete, view, mark as completed, reopen, list all tasks, filter, save to file, load from file, update priority, sort tasks) to manage Tasks.
 * await showTaskMenu(selectedTaskList);
 */
export async function selectedTaskMenu(manager, selectedTaskList) {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose your Task List Manager action",
      choices: taskMenu,
    },
  ]);
  switch (action) {
    case 1:
      await addTask(manager, selectedTaskList);
      break;
    case 2:
      await updateTask(manager, selectedTaskList);
      break;
    case 3:
      await deleteTask(manager, selectedTaskList);
      break;
    case 4:
      await reopenCompletedTask(manager, selectedTaskList);
      break;
    case 5:
      await displayTasks(manager, selectedTaskList);
      break;
    case 6:
      await filterTasks(manager, selectedTaskList);
      break;
    case 7:
      await sortTasks(manager, selectedTaskList);
      break;
    case "back":
      await showTaskManagerMenu(manager);
      break;
    case "menu":
      await mainMenu(manager);
      break;
    default:
      console.warn(chalk.redBright("❌ Invalid option. Please try again."));
  }
}

export async function showTaskMenu(manager) {
  if (manager.taskLists.length === 0) {
    console.warn(
      chalk.redBright(
        "⚠️  No Task Lists available. Please first create a task list or load tasks from file."
      )
    );
    await mainMenu(manager);
  }

  const { selectedTaskId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTaskId",
      message: "Select a Task List",
      choices: manager.taskLists.map((list) => ({
        name: list.name,
        value: list.id,
      })),
    },
  ]);

  const selectedTaskList = manager.getTaskList(selectedTaskId);
  await selectedTaskMenu(manager, selectedTaskList);
}
