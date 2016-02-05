module.exports = function(){
    DATECOMMON = {};

    DATECOMMON.isWithin = function(test, date1, date2) {
        var start = date1 < date2 ? date1 : date2;
        var end = date1 > date2 ? date1 : date2;
        return start<=test && test<=end;
    };

    return DATECOMMON;
}