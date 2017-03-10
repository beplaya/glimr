module.exports = function Glimr(){
    if(!(this instanceof Glimr)) {
        return new Glimr();
    }
    this.glimrBuild = new require(__dirname + '/glimr/glimr_build.js')();

    this.analyzeLogs = function(logContents, projectKey, options){
        var self = this;
        var result = options;
        result.logObjects = self.glimrBuild.toLogObjectsArray(logContents, result.startDate, result.endDate);
        result.authors = self.glimrBuild.authors.findUniqueAuthors(result.logObjects);
        result.logObjects = self.glimrBuild.deltas.addDeltaInfo(result.logObjects);
        result.cards = self.glimrBuild.cards.findUniqueCards(projectKey, result.logObjects);
        result.punchCard = self.glimrBuild.punchCard.createPunchcard(result.logObjects);

        result.counts = {
            commits : result.logObjects.length,
            cards : result.cards.length,
            pullRequests : 0
        };

        for(var i=0; i<result.logObjects.length; i++){
            if(result.logObjects[i].pullRequest.isPullRequest){
                result.counts.pullRequests++;
            }
        }
        return result;
    };
};