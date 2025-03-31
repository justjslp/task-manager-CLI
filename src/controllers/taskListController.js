import inquirer from "inquirer";
import { updateOptions } from "../utils/JSONLoader.js";
import { TaskList } from "../models/TaskList.js";
import { mainMenu } from "../views/menu.js";

/**
 * Prompts the user to create a new Task List.
 *
 * @async
 * @returns {Promise<void>}
 *
 * @example
 * // When called, the user is prompted to enter a name for the new Task List.
 * await createTaskList(manager);
 */
export async function createTaskList(manager) {
  const { taskListName, taskListDescription } = await inquirer.prompt([
    {
      type: "input",
      name: "taskListName",
      message: "Enter a name for your new Task List (max 20 characters)",
      validate: (input) =>
        input.length > 0 && input.length <= 20
          ? true
          : "⚠️  Task List name must be between 1 and 20 characters.",
    },
    {
      type: "input",
      name: "taskListDescription",
      message:
        "Enter a description for your new Task List (max 100 characters)",
      validate: (input) =>
        input.length > 0 && input.length <= 100
          ? true
          : "⚠️  Task List description must be between 1 and 20 characters.",
    },
  ]);

  const newTaskList = new TaskList(taskListName, taskListDescription);
  manager.addTaskList(newTaskList);
}

export async function updateTaskList(manager) {
  if (manager.taskLists.length === 0) {
    console.log("⚠️  No Task Lists available to update.");
    return;
  }

  const { selectedTaskId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTaskId",
      message: "🔄 Select a Task List to update",
      choices: manager.taskLists.map((list) => ({
        name: list.name,
        value: list.id,
      })),
    },
  ]);

  const selectedTaskList = manager.getTaskList(selectedTaskId);
  console.log(selectedTaskList);

  const { updateAction } = await inquirer.prompt([
    {
      type: "list",
      name: "updateAction",
      message: "📚 Select the field to update",
      choices: updateOptions,
    },
  ]);

  // Process updateAction here (implementation depends on your logic)
  switch (updateAction) {
    case "updateName":
      // code to update the name
      break;
    case "updateDescription":
      // code to update the description
      break;
    case "toggleDefault":
      // code to toggle isDefault property
      break;
    case "toggleArchived":
      // code to toggle isArchived property
      break;
    case "back":
      await updateTaskList(manager);
      break;
    case "menu":
      await mainMenu(manager);
    default:
      console.log("❌ Invalid option selected.");
  }
}
