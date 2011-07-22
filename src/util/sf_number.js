/**
 * 数字 小程序
 *
 * @namespace org.shen.Starfish
 * @module number
 */
starfish.number = {
    /**
     * 人民币金额转大写
     *
     * @method numToCny
     * @param {Number}  num  要转换的数字
     * @return {String}  大写金额
     */
    numToCny: function(num) {
        num = num.toFixed(2);
        var capUnit = ['万','亿','万','圆',''];
        var capDigit = { 2:['角','分',''], 4:['仟','佰','拾','']};
        var capNum = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'];
        if (((num.toString()).indexOf('.') > 16) || (isNaN(num))) {
            return '';
        }
        //num = (Math.round(num * 100) / 100).toString();
        num = ((Math.pow(10, 19 - num.length)).toString()).substring(1) + num;
        var i,ret,j,nodeNum,k,subret,len,subChr,CurChr = [];
        for (i = 0, ret = ''; i < 5; i++, j = i * 4 + Math.floor(i / 4)) {
            nodeNum = num.substring(j, j + 4);
            for (k = 0,subret = '',len = nodeNum.length; ((k < len) && (parseInt(nodeNum.substring(k)) != 0)); k++) {
                CurChr[k % 2] = capNum[nodeNum.charAt(k)] + ((nodeNum.charAt(k) == 0) ? '' : capDigit[len][k]);
                if (!((CurChr[0] == CurChr[1]) && (CurChr[0] == capNum[0]))) {
                    if (!((CurChr[k % 2] == capNum[0]) && (subret == '') && (ret == ''))) {
                        subret += CurChr[k % 2];
                    }
                }
            }
            subChr = subret + ((subret == '') ? '' : capUnit[i]);
            if (!((subChr == capNum[0]) && (ret == ''))) {
                ret += subChr;
            }
        }
        ret = (ret == '') ? capNum[0] + capUnit[3] : ret;
        return ret;
    }

};
