import inquirer from "inquirer";
import { Task } from "../models/Task.js";
import { priorityLevels } from "../utils/JSONLoader.js";
import { formatLocalDate } from "../utils/dateFormat.js";
import { parse } from "date-fns";
import chalk from "chalk";
import { selectedTaskMenu } from "../views/taskMenu.js";

export async function addTask(selectedTaskList, manager) {
  const { title, description, dueDate, dueTime, priority } =
    await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "📝 Enter a title for your new Task (max 20 characters)",
        validate: (input) =>
          input.length > 0 && input.length <= 20
            ? true
            : "⚠️  Task title must be between 1 and 20 characters.",
      },
      {
        type: "input",
        name: "description",
        message:
          "Enter a description for your new Task List (max 200 characters)",
        validate: (input) =>
          input.length > 0 && input.length <= 200
            ? true
            : "⚠️  Task List description must be between 1 and 200 characters.",
      },
      {
        type: "input",
        name: "dueDate",
        message: "Enter the due date for the task (YYYY-MM-DD)",
        validate: async (input) => {
          const dueDate = parse(input, "yyyy-MM-dd", new Date());
          if (isNaN(dueDate)) {
            return "Please enter a valid date in the format YYYY-MM-DD";
          }
          if (dueDate < new Date(Date.now())) {
            return "Please enter a date that is after the current date.";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "dueTime",
        message: "Enter the due time for your due date (hh:mm:ss)",
      },
      {
        type: "list",
        name: "priority",
        message: "Please select a priority for your task",
        choices: priorityLevels,
      },
    ]);

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

  const newTask = new Task(title, description, combinedDate, priority);
  selectedTaskList.addTask(newTask);
  selectedTaskList.logTaskListState();
  await selectedTaskMenu(selectedTaskList, manager);
}

export async function updateTask(selectedTaskList) {}

export async function deleteTask(selectedTaskList, manager) {
  if (selectedTaskList.tasks.length === 0) {
    console.warn(
      chalk.redBright("⚠️ You don't have tasks available to delete.")
    );
    await selectedTaskMenu(selectedTaskList, manager);
  }

  const { selectedTaskId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedTaskId",
      message: "🗑️ Select a Task to delete.",
      choices: selectedTaskList.tasks.map((list) => ({
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
  await selectedTaskMenu(selectedTaskList, manager);
}

export async function markTaskAsCompleted(selectedTaskList) {}

export async function reopenCompletedTask(selectedTaskList) {}

export async function displayTasks(selectedTaskList) {}

export async function filterTasks(selectedTaskList) {}

export async function updateTaskPriority(selectedTaskList) {}

export async function sortTasks(selectedTaskList) {}
