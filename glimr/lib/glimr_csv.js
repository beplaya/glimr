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

    CSV.createAuthors = function(authors) {
        var header = "name, email, contribution_total, contribution_total_by_all, contribution_fraction";
        var csv = header;
        for(var i=0; i<authors.length; i++) {
            var a = authors[i];
            var row = "\n";
            row += a.name;
            row += "," + a.email;
            row += "," + a.activity.contribution.total;
            row += "," + a.activity.contribution.totalCommitsByAll;
            row += "," + a.activity.contribution.fractionOfContribution;
            csv += row;
        }
        return csv;
    };

    CSV.createCards = function(cards) {
        var header = "key, number, project_key, number_of_pull_requests, number_of_commits";
        var csv = header;
        for(var i=0; i<cards.length; i++) {
            var c = cards[i];
            var row = "\n";
            row += c.key;
            row += "," + c.number;
            row += "," + c.projectKey;
            row += "," + c.numberOfPullRequests;
            row += "," + c.commits.length;
            csv += row;
        }
        return csv;
    };

    return CSV;
}