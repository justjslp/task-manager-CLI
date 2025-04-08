import inquirer from "inquirer";
import { Task } from "../models/Task.js";
import { priorityLevels } from "../utils/JSONLoader.js";
import { formatLocalDate } from "../utils/dateFormat.js";
import { parse } from "date-fns";

export async function addTask(selectedTaskList) {
  const { description, dueDate, priority } = await inquirer.prompt([
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
        const localMidnight = parse(input, "yyyy-MM-dd", new Date());
        if (isNaN(localMidnight)) {
          return "Please enter a valid date in the format YYYY-MM-DD.";
        }

        const inputFormattedLocal = formatLocalDate(localMidnight);
        const nowFormattedLocal = formatLocalDate(Date.now());
        if (inputFormattedLocal < nowFormattedLocal) {
          return "Please enter a date that is after the current date.";
        }
        return true;
      },
    },
    {
      type: "list",
      name: "priority",
      message: "Please select a priority for your task",
      choices: priorityLevels,
    },
  ]);
  const task = new Task(description, dueDate, priority);
  selectedTaskList.addTask(task);
  selectedTaskList.logTaskListState();
}

export async function updateTask(selectedTaskList) {}

export async function deleteTask(selectedTaskList) {}

export async function markTaskAsCompleted(selectedTaskList) {}

export async function reopenCompletedTask(selectedTaskList) {}

export async function displayTasks(selectedTaskList) {}

export async function filterTasks(selectedTaskList) {}

export async function updateTaskPriority(selectedTaskList) {}

export async function sortTasks(selectedTaskList) {}
