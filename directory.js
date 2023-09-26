const main = new Directory('/');
let currentDirectory = main;

function Directory(name, parent) {
  this.name = name;
  this.parent = parent || null;
  this.directories = {};
  this.files = {};
}

function isValidDirectory(name) {
  return !!currentDirectory.directories[name];
}

function changeDirectory(pathString) {
  let path = pathString.split('/');
  let originalCurrent = currentDirectory;

  let tempDir = path.shift();
  while (tempDir !== undefined) {
    if (tempDir == '..' && !!currentDirectory.parent) {
      currentDirectory = currentDirectory.parent;
    } else if (isValidDirectory(tempDir)) {
      currentDirectory = currentDirectory.directories[tempDir];
    } else {
      console.log('invalid path', pathString);
      currentDirectory = originalCurrent;
      break;
    }
    tempDir = path.shift();
  }
}

function getDirectory() {
  let path = '';
  let currentTraverse = currentDirectory;
  while (currentTraverse.parent !== null) {
    path = path === '' ? currentTraverse.name : currentTraverse.name + '/' + path;
    currentTraverse = currentTraverse.parent;
  }
  return currentTraverse.name + path;
}

function getDirectoryContents() {
  return currentDirectory;
}

function makeDirectory(name) {
  if (isValidDirectory(name)) {
    console.log('directory name "' + name  + '" exists. please choose a different name');
  } else {
    const newDirectory = new Directory(name, currentDirectory);
    currentDirectory.directories[name] = newDirectory;
  }
}

function removeDirectory(name) {
  if (!currentDirectory.directories[name]) {
    console.log('directory does not exist');
  } else {
    delete currentDirectory.directories[name];
  }
}

function findName(name) {
  const results = [];
  
  let start = currentDirectory;
  while(!!start.parent) {
    start = start.parent;
  }

  searchContents(start);
  return results;

  function searchContents(directory) {
    if (!!directory.files[name]) {
      results.push({ type: 'file', directory: directory.name });
    }
    if (name === directory.name) {
      results.push({type: 'directory', directory: directory.name });
    }
    const subDirectoryNames = Object.keys(directory.directories);
    if (subDirectoryNames.length > 0) {
      for (let i = 0; i < subDirectoryNames.length; i++) {
        let name = subDirectoryNames[i];
        let subDirectory = directory.directories[name];
        searchContents(subDirectory);
      }
    }
  }
}

function merge(source, destination) {
  if (!(isValidDirectory(source) && isValidDirectory(destination))) {
    console.log('cannot merge invalid directories');
    return;
  }
  const sourceDirectory = currentDirectory.directories[source];
  const destinationDirectory = currentDirectory.directories[destination];

  for (let name in sourceDirectory.directories) {
    let subDirectory = sourceDirectory.directories[name];
    if (!destinationDirectory.directories[name]) {
      destinationDirectory.directories[name] = subDirectory;
    } else {
      let newName = name + new Date().getTime();
      destinationDirectory.directories[newName] = subDirectory;
    }
  }

  for (let name in sourceDirectory.files) {
    let file = sourceDirectory.files[name];
    if (!destinationDirectory.files[name]) {
      destinationDirectory.files[name] = file;
    } else {
      let newName = name + new Date().getTime();
      destinationDirectory.files[newName] = file;
    }
  }

  delete currentDirectory.directories[source];
}

function _clearDirectory() {
  currentDirectory = new Directory('/');
}

function _getDirectory() {
  return currentDirectory;
}

module.exports = {
  currentDirectory,
  isValidDirectory,
  changeDirectory,
  getDirectory,
  getDirectoryContents,
  makeDirectory,
  removeDirectory,
  findName,
  merge,
  _Directory: Directory,
  _clearDirectory,
  _getDirectory,
}
