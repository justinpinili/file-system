# In-Memory Filesystem

## Requirements
- Node.js and npm installed on your machine

## Instructions
- run `npm install`
- run `npm run start` to start the file system prompt
- use the commands listed below to interact with the in-memory filesystem
- for simplicity, commands and arguments are separated by spaces (` `)
- to end the prompt type the command: `exit`

## Testing
- run `npm run test` to run unit tests

### Commands
Below are the following commands for the file system:

#### changeDirectory
ex. `changeDirectory test/path/../other`
navigates to the specified path as long as it is valid

#### getDirectory
ex. `getDirectory`
provides the directory path for the current location in the file system

#### getDirectoryContents
ex. `getDirectoryContents`
provides the context of the current directory

#### makeDirectory
ex. `makeDirectory foo`
creates a directory in the current location with the provided name

#### removeDirectory
ex. `removeDirectory fooo`
deletes the directory in the current location

#### createNewFile
ex. `createNewFile foo`
creates a new file in the current location

#### writeFileContents
ex. `writeFileContents foo content-i-want-to-write`
creates content for the specified file. if no file is found, no content will be written

#### getFileContents
ex. `getFileContents foo`
provides the context of the requested file

#### moveFile
ex. `moveFile foo destination`
moves an existing file to the provided destination, if one exists

#### findName
ex. `findName foo`
returns all directories and files that match the provided name

#### merge
ex. `merge source destination`
merges two existing directories into the target destination provided.

### TODOs
I tried to adhere to the defined timeframe and requirements. Because this project was open-ended, I had to pick and choose where I would spend my time. If I had more time to work on this I would:
- Add unit tests for prompt interactions
- For `writeFileContents` expand on the content capabilities so that we aren't limited to non-spaced content
- For `merge` there could be a more elegant approach to merging child directories with colliding names (instead of just validating top level directory name)
- The unit test DRYness could be improved (I focused more on refactoring the running code base vs. tests)
- Write in TypeScript so we can properly define properties and variables
