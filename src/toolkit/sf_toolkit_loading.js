/**
 * loading条
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module load
 * @param {String}  obj  要显示loading条的元素id
 * @param {int}  n  loading条组成的个数 (默认为15) (可选)
 */
starfish.toolkit.loading = function() {
    var colors = ["lightskyblue", "white"];

    function load(obj, n) {
        this.obj = obj;
        this.nums = n || 15;
        this.init();
        this.loading();
    }

    load.prototype = {
        init: function() {
            var dom = starfish.web.dom;
            var table = dom.elem('table');
            table.className = "loading_table";
            var tbody = dom.elem('tbody');
            var tr = dom.elem('tr');
            var td = dom.elem('td');
            td.setAttribute("colSpan", 5);
            starfish.web.css(td, "textAlign", "center");
            var span = dom.elem('span');

            for (var i = 0; i < this.nums; i++) {
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
            $(this.obj).appendChild(table);
        },

        loading: function() {
            if (this.wait_interval) {
                clearInterval(this.wait_interval);
                this.wait_interval = null;
            }

            this.wait_inputs = starfish.web.className("load", $(this.obj));
            this.wait_inputs.reverse();

            this.cur_color = 0;
            var color = this.cur_color;

            var i = 0;
            var inputs = this.wait_inputs;
            var n = this.nums;
            this.wait_interval = setInterval(function() {
                starfish.web.css(inputs[i++], "backgroundColor", colors[color]);
                if (i == n) {
                    i = 0;
                    color = 1 - color;
                }
            }, 100);
        }
    };

    return load;
}();
