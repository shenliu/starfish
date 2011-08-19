/**
 * 修复 IE 中的Bugs
 *
 * @namespace org.shen.Starfish
 * @module ie
 */
starfish.ie = {
    /**
     * 修复IE 6.0下PNG不透明的Bug
     * 使用前先确定客户端浏览器为IE 6.0 使用starfish.client.browser.ie == 6
     *
     * @method correctPNG
     */
    correctPNG: function() {
        for (var i = document.images.length - 1; i >= 0; i--) {
            var img = document.images[i];
            var imgName = img.src.toUpperCase();
            if (imgName.substring(imgName.length - 3, imgName.length) == "PNG") {
                var imgID = (img.id) ? "id='" + img.id + "' " : "";
                var imgClass = (img.className) ? "class='" + img.className + "' " : "";
                var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
                var imgStyle = "display:inline-block;" + img.style.cssText;
                if (img.align == "left") {
                    imgStyle = "float:left;" + imgStyle;
                }
                if (img.align == "right") {
                    imgStyle = "float:right;" + imgStyle;
                }
                if (img.parentElement.href) {
                    imgStyle = "cursor:hand;" + imgStyle;
                }
                img.outerHTML = "<span " + imgID + imgClass + imgTitle +
                    " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";" +
                    "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" +
                    "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>";
            }
        }
    }

};