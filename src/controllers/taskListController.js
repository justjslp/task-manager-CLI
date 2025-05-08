import chalk from "chalk";
import { format } from "date-fns";
import fs from "fs";
import inquirer from "inquirer";
import { showTaskListMenu } from "../views/taskListMenu.js";
import { TaskList } from "../models/TaskList.js";
import { Task } from "../models/Task.js";
import { updateTaskListOptions } from "../utils/JSONLoader.js";
import { findDefaultTaskList } from "../utils/defaultTaskList.js";
import { pause } from "../utils/pause.js";
import { printBanner } from "../index.js";

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
  console.log(
    chalk.rgb(168, 155, 157)("Create a Task List. Type 'cancel' to abort.")
  );

  const { name } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "📝 Enter a name for your new Task List (max 50 characters).",
      validate: (input) =>
        input.length > 0 && input.length <= 50
          ? true
          : "⚠️ Task List name must be between 1 and 50 characters.",
    },
  ]);

  if (name.trim().toLowerCase() === "cancel") {
    console.log(chalk.rgb(207, 207, 234)("Operation cancelled."));
    await pause();
    await showTaskListMenu(manager);
  }

  const { description } = await inquirer.prompt([
    {
      type: "input",
      name: "description",
      message:
        "📝 Enter a description for your new Task List (max 100 characters)",
      validate: (input) =>
        input.length > 0 && input.length <= 100
          ? true
          : "⚠️ Task List description must be between 1 and 100 characters.",
    },
  ]);

  if (description.trim().toLowerCase() === "cancel") {
    console.log(chalk.rgb(207, 207, 234)("Operation cancelled."));
    await pause();
    await showTaskListMenu(manager);
  }

  const newTaskList = new TaskList({
    name: name.trim(),
    description: description.trim(),
  });

  manager.addTaskList(newTaskList);
  await pause();
  await showTaskListMenu(manager);
}

export async function updateTaskList(manager) {
  if (manager.unarchivedTaskLists.length === 0) {
    console.warn(
      chalk.redBright("⚠️ You haven't task lists available to update.")
    );
    await pause();
    await showTaskListMenu(manager);
  }

  const { selectedTaskId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTaskId",
      message: "🔄 Select a Task List to update",
      choices: manager.unarchivedTaskLists.map((list) => ({
        name: list.name,
        value: list.id,
      })),
    },
  ]);

  const selectedTaskList = manager.getTaskList(selectedTaskId);
  await updateTaskListField(manager, selectedTaskList);
}
async function updateTaskListField(manager, selectedTaskList) {
  console.clear();
  await printBanner();
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
      await pause();
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
      await pause();
      await updateTaskListField(manager, selectedTaskList);
      break;
    case 3:
      const { toggleDefault } = await inquirer.prompt([
        {
          type: "list",
          name: "toggleDefault",
          message:
            "🕹️ Would you like to toggle the default status for this Task List?",
          choices: [
            { name: "📌 Mark as Default", value: 1 },
            { name: "⚪ Mark as Not Default", value: 2 },
          ],
        },
      ]);
      if (toggleDefault === 1) {
        const defaultTaskList = await findDefaultTaskList(manager);
        if (defaultTaskList) {
          console.warn(
            chalk.redBright("⚠️ You already have a default task list.")
          );
          await pause();
          await updateTaskListField(manager, selectedTaskList);
        }
        selectedTaskList.updateTaskListFields("isDefault", true);
      } else selectedTaskList.updateTaskListFields("isDefault", false);
      await pause();
      await updateTaskListField(manager, selectedTaskList);
      break;
    case 4:
      if (selectedTaskList.isDefault) {
        const { confirmedArchived } = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirmedArchived",
            message:
              "⚠️ This current Task List is marked as default. If you continue the state of default of the task list will be restored.",
          },
        ]);

        if (confirmedArchived) {
          selectedTaskList.updateTaskListFields("isDefault", false);
          selectedTaskList.updateTaskListFields("isArchived", true);
          manager.archivedTaskLists.push(selectedTaskList);
          manager.unarchivedTaskLists = manager.unarchivedTaskLists.filter(
            (taskList) => taskList !== selectedTaskList
          );
          await pause();
          await showTaskListMenu(manager);
        } else await showTaskListMenu(manager);
      }

      const { markAsArchived } = await inquirer.prompt([
        {
          type: "confirm",
          name: "markAsArchived",
          message: "🗃️ Would you like to mark the Task List as Completed?",
        },
      ]);
      if (markAsArchived) {
        selectedTaskList.updateTaskListFields("isArchived", true);
        manager.archivedTaskLists.push(selectedTaskList);
        manager.unarchivedTaskLists = manager.unarchivedTaskLists.filter(
          (taskList) => taskList !== selectedTaskList
        );
        await pause();
        await showTaskListMenu(manager);
      } else await showTaskListMenu(manager);

      break;
    case "back":
      await updateTaskList(manager);
      break;
    case "taskListMenu":
      await showTaskListMenu(manager);
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
    await pause();
    await showTaskListMenu(manager);
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
  await pause();
  await showTaskListMenu(manager);
}

