import inquirer from "inquirer";
import { showTaskListManagerMenu } from "./taskListMenu.js";
import { menuOptions } from "../utils/JSONLoader.js";

/**
 * An array of main menu options for the CLI.
 * Each option includes a display name and a corresponding numerical value.
 *
 * @type {Array<{name: string, value: number}>}
 */

export async function mainMenu(manager) {
  try {
    while (true) {
      const answer = await inquirer.prompt([
        {
          type: "list",
          name: "selectedOption",
          message: "Select an option:",
          choices: menuOptions,
        },
      ]);

      await handleMenuSelection(answer.selectedOption, manager);
    }
  } catch (error) {
    console.error("🚨 Unexpected error occurred!", error);
  }
}

/**
 * Handles the selection from the main menu options.
 *
 * @async
 * @param {number} option - The numerical option selected by the user.
 * @param {TaskListManager} manager - The TaskListManager instance to operate on.
 * @returns {Promise<void>}
 *
 * @example
 * // Depending on the user's choice, various functions are executed.
 * await handleMenuSelection(1, manager);
 */
async function handleMenuSelection(option, manager) {
  switch (option) {
    case 1:
      await showTaskListManagerMenu(manager);
      break;
    case 2:
      console.log("🚀 Adding a new task...");
      break;
    case 3:
      console.log("🗑️ Deleting a task...");
      break;
    case 4:
      console.log("✏️ Updating a task...");
      break;
    case 5:
      console.log("✅ Marking task as completed...");
      break;
    case 6:
      console.log("🔄 Reopening completed task...");
      break;
    case 7:
      console.log("📋 Listing all tasks...");
      break;
    case 8:
      console.log("🔎 Filtering tasks...");
      break;
    case 9:
      console.log("💾 Saving tasks to file...");
      break;
    case 10:
      console.log("📂 Loading tasks from file...");
      break;
    case 11:
      console.log("⚡ Setting task priority...");
      break;
    case 12:
      console.log("📊 Sorting tasks by priority...");
      break;
    case 0:
      console.log("👋 Exiting...");
      process.exit(0);
    default:
      console.warn("❌ Invalid option. Please try again.");
  }
}
