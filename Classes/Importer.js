import { readFile } from "fs/promises";

import { Task } from "./Task.js";
import { TaskList } from "./TaskList.js";
import { TaskListManager } from "./TaskListManager.js";

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
 * The priority levels configuration loaded from "../assets/priorityLevels.json".
 * @type {Object}
 */
const priorityLevels = await loadJSON("../assets/priorityLevels.json");

/**
 * The Task List Manager menu configuration loaded from "../assets/taskListManagerMenu.json".
 * @type {Object}
 */
const taskListManagerMenu = await loadJSON(
  "../assets/taskListManagerMenu.json"
);

/**
 * Exports the Task, TaskList, TaskListManager classes, along with the loaded JSON configurations.
 *
 * @module Importer
 */
export { Task, TaskList, TaskListManager, priorityLevels, taskListManagerMenu };
