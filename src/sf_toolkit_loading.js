/**
 * loading条
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module load
 * @param {String}  obj  要显示loading条的元素id
 * @param {int}  n  loading条组成的个数 (默认为15) (可选)
 */
starfish.toolkit.loading = function(obj, n) {
    var colors = ["lightskyblue", "white"];
    var cur_color = 0; // 当前的颜色
    var wait_interval = null;

    var wait_inputs;
    var nums = n || 15; // input 个数

    function init() {
        var dom = starfish.web.dom;
        var table = dom.elem('table');
        table.className = "loading_table";
        var tbody = dom.elem('tbody');
        var tr = dom.elem('tr');
        var td = dom.elem('td');
        td.setAttribute("colSpan", 5);
        starfish.web.css(td, "textAlign", "center");
        var span = dom.elem('span');

        for (var i = 0; i < nums; i++) {
            var input = dom.elem('input');
            input.type = "text";
            input.name = "loading";
            input.className = "load";
            span.appendChild(input);
        }
        td.appendChild(span);
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);
        $(obj).appendChild(table);
    }

    function loading() {
        if (wait_interval) {
            clearInterval(wait_interval);
            wait_interval = null;
        }

        wait_inputs = starfish.web.className("load");
        wait_inputs.reverse();
        
        var i = 0;
        wait_interval = setInterval(function() {
            starfish.web.css(wait_inputs[i++], "backgroundColor", colors[cur_color]);
            if (i == nums) {
                i = 0;
                cur_color = 1 - cur_color;
            }
        }, 100);
    }
    init();
    loading();
};
