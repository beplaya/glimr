module.exports = function(){
    var DELTAS = {};

    DELTAS.addDeltaInfo = function(logObjects) {
        logObjects = DELTAS.findDeltas(logObjects);
        logObjects = DELTAS.findRollingAverageDeltas(logObjects)
        logObjects = DELTAS.findRollingStDevDeltas(logObjects)
        return logObjects;
    };

    DELTAS.findDeltas = function(logObjects) {
        //var s = "index, deltams";
        for(var i=0; i<logObjects.length; i++) {
            logObjects[i].deltas = {
                msSinceLast : 0
            };
            var previousLogIndex = i+1;
            if(previousLogIndex < logObjects.length){
                var previousLog = logObjects[previousLogIndex];
                var previousDate = previousLog.date;
                var currentDate = logObjects[i].date;
                logObjects[i].deltas.msSinceLast = Math.abs(currentDate.getTime() - previousDate.getTime());
                //s += ("\n"+i+", "+logObjects[i].deltas.msSinceLast);
            }
        }
        //require('fs').writeFileSync("./rrr.csv", s);
        return logObjects;
    };

    DELTAS.findRollingAverageDeltas = function(logObjects) {
        var sum = 0;
        var count = 0;
        for(var i=logObjects.length-1; i>=0; i--) {
            sum += logObjects[i].deltas.msSinceLast;
            if(count == 0){
                logObjects[i].deltas.rollingAverageMs = sum;
            } else {
                logObjects[i].deltas.rollingAverageMs = (sum / count);
            }
            count++;
        }
        return logObjects;
    };

    DELTAS.findRollingStDevDeltas = function(logObjects) {
        for(var i=0; i<logObjects.length; i++) {
            var average = logObjects[i].deltas.rollingAverageMs;
            var varianceSum = 0;
            var variance;
            for(var j=i; j<logObjects.length; j++) {
                var deltaFromAvg = logObjects[j].deltas.msSinceLast - average;
                varianceSum += (deltaFromAvg * deltaFromAvg);
            }
            variance = varianceSum / (logObjects.length - i - 2);
            logObjects[i].deltas.rollingStDevMs = Math.sqrt(variance);
        }

        return logObjects;
    };

    return DELTAS;
}