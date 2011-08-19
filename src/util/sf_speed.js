function speed() {
    var d1 = $('d1');
    var kbpz = starfish.web.className('kbps');
    kbpz.reverse();

    for (var i = 0; i < test_imgs.length; i++) {
        (function() {
            var kbps = kbpz[i];
            new starfish.toolkit.loading(kbps);
            var img = new Image();

            var o = test_imgs[i];

            img.onload = function() {
                var endtime = new Date().getTime();
                var time = (endtime - starttime) / 1000; // 秒
                o.kbsec = Math.round((o.size / 1024 / time) * 100) / 100;
                o.kbps = Math.round((o.size / 1000 * 8 / time) * 100) / 100;

                kbps.innerHTML = "链接速度: " + o.kbps + "Kbps";
                starfish.web.dom.next(kbps).innerHTML = "下载速度: " + o.kbsec + "KB/sec";
            };

            img.onerror = function() {
                alert("错误 " + i);
            };

            var starttime = new Date().getTime();
            img.src = o.url + new Date().getTime();

        })();
    }

}

var test_imgs = [
    {
        //url: 'http://bizhi.zhuoku.com/2011/06/15/sheji/Sheji01.jpg?',
        //size: 974538
        url: 'http://www.dfjq.com.cn/upload/2008/2/c1.jpg?',
        size: 47774
    },
    {
        //url: 'http://bizhi.zhuoku.com/2011/06/15/sheji/Sheji02.jpg?',
        //size: 1566048
        url: 'http://www.dfjq.com.cn/upload/2008/2/c2.jpg?',
        size: 47261
    },
    {
        //url: 'http://bizhi.zhuoku.com/2011/06/15/sheji/Sheji03.jpg?',
        //size: 510395
        url: 'http://www.dfjq.com.cn/upload/2008/2/c3.jpg?',
        size: 60945
    },
    {
        //url: 'http://bizhi.zhuoku.com/2011/06/15/sheji/Sheji04.jpg?',
        //size: 1104429
        url: 'http://www.dfjq.com.cn/upload/2008/2/c4.jpg?',
        size: 44890
    },
    {
        //url: 'http://bizhi.zhuoku.com/2011/06/15/sheji/Sheji05.jpg?',
        //size: 1272855
        url: 'http://www.dfjq.com.cn/upload/2008/2/c5.jpg?',
        size: 26729
    }
];
