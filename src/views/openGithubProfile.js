import inquirer from "inquirer";
import open from "open";

export async function openGithubProfile() {
  const { openLink } = await inquirer.prompt([
    {
      type: "confirm",
      name: "openLink",
      message: "Would you like to open the GitHub repository in your browser?",
      default: false,
    },
  ]);

  if (openLink) {
    await open("https://github.com/justjslp");
  }
}
