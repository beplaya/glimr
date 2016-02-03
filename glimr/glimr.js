module.exports = function() {
    var GLIMR = {};

    GLIMR.toEntryObjectsArray = function(logOutput) {
        var entryTextBlocks = logOutput.split("\ncommit ");
        var entryObjects = [];
        var index = 0;
        for(var i=0; i<entryTextBlocks.length; i++){
            var entryLines = entryTextBlocks[i];
            if(entryLines.length===0){
                continue;
            }else {
                var entryObj = GLIMR.createEntry(entryLines);
                entryObjects[index] = entryObj;
                index++;
            }
        }
        entryObjects = entryObjects.sort(function(a, b){
            return a.date.getTime() < b.date.getTime() ? 1 : (a.date.getTime() === b.date.getTime() ? 0 : -1);
        });
        return entryObjects;
    };

    GLIMR.createEntry = function(entryLines) {
        var entry = {};
        var lines = entryLines.split("\n");
        for(var i=0; i<lines.length; i++){
            var l = lines[i];
            if(l.length > 0 && !entry.commit) {
                entry.commit = l.replace(/commit/g, "").trim();
            } else if(l.indexOf("Author: ") != -1) {
                var authorLineSplit = l.split("<");
                entry.author = {
                    name: authorLineSplit[0].replace(/:/g, "").replace(/Author/g, "").trim(),
                    email: authorLineSplit[1].replace(/>/g, "").trim()
                };
            } else if(l.indexOf("Date: ") != -1) {
                entry.date = new Date(l.replace("Date: ", ""));
            }
        }
        entry.message = entryLines.split("Date: ")[1];
        entry.message = entry.message.substring(entry.message.indexOf("\n\n")+"\n\n".length, entry.message.length).trim();
        return entry;
    };

    return GLIMR;
}