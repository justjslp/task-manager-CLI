import inquirer from "inquirer";
import { Task } from "../models/Task.js";
import { priorityLevels } from "../utils/JSONLoader.js";
import { parse } from "date-fns";
import chalk from "chalk";
import { selectedTaskMenu } from "../views/taskMenu.js";
import { updateTaskOptions } from "../utils/JSONLoader.js";
import { pause } from "../utils/pause.js";
import { printBanner } from "../index.js";
import { formatLocalDate } from "../utils/dateFormat.js";

export async function addTask(manager, selectedTaskList) {
  console.log(chalk.rgb(168, 155, 157)("Add Task. Type 'cancel' to abort."));

  const { title } = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "📝 Enter a title for your new Task (max 50 characters)",
      validate: (input) =>
        input.length > 0 && input.length <= 50
          ? true
          : "⚠️  Task title must be between 1 and 50 characters.",
    },
  ]);

  if (title.trim().toLowerCase() === "cancel") {
    console.log(chalk.rgb(207, 207, 234)("Operation cancelled."));
    await pause();
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const { description } = await inquirer.prompt([
    {
      type: "input",
      name: "description",
      message:
        "📝 Enter a description for your new Task List (max 300 characters)",
      validate: (input) =>
        input.length > 0 && input.length <= 300
          ? true
          : "⚠️  Task List description must be between 1 and 300 characters.",
    },
  ]);

  if (description.trim().toLowerCase() === "cancel") {
    console.log(chalk.rgb(207, 207, 234)("Operation cancelled."));
    await pause();
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const { dueDate } = await inquirer.prompt([
    {
      type: "input",
      name: "dueDate",
      message: "Enter the due date for the task (YYYY-MM-DD)",
      validate: async (input) => {
        const dueDate = parse(input, "yyyy-MM-dd", Date.now());
        if (input.trim().toLowerCase() === "cancel") return true;
        if (isNaN(dueDate)) {
          return "Please enter a valid date in the format YYYY-MM-DD";
        }
        if (dueDate < Date.now()) {
          return "Please enter a date that is after the current date.";
        }
        return true;
      },
    },
  ]);

  if (dueDate.trim().toLowerCase() === "cancel") {
    console.log(chalk.rgb(207, 207, 234)("Operation cancelled."));
    await pause();
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const { dueTime } = await inquirer.prompt([
    {
      type: "input",
      name: "dueTime",
      message: "Enter the due time for your due date (hh:mm:ss)",
      validate: async (input) => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
        if (input.trim().toLowerCase() === "cancel") return true;
        if (!timeRegex.test(input)) {
          return "Please enter a valid time in the format hh:mm:ss";
        }
        return true;
      },
    },
  ]);

  if (dueTime.trim().toLowerCase() === "cancel") {
    console.log(chalk.rgb(207, 207, 234)("Operation cancelled."));
    await pause();
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const { priority } = await inquirer.prompt([
    {
      type: "list",
      name: "priority",
      message: "Please select a priority for your task",
      choices: priorityLevels,
    },
  ]);

  if (priority === "cancel") {
    console.log(chalk.rgb(207, 207, 234)("Operation cancelled."));
    await pause();
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const [year, month, day] = dueDate.split("-").map(Number);

  const [hour, minute, second] = dueTime.split(":").map(Number);

  const combinedDate = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second
  ).getTime();

  const newTask = new Task({
    title: title.trim(),
    description: description.trim(),
    dueDate: combinedDate,
    priority,
  });

  selectedTaskList.addTask(newTask);
  await pause();
  await selectedTaskMenu(manager, selectedTaskList);
}

export async function updateTask(manager, selectedTaskList) {
  if (selectedTaskList.nonCompletedTasks.length === 0) {
    console.warn(chalk.redBright("⚠️ You haven't tasks available to update."));
    await pause();
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const { selectedTaskId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTaskId",
      message: "🔄 Select a Task to update",
      choices: selectedTaskList.nonCompletedTasks.map((list) => ({
        name: list.title,
        value: list.id,
      })),
    },
  ]);

  const selectedTask = selectedTaskList.getTask(selectedTaskId);

  await updateTaskField(manager, selectedTaskList, selectedTask);
}
async function updateTaskField(manager, selectedTaskList, selectedTask) {
  const { updateTaskAction } = await inquirer.prompt([
    {
      type: "list",
      name: "updateTaskAction",
      message: "📚 Select the field to update",
      choices: updateTaskOptions,
    },
  ]);
  switch (updateTaskAction) {
    case 1:
      const { updatedTitle } = await inquirer.prompt([
        {
          type: "input",
          name: "updatedTitle",
          message: "📝 Enter the new title for your Task",
          validate: (input) =>
            input.length > 0 && input.length <= 50
              ? true
              : "⚠️  Task title must be between 1 and 50 characters.",
        },
      ]);
      selectedTask.updatedTaskFields("title", updatedTitle.trim());
      await updateTaskField(manager, selectedTaskList, selectedTask);
      break;
    case 2:
      const { updatedDescription } = await inquirer.prompt([
        {
          type: "input",
          name: "updatedDescription",
          message: "📝 Enter the new description for your Task",
          validate: (input) =>
            input.length > 0 && input.length <= 300
              ? true
              : "⚠️  Task title must be between 1 and 300 characters.",
        },
      ]);
      selectedTask.updatedTaskFields("description", updatedDescription.trim());
      await updateTaskField(manager, selectedTaskList, selectedTask);
      break;
    case 3:
      const { dueDate, dueTime } = await inquirer.prompt([
        {
          type: "input",
          name: "dueDate",
          message: "📆 Enter the new due date for the task (YYYY-MM-DD)",
          validate: async (input) => {
            const dueDate = parse(input, "yyyy-MM-dd", new Date());
            if (isNaN(dueDate)) {
              return "Please enter a valid date in the format YYYY-MM-DD";
            }
            if (dueDate < Date.now()) {
              return "Please enter a date that is after the current date.";
            }
            return true;
          },
        },
        {
          type: "input",
          name: "dueTime",
          message: "🕛 Enter the new due time for your new due date (hh:mm:ss)",
          validate: async (input) => {
            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
            if (!timeRegex.test(input)) {
              return "Please enter a valid time in the format hh:mm:ss";
            }
            return true;
          },
        },
      ]);

      const [year, month, day] = dueDate.split("-").map(Number);
      const [hour, minute, second] = dueTime.split(":").map(Number);

      const combinedNewDate = new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second
      ).getTime();
      selectedTask.updatedTaskFields("dueDate", combinedNewDate);

      await updateTaskField(manager, selectedTaskList, selectedTask);
      break;
    case 4:
      const { priority } = await inquirer.prompt([
        {
          type: "list",
          name: "priority",
          message: "Please select a priority for your task",
          choices: priorityLevels,
        },
      ]);
      selectedTask.updatedTaskFields("priority", priority);
      await updateTaskField(manager, selectedTaskList, selectedTask);
      break;
    case 5:
      const { markAsCompleted } = await inquirer.prompt([
        {
          type: "confirm",
          name: "markAsCompleted",
          message: "🕹️ Would you like to mark the Task as completed?",
        },
      ]);

      if (markAsCompleted) {
        selectedTask.updatedTaskFields("completed", true);
        selectedTaskList.completedTasks.push(selectedTask);
        selectedTaskList.nonCompletedTasks =
          selectedTaskList.nonCompletedTasks.filter(
            (task) => task !== selectedTask
          );
        selectedTask.completedAt = Date.now();
        await pause();
        await selectedTaskMenu(manager, selectedTaskList);
      } else await selectedTaskMenu(manager, selectedTaskList);
      break;
    case "back":
      await updateTask(manager, selectedTaskList);
      break;
    case "taskMenu":
      await selectedTaskMenu(manager, selectedTaskList);
      break;
  }
}