export async function unarchiveTaskList(manager) {
  if (manager.archivedTaskLists.length === 0) {
    console.warn(
      chalk.redBright(
        "⚠️ You haven't archived task lists available to display."
      )
    );
    await pause();
    await showTaskListMenu(manager);
  }

  const { archivedTaskListId } = await inquirer.prompt([
    {
      type: "list",
      name: "archivedTaskListId",
      message: "🗂️ Select a Task List archived to unarchive",
      choices: manager.archivedTaskLists.map((list) => ({
        name: list.name,
        value: list.id,
      })),
    },
  ]);

  const selectedTaskList = manager.getTaskList(archivedTaskListId);
  selectedTaskList.updateTaskListFields("isArchived", false);
  manager.unarchivedTaskLists.push(selectedTaskList);
  manager.archivedTaskLists = manager.archivedTaskLists.filter(
    (taskList) => taskList !== selectedTaskList
  );
  await pause();
  await showTaskListMenu(manager);
}

export async function displayTasksLists(manager) {
  console.clear();
  await printBanner();
  if (
    manager.unarchivedTaskLists.length === 0 &&
    manager.archivedTaskLists.length === 0
  ) {
    console.warn(
      chalk.redBright("⚠️ You haven't task lists available to display.")
    );
    await pause();
    await showTaskListMenu(manager);
  }

  const { displayFilter } = await inquirer.prompt([
    {
      type: "list",
      name: "displayFilter",
      message: "📝 Which task lists would you like to see?",
      choices: [
        { name: "🗃️ Archived Task Lists", value: 1 },
        { name: "🗂️ Non Archived Task Lists", value: 2 },
        { name: "📖 All Task Lists", value: 3 },
        { name: "🔙 Go Back", value: "back" },
      ],
    },
  ]);

  switch (displayFilter) {
    case 1:
      if (manager.archivedTaskLists.length === 0) {
        console.warn(
          chalk.redBright(
            "⚠️ You haven't archived task lists available to display."
          )
        );
      } else {
        manager.getArchivedTaskLists();
      }
      break;

    case 2:
      if (manager.unarchivedTaskLists.length === 0) {
        console.warn(
          chalk.redBright(
            "⚠️ You haven't non-archived task lists available to display."
          )
        );
      } else {
        manager.getNonArchivedTaskLists();
      }
      break;

    case 3:
      manager.getAllTaskLists();
      break;

    case "back":
      await showTaskListMenu(manager);
      break;

    default:
      console.warn(chalk.redBright("❌ Invalid option."));
      break;
  }
  await pause();
  console.clear();
  await printBanner();
  await displayTasksLists(manager);
}

