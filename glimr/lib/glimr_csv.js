module.exports = function GlimrCSV(){
    if(!(this instanceof GlimrCSV)) {
        return new GlimrCSV();
    }

    this.createLogObjects = function(deltaLogObjects) {
        var header = "date, commit, author_name, author_email, message, "
            +"is_pull_request, pull_request_number, ms_since_last, "
            +"rolling_avg_ms, rolling_stdev_ms";
        var csv = header;
        for(var i=0; i<deltaLogObjects.length; i++) {
            var lo = deltaLogObjects[i];
            var row = "\n";
            row += lo.date;
            row += "," + lo.commit;
            row += "," + this.noCommas(lo.author.name);
            row += "," + this.noCommas(lo.author.email);
            row += "," + this.noCommas(lo.message.replace(/,/g, "")).replace(/\n/g, "").trim();
            row += "," + lo.pullRequest.isPullRequest;
            row += "," + lo.pullRequest.number;
            row += "," + lo.deltas.msSinceLast;
            row += "," + lo.deltas.rollingAverageMs;
            row += "," + lo.deltas.rollingStDevMs;
            csv += row;
        }
        return csv;
    };

    this.createAuthors = function(authors) {
        var header = "name, email, contribution_total, contribution_total_by_all, contribution_fraction";
        var csv = header;
        for(var i=0; i<authors.length; i++) {
            var a = authors[i];
            var row = "\n";
            row += this.noCommas(a.name);
            row += "," + this.noCommas(a.email);
            row += "," + a.activity.contribution.total;
            row += "," + a.activity.contribution.totalCommitsByAll;
            row += "," + a.activity.contribution.fractionOfContribution;
            csv += row;
        }
        return csv;
    };

    this.createCards = function(cards) {
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

    this.noCommas = function(str) {
        str = str || "";
        return str.replace(/,/g, "").trim();
    };
};