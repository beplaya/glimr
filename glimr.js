module.exports = function(){
    var G = {};
    G.glimrBuild = require(__dirname + '/glimr/glimr_build.js')();

    G.analyzeLogs = function(logContents, projectKey, options){
        var R = options;
        R.logObjects = G.glimrBuild.toLogObjectsArray(logContents, R.startDate, R.endDate);
        R.authors = G.glimrBuild.authors.findUniqueAuthors(R.logObjects);
        R.logObjects = G.glimrBuild.deltas.addDeltaInfo(R.logObjects);
        R.cards = G.glimrBuild.cards.findUniqueCards(projectKey, R.logObjects);

        R.counts = {
            commits : R.logObjects.length,
            cards : R.cards.length,
            pullRequests : 0
        };

        for(var i=0; i<R.logObjects.length; i++){
            if(R.logObjects[i].pullRequest.isPullRequest){
                R.counts.pullRequests++;
            }
        }
        return R;
    };

    return G;
};