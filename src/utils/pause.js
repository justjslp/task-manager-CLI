import inquirer from "inquirer";

export async function pause(message = "🔹 Press Enter to resume") {
  await inquirer.prompt([
    {
      type: "input",
      name: "key",
      message,
    },
  ]);
}
