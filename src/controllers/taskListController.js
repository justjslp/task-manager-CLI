import inquirer from "inquirer";
import { updateOptions } from "../utils/JSONLoader.js";
import { TaskList } from "../models/TaskList.js";
import { showTaskListManagerMenu } from "../views/taskListMenu.js";
import chalk from "chalk";

/**
 * Freeze JSON configuration objects to prevent accidental modification.
 */
Object.freeze(updateOptions);

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
      message: "📝 Enter a name for your new Task List (max 20 characters)",
      validate: (input) =>
        input.length > 0 && input.length <= 20
          ? true
          : "⚠️  Task List name must be between 1 and 20 characters.",
    },
    {
      type: "input",
      name: "taskListDescription",
      message:
        "📝 Enter a description for your new Task List (max 100 characters)",
      validate: (input) =>
        input.length > 0 && input.length <= 100
          ? true
          : "⚠️  Task List description must be between 1 and 100 characters.",
    },
  ]);

  const newTaskList = new TaskList(taskListName, taskListDescription);
  manager.addTaskList(newTaskList);
  await showTaskListManagerMenu(manager);
}

export async function updateTaskList(manager) {
  if (manager.taskLists.length === 0) {
    console.warn(chalk.redBright("⚠️  No Task Lists available to update."));
    await showTaskListManagerMenu(manager);
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
    case 1:
      const { updatedName } = await inquirer.prompt([
        {
          type: "input",
          name: "updatedName",
          message: "📝 Enter the new name for your Task List",
          validate: (input) => {
            if (input.trim().length === 0)
              return "⚠️ Task List name cannot be empty.";
            if (input.length > 20)
              return "⚠️ Task List name must be at most 20 characters.";
            return true;
          },
        },
      ]);
      if (updatedName.trim() !== "")
        selectedTaskList.updateFields("name", updatedName.trim());
      await showTaskListManagerMenu(manager);
      break;
    case 2:
      const { updatedDescription } = await inquirer.prompt([
        {
          type: "input",
          name: "updatedDescription",
          message: "📝 Enter the new description for your Task List",
          validate: (input) => {
            if (input.trim().length === 0)
              return "⚠️ Task List description cannot be empty.";
            if (input.length > 100)
              return "⚠️ Task List description must be at most 100 characters.";
            return true;
          },
        },
      ]);
      if (updatedDescription.trim() !== "")
        selectedTaskList.updateFields("description", updatedDescription.trim());
      await showTaskListManagerMenu(manager);
      break;
    case 3:
      const { toggleDefault } = await inquirer.prompt([
        {
          type: "confirm",
          name: "toggleDefault",
          message:
            "🕹️  Would you like to toggle the default status for this Task List?",
          default: false,
        },
      ]);
      selectedTaskList.updateFields("isDefault", toggleDefault);
      await showTaskListManagerMenu(manager);
      break;
    case 4:
      const { toggleArchived } = await inquirer.prompt([
        {
          type: "confirm",
          name: "toggleArchived",
          message:
            "🕹️  Would you like to toggle the archived status for this Task List?",
          default: false,
        },
      ]);
      selectedTaskList.updateFields("isArchived", toggleArchived);
      await showTaskListManagerMenu(manager);
      break;
    case "back":
      await updateTaskList(manager);
      break;
    case "managerMenu":
      await showTaskListManagerMenu(manager);
      break;
    default:
      console.log("❌ Invalid option selected.");
  }
}

export async function deleteTaskList(manager) {
  if (manager.taskLists.length === 0) {
    console.warn(chalk.redBright("⚠️  No Task Lists available to delete."));
    await showTaskListManagerMenu(manager);
  }

  const { selectedTaskId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTaskId",
      message: "🗑️ Select a Task List to delete",
      choices: manager.taskLists.map((list) => ({
        name: list.name,
        value: list.id,
      })),
    },
  ]);

  const selectedTaskList = manager.getTaskList(selectedTaskId);

  const { answer } = await inquirer.prompt([
    {
      type: "confirm",
      name: "answer",
      message: `Are you sure you want to delete the task list "${selectedTaskList.name}"? This will permanently remove all tasks within this list.`,
      default: false,
    },
  ]);
  if (answer) selectedTaskList.deleteTaskListSelf(manager);
  await showTaskListManagerMenu(manager);
}

export async function displayTasksLists(manager) {
  if (manager.taskLists.length === 0) {
    console.warn(chalk.redBright("⚠️  No Task Lists available."));
    await showTaskListManagerMenu(manager);
  }
  manager.getAllTasksLists();
  await showTaskListManagerMenu(manager);
}
