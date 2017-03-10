module.exports = function Authors(){
    if(!(this instanceof Authors)) {
        return new Authors();
    }

    this.findUniqueAuthors = function(logObjects) {
        var authors = [];
        for(var i=0; i<logObjects.length; i++) {
            var commitAuthor = {
                name : logObjects[i].author.name,
                email : logObjects[i].author.email
            }
            var existingAuthorIndex = this.findAuthorIndex(authors, commitAuthor);
            var fractionOfContribution = 1/logObjects.length;
            if(existingAuthorIndex == -1){
                commitAuthor.activity = {
                        commits : [logObjects[i].commit],
                        contribution : {
                            total : 1,
                            totalCommitsByAll : logObjects.length,
                            fractionOfContribution : 1 / logObjects.length
                        }
                    };
                authors.push(commitAuthor);
            } else {
                authors[existingAuthorIndex].activity.commits.push(logObjects[i].commit);
                var newTotal = authors[existingAuthorIndex].activity.contribution.total + 1;
                authors[existingAuthorIndex].activity.contribution.total = newTotal;
                authors[existingAuthorIndex].activity.contribution.fractionOfContribution = newTotal / logObjects.length;
            }
        }
        return authors;
    };

    this.findAuthorIndex = function(authors, commitAuthor) {
        for(var i=0; i<authors.length; i++){
            if(authors[i].name === commitAuthor.name
                || (authors[i].email.trim().length>0 &&authors[i].email === commitAuthor.email)) {
                return i;
            }
        }
        return -1;
    };
};