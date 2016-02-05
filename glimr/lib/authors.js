module.exports = function(){
    var AUTHORS = {};
    AUTHORS.findUniqueAuthors = function(logObjects) {
        var authors = [];
        for(var i=0; i<logObjects.length; i++) {
            var commitAuthor = logObjects[i].author;
            var existingAuthorIndex = AUTHORS.findAuthorIndex(authors, commitAuthor);
            var fractionOfContribution = 1/logObjects.length;
            if(existingAuthorIndex == -1){
                commitAuthor.activity = {
                        commits : [logObjects[i]],
                        contribution : {
                            total : 1,
                            totalCommitsByAll : logObjects.length,
                            fractionOfContribution : 1 / logObjects.length
                        }
                    };
                authors.push(commitAuthor);
            } else {
                authors[existingAuthorIndex].activity.commits.push(logObjects[i]);
                var newTotal = authors[existingAuthorIndex].activity.contribution.total + 1;
                authors[existingAuthorIndex].activity.contribution.total = newTotal;
                authors[existingAuthorIndex].activity.contribution.fractionOfContribution = newTotal / logObjects.length;
            }
        }
        return authors;
    };

    AUTHORS.findAuthorIndex = function(authors, commitAuthor) {
        for(var i=0; i<authors.length; i++){
            if(authors[i].name === commitAuthor.name
                || (authors[i].email.trim().length>0 &&authors[i].email === commitAuthor.email)) {
                return i;
            }
        }
        return -1;
    };

    return AUTHORS;
}