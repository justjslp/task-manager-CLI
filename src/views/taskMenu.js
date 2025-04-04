import inquirer from "inquirer";
import { taskManagerMenu } from "../utils/JSONLoader.js";
// import { } from "../controllers/taskController.js";
import { mainMenu } from "./menu.js";
import chalk from "chalk";

Object.freeze(taskManagerMenu);

/**
 * Displays the Task Manager menu and handles the selected action.
 *
 * @async
 * @returns {Promise<void>}
 *
 * @example
 * // Presents options (add, update, delete, view, mark as completed, reopen, list all tasks, filter, save to file, load from file, update priority, sort tasks) to manage Tasks.
 * await showTaskManagerMenu(selectedTaskList);
 */
export async function showTaskManagerMenu(manager) {

  if (manager.taskLists.length === 0) {
    console.warn(chalk.redBright("⚠️  No Task Lists available."));
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

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose your Task List Manager action",
      choices: taskManagerMenu,
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
      await markTaskAsCompleted(manager, selectedTaskList);
      break;
    case 5:
      await reopenCompletedTask(manager, selectedTaskList);
      break;
    case 6:
      await listAllTasks(manager, selectedTaskList);
      break;
    case 7:
      await filterTasks(manager, selectedTaskList);
      break;
    case 8:
      await saveTasksToAFile(manager, selectedTaskList);
      break;
    case 9:
      await loadTasksFromFile(manager, selectedTaskList);
      break;
    case 10:
      await updateTaskPriority(manager, selectedTaskList);
      break;
    case 11:
      await reopenCompletedTask(manager, selectedTaskList);
      break;
    case 0:
      await mainMenu(manager, selectedTaskList);
      break;
    default:
      console.warn(chalk.redBright("❌ Invalid option. Please try again."));
  }
}
