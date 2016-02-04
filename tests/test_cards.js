var expect = require('expect.js'),
fs = require('fs'),
glimr = require(__dirname + '/../glimr/glimr.js')();
var nitLogs = {};
nitLogs.content = fs.readFileSync(__dirname + "/data/nitlogs.txt").toString();
nitLogs.logObjects = glimr.toLogObjectsArray(nitLogs.content, true);
nitLogs.cards = glimr.cards.findUniqueCards("NIT", nitLogs.logObjects);




describe('cards', function(){

    it('should a list of unique cards',function(){
        console.log(JSON.stringify(nitLogs.cards, 0, 4));
        expect(nitLogs.cards.length).to.equal(2);
        expect(nitLogs.cards[0].number).to.equal(3);
        expect(nitLogs.cards[0].key).to.equal("NIT-3");
        expect(nitLogs.cards[1].number).to.equal(2);
        expect(nitLogs.cards[1].key).to.equal("NIT-2");
    });

});