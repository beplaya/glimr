var expect = require('expect.js'),
fs = require('fs'),
glimrBuild = require(__dirname + '/../glimr/glimr_build.js')();
var nitLogs = {};
nitLogs.content = fs.readFileSync(__dirname + "/data/nitlogs.txt").toString();
nitLogs.logObjects = glimrBuild.toLogObjectsArray(nitLogs.content, true);
nitLogs.cards = glimrBuild.cards.findUniqueCards("NIT", nitLogs.logObjects);


describe('cards', function(){

    it('should a list of unique cards',function(){

        expect(nitLogs.cards.length).to.equal(2);
        expect(nitLogs.cards[0].number).to.equal(3);
        expect(nitLogs.cards[0].key).to.equal("NIT-3");
        expect(nitLogs.cards[0].numberOfPullRequests).to.equal(1);
        expect(nitLogs.cards[0].commits.length).to.equal(2);
        //
        expect(nitLogs.cards[1].number).to.equal(2);
        expect(nitLogs.cards[1].key).to.equal("NIT-2");
        expect(nitLogs.cards[1].numberOfPullRequests).to.equal(2);
        expect(nitLogs.cards[1].commits.length).to.equal(44);
        //
    });

});