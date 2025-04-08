import crypto from "crypto";
import { formatLocalDate } from "../utils/dateFormat.js";
import { parse } from "date-fns";
/**
 * Represents an individual Task.
 *
 * A Task is a single unit of work with a unique identifier, description, due date, priority, and creation date.
 * It also tracks whether the task has been completed.
 *
 * @example
 * // Assuming priorityLevels is defined and contains a NON_URGENT property
 * const task = new Task("Finish the report", "2023-12-31", priorityLevels.NON_URGENT);
 * console.log(task.description); // "Finish the report"
 */
export class Task {
  /**
   * Creates a new Task instance.
   *
   * @param {string} description - A short text describing the task.
   * @param {string} dueDate - The due date for the task in a format accepted by the Date constructor (e.g., "YYYY-MM-DD").
   * @param {string} [priority=priorityLevels.NON_URGENT] - The priority level of the task. Must be one of the values in priorityLevels. The value by default is NON_URGENT.
   *
   * @throws {Error} Throws an error if the provided priority is not one of the allowed values.
   */
  constructor(description, dueDate, priority = 6) {
    /**
     * A unique identifier for the Task.
     * @type {string}
     */
    this.id = crypto.randomUUID();

    /**
     * A short description of the task.
     * @type {string}
     */
    this.description = description;

    /**
     * The due date for the task as a Date object.
     * @type {Date}
     */

    this.dueDate = formatLocalDate(parse(dueDate, "yyyy-MM-dd", new Date()));

    /**
     * The priority level of the task.
     * @type {string}
     */
    this.priority = priority;

    /**
     * Indicates whether the task is completed.
     * @type {boolean}
     */
    this.completed = false;

    /**
     * The timestamp representing when the task was created.
     * @type {Date}
     */
    this.createdAt = formatLocalDate(new Date());
  }
}
