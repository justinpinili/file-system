const prompt = require('prompt');
const directoryLib = require('./directory');
const fileLib = require('./file')

const COMMAND_MAP = {
  changeDirectory: { argCount: 1, function: directoryLib.changeDirectory },
  getDirectory: { argCount: 0, function: directoryLib.getDirectory },
  getDirectoryContents: { argCount: 0, function: directoryLib.getDirectoryContents },
  makeDirectory: { argCount: 1, function: directoryLib.makeDirectory },
  removeDirectory: { argCount: 1, function: directoryLib.removeDirectory },
  createNewFile: { argCount: 1, function: fileLib.createNewFile },
  writeFileContents: { argCount: 2, function: fileLib.writeFileContents },
  getFileContents: { argCount: 1, function: fileLib.getFileContents },
  moveFile: { argCount: 2, function: fileLib.moveFile },
  findName: { argCount: 1, function: directoryLib.findName },
  merge: { argCount: 2, function: directoryLib.merge },
};

prompt.start();
let exit = false;
runFileDirectory();

async function runFileDirectory() {
  while (!exit) {
    let { command } = await prompt.get(['command']);
    if (command === 'exit') {
      exit = true;
      return process.exit();
    }

    let context = command.split(' ');
    let action = context[0];
    let functionArgs = context.slice(1);
    let commandDetails = COMMAND_MAP[action];
    if (!commandDetails) {
      console.log('command not found');
    } else {
      if (context.length - 1 != commandDetails.argCount) {
        console.log(action + ' requires ' + commandDetails.argCount + ' argument(s)');
        continue;
      }
      const results = commandDetails.function.apply(null, functionArgs);
      if (results) {
        console.log(results);
      }
    }
  }
}
