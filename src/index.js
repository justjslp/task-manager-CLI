import inquirer from "inquirer";
import open from "open"; // Make sure to install via `npm install open`
import { mainMenu } from "./views/menu.js";
import { TaskListManager } from "./models/TaskListManager.js";
import chalk from "chalk";
import { pastel } from "gradient-string";

async function main() {
  const title = `████████╗ █████╗ ███████╗██╗  ██╗    ██╗     ██╗███████╗████████╗    ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗      
╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝    ██║     ██║██╔════╝╚══██╔══╝    ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗    
   ██║   ███████║███████╗█████╔╝     ██║     ██║███████╗   ██║       ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝    
   ██║   ██╔══██║╚════██║██╔═██╗     ██║     ██║╚════██║   ██║       ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗    
   ██║   ██║  ██║███████║██║  ██╗    ███████╗██║███████║   ██║       ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║    
   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝    ╚══════╝╚═╝╚══════╝   ╚═╝       ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝`;

  const subtitle = chalk.bold.whiteBright(
    "\n✅ Welcome to Task Manager CLI. By"
  );

  // Print title and subtitle with gradient
  console.log("\n" + pastel.multiline(title));
  console.log(
    subtitle +
      chalk.rgb(72, 171, 182).italic(" justjslp.") +
      " Github: " +
      chalk.rgb(101, 101, 255).bold.underline("https://github.com/justjslp") +
      ".\n"
  );

  const manager = new TaskListManager();
  await mainMenu(manager);
}

main();
