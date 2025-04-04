import inquirer from "inquirer";
import { showTaskListManagerMenu } from "./taskListMenu.js";
import { showTaskManagerMenu } from "./taskMenu.js";
import { menuOptions } from "../utils/JSONLoader.js";
import chalk from "chalk";

/**
 * Freeze JSON configuration objects to prevent accidental modification.
 */
Object.freeze(menuOptions);

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
      await showTaskManagerMenu(manager);
      break;
    case 0:
      console.log(chalk.greenBright("👋 Exiting..."));
      process.exit(0);
    default:
      console.warn(chalk.redBright("❌ Invalid option. Please try again."));
  }
}
