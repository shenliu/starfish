/**
 * 日期 时间方法
 */
starfish.timez = {
	/**
	 * 把型如 yyyymmdd 的字符串时间表示 转化为Date对象
	 * @param {string} 	sDate	字符串时间表示
	 * 
	 * @return {object} 如果可以转化返回new Date()对象 否则返回null
	 */
	sDate2oDate : function(sDate) {
		var reg = /(\d{4})(\d{2})(\d{2})/;
		if (reg.test(sDate)) {
			var year = parseInt(RegExp.$1);
			var month = parseInt(RegExp.$2) - 1;
			var date = parseInt(RegExp.$3);
			return new Date(year, month, date);
		}
		return null;
	},

	/**
	 * 把型如 yyyymmdd 转换成 yyyy*mm*dd*  (*为任意符号)
	 * 		另: yyyy年mm月dd日 -> yyyymmdd	 用parseDateReverse
	 *
	 * @param {string} date		yyyymmdd
	 * @param {string} sign		(可选) 连接的符号 默认为"-" 如为"cn"则为中文->年月日
	 * @param {string} ymd		(可选) 型如"ymd ym y md" (y-年 m-月 d-日)
	 *
	 * @return  {string}	[yyyy]*[mm]*[dd]*
	 * 
	 * 例子:
	 * 		parseDate("19810210")  			   -> 1981-02-12
	 * 		parseDate("19810210", "**", "ym")  -> 1981**02
	 * 		parseDate("19810210", "cn", "md")  -> 02月10日
	 *
	 */
	parseDate : function(date, sign, ymd) {
		var _arr_sign = [ "-", "-" ];
		var _arr_ymd = [ true, true, true ];
		var _arr_date = [];
		_arr_date = date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
				.split("-");

		if (ymd) {
			ymd = ymd.toLowerCase();
			if (ymd.indexOf("y") == -1) {
				_arr_ymd[0] = false;
			}
			if (ymd.indexOf("m") == -1) {
				_arr_ymd[1] = false;
			}
			if (ymd.indexOf("d") == -1) {
				_arr_ymd[2] = false;
			}
		}
		if (sign) {
			if (sign.toLowerCase() == "cn") {
				_arr_sign[0] = "年";
				_arr_sign[1] = "月";
				_arr_sign[2] = "日";
			} else {
				_arr_sign[0] = sign;
				_arr_sign[1] = sign;
			}
		}

		var _d = "";
		for ( var i = 0; i < _arr_ymd.length; i++) {
			if (_arr_ymd[i]) {
				_d += _arr_date[i] + (_arr_sign[i] ? _arr_sign[i] : "");
			} else {
				if (!(sign && sign.toLowerCase() == "cn")) {
					var last = _d.substring(_d.length - _arr_sign[0].length);
					if (isNaN(last)) {
						_d = _d.substring(0, _d.length - last.length);
					}
				}
			}
		}
		return _d;
	},

	/**
	 * 把型如 yyyy年mm月dd日 转换成 yyyymmdd
	 * @param {string} 	sDate	yyyy年mm月dd日
	 * 
	 * @return {string} yyyymmdd否则返回null
	 */
	parseDateReverse : function(sDate) {
		var reg = /(\d{4}).{1}(\d{1,2}).{1}(\d{1,2}).{1}/;
		if (reg.test(sDate)) {
			var year = RegExp.$1;
			var month = RegExp.$2;
			month = month.length == 1 ? "0" + month : month;
			var date = RegExp.$3;
			date = date.length == 1 ? "0" + date : date;
			return year + month + date;
		}
		return null;
	},

	/**
	 * 给定两个日期(yyyymm) 返回这两个日期中间的月份数组
	 * @param {string} ds	起始日期	(yyyymm)
	 * @param {string} de	终止日期	(yyyymm)
	 *
	 * @return {array} 从ds到de的月份数组
	 */
	intervalMonths : function(ds, de) {
		var dsy = parseInt(ds.substring(0, 4));
		var dsm = parseInt(ds.substring(4));

		var dey = parseInt(de.substring(0, 4));
		var dem = parseInt(de.substring(4));

		var dates = [];
		var dm = (dey - dsy) * 12 + dem - dsm; // 年份不同加上 年份差值*12
		for ( var i = 0, y = dsy, m = dsm; i <= dm; i++, m++) {
			if (m > 12) {
				y += 1;
				m = 1;
			}
			var date = y + "" + (m < 10 ? "0" + m : m);
			dates.push(date);
		}
		return dates;
	},

	/**
	 * 根据给定的年份和第几周的数字, 返回日期数组[此周第一天,此周最后一天]
	 * @param {number} year			年份
	 * @param {number} num_of_week	周数
	 *
	 * @return {array} 日期数组[此周第一天,此周最后一天]
	 */
	intervalDateByWeek : function(year, num_of_week) {
		num_of_week = parseInt(num_of_week);
		var date = new Date(year, 0, (7 * num_of_week));
		var first = new Date(date.getFullYear(), date.getMonth(), date.getDate()
				- date.getDay() + 1);
		var last = new Date(date.getFullYear(), date.getMonth(), date.getDate()
				- date.getDay() + 7);
		return [ first, last ];
	},

	/**
	 * 根据给定的日期 与 类型 得到相差的日期
	 * @param {date} 	date		给定的日期
	 * @param {number} 	type		类型 SHEN.date.YEAR,MONTHS...
	 * @param {number} 	diff		相差的间隔 可为负数(以前的日期)
	 *
	 * @return {date} 相差间隔的日期
	 */
	differentDate : function(date, type, diff) {
		var diff_date = null;
		switch (type) {
		case starfish.timez.YEAR:
			diff_date = new Date(date.getFullYear() + diff, date.getMonth(),
					date.getDate());
			break;
		case starfish.timez.MONTHS:
			diff_date = new Date(date.getFullYear(), date.getMonth() + diff,
					date.getDate());
			break;
		case starfish.timez.DAY:
			diff_date = new Date(date.getFullYear(), date.getMonth(), date
					.getDate() + diff);
			break;
		case starfish.timez.WEEK:
			diff_date = new Date(date.getFullYear(), date.getMonth(), date
					.getDate() + 7 * diff);
			break;
		default:
			break;
		}
		return diff_date;
	}

};

// 定义一些常量
starfish.timez.YEAR = 1;
starfish.timez.MONTHS = 2;
starfish.timez.DAY = 3;
starfish.timez.WEEK = 4;
starfish.timez.SEASON = 5;
