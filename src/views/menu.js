import inquirer from "inquirer";
import { showTaskListMenu } from "./taskListMenu.js";
import { showTaskMenu } from "./taskMenu.js";
import { openGithubProfile } from "./openGithubProfile.js";
import { menuOptions } from "../utils/JSONLoader.js";
import { defaultTaskList } from "../utils/defaultTaskList.js";
import { findDefaultTaskList } from "../utils/defaultTaskList.js";
import chalk from "chalk";
import { printBanner } from "../index.js";

/**
 * An array of main menu options for the CLI.
 * Each option includes a display name and a corresponding numerical value.
 *
 * @type {Array<{name: string, value: number}>}
 */

export async function mainMenu(manager) {
  const choices = [...menuOptions];

  const defaultTaskList = await findDefaultTaskList(manager);

  if (defaultTaskList !== undefined) {
    const defaultName = defaultTaskList.name;
    choices.splice(3, 0, {
      name: `🔧 ${defaultName}`,
      value: 4,
    });
  }
  try {
    while (true) {
      console.clear();
      await printBanner();
      const { selectedOption } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedOption",
          message: "Select an option:",
          choices,
        },
      ]);

      await handleMenuSelection(manager, selectedOption);
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
 * @param {TaskList} manager - The TaskList instance to operate on.
 * @returns {Promise<void>}
 *
 * @example
 * // Depending on the user's choice, various functions are executed.
 * await handleMenuSelection(1, manager);
 */
async function handleMenuSelection(manager, selectedOption) {
  switch (selectedOption) {
    case 1:
      await showTaskListMenu(manager);
      break;
    case 2:
      await showTaskMenu(manager);
      break;
    case 3:
      await openGithubProfile();
      break;
    case 4:
      await defaultTaskList(manager);
      break;
    case 0:
      console.log(chalk.greenBright("👋 Exiting..."));
      process.exit(0);
    default:
      console.warn(chalk.redBright("❌ Invalid option. Please try again."));
  }
}