export async function saveTaskListsToFile(manager) {
  if (manager.taskLists.length === 0) {
    console.warn(
      chalk.redBright("⚠️ You don't have any task lists available to save.")
    );
    await pause();
    await showTaskListMenu(manager);
  }

  console.log(
    chalk.rgb(168, 155, 157)("Save the manager. Type 'cancel' to abort.")
  );

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

  if (managerName.trim().toLowerCase() === "cancel") {
    console.log(chalk.rgb(207, 207, 234)("Operation cancelled."));
    await pause();
    await showTaskListMenu(manager);
  }

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
  await pause();
  await showTaskListMenu(manager);
}

export async function loadTaskListsFromFile(manager) {
  const dataDir = "data";

  const files = fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith(".json"));

  if (files.length === 0) {
    console.warn(
      chalk.redBright(
        "⚠️ No saved Task List Manager were found in the 'data' directory."
      )
    );
    await pause();
    await showTaskListMenu(manager);
  }

  console.log(chalk.yellowBright("📋 Current manager summary:"));
  if (manager.taskLists.length === 0) {
    console.log(chalk.gray("💽 No task lists in memory."));
  } else {
    console.log(
      chalk.gray(`${manager.taskLists.length} task lists in memory:`)
    );
    manager.taskLists.forEach((list, i) => {
      console.log(
        `  ${i + 1}. ${chalk.bold.green(list.name)} ${chalk.cyanBright(
          list.tasks.length
        )} tasks.`
      );
    });
  }

  const { confirmSave } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmSave",
      message:
        "💾 Do you want to save your current work before loading another manager?",
      default: true,
    },
  ]);

  if (confirmSave) {
    const timestamp = format(Date.now(), "yyyyMMdd_HHmmss");
    const backupPath = `${dataDir}/backup_${timestamp}.json`;
    fs.writeFileSync(backupPath, JSON.stringify(manager, null, 2), "utf8");
    console.log(chalk.green(`✅ Backup saved to: ${backupPath}`));
  }

  const { selectedFile } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedFile",
      message: "📂 Select a Task Lists Manager file to load",
      choices: files,
    },
  ]);

  const { confirmLoad } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmLoad",
      message: `⚠️ This will overwrite your current progress. Are you sure you want to load ${selectedFile}?`,
      default: false,
    },
  ]);

  if (!confirmLoad) {
    console.log(chalk.red("ℹ️ Load cancelled. Your data remains unchanged."));
    await pause();
    await showTaskListMenu(manager);
  }

  const path = `data/${selectedFile}`;
  try {
    const fileContent = fs.readFileSync(path, "utf8");
    const parsedManager = JSON.parse(fileContent);
    const { taskLists: rawLists, id } = parsedManager;
    manager.taskLists.length = 0;

    manager.id = id;

    // rebuild each TaskList
    for (const raw of rawLists) {
      const list = new TaskList({
        id: raw.id,
        name: raw.name,
        description: raw.description,
        isDefault: raw.isDefault,
        isArchived: raw.isArchived,
        tasks: [],
        nonCompletedTasks: [],
        completedTasks: [],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      });

      // rebuild each Task inside
      for (const t of raw.tasks || []) {
        const task = new Task({
          id: t.id,
          title: t.title,
          description: t.description,
          dueDate: t.dueDate,
          priority: t.priority,
          completed: t.completed,
          completedAt: t.completedAt,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        });
        // if it was already completed, push it to the right bucket
        if (t.completed) {
          list.tasks.push(task);
          list.completedTasks.push(task);
        } else {
          list.tasks.push(task);
          list.nonCompletedTasks.push(task);
        }
      }

      if (list.isArchived) manager.archivedTaskLists.push(list);
      else manager.unarchivedTaskLists.push(list);
      manager.taskLists.push(list);
    }

    console.log(
      chalk.whiteBright("✅ Task Lists loaded successfully from ") +
        chalk.blueBright(path)
    );
    await pause();
    await showTaskListMenu(manager);
  } catch (error) {
    console.error(chalk.red("❌ Failed to load Task Lists:"), error.message);
  }
}
