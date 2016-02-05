module.exports = function(){
    var CSV = {};

    CSV.createLogObjects = function(deltaLogObjects) {
        var header = "date, commit, author_name, author_email, message, "
            +"is_pull_request, pull_request_number, ms_since_last, "
            +"rolling_avg_ms, rolling_stdev_ms";
        var csv = header;
        for(var i=0; i<deltaLogObjects.length; i++) {
            var lo = deltaLogObjects[i];
            var row = "\n";
            row += lo.date;
            row += "," + lo.commit;
            row += "," + lo.author.name;
            row += "," + lo.author.email;
            row += "," + lo.message.replace(/,/g, "").replace(/\n/g, "").trim();
            row += "," + lo.pullRequest.isPullRequest;
            row += "," + lo.pullRequest.number;
            row += "," + lo.deltas.msSinceLast;
            row += "," + lo.deltas.rollingAverageMs;
            row += "," + lo.deltas.rollingStDevMs;
            csv += row;
        }
        return csv;
    };

    return CSV;
}