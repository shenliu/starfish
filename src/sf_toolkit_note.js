/**
 * !!! 注: 本toolkit只支持webkit核心浏览器 !!!
 * web便签
 */
starfish.toolkit.note = {}

starfish.toolkit.note.bgColors = [
    ["rgb(255, 240, 70)"], ["#ff66cc"], ["#69f"], ["#9f0"]
];

starfish.toolkit.note.tsColors = [
    // background, border-top
    ["#db0", "#a80"], ["#f09", "#c36"], ["#36c", "#039"], ["#690", "#360"]
];

starfish.toolkit.note.db = null;

starfish.toolkit.note.init = function(){
    try {
        if (window.openDatabase) {
            starfish.toolkit.note.db = openDatabase("Note", "1.0", "Note for users", 200000);
            if (!starfish.toolkit.note.db) {
                //alert("打开数据库失败");
            }
        } else {
            //alert("本toolkit只支持webkit核心浏览器");
        }
    } catch(err) {
        //alert("本toolkit只支持webkit核心浏览器");
    }
}

starfish.toolkit.note.loaded = function() {
    if (!starfish.toolkit.note.db) {
        return;
    }
    
    starfish.toolkit.note.db.transaction(function(tx) {
        tx.executeSql("SELECT COUNT(*) FROM notes", [],
            function(result) {
                starfish.toolkit.note.loadNotes();
            },

            function(tx, error) {
                tx.executeSql("CREATE TABLE notes (id REAL UNIQUE, note TEXT, timestamp REAL, left TEXT, top TEXT, zindex REAL)", [],
                    function(result) {
                        starfish.toolkit.note.loadNotes();
                    }
                );
            }
        );
    });
}

starfish.toolkit.note.loadNotes = function() {
    starfish.toolkit.note.db.transaction(function(tx) {
        tx.executeSql("SELECT id, note, timestamp, left, top, zindex FROM notes", [],
            function(tx, result) {
                for (var i = 0; i < result.rows.length; ++i) {
                    var row = result.rows.item(i);
                    var note = new starfish.toolkit.note.note();
                    note.id(row['id']);
                    note.text(row['note']);
                    note.timestamp(row['timestamp']);
                    note.left(row['left']);
                    note.top(row['top']);
                    note.zIndex(row['zindex']);

                    if (row['id'] > note.hId()) {
                        note.hId(row['id']);
                    }
                    if (row['zindex'] > note.Z()) {
                        note.Z(row['zindex']);
                    }
                }
                if (!result.rows.length) {
                    starfish.toolkit.note.newNote();
                }
            }, function(tx, error) {
                alert('读取本地数据库错误: - ' + error.message);
                return;
            }
        );
    });
}

