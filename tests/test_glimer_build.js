
var expect = require('expect.js'),
fs = require('fs'),
glimrBuild = require(__dirname + '/../glimr/glimr_build.js')();

var nitLogs = {};
nitLogs.content = fs.readFileSync(__dirname + "/data/nitlogs.txt").toString();
nitLogs.logObjects = glimrBuild.toLogObjectsArray(nitLogs.content);


describe('Log Objectifier', function(){
    it('should objectify logs',function(){
        expect(nitLogs.logObjects.length).to.equal(363);
    });

    it('should objectify commit ids',function(){
        expect("0~" + nitLogs.logObjects[0].commit).to.equal("0~" + "2f236253b3ba306157cff82f5f405d00648d46f0");
        expect("4~" + nitLogs.logObjects[4].commit).to.equal("4~" + "4ee4f7658f6ef29d585f6a84e7d20acf25cc2c03");
        var index = (nitLogs.logObjects.length-1);
        expect(index + "~" + nitLogs.logObjects[index].commit).to.equal(index + "~" + "c316a2cc0daeb74e6079b656f95702a83c39e86d");
    });

    it('should objectify commit author name',function(){
        expect("0~" + nitLogs.logObjects[0].author.name).to.equal("0~TEST AuTHOR0");
        expect("1~" + nitLogs.logObjects[1].author.name).to.equal("1~T3ST AuTttHOR1");
    });

    it('should objectify commit author email address',function(){
        expect("0~" + nitLogs.logObjects[0].author.email).to.equal("0~author0@email.net");
        expect("1~" + nitLogs.logObjects[1].author.email).to.equal("1~testa1@thing.com");
    });

    it('should objectify commit date',function(){
        expect("0~" + nitLogs.logObjects[0].date).to.equal("0~"+new Date("Wed Feb 3 17:58:43 2016 -0500"));
    });

    it('should objectify commit message',function(){
        expect("0~" + nitLogs.logObjects[0].message).to.equal("0~"+"the commit message\n\n    is here and should all be captured");
    });


    it('should objectify commit and know if it is a pull request',function(){
        expect("0~" + nitLogs.logObjects[0].pullRequest.isPullRequest).to.equal("0~" + false);
        expect("0~" + nitLogs.logObjects[0].pullRequest.number).to.equal("0~" + "-1");
        expect("3~" + nitLogs.logObjects[3].pullRequest.isPullRequest).to.equal("3~" + true);
        expect("3~" + nitLogs.logObjects[3].pullRequest.number).to.equal("3~" + "23");

        for(var i=0; i<nitLogs.logObjects.length; i++) {
            if(nitLogs.logObjects[i].message.indexOf("NIT-3")!=-1 && nitLogs.logObjects[i].pullRequest.isPullRequest){
                expect(i).to.equal(5);
            }
        }
    });

    it('should objectify commit messages within dates',function(){
        //793013f722b36baa320fd7c0f8b2bd7130617407 start Feb 1
        //4ee4f7658f6ef29d585f6a84e7d20acf25cc2c03 end Feb 3

        var logObjectsWithinDatesEndStart = glimrBuild.toLogObjectsArray(nitLogs.content,
            new Date("Wed Feb 3 17:00:09 2016 -0500"), new Date("Mon Feb 1 22:01:42 2016 -0500"));
        var logObjectsWithinDatesStartEnd = glimrBuild.toLogObjectsArray(nitLogs.content,
            new Date("Mon Feb 1 22:01:42 2016 -0500"), new Date("Wed Feb 3 17:00:09 2016 -0500"));

        expect(logObjectsWithinDatesEndStart.length).to.equal(9);
        expect(logObjectsWithinDatesStartEnd.length).to.equal(9);

    });
});
