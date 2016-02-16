module.exports = function() {
    var P = {
        days : [{name:"sunday"},{name:"monday"},{name:"tuesday"},
                {name:"wednesday"},{name:"thursday"},{name:"friday"},{name:"saturday"}]
     };
    /*
        {
        "daily" : [
         {
             name : "sunday",
             numberOfCommits : INT,
             numberOffHoursCommits : INT,
             hourly : [INT, INT, ...]
          }, ...]
        }
    */

    P.createPunchcard = function(logObjects) {
        var punchCard = { days : []};
        punchCard.sumCommitsInDay = 0;
        punchCard.sumOffHoursCommitsInDay = 0;
        for(var dayIndex=0; dayIndex<P.days.length; dayIndex++) {
            punchCard.days.push({
                    name : P.days[dayIndex].name,
                    dayIndex : dayIndex,
                    numberOfCommits : 0,
                    numberOfOffHoursCommits : 0,
                    hourly : [],
                    sumCommitsInHour : 0
                });
            for(var hour=0; hour<24; hour++) {
                punchCard.days[dayIndex].hourly.push({hour: hour, numberOfCommits:0});
                for(var j=0; j<logObjects.length; j++) {
                    var logObject = logObjects[j];
                    if(P.isSameDay(dayIndex, logObject)){
                        if(P.isSameHour(hour, logObject)){
                            punchCard.days[dayIndex].numberOfCommits++;
                            if(P.isOffHourOrWeekend(dayIndex, logObject)) {
                                punchCard.days[dayIndex].numberOfOffHoursCommits++;
                            }
                            punchCard.days[dayIndex].hourly[hour].numberOfCommits++;
                        }
                    }
                }
                punchCard.days[dayIndex].sumCommitsInHour += punchCard.days[dayIndex].hourly[hour].numberOfCommits;
            }
            for(var hour=0; hour<24; hour++) {
                if(punchCard.days[dayIndex].sumCommitsInHour!=0) {
                    punchCard.days[dayIndex].hourly[hour].fractionOfCommits = punchCard.days[dayIndex].hourly[hour].numberOfCommits
                            / punchCard.days[dayIndex].sumCommitsInHour
                } else {
                    punchCard.days[dayIndex].hourly[hour].fractionOfCommits = 0;
                }
            }
            punchCard.sumCommitsInDay += punchCard.days[dayIndex].numberOfCommits;
            punchCard.sumOffHoursCommitsInDay += punchCard.days[dayIndex].numberOfOffHoursCommits;
        }
        //
        //
        //
        for(var dayIndex=0; dayIndex<P.days.length; dayIndex++) {
            if(punchCard.sumCommitsInDay!=0) {
                punchCard.days[dayIndex].fractionOfCommits = punchCard.days[dayIndex].numberOfCommits
                        / punchCard.sumCommitsInDay
            } else {
                punchCard.days[dayIndex].fractionOfCommits = 0;
            }
            if(punchCard.sumOffHoursCommitsInDay!=0) {
                punchCard.days[dayIndex].fractionOfOffHoursCommits = punchCard.days[dayIndex].numberOfOffHoursCommits
                        / punchCard.sumOffHoursCommitsInDay
            } else {
                punchCard.days[dayIndex].fractionOfOffHoursCommits = 0;
            }
        }
        return punchCard;
    };

    P.isSameHour = function(hour, logObject) {
        return new Date(logObject.date).getHours() == hour;
    };

    P.isSameDay = function(dayIndex, logObject) {
        return new Date(logObject.date).getDay() == dayIndex;
    };

    P.isOffHourOrWeekend = function(dayIndex, logObject) {
        if(dayIndex == 0 || dayIndex == 6){
            return true;
        }
        var hourOfCommit = new Date(logObject.date).getHours();
        return hourOfCommit < 7 || hourOfCommit > 17;
    };

    return P
};