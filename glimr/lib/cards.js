module.exports = function Cards(){
    if(!(this instanceof Cards)) {
        return new Cards();
    }

    this.findUniqueCards = function(projectKey, logObjects) {
        var cards = [];
        var search = projectKey+"-";
        var pullRequestSearch = "Merge pull request #";
        for(var i=0; i<logObjects.length; i++) {
            var message = logObjects[i].message || "";
            var pullRequestNumber = -1;

            var messageLines = message.split("\n");
            for(var mli=0; mli<messageLines.length; mli++){
                messageLines[mli] = messageLines[mli].trim();
                if(messageLines[mli].indexOf(search) == 0 || (messageLines[mli].indexOf(search) != -1 && messageLines[mli].indexOf(pullRequestSearch) != -1)){
                    var spaceIndex = messageLines[mli].indexOf(" ");
                    var issueKey = messageLines[mli].substr(0, spaceIndex).trim();
                    if(messageLines[mli].indexOf(pullRequestSearch) != -1){
                        issueKey = messageLines[mli].substr(messageLines[mli].lastIndexOf(projectKey)).trim();
                    }

                    var split = issueKey.split("-");
                    if(split && split.length > 1) {
                        var issueNumber = 1*split[1];
                        if(Number.isInteger(issueNumber)){
                            var existingCardIndex = this.findCardIndex(cards, issueKey);
                            if(existingCardIndex == -1){
                                cards.push({
                                    key : issueKey,
                                    number : issueNumber,
                                    projectKey : projectKey,
                                    numberOfPullRequests : logObjects[i].pullRequest.isPullRequest ? 1 : 0,
                                    commits : [ logObjects[i] ]
                                });
                            } else {
                                cards[existingCardIndex].numberOfPullRequests += logObjects[i].pullRequest.isPullRequest ? 1 : 0;
                                cards[existingCardIndex].commits.push(logObjects[i]);
                            }
                            break;
                        }
                    }
                }
            }
        }
        return cards;
    };

    this.findCardIndex = function(cards, issueKey) {
        for(var j=0; j<cards.length; j++){
            if(cards[j].key === issueKey){
                return j;
            }
        }
        return -1;
    };

    return this;
}