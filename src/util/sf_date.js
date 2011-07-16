//表示时间上的一刻，通常以日期和当天的时间表示。
function DateTime(year, month, day, hour, min, sec, millisec) {
    var d = new Date();

    if (year || year == 0) {
        d.setFullYear(year);
    }
    if (month || month == 0) {
        d.setMonth(month - 1);
    }
    if (day || day == 0) {
        d.setDate(day);
    }
    if (hour || hour == 0) {
        d.setHours(hour);
    }
    if (min || min == 0) {
        d.setMinutes(min);
    }
    if (sec || sec == 0) {
        d.setSeconds(sec);
    }
    if (millisec || millisec == 0) {
        d.setMilliseconds(millisec);
    }
//将指定的天数加到此实例的值上。
    this.AddDays = function(value) {
        if (!ValidateAddMethodParam(value)) {
            return null;
        }
        var result = this.Clone();
        result.GetValue().setDate(result.GetDay() + value);
        return result;
    }
//将指定的小时数加到此实例的值上。
    this.AddHours = function(value) {
        if (!ValidateAddMethodParam(value)) {
            return null;
        }
        var result = this.Clone();
        result.GetValue().setHours(result.GetHour() + value);
        return result;
    }
//将指定的分钟数加到此实例的值上。
    this.AddMinutes = function(value) {
        if (!ValidateAddMethodParam(value)) {
            return null;
        }
        var result = this.Clone();
        result.GetValue().setMinutes(result.GetMinute() + value);
        return result;
    }
//将指定的毫秒数加到此实例的值上。
    this.AddMilliseconds = function(value) {
        if (!ValidateAddMethodParam(value)) {
            return null;
        }
        var result = this.Clone();
        result.GetValue().setMilliseconds(result.GetMillisecond() + value);
        return result;
    }
//将指定的月份数加到此实例的值上。
    this.AddMonths = function(value) {
        if (!ValidateAddMethodParam(value)) {
            return null;
        }
        var result = this.Clone();
        result.GetValue().setMonth(result.GetValue().getMonth() + value);
        return result;
    }
//将指定的秒数加到此实例的值上。
    this.AddSeconds = function(value) {
        if (!ValidateAddMethodParam(value)) {
            return null;
        }
        var result = this.Clone();
        result.GetValue().setSeconds(result.GetSecond() + value);
        return result;
    }
//将指定的年份数加到此实例的值上。
    this.AddYears = function(value) {
        if (!ValidateAddMethodParam(value)) {
            return null;
        }
        var result = this.Clone();
        result.GetValue().setFullYear(result.GetYear() + value);
        return result;
    }
//将此实例的值与指定的 Date 值相比较，并指示此实例是早于、等于还是晚于指定的 Date 值。
    this.CompareTo = function(other) {
        var internalTicks = other.getTime();
        var num2 = d.getTime();
        if (num2 > internalTicks) {
            return 1;
        }
        if (num2 < internalTicks) {
            return -1;
        }
        return 0;
    }
//返回一个数值相同的新DateTime对象
    this.Clone = function() {
        return new DateTime(
                this.GetYear()
                , this.GetMonth()
                , this.GetDay()
                , this.GetHour()
                , this.GetMinute()
                , this.GetSecond()
                , this.GetMillisecond());
    }
//返回一个值，该值指示此实例是否与指定的 DateTime 实例相等。
    this.Equals = function(other) {
        return this.CompareTo(other) == 0;
    }
//获取此实例的日期部分。
    this.GetDate = function() {
        var result = new DateTime(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        return result;
    }
//获取此实例所表示的日期为该月中的第几天。
    this.GetDay = function() {
        return d.getDate();
    }
//获取此实例所表示的日期是星期几。
    this.GetDayOfWeek = function() {
        return d.getDay();
    }
//获取此实例所表示日期的小时部分。
    this.GetHour = function() {
        return d.getHours();
    }
//获取此实例所表示日期的分钟部分。
    this.GetMinute = function() {
        return d.getMinutes();
    }
//获取此实例所表示日期的毫秒部分。
    this.GetMillisecond = function() {
        return d.getMilliseconds();
    }
//获取此实例所表示日期的月份部分。
    this.GetMonth = function() {
        return d.getMonth() + 1;
    }
//获取此实例的下个月一日的DateTime对象
    this.GetNextMonthFirstDay = function() {
        var result = new DateTime(this.GetYear(), this.GetMonth(), 1, 0, 0, 0, 0);
        result = result.AddMonths(1);
        return result;
    }
//获取此实例的下一个周日的DateTime对象
    this.GetNextWeekFirstDay = function() {
        var result = this.GetDate();
        return result.AddDays(7 - result.GetDayOfWeek());
    }
//获取此实例的下一个周日的DateTime对象
    this.GetNextYearFirstDay = function() {
        return new DateTime(this.GetYear() + 1, 1, 1, 0, 0, 0, 0);
    }
//获取此实例所表示日期的秒部分。
    this.GetSecond = function() {
        return d.getSeconds();
    }
//返回此实例的Date值
    this.GetValue = function() {
        return d;
    }
//获取此实例所表示日期的年份部分。
    this.GetYear = function() {
        return d.getFullYear();
    }
//指示此实例是否是DateTime对象
    this.IsDateTime = function() {
    }
//将当前 DateTime 对象的值转换为其等效的短日期字符串表示形式。
    this.ToShortDateString = function() {
        var result = "";
        result = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        return result;
    }
//将当前 DateTime 对象的值转换为其等效的短时间字符串表示形式。
    this.ToShortTimeString = function() {
        var result = "";
        result = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        return result;
    }
//将当前 DateTime 对象的值转换为其等效的字符串表示形式。
    this.ToString = function(format) {
        if (typeof(format) == "string") {

        }
        return this.ToShortDateString() + " " + this.ToShortTimeString();
    }
//验证Add系列的方法参数是否合法
    function ValidateAddMethodParam(param) {
        if (typeof(param) != "number") {
            return false;
        }
        return true;
    }

//继承自Date的方法
    this.getTime = function() {
        return d.getTime();
    }
}

//比较 DateTime 的两个实例，并返回它们相对值的指示。
DateTime.Compare = function(d1, d2) {
    return d1.CompareTo(d2);
}
//返回指定年和月中的天数。
DateTime.DaysInMonth = function(year, month) {
    if ((month < 1) || (month > 12)) {
        return "月份[" + month + "]超出范围";
    }
    var numArray = DateTime.IsLeapYear(year) ? DateTime.DaysToMonth366 : DateTime.DaysToMonth365;
    return (numArray[month] - numArray[month - 1]);
}
//返回一个值，该值指示 DateTime 的两个实例是否相等。
DateTime.Equals = function(d1, d2) {
    return d1.CompareTo(d2) == 0;
}
//返回指定的年份是否为闰年的指示。
DateTime.IsLeapYear = function(year) {
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
}
//获取一个 DateTime 对象，该对象设置为此计算机上的当前日期和时间，表示为本地时间。
DateTime.Now = new DateTime();
//将日期和时间的指定字符串表示形式转换为其等效的 DateTime。
DateTime.Parse = function(s) {
    var result = new DateTime();
    var value = result.GetValue();
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

//获取当前日期，其时间组成部分设置为 00:00:00。
DateTime.Today = new DateTime(null, null, null, 0, 0, 0, 0);

//静态字段
DateTime.DaysToMonth365 = [ 0, 0x1f, 0x3b, 90, 120, 0x97, 0xb5, 0xd4, 0xf3, 0x111, 0x130, 0x14e, 0x16d ];
DateTime.DaysToMonth366 = [ 0, 0x1f, 60, 0x5b, 0x79, 0x98, 0xb6, 0xd5, 0xf4, 0x112, 0x131, 0x14f, 0x16e ];