starfish.toolkit.note.note = function() {
    starfish.toolkit.note.init();
    var db = starfish.toolkit.note.db, captured = null, highestZ = 0, highestId = 0;
    
    function modifiedString(date) {
        return '记录时间: ' + date.getFullYear() + '-' + (date.getMonth() + 1)
            + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
            + ':' + date.getSeconds();
    }

    /* ************************************** */
    
    function _note() {
        var self = this;

        var note = document.createElement('div');
        note.className = 'note';

        starfish.web.event.addEvent(note, "mousedown", function(e) {
            return self.mouseDown(e);
        });

        starfish.web.event.addEvent(note, "click", function(e) {
            return self.noteClick(e);
        });

        this._note = note;

        var close = document.createElement('div');
        close.className = 'closebutton';
        starfish.web.event.addEvent(close, "click", function(e) {
            return self.close(e);
        });
        note.appendChild(close);

        var edit = document.createElement('div');
        edit.className = 'edit';
        edit.setAttribute('contenteditable', true);
        starfish.web.event.addEvent(edit, "keyup", function(e) {
            return self.keyUp();
        });

        starfish.web.event.addEvent(edit, "blur", function(e) {
            return self.noteBlur(e);
        });
        note.appendChild(edit);
        this.editField = edit;

        var ts = document.createElement('div');
        ts.className = 'timestamp';
        starfish.web.event.addEvent(ts, "mousedown", function(e) {
            return self.mouseDown(e);
        });
        note.appendChild(ts);
        this.lastModified = ts;

        // 随机颜色
        var colorIdx = Number.random(0, starfish.toolkit.note.bgColors.length - 1);
        starfish.web.css(note, "backgroundColor", starfish.toolkit.note.bgColors[colorIdx]);
        starfish.web.css(ts, "backgroundColor", starfish.toolkit.note.tsColors[colorIdx][0]);
        starfish.web.css(ts, "borderTopColor", starfish.toolkit.note.tsColors[colorIdx][1]);

        // 随机倾斜
        note.style.webkitTransform = 'rotate(' + Number.random(-5, 5) + 'deg)';

        document.body.appendChild(note);
        return this;
    }

    _note.prototype = {
        id: function(x) {
            if (x) {
                this._id = x;
            }
            if (!("_id" in this)) {
                this._id = 0;
            }
            return this._id;
        },

        text: function(x) {
            if (x) {
                this.editField.innerHTML = x;
            }
            return this.editField.innerHTML;
        },

        timestamp: function(x) {
            if (x) {
                if (this._timestamp == x) {
                    return;
                }
                this._timestamp = x;
                var date = new Date();
                date.setTime(parseFloat(x));
                this.lastModified.textContent = modifiedString(date);
            }
            if (!("_timestamp" in this)) {
                this._timestamp = 0;
            }
            return this._timestamp;
        },

        left: function(x) {
            if (x) {
                this._note.style.left = x;
            }
            return this._note.style.left;
        },

        top: function(x) {
            if (x) {
                this._note.style.top = x;
            }
            return this._note.style.top;
        },

        zIndex: function(x) {
            if (x) {
                this._note.style.zIndex = x;
            }
            return this._note.style.zIndex;
        },

        close: function(e) {
            this.cancelPendingSave();

            var note = this;
            db.transaction(function(tx) {
                tx.executeSql("DELETE FROM notes WHERE id = ?", [note.id()]);
            });

            var duration = e.shiftKey ? 2 : .25;
            this._note.style.webkitTransition = '-webkit-transform ' + duration + 's ease-in, opacity ' + duration + 's ease-in';
            this._note.offsetTop; // Force style recalc
            this._note.style.webkitTransformOrigin = "0 0";
            this._note.style.webkitTransform = 'skew(30deg, 0deg) scale(.1)';
            this._note.style.opacity = '0';

            var self = this;
            delay(function() {
                document.body.removeChild(self._note);
            }, duration * 1000);
        },

        saveSoon: function() {
            this.cancelPendingSave();
            var self = this;
            this._saveTimer = delay(function() {
                self.save();
            }, 200);
        },

        cancelPendingSave: function() {
            if (!("_saveTimer" in this)) {
                return;
            }
            clearTimeout(this._saveTimer);
            delete this._saveTimer;
        },

        save: function() {
            this.cancelPendingSave();

            if ("dirty" in this) {
                this.timestamp(new Date().getTime());
                delete this.dirty;
            }

            var note = this;
            db.transaction(function(tx) {
                tx.executeSql("UPDATE notes SET note = ?, timestamp = ?, left = ?, top = ?, zindex = ? WHERE id = ?", [note.text(), note.timestamp(), note.left(), note.top(), note.zIndex(), note.id()]);
            });
        },

        saveAsNew: function() {
            this.timestamp(new Date().getTime());

            var note = this;
            db.transaction(function (tx) {
                tx.executeSql("INSERT INTO notes (id, note, timestamp, left, top, zindex) VALUES (?, ?, ?, ?, ?, ?)", [note.id(), note.text(), note.timestamp(), note.left(), note.top(), note.zIndex()]);
            });
        },

        mouseDown: function(e) {
            captured = this;
            this.startX = starfish.web.window.getX(e) - starfish.web.window.pageX(this._note);
            this.startY = starfish.web.window.getY(e) - starfish.web.window.pageY(this._note);
            this.zIndex(this.incrementZ());

            var self = this;
            if (!("mouseMoveHandler" in this)) {
                this.mouseMoveHandler = function(e) {
                    return self.mouseMove(e);
                }
                this.mouseUpHandler = function(e) {
                    return self.mouseUp(e);
                }
            }

            starfish.web.event.addEvent(document, "mousemove", this.mouseMoveHandler, true);
            starfish.web.event.addEvent(document, "mouseup", this.mouseUpHandler, true);
            return false;
        },

        mouseMove: function(e) {
            if (this != captured) {
                return true;
            }

            this.left(e.clientX - this.startX + 'px');
            this.top(e.clientY - this.startY + 'px');
            return false;
        },

        mouseUp: function(e) {
            starfish.web.event.removeEvent(document, "mousemove", this.mouseMoveHandler, true);
            starfish.web.event.removeEvent(document, "mouseup", this.mouseUpHandler, true);
            this.save();
            return false;
        },

        noteClick: function(e) {
            this.editField.focus();
            getSelection().collapseToEnd();
            if (this.itvl) {
                window.clearInterval(this.itvl);
                delete this.itvl;
            }
            starfish.web.css(this._note, "opacity", 1.0);
        },

        keyUp: function() {
            this.dirty = true;
            this.saveSoon();
        },

        noteBlur: function() {
            var note = this._note;
            var opacity = starfish.web.css(note, "opacity");
            this.itvl = window.setInterval(function() {
                if (opacity <= 0.1) {
                    window.clearInterval(this.itvl);
                    return;
                }
                starfish.web.css(note, "opacity", opacity);
                opacity = (parseFloat(opacity - 0.1)).toFixed(1);
            }, 150);
            return false;
        },

        Z: function(z) {
            if (z) {
                highestZ = z;
            }
            return highestZ;
        },

        incrementZ: function() {
            return highestZ++;
        },

        hId: function(id) {
            if (id) {
                highestId = id;
            }
            return highestId;
        },

        incrementId: function() {
            return highestId++;
        }

    }

    return _note;

}();

starfish.toolkit.note.newNote = function() {
    var note = new starfish.toolkit.note.note();
    note.id(note.incrementZ());
    note.timestamp(new Date().getTime());
    note.left(Number.random(10, 200) + 'px');
    note.top(Number.random(10, 200) + 'px');
    note.zIndex(note.incrementId());
    note.saveAsNew();
}
