module.exports = function DateCommon(){
    if(!(this instanceof DateCommon)) {
        return new DateCommon();
    }

    this.isWithin = function(test, date1, date2) {
        var start = date1 < date2 ? date1 : date2;
        var end = date1 > date2 ? date1 : date2;
        return start<=test && test<=end;
    };
};