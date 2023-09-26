const directoryLib = require('./directory');

function File(name) {
  this.name = name;
  this.contents = null;
}

function isValidFile(name) {
  const currentDirectory = directoryLib._getDirectory();
  return !!currentDirectory.files[name];
}

function createNewFile(name) {
  if (isValidFile(name)) {
    console.log('file name "' + name + '" exists. please choose a different name');
  } else {
    const newFile = new File(name);
    const currentDirectory = directoryLib._getDirectory();
    currentDirectory.files[name] = newFile;
  }
}

function writeFileContents(name, contents) {
  if (!isValidFile(name)) {
    console.log('file not found');
  } else {
    // validation of contents (size + safety)
    const currentDirectory = directoryLib._getDirectory();
    currentDirectory.files[name].contents = contents;
  }
}

function getFileContents(name) {
  if (!isValidFile(name)) {
    console.log('file not found');
  } else {
    const currentDirectory = directoryLib._getDirectory();
    return currentDirectory.files[name].contents;
  }
}

function moveFile(name, directory) {
  if (isValidFile(name) && directoryLib.isValidDirectory(directory)) {
    const currentDirectory = directoryLib._getDirectory();
    if (!!currentDirectory.directories[directory].files[name]) {
      console.log('duplicate name in target directory', { name, directory });
      return;
    }
    let tempFile = Object.assign({}, currentDirectory.files[name]);
    currentDirectory.directories[directory].files[name] = tempFile;
    delete currentDirectory.files[name];
  } else {
    console.log('invalid name and/or directory');
  }
}

module.exports = {
  createNewFile,
  writeFileContents,
  getFileContents,
  moveFile,
}
