import inquirer from "inquirer";
import { Task } from "../models/Task.js";
import { priorityLevels } from "../utils/JSONLoader.js";
import { parse } from "date-fns";
import chalk from "chalk";
import { selectedTaskMenu } from "../views/taskMenu.js";
import { updateTaskOptions } from "../utils/JSONLoader.js";

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
  await selectedTaskMenu(manager, selectedTaskList);
}

export async function updateTask(manager, selectedTaskList) {
  if (selectedTaskList.nonCompletedTasks.length === 0) {
    console.warn(chalk.redBright("⚠️ You haven't tasks available to update."));
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
      const { toggleCompleted } = await inquirer.prompt([
        {
          type: "list",
          name: "toggleCompleted",
          message:
            "🕹️ Would you like to toggle the completed status for this Task?",
          choices: [
            { name: "✔️ Mark as Completed", value: 1 },
            { name: "✖️ Mark as Not Completed", value: 2 },
          ],
        },
      ]);
      if (toggleCompleted === 1) {
        selectedTask.updatedTaskFields("completed", true);
        selectedTaskList.completedTasks.push(selectedTask);
        selectedTaskList.nonCompletedTasks =
          selectedTaskList.nonCompletedTasks.filter(
            (task) => task !== selectedTask
          );
      } else selectedTask.updatedTaskFields("completed", false);
      selectedTask.completedAt = Date.now();
      await selectedTaskMenu(manager, selectedTaskList);
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
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const { selectedTaskId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTaskId",
      message: "🗑️ Select a Task to delete.",
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
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const { selectedTaskId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTaskId",
      message: "🔄 Select a Task to reopen.",
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
    await selectedTaskMenu(manager, selectedTaskList);
  }

  const { displayFilter } = await inquirer.prompt([
    {
      type: "list",
      name: "displayFilter",
      message: "📝 Which tasks would you like to see?",
      choices: [
        { name: "✅ Completed Tasks", value: 1 },
        { name: "⏳ Non Completed Tasks", value: 2 },
        { name: "📋 All Tasks", value: 3 },
      ],
    },
  ]);

  if (displayFilter === 1) {
    if (selectedTaskList.completedTasks.length === 0) {
      console.warn(
        chalk.redBright("⚠️ You haven't completed tasks available to display.")
      );
      await selectedTaskMenu(manager, selectedTaskList);
    } else selectedTaskList.getCompletedTasks();
  } else if (displayFilter === 2) {
    if (selectedTaskList.nonCompletedTasks.length === 0) {
      console.warn(
        chalk.redBright("⚠️ You haven't completed tasks available to display.")
      );
      await selectedTaskMenu(manager, selectedTaskList);
    } else selectedTaskList.getNonCompletedTasks();
  } else selectedTaskList.getAllTasks();

  await selectedTaskMenu(manager, selectedTaskList);
}

export async function filterTasks(manager, selectedTaskList) {}

export async function sortTasks(manager, selectedTaskList) {}