export async function deleteTask(manager, selectedTaskList) {
  if (selectedTaskList.nonCompletedTasks.length === 0) {
    console.warn(chalk.redBright("⚠️ You haven't tasks available to delete."));
    await pause();
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const { selectedTaskId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTaskId",
      message: "🗑️ Select a Task to delete",
      choices: selectedTaskList.nonCompletedTasks.map((list) => ({
        name: list.title,
        value: list.id,
      })),
    },
  ]);

  const selectedTask = selectedTaskList.getTask(selectedTaskId);

  const { answer } = await inquirer.prompt([
    {
      type: "confirm",
      name: "answer",
      message: `Are you sure you want to delete the Task "${selectedTask.title}"? This will permanently remove the task from the Task List "${selectedTaskList.name}".`,
      default: false,
    },
  ]);

  if (answer) selectedTask.deleteTaskSelf(selectedTaskList);
  await selectedTaskMenu(manager, selectedTaskList);
}

export async function reopenCompletedTask(manager, selectedTaskList) {
  if (selectedTaskList.completedTasks.length === 0) {
    console.warn(
      chalk.redBright("⚠️ You haven't completed tasks available to re open.")
    );
    await pause();
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const { selectedTaskId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTaskId",
      message: "🔄 Select a Task to reopen",
      choices: selectedTaskList.completedTasks.map((list) => ({
        name: list.title,
        value: list.id,
      })),
    },
  ]);

  const selectedTask = selectedTaskList.getTask(selectedTaskId);

  selectedTask.updatedTaskFields("completed", false);
  selectedTaskList.nonCompletedTasks.push(selectedTask);
  selectedTaskList.completedTasks = selectedTaskList.completedTasks.filter(
    (task) => task !== selectedTask
  );
  selectedTask.completedAt = null;

  await selectedTaskMenu(manager, selectedTaskList);
}

