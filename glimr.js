module.exports = function() {
    var R = {};
    var fs = require('fs');
    var DEFAULT_FILE_PATH = "./glimr_results";
    var EXPECTED_ARGS = "glimr <project_key> <file_containing_logs> "
        +"<start UNIX epoch OR 0 for all> "
        +"<end UNIX epoch OR 0 for all> ";
    //
    var cliArgs = process.argv.slice(2);
    if(cliArgs.length<4) {
        R = {glimrError: "Invalid args length!", expectedArgs : EXPECTED_ARGS};
        jlog(R);
        return;
    }
    //
    var projectKey = cliArgs[0];
    var filePath = cliArgs[1];
    var time = { start : cliArgs[2], end : cliArgs[3] };
    var endDate = cliArgs[3];
    var filePathOut = {
            all : {
                json : DEFAULT_FILE_PATH+"_all.json"
            },
            logs : {
                json : DEFAULT_FILE_PATH+"_logs.json",
                csv : DEFAULT_FILE_PATH+"_logs.csv"
            },
            authors : {
                json : DEFAULT_FILE_PATH+"_authors.json",
                csv : DEFAULT_FILE_PATH+"_authors.csv"
            },
            cards : {
                json : DEFAULT_FILE_PATH+"_cards.json",
                csv : DEFAULT_FILE_PATH+"_cards.csv"
            }
        };

    function jlog(obj){
        console.log(JSON.stringify(obj, 0, 4));
    }


    if(!filePath){
        R = {glimrError: "No log file path provided!", expectedArgs : EXPECTED_ARGS};
        jlog(R);
        return;
    }
    if(!fs.existsSync(filePath)){
        R = {glimrError: "Log file does not exist ["+filePath+"]", expectedArgs : EXPECTED_ARGS};
        jlog(R);
        return;
    }
    if(!projectKey){
        R = {glimrError: "No project key provided!", expectedArgs : EXPECTED_ARGS};
        jlog(R);
        return;
    }
    //
    try {
        var startDate = new Date(time.start *1);
        var endDate = new Date(time.end*1);

        if(startDate.toString() === "Invalid Date" || endDate.toString() === "Invalid Date"){
            R = {glimrError: "Invalid Dates! (" + startDate+","+endDate.toString()+")!", expectedArgs : EXPECTED_ARGS};
            jlog(R);
            return;
        }
        if(time.start == 0 && time.end == 0){
            startDate = undefined;
            endDate = undefined;
        }
        var glimrBuild = require(__dirname + '/glimr/glimr_build.js')();
        var content = fs.readFileSync(filePath).toString();
        R.logObjects = glimrBuild.toLogObjectsArray(content, startDate, endDate);
        R.authors = glimrBuild.authors.findUniqueAuthors(R.logObjects);
        R.logObjects = glimrBuild.deltas.addDeltaInfo(R.logObjects);
        R.cards = glimrBuild.cards.findUniqueCards(projectKey, R.logObjects);

        R.counts = {
            commits : R.logObjects.length,
            cards : R.cards.length,
            pullRequests : 0
        }
        for(var i=0; i<R.logObjects.length; i++){
            if(R.logObjects[i].pullRequest.isPullRequest){
                R.counts.pullRequests++;
            }
        }
        fs.writeFileSync(filePathOut.authors.json, JSON.stringify(R.authors, 0, 4));
        fs.writeFileSync(filePathOut.authors.csv, glimrBuild.glimrCSV.createAuthors(R.authors));

        fs.writeFileSync(filePathOut.cards.json, JSON.stringify(R.cards, 0, 4));
        fs.writeFileSync(filePathOut.cards.csv, glimrBuild.glimrCSV.createCards(R.cards));

        fs.writeFileSync(filePathOut.all.json, JSON.stringify(R, 0, 4));
        fs.writeFileSync(filePathOut.logs.json, JSON.stringify(R.logObjects, 0, 4));
        fs.writeFileSync(filePathOut.logs.csv, glimrBuild.glimrCSV.createLogObjects(R.logObjects));
        jlog(R);
    } catch (e) {
        console.log(e);
        R = {glimrError: "Invalid content!", exception: e};
    }
}();