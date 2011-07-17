starfish.datetime = (function() {
    /**
     * 构造函数
     * @param params
     *      params {
     *          year, month, day, hour, minute, second, millisecond
     *      }
     */
    function datetime(params) {
        this.date = new Date();
        if (params) {
            params.year ? this.date.setFullYear(params.year) : null;
            params.month ? this.date.setMonth(params.month - 1) : null;
            params.day ? this.date.setDate(params.day) : null;
            params.hour ? this.date.setHours(params.hour) : null;
            params.minute ? this.date.setMinutes(params.minute) : null;
            params.second ? this.date.setSeconds(params.second) : null;
            params.millisecond ? this.date.setMilliseconds(params.millisecond) : null;
        }
    }

    datetime.prototype = {
        /**
         * 日期
         */
        getDateTime: function() {
            return new datetime({
                year: this.date.getFullYear(),
                month: this.date.getMonth(),
                day: this.date.getDate()
            });
        },

        /**
         * 年份
         */
        getYear: function() {
            return this.date.getFullYear();
        },

        /**
         * 月份
         */
        getMonth: function() {
            return this.date.getMonth();
        },

        getDay: function() {
            return this.date.getDay();
        },

        /**
         * 月中的第几天
         */
        getDate: function() {
            return this.date.getDate();
        },

        /**
         * 小时
         */
        getHour: function() {
            return this.date.getHours();
        },

        /**
         * 分钟
         */
        getMinute: function() {
            return this.date.getMinutes();
        },

        /**
         * 秒
         */
        getSecond: function() {
            return this.date.getSeconds();
        },

        /**
         * 毫秒
         */
        getMillisecond: function() {
            return this.date.getMilliseconds();
        },

        /**
         * 时间
         */
        getTime: function() {
            return this.date.getTime();
        },

        ////////////////////////////////////

        copy: function() {
            return new datetime({
                year: this.getYear(),
                month: this.getMonth() + 1,
                day: this.getDay(),
                hour: this.getHour(),
                minute: this.getMinute(),
                second: this.getSecond(),
                millisecond: this.getMillisecond()
            });
        },

        getValue: function() {
            return this.date;
        },

        ////////////////////////////////////

        /**
         * 增加年份
         * @param  {int}  value
         */
        addYears: function(value) {
            var result = this.copy();
            result.getValue().setFullYear(result.getYear() + value);
            return result;
        },

        addMonths: function(value) {
            var result = this.copy();
            result.getValue().setMonth(result.getValue().getMonth() + value);
            return result;
        },

        addDays: function(value) {
            var result = this.copy();
            result.getValue().setDate(result.getDay() + value);
            return result;
        },

        addHours: function(value) {
            var result = this.copy();
            result.getValue().setHours(result.getHour() + value);
            return result;
        },

        addMinutes: function(value) {
            var result = this.copy();
            result.getValue().setMinutes(result.getMinute() + value);
            return result;
        },

        addSeconds: function(value) {
            var result = this.copy();
            result.getValue().setSeconds(result.getSecond() + value);
            return result;
        },

        addMilliseconds: function(value) {
            var result = this.copy();
            result.getValue().setMilliseconds(result.getMillisecond() + value);
            return result;
        },

        ////////////////////////////////////

        /**
         * 获取下一年第一天
         */
        getNextYearFirstDay: function() {
            return new datetime({
                year: this.date.getYear() + 1,
                month: 1,
                day: 1
            });
        },

        /**
         * 获取下一月第一天
         */
        getNextMonthFirstDay: function() {
            var result = new datetime({
                year: this.date.getYear(),
                month: this.date.getMonth(),
                day: 1
            });
            result = result.addMonths(1);
            return result;
        },

        /**
         * 获取下一个周日
         */
        getNextWeekFirstDay: function() {
            var result = this.getDateTime();
            return result.addDays(7 - result.getDay());
        },

        ////////////////////////////////////

        compareTo: function(other) {
            var otherTime = other.getTime();
            var thisTime = this.date.getTime();
            if (thisTime > otherTime) {
                return 1;
            }
            if (thisTime < otherTime) {
                return -1;
            }
            return 0;
        },

        equals: function(other) {
            return this.compareTo(other) == 0;
        },

        ////////////////////////////////////

        toShortDateString: function() {
            var result = "";
            result = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + this.date.getDate();
            return result;
        },

        toShortTimeString: function() {
            var result = "";
            result = this.date.getHours() + ":" + this.date.getMinutes() + ":" + this.date.getSeconds();
            return result;
        },

        toString: function(format) {
            return this.toShortDateString() + " " + this.toShortTimeString();
        }
    };

    return datetime;

})();

starfish.datetime.compare = function(d1, d2) {
    return d1.compareTo(d2);
};

//返回指定年和月中的天数。
starfish.datetime.daysInMonth = function(year, month) {
    if ((month < 1) || (month > 12)) {
        return "月份[" + month + "]超出范围";
    }
    var numArray = starfish.datetime.isLeapYear(year) ? starfish.datetime.DaysToMonth366 : starfish.datetime.DaysToMonth365;
    return (numArray[month] - numArray[month - 1]);
};

//返回一个值，该值指示 DateTime 的两个实例是否相等。
starfish.datetime.equals = function(d1, d2) {
    return d1.compareTo(d2) == 0;
};

//返回指定的年份是否为闰年的指示。
starfish.datetime.isLeapYear = function(year) {
    if ((year < 1) || (year > 0x270f)) {
        return "年份[" + year + "]超出范围";
    }
    if ((year % 4) != 0) {
        return false;
    }
    if ((year % 100) == 0) {
        return ((year % 400) == 0);
    }
    return true;
};

//当前日期和时间
starfish.datetime.now = new starfish.datetime();

//将日期和时间的指定字符串表示形式转换为starfish.datetime
starfish.datetime.parse = function(s) {
    var result = new starfish.datetime();
    var value = result.getValue();
    value.setHours(0, 0, 0, 0);
    var dateRex = /\b[1-2][0-9][0-9][0-9][-]\d{1,2}[-]\d{1,2}\b/i;
    if (dateRex.test(s)) {
        var dateStr = s.match(dateRex)[0];
        try {
            var dateParts = dateStr.split("-");
            var year = dateParts[0] - 0;
            var month = dateParts[1] - 1;
            var day = dateParts[2] - 0;
            value.setFullYear(year, month, day);
        } catch(ex) {
            return null;
        }
        var timeRex = /\b\d{1,2}[:]\d{1,2}[:]\d{1,2}\b/i;
        if (timeRex.test(s)) {
            var timeStr = s.match(timeRex)[0];
            try {
                var timeParts = timeStr.split(":");
                var hour = timeParts[0] - 0;
                var min = timeParts[1] - 0;
                var sec = timeParts[2] - 0;
                value.setHours(hour, min, sec);
            } catch(ex) {

            }
        }
    } else {
        return null;
    }
    return result;
};

//获取当前日期,其时间组成部分设置为00:00:00
starfish.datetime.today = new starfish.datetime(null, null, null, 0, 0, 0, 0);

//静态字段
starfish.datetime.DaysToMonth365 = [0, 0x1f, 0x3b, 90, 120, 0x97, 0xb5, 0xd4, 0xf3, 0x111, 0x130, 0x14e, 0x16d];
starfish.datetime.DaysToMonth366 = [0, 0x1f, 60, 0x5b, 0x79, 0x98, 0xb6, 0xd5, 0xf4, 0x112, 0x131, 0x14f, 0x16e];
