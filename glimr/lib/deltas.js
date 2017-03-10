module.exports = function Deltas(){
    if(!(this instanceof Deltas)) {
        return new Deltas();
    }

    this.addDeltaInfo = function(logObjects) {
        logObjects = this.findDeltas(logObjects);
        logObjects = this.findRollingAverageDeltas(logObjects)
        logObjects = this.findRollingStDevDeltas(logObjects)
        return logObjects;
    };

    this.findDeltas = function(logObjects) {
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
            }
        }
        return logObjects;
    };

    this.findRollingAverageDeltas = function(logObjects) {
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

    this.findRollingStDevDeltas = function(logObjects) {
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
};