export async function displayTasks(manager, selectedTaskList) {
  if (
    selectedTaskList.nonCompletedTasks.length === 0 &&
    selectedTaskList.completedTasks.length === 0
  ) {
    console.warn(chalk.redBright("⚠️ You haven't tasks available to display."));
    await pause();
    return selectedTaskMenu(manager, selectedTaskList);
  }

  const { displayFilter } = await inquirer.prompt({
    type: "list",
    name: "displayFilter",
    message: "📝 Which tasks would you like to see?",
    choices: [
      { name: "✅ Completed Tasks", value: 1 },
      { name: "⏳ Non Completed Tasks", value: 2 },
      { name: "📋 All Tasks", value: 3 },
      { name: "🔙 Go Back", value: "back" },
    ],
  });

  switch (displayFilter) {
    case 1:
      if (selectedTaskList.completedTasks.length === 0) {
        console.warn(
          chalk.redBright(
            "⚠️ You haven't completed tasks available to display."
          )
        );
      } else {
        selectedTaskList.getCompletedTasks();
      }
      break;

    case 2:
      if (selectedTaskList.nonCompletedTasks.length === 0) {
        console.warn(
          chalk.redBright(
            "⚠️ You haven't non-completed tasks available to display."
          )
        );
      } else {
        selectedTaskList.getNonCompletedTasks();
      }
      break;

    case 3:
      selectedTaskList.getAllTasks();
      break;

    case "back":
      await selectedTaskMenu(manager, selectedTaskList);
      break;

    default:
      console.warn(chalk.redBright("❌ Invalid option."));
      break;
  }

  await pause();
  console.clear();
  await printBanner();
  await displayTasks(manager, selectedTaskList);
}

