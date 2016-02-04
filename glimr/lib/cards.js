module.exports = function(){
    var CARDS = {};
    CARDS.findUniqueCards = function(projectKey, logObjects) {
        var cards = [];
        var search = projectKey+"-";
        var pullRequestSearch = "Merge pull request #";
        for(var i=0; i<logObjects.length; i++) {
            var message = logObjects[i].message || "";
            var isMergePull = false;
            var pullRequestNumber = -1;
            if(message.indexOf(pullRequestSearch) != -1){
                isMergePull = true;
                var indexOfPullRequest = message.indexOf(pullRequestSearch);
                pullRequestNumber = message.substr(indexOfPullRequest);
                pullRequestNumber = pullRequestNumber.substr(pullRequestSearch.length);
                pullRequestNumber = pullRequestNumber.substr(0, pullRequestNumber.indexOf(" "));
            }
            var messageLines = message.split("\n");
            for(var mli=0; mli<messageLines.length; mli++){
                messageLines[mli] = messageLines[mli].trim();
                if(messageLines[mli].indexOf(search) == 0 || (messageLines[mli].indexOf(search) != -1
                        && messageLines[mli].indexOf(pullRequestSearch) != -1)){
                    var spaceIndex = messageLines[mli].indexOf(" ");
                    var issueKey = messageLines[mli].substr(0, spaceIndex).trim();
                    var split = issueKey.split("-");
                    if(split && split.length > 1) {
                        var issueNumber = 1*split[1];
                        if(Number.isInteger(issueNumber)){
                            var existingCardIndex = CARDS.findCardIndex(cards, issueKey);
                            if(existingCardIndex == -1){
                                cards.push({
                                    key : issueKey,
                                    number : issueNumber,
                                    projectKey : projectKey,
                                    commits : [ {logObject: logObjects[i], isMergePull : isMergePull, pullRequestNumber: pullRequestNumber}]
                                });
                            } else {
                                cards[existingCardIndex].commits.push({logObject: logObjects[i], isMergePull : isMergePull, pullRequestNumber: pullRequestNumber});
                            }
                        }
                    }
                }
            }
        }
        return cards;
    };

    CARDS.findCardIndex = function(cards, issueKey) {
        for(var j=0; j<cards.length; j++){
            if(cards[j].key === issueKey){
                return j;
            }
        }
        return -1;
    };

    return CARDS;
}