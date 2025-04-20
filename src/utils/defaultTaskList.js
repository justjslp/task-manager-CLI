import chalk from "chalk";
import { selectedTaskMenu } from "../views/taskMenu.js";

export async function defaultTaskList(manager) {

  const defaultTaskList = await findDefaultTaskList(manager);

  if (!defaultTaskList) {
    console.warn(chalk.redBright("⚠️ You haven't a default task list."));
  } else {
    await selectedTaskMenu(manager, defaultTaskList);
  }
}

export async function findDefaultTaskList(manager)
{
  const defaultTaskList = manager.taskLists.find(
    (taskList) => taskList.isDefault === true
  );
  return defaultTaskList
}