export async function filterTasks(manager, selectedTaskList) {

  if (selectedTaskList.tasks.length === 0) {
    console.warn(chalk.redBright("⚠️ You haven't tasks available to filter."));
    await pause();
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const { field } = await inquirer.prompt({
    type: "list",
    name: "field",
    message: "🔍 Which field would you like to filter by?",
    choices: [
      { name: "📛 Title (Contains…)", value: "title" },
      { name: "📝 Description (Contains…)", value: "description" },
      { name: "📅 Due Date (Before/After)", value: "dueDate" },
      { name: "🚦 Priority (Equals)", value: "priority" },
      { name: "🗓️ Created At (Before/After)", value: "createdAt" },
      { name: "🔙 Go Back", value: "back" },
    ],
  });
  await filterByField(manager, selectedTaskList, field);
}

async function filterByField(manager, selectedTaskList, field) {
  let filtered = [];
  switch (field) {
    case "title": {
      const { query } = await inquirer.prompt([
        {
          type: "input",
          name: "query",
          message: "🔎 Enter substring to match in title:",
        },
      ]);
      filtered = selectedTaskList.tasks.filter((task) =>
        task.title.toLowerCase().includes(query.toLowerCase())
      );
      break;
    }
    case "description": {
      const { query } = await inquirer.prompt([
        {
          type: "input",
          name: "query",
          message: "🔎 Enter substring to match in title:",
        },
      ]);
      filtered = selectedTaskList.tasks.filter((task) =>
        task.description.toLowerCase().includes(query.toLowerCase())
      );
      break;
    }
    case "dueDate": {
      const { when, date } = await inquirer.prompt([
        {
          type: "list",
          name: "when",
          message: "Before or after?",
          choices: ["Before", "After"],
        },
        { type: "input", name: "date", message: "📅 Enter date (YYYY-MM-DD):" },
      ]);
      const dt = parse(date, "yyyy-MM-dd", Date.now());
      filtered = selectedTaskList.tasks.filter((task) =>
        when === "before" ? task.dueDate < dt : task.dueDate > dt
      );
      break;
    }
    case "priority": {
      const { p } = await inquirer.prompt({
        type: "list",
        name: "p",
        message: "🔢 Select priority:",
        choices: priorityLevels.map((pl) => ({
          name: pl.name,
          value: pl.value,
        })),
      });
      filtered = selectedTaskList.tasks.filter((t) => t.priority === p);
      break;
    }
    case "createdAt": {
      const { when, date } = await inquirer.prompt([
        {
          type: "list",
          name: "when",
          message: "Before or after?",
          choices: ["Before", "After"],
        },
        { type: "input", name: "date", message: "📅 Enter date (YYYY-MM-DD):" },
      ]);
      const dt = parse(date, "yyyy-MM-dd", Date.now());
      filtered = selectedTaskList.tasks.filter((task) =>
        when === "Before"
          ? Number(task.dueDate) < dt
          : Number(task.dueDate) > dt
      );
      break;
    }
    case "back":
      await selectedTaskMenu(manager, selectedTaskList);
      break;
  }

  if (filtered.length === 0) {
    console.warn(chalk.redBright("⚠️ No tasks match that filter."));
  } else {
    filtered.forEach((task, index) => {
      const foundPriority = priorityLevels.find(
        (priority) => priority.value === task.priority
      );
      const now = Date.now();
      const id = task.id;
      const title = task.title;
      const dueDate =
        new Date(task.dueDate) < new Date(now).getTime()
          ? chalk.redBright(`📅 ${formatLocalDate(task.dueDate)}`)
          : chalk.blackBright(`📅 ${formatLocalDate(task.dueDate)}`);
      const priority = chalk.yellow(foundPriority.name);
      const completedAt = task.completedAt
        ? chalk.green(`📅 ${formatLocalDate(task.completedAt)}`)
        : chalk.redBright("Not completed so far.");
      const createdAt = task.createdAt
        ? chalk.blackBright(`📅 ${formatLocalDate(task.createdAt)}`)
        : "";
      const updatedAt = task.updatedAt
        ? chalk.blackBright(`📝 ${formatLocalDate(task.updatedAt)}`)
        : chalk.blackBright("Not updated so far.");

      console.log(
        chalk.cyan(index + 1 + ". ") +
          chalk.bold.green(`${title} `) +
          chalk.gray(`(ID: ${id.slice(0, 8)}...) `) +
          chalk.whiteBright(`Due date: ${dueDate} `) +
          chalk.whiteBright(`Priority: ${priority}. `) +
          chalk.whiteBright(`Completed at: ${completedAt} `) +
          chalk.whiteBright(`Created at: ${createdAt} `) +
          chalk.whiteBright(`Updated at: ${updatedAt} `)
      );
    });
  }

  await pause();
  console.clear();
  await printBanner();
  await filterTasks(manager, selectedTaskList);
}

export async function sortTasks(manager, selectedTaskList) {
  if (selectedTaskList.tasks.length === 0) {
    console.warn(chalk.redBright("⚠️ You haven't tasks available to sort."));
    await pause();
    await selectedTaskMenu(manager, selectedTaskList);
  }
}
