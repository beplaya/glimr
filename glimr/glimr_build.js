module.exports = function() {
    var GLIMRB = {};
    GLIMRB.deltas = require(__dirname + "/lib/deltas.js")();
    GLIMRB.cards = require(__dirname + "/lib/cards.js")();
    GLIMRB.authors = require(__dirname + "/lib/authors.js")();
    GLIMRB.dateCommon = require(__dirname + "/lib/date_common.js")();
    GLIMRB.glimrCSV = require(__dirname + "/lib/glimr_csv.js")();
    GLIMRB.punchCard = require(__dirname + "/lib/punch_card.js")();

    GLIMRB.toLogObjectsArray = function(logOutput, date1, date2) {
        var logObjects = GLIMRB.build(logOutput, date1, date2);
        return logObjects;
    };

    GLIMRB.build = function(logOutput, date1, date2) {
        var entryTextBlocks = logOutput.split("\ncommit ");
        var logObjects = [];
        var index = 0;
        for(var i=0; i<entryTextBlocks.length; i++){
            var entryLines = entryTextBlocks[i];
            if(entryLines.length===0) {
                continue;
            } else {
                var entryObj = GLIMRB.createEntry(entryLines);
                logObjects[index] = entryObj;
                index++;
            }
        }
        logObjects = logObjects.sort(function(a, b){
            return a.date.getTime() < b.date.getTime() ? 1 : (a.date.getTime() === b.date.getTime() ? 0 : -1);
        });
        var finalLogObjects = logObjects;
        if(date1 && date2){
            finalLogObjects = [];
            for(var i=0; i<logObjects.length; i++){
                if(GLIMRB.dateCommon.isWithin(logObjects[i].date, date1, date2)){
                    finalLogObjects.push(logObjects[i]);
                }
            }
        }
        return finalLogObjects;
    };

    GLIMRB.createEntry = function(entryLines) {
        var entry = {};
        var lines = entryLines.split("\n");
        for(var i=0; i<lines.length; i++){
            var l = lines[i];
            if(l.length > 0 && !entry.commit) {
                entry.commit = l.replace(/commit/g, "").trim();
            } else if(l.indexOf("Author: ") != -1) {
                var authorLineSplit = l.split("<");
                entry.author = {
                    name: authorLineSplit[0].replace(/:/g, "").replace(/Author/g, "").trim(),
                    email: authorLineSplit[1].replace(/>/g, "").trim()
                };
            } else if(l.indexOf("Date: ") != -1) {
                entry.date = new Date(l.replace("Date: ", ""));
            }
        }
        entry.message = entryLines.split("Date: ")[1];
        entry.message = entry.message.substring(entry.message.indexOf("\n\n")+"\n\n".length, entry.message.length).trim();
        entry.pullRequest = GLIMRB.getPullRequestInfo(entry.message);
        return entry;
    };

    GLIMRB.getPullRequestInfo = function(message) {
        var pullRequest = {
            isPullRequest : false,
            number : -1
        };
        try {
            var pullRequestSearchStr = "Merge pull request #";
            var indexOfPullRequestInfoInMessage = message.indexOf(pullRequestSearchStr);
            if(indexOfPullRequestInfoInMessage != -1) {
                var numberStr = message.substring(indexOfPullRequestInfoInMessage+pullRequestSearchStr.length);
                if(numberStr.indexOf(" ")!=-1){
                    pullRequest.isPullRequest = true;
                    pullRequest.number = numberStr.split(" ")[0];
                }
            }
        } catch(e) {
            console.log(e);
            pullRequest = {
                isPullRequest : false,
                number : -1
            };
        }
        return pullRequest;
    };

    return GLIMRB;
}