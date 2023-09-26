const assert = require('assert');
const directoryLib = require('../directory');
const fileLib = require('../file')

describe('File System', function() {
  describe('File Library', function() {
    beforeEach(function() {
      directoryLib._clearDirectory();
    });

    describe('#createNewFile', function() {
      it('should create a directory if the directory name does not exist', function() {
        const newFile = 'baz';
        fileLib.createNewFile(newFile);
        const result = directoryLib._getDirectory();
        assert.equal(result.files[newFile].name, newFile);
      });

      it('should not create a directory if the directory exists', function() {
        const newFile = 'baz';
        fileLib.createNewFile(newFile);
        fileLib.createNewFile(newFile);
        const result = directoryLib._getDirectory();
        assert.equal(Object.keys(result.files).length, 1);
      });
    });

    describe('#writeFileContents', function() {
      it('should write new content to a file if it exists', function() {
        const newFile = 'baz';
        fileLib.createNewFile(newFile);
        let result = directoryLib._getDirectory();
        assert.equal(result.files[newFile].name, newFile);
        
        const content = 'this-is-the-new-content';
        fileLib.writeFileContents(newFile, content);
        result = directoryLib._getDirectory();
        assert.equal(result.files[newFile].contents, content);
      });

      it('should not write new content to a file if it does not exist', function() {
        const newFile = 'baz';
        const missingFile = 'foo';
        fileLib.createNewFile(newFile);
        let result = directoryLib._getDirectory();
        assert.equal(result.files[newFile].name, newFile);
        
        const content = 'this-is-the-new-content';
        fileLib.writeFileContents(missingFile, content);
        result = directoryLib._getDirectory();
        assert.equal(result.files[missingFile], undefined);
      });
    });

    describe('#getFileContents', function() {
      it('should return the contents of the existing file', function() {
        const newFile = 'baz';
        fileLib.createNewFile(newFile);
        let result = directoryLib._getDirectory();
        assert.equal(result.files[newFile].name, newFile);
        
        const content = 'this-is-the-new-content';
        fileLib.writeFileContents(newFile, content);
        result = fileLib.getFileContents(newFile);
        assert.equal(result, content);
      });

      it('should return nothing for non-existing files', function() {
        const newFile = 'baz';
        fileLib.createNewFile(newFile);
        let result = directoryLib._getDirectory();
        assert.equal(result.files[newFile].name, newFile);
        
        const content = 'this-is-the-new-content';
        fileLib.writeFileContents(newFile, content);
        result = fileLib.getFileContents('missing-file');
        assert.equal(result, undefined);
      });
    });

    describe('#moveFile', function() {
      it('should prevent moving files that have the same name', function() {
        const newFile = 'baz';
        fileLib.createNewFile(newFile);
        const content = 'this-is-the-new-content';
        fileLib.writeFileContents(newFile, content);

        const newDirectory = 'foo';
        directoryLib.makeDirectory(newDirectory);
        directoryLib.changeDirectory(newDirectory);

        const otherContent = 'this-is-other-content';
        fileLib.createNewFile(newFile);
        fileLib.writeFileContents(newFile, otherContent);
        directoryLib.changeDirectory('..');
        fileLib.moveFile(newFile, newDirectory);
        directoryLib.changeDirectory(newDirectory);
        let result = directoryLib._getDirectory();

        assert.equal(result.files[newFile].contents, otherContent);
      });

      it('should move a file successfully if an existing file does not have the same name', function() {
        const newFile = 'baz';
        fileLib.createNewFile(newFile);
        const content = 'this-is-the-new-content';
        fileLib.writeFileContents(newFile, content);

        const newDirectory = 'foo';
        directoryLib.makeDirectory(newDirectory);
        fileLib.moveFile(newFile, newDirectory);
        directoryLib.changeDirectory(newDirectory);
        let result = directoryLib._getDirectory();

        assert.equal(result.files[newFile].contents, content);
        assert.equal(result.files[newFile].name, newFile);

        directoryLib.changeDirectory('..');
        result = directoryLib._getDirectory();
        assert.equal(Object.keys(result.files).length, 0);
      });
    });
  });
});
