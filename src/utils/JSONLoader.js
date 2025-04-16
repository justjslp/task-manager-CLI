import { readFile } from "fs/promises";

/**
 * Asynchronously loads and parses a JSON file.
 *
 * This function reads a JSON file from the given file path relative to the current module,
 * parses its contents, and returns the resulting JavaScript object.
 *
 * @async
 * @param {string} filePath - The relative file path to the JSON file.
 * @returns {Promise<any>} A promise that resolves to the parsed JSON object.
 *
 * @throws {Error} Throws an error if the file cannot be read or the content cannot be parsed.
 *
 * @example
 * const data = await loadJSON("../assets/priorityLevels.json");
 * console.log(data);
 */
async function loadJSON(filePath) {
  try {
    const fileUrl = new URL(filePath, import.meta.url);
    const data = await readFile(fileUrl, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    throw error;
  }
}

// Load JSON configuration files asynchronously

/**
 * The main menu options of the task manager CLI application.
 * @type {Object}
 */
const menuOptions = await loadJSON("../utils/menuOptions.json");

/**
 * The priority levels configuration loaded from "../assets/priorityLevels.json".
 * @type {Object}
 */
const priorityLevels = await loadJSON("../utils/priorityLevels.json");

/**
 * The Task List Manager menu configuration loaded from "../assets/taskListMenu.json".
 * @type {Object}
 */
const taskListMenu = await loadJSON("../utils/taskListMenu.json");

/**
 * The Task Manager menu configuration loaded from "../assets/taskMenu.json".
 * @type {Object}
 */
const taskMenu = await loadJSON("../utils/taskMenu.json");

/**
 * The update task list options configuration loaded from "../assets/updateTaskListOptions.json".
 * @type {Object}
 */
const updateTaskListOptions = await loadJSON(
  "../utils/updateTaskListOptions.json"
);

/**
 * The update task options configuration loaded from "../assets/updateTaskOptions.json".
 * @type {Object}
 */
const updateTaskOptions = await loadJSON("../utils/updateTaskOptions.json");

/**
 * Exports the Task, TaskList, TaskList classes, along with the loaded JSON configurations.
 *
 * @module Importer
 */
export {
  menuOptions,
  taskListMenu,
  updateTaskListOptions,
  taskMenu,
  priorityLevels,
  updateTaskOptions,
};
