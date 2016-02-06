var expect = require('expect.js'),
fs = require('fs'),
glimrBuild = require(__dirname + '/../glimr/glimr_build.js')();
var nitLogs = {};
nitLogs.content = fs.readFileSync(__dirname + "/data/nitlogs.txt").toString();
nitLogs.logObjects = glimrBuild.toLogObjectsArray(nitLogs.content, true);
nitLogs.authors = glimrBuild.authors.findUniqueAuthors(nitLogs.logObjects);

describe('cards', function(){

    it('should a list of unique authors',function(){
        expect(nitLogs.authors.length).to.equal(5);
    });

});