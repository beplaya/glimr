
var superagent = require('superagent'),
expect = require('expect.js'),
fs = require('fs'),
glimr = require(__dirname + '/../glimr/glimr.js')();

var nitLogs = {};
nitLogs.content = fs.readFileSync(__dirname + "/data/nitlogs.txt").toString();
nitLogs.logObjects = glimr.toEntryObjectsArray(nitLogs.content);


describe('Log Objectifier', function(){
    it('should objectify logs',function(){
        expect(nitLogs.logObjects.length).to.equal(363);
    });
});
describe('Log Objectifier', function(){
    it('should objectify commit ids',function(){
        expect("0~" + nitLogs.logObjects[0].commit).to.equal("0~" + "2f236253b3ba306157cff82f5f405d00648d46f0");
        expect("4~" + nitLogs.logObjects[4].commit).to.equal("4~" + "4ee4f7658f6ef29d585f6a84e7d20acf25cc2c03");
        var index = (nitLogs.logObjects.length-1);
        expect(index + "~" + nitLogs.logObjects[index].commit).to.equal(index + "~" + "c316a2cc0daeb74e6079b656f95702a83c39e86d");
    });
});

describe('Log Objectifier', function(){
    it('should objectify commit author name',function(){
        expect("0~" + nitLogs.logObjects[0].author.name).to.equal("0~TEST AuTHOR0");
        expect("1~" + nitLogs.logObjects[1].author.name).to.equal("1~T3ST AuTttHOR1");
    });
});

describe('Log Objectifier', function(){
    it('should objectify commit author email address',function(){
        expect("0~" + nitLogs.logObjects[0].author.email).to.equal("0~author0@email.net");
        expect("1~" + nitLogs.logObjects[1].author.email).to.equal("1~testa1@thing.com");
    });
});