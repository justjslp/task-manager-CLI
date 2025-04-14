import inquirer from "inquirer";
import { updateTaskListOptions } from "../utils/JSONLoader.js";
import { TaskList } from "../models/TaskList.js";
import { showTaskListManagerMenu } from "../views/taskListMenu.js";
import chalk from "chalk";
import fs from "fs";

/**
 * Freeze JSON configuration objects to prevent accidental modification.
 */
Object.freeze(updateTaskListOptions);

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
      message: "📝 Enter a name for your new Task List (max 50 characters)",
      validate: (input) =>
        input.length > 0 && input.length <= 50
          ? true
          : "⚠️ Task List name must be between 1 and 50 characters.",
    },
    {
      type: "input",
      name: "taskListDescription",
      message:
        "📝 Enter a description for your new Task List (max 100 characters)",
      validate: (input) =>
        input.length > 0 && input.length <= 100
          ? true
          : "⚠️ Task List description must be between 1 and 100 characters.",
    },
  ]);
  const newTaskList = new TaskList(
    taskListName.trim(),
    taskListDescription.trim()
  );
  manager.addTaskList(newTaskList);
  await showTaskListManagerMenu(manager);
}

export async function updateTaskList(manager) {
  if (manager.taskLists.length === 0) {
    console.warn(
      chalk.redBright("⚠️ You haven't task lists available to update.")
    );
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
  await updateTaskListField(manager, selectedTaskList);
}
async function updateTaskListField(manager, selectedTaskList) {
  const { updateTaskListAction } = await inquirer.prompt([
    {
      type: "list",
      name: "updateTaskListAction",
      message: "📚 Select the field to update",
      choices: updateTaskListOptions,
    },
  ]);

  switch (updateTaskListAction) {
    case 1:
      const { updatedName } = await inquirer.prompt([
        {
          type: "input",
          name: "updatedName",
          message: "📝 Enter the new name for your Task List",
          validate: (input) =>
            input.length > 0 && input.length <= 50
              ? true
              : "⚠️ Task List name must be between 1 and 50 characters.",
        },
      ]);
      selectedTaskList.updateTaskListFields("name", updatedName.trim());
      await updateTaskListField(manager, selectedTaskList);
      break;
    case 2:
      const { updatedDescription } = await inquirer.prompt([
        {
          type: "input",
          name: "updatedDescription",
          message: "📝 Enter the new description for your Task List",
          validate: (input) =>
            input.length > 0 && input.length <= 100
              ? true
              : "⚠️ Task List description must be between 1 and 100 characters.",
        },
      ]);
      selectedTaskList.updateTaskListFields(
        "description",
        updatedDescription.trim()
      );
      await updateTaskListField(manager, selectedTaskList);
      break;
    case 3:
      const { toggleDefault } = await inquirer.prompt([
        {
          type: "confirm",
          name: "toggleDefault",
          message:
            "🕹️ Would you like to toggle the default status for this Task List?",
          default: false,
        },
      ]);
      selectedTaskList.updateTaskListFields("isDefault", toggleDefault);
      await updateTaskListField(manager, selectedTaskList);
      break;
    case 4:
      const { toggleArchived } = await inquirer.prompt([
        {
          type: "confirm",
          name: "toggleArchived",
          message:
            "🕹️ Would you like to toggle the archived status for this Task List?",
          default: false,
        },
      ]);
      selectedTaskList.updateTaskListFields("isArchived", toggleArchived);
      await updateTaskListField(manager, selectedTaskList);
      break;
    case "back":
      await updateTaskList(manager);
      break;
    case "taskListManagerMenu":
      await showTaskListManagerMenu(manager);
      break;
    default:
      console.warn(chalk.redBright("❌ Invalid option. Please try again."));
  }
}

export async function deleteTaskList(manager) {
  if (manager.taskLists.length === 0) {
    console.warn(
      chalk.redBright("⚠️ You haven't task lists available to delete.")
    );
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
    console.warn(
      chalk.redBright("⚠️ You don't have task lists available to delete.")
    );
    await showTaskListManagerMenu(manager);
  }
  manager.getAllTasksLists();
  await showTaskListManagerMenu(manager);
}

export async function saveTaskListsToFile(manager) {
  if (manager.taskLists.length === 0) {
    console.warn(
      chalk.redBright("⚠️ You haven't task lists available to save.")
    );
  }

  const { managerName } = await inquirer.prompt([
    {
      type: "input",
      name: "managerName",
      message: "🛠️ Select the filename for your Task Lists Manager ",
      validate: (input) =>
        input.length > 0 && input.length <= 50
          ? true
          : "⚠️ Manager filename must be between 1 and 50 characters.",
    },
  ]);

  const path = `data/${managerName}.json`;
  const jsonManager = JSON.stringify(manager, null, 2);

  fs.writeFileSync(path, jsonManager, "utf8");

  const taskListNames = manager.taskLists
    .map((taskList) => taskList.name)
    .join(", ");
  console.log(
    chalk("The Task Lists: ") +
      chalk.green.bold(taskListNames) +
      " were save to " +
      chalk.blueBright(path) +
      chalk(" Successfully")
  );
}

export async function loadTaskListsFromFile(manager) {}
