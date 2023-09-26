const assert = require('assert');
const directoryLib = require('../directory');
const fileLib = require('../file')

describe('File System', function() {
  describe('Directory Library', function() {
    beforeEach(function() {
      directoryLib._clearDirectory();
    });

    describe('#changeDirectory', function() {
      it('should not change directory if path is invalid', function() {
        const newDirectory = 'foo';
        directoryLib.changeDirectory(newDirectory);
        assert.notEqual(directoryLib._getDirectory().name, newDirectory)
      });

      it('should change directory if path is valid', function() {
        const newDirectory = 'bar';
        directoryLib.makeDirectory(newDirectory);
        directoryLib.changeDirectory(newDirectory);
        assert.equal(directoryLib._getDirectory().name, newDirectory)
      });

      it('should handle parent directory changing (valid path)', function() {
        const newDirectory = 'baz';
        directoryLib.makeDirectory(newDirectory);
        directoryLib.changeDirectory(newDirectory);
        directoryLib.makeDirectory('next');
        directoryLib.changeDirectory('../baz/next/../..');
        assert.equal(directoryLib._getDirectory().name, '/');
      });

      it('should handle parent directory changing (invalid path)', function() {
        const newDirectory = 'baz';
        directoryLib.makeDirectory(newDirectory);
        directoryLib.changeDirectory(newDirectory);
        directoryLib.makeDirectory('next');
        directoryLib.changeDirectory('../bad/next/../..');
        // directory remains at baz since the path was invalid
        assert.notEqual(directoryLib._getDirectory().name, '/');
        assert.equal(directoryLib._getDirectory().name, newDirectory)
      });
    });

    describe('#getDirectory', function() {
      it('should return the existing path of your current directory', function() {
        const newDirectory = 'baz';
        const nextDirectory = 'next';
        directoryLib.makeDirectory(newDirectory);
        directoryLib.changeDirectory(newDirectory);
        directoryLib.makeDirectory(nextDirectory);
        directoryLib.changeDirectory(nextDirectory);
        const result = directoryLib.getDirectory();
        assert.equal(result, '/baz/next')
      });
    });

    describe('#getDirectoryContents', function() {
      it('should return the contents of the current directory', function() {
        const directoryName = 'foo';
        const fileName = 'bar';
        directoryLib.makeDirectory(directoryName);
        fileLib.createNewFile(fileName);
        const result = directoryLib.getDirectoryContents();
        assert.equal(result.name, '/');
        assert.equal(result.directories[directoryName].name, directoryName);
        assert.equal(result.files[fileName].name, fileName);
        assert.equal(result.name, '/');
      });
    });

    describe('#makeDirectory', function() {
      it('should create a directory if the directory name does not exist', function() {
        const newDirectory = 'baz';
        directoryLib.makeDirectory(newDirectory);
        const result = directoryLib._getDirectory();
        assert.equal(result.directories[newDirectory].name, newDirectory);
      });

      it('should not create a directory if the directory exists', function() {
        const newDirectory = 'baz';
        directoryLib.makeDirectory(newDirectory);
        directoryLib.makeDirectory(newDirectory);
        const result = directoryLib._getDirectory();
        assert.equal(Object.keys(result.directories).length, 1);
      });
    });

    describe('#removeDirectory', function() {
      it('should remove the directory if it exists', function() {
        const newDirectory = 'baz';
        directoryLib.makeDirectory(newDirectory);
        let result = directoryLib._getDirectory();
        assert.equal(result.directories[newDirectory].name, newDirectory);
        directoryLib.removeDirectory(newDirectory);
        result = directoryLib._getDirectory();
        assert.equal(Object.keys(result.directories).length, 0);
      });
    });

    describe('#findName', function() {
      it('should return all matching names', function() {
        const name = 'foo';
        const nextDirectory = 'next';
        directoryLib.makeDirectory(name);
        directoryLib.changeDirectory(name);
        fileLib.createNewFile(name);
        directoryLib.makeDirectory(nextDirectory);
        directoryLib.changeDirectory(nextDirectory);
        const result = directoryLib.findName(name);
        assert.equal(result.length, 2);
      });
    });

    describe('#merge', function() {
      it('does not merge when a directory reference is invalid', function() {
        const firstDirectory = 'foo';
        const secondDirectory = 'bar';

        directoryLib.makeDirectory(firstDirectory);
        directoryLib.merge(firstDirectory, secondDirectory);
        const result = directoryLib._getDirectory().directories[secondDirectory];
        assert.equal(result, undefined);
      });

      it('does merge when a directory reference is valid', function() {
        const firstDirectory = 'foo';
        const firstFile = 'file1';
        const secondDirectory = 'bar';
        const secondFile = 'file2';
        const duplicateDirectory = 'baz';
        const duplicateFile = 'file3';

        directoryLib.makeDirectory(firstDirectory);
        directoryLib.makeDirectory(secondDirectory);
        directoryLib.changeDirectory(firstDirectory);
        fileLib.createNewFile(firstFile);
        fileLib.createNewFile(duplicateFile);
        directoryLib.makeDirectory(firstDirectory);
        directoryLib.makeDirectory(duplicateDirectory);
        directoryLib.changeDirectory('../' + secondDirectory);
        fileLib.createNewFile(secondFile);
        fileLib.createNewFile(duplicateFile);
        directoryLib.makeDirectory(secondDirectory);
        directoryLib.makeDirectory(duplicateDirectory);
        directoryLib.changeDirectory('..');
        directoryLib.merge(firstDirectory, secondDirectory);

        const result = directoryLib._getDirectory().directories[secondDirectory];
        assert.equal(Object.keys(result.directories).length, 4);
        assert.equal(Object.keys(result.files).length, 4);
      });
    });
  });
});
