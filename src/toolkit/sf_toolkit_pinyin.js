/**
 * 把汉字转换成拼音 需要导入sf_toolkit_dic中的语句
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module pinyin
 * @param word 要显示拼音的字词
 */
starfish.toolkit.pinyin = function(word) {
    var pydic = starfish.toolkit.pydic;
    var str = '';
    var s;
    var lastAlphabet = false; // 上一个是字母
    for (var i = 0; i < word.length; i++) {
        if (pydic.indexOf(word.charAt(i)) != -1 && word.charCodeAt(i) > 200) {
            if (lastAlphabet) {
                lastAlphabet = false;
                str += " ";
            }
            s = 1;
            while (pydic.charAt(pydic.indexOf(word.charAt(i)) + s) != ",") {
                str += pydic.charAt(pydic.indexOf(word.charAt(i)) + s);
                s++;
            }
            str += " ";
        } else {
            str += word.charAt(i);
            lastAlphabet = true;
        }
    }
    return str;
};
