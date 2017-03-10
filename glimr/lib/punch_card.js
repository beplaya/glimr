module.exports = function PunchCard() {
    if(!(this instanceof PunchCard)) {
        return new PunchCard();
    }
    this.days = [{name:"sunday"},{name:"monday"},{name:"tuesday"},
                {name:"wednesday"},{name:"thursday"},{name:"friday"},{name:"saturday"}];
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

    this.createPunchcard = function(logObjects) {
        var punchCard = { days : []};
        punchCard.sumCommitsInDay = 0;
        punchCard.sumOffHoursCommitsInDay = 0;
        for(var dayIndex=0; dayIndex<this.days.length; dayIndex++) {
            punchCard.days.push({
                    name : this.days[dayIndex].name,
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
                    if(this.isSameDay(dayIndex, logObject)){
                        if(this.isSameHour(hour, logObject)){
                            punchCard.days[dayIndex].numberOfCommits++;
                            if(this.isOffHourOrWeekend(dayIndex, logObject)) {
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
        for(var dayIndex=0; dayIndex<this.days.length; dayIndex++) {
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

    this.isSameHour = function(hour, logObject) {
        return new Date(logObject.date).getHours() == hour;
    };

    this.isSameDay = function(dayIndex, logObject) {
        return new Date(logObject.date).getDay() == dayIndex;
    };

    this.isOffHourOrWeekend = function(dayIndex, logObject) {
        if(dayIndex == 0 || dayIndex == 6){
            return true;
        }
        var hourOfCommit = new Date(logObject.date).getHours();
        return hourOfCommit < 7 || hourOfCommit > 17;
    };
};