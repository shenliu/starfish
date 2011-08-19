/**
 * file upload
 *
 * @namespace org.shen.Starfish.toolkit
 * @submodule toolkit
 * @module upload
 * @requires event dom
 */

starfish.toolkit.upload = function() {
    var web = starfish.web;

    function fileUploaderBasic(options) {
        this.options = {
            // 设置为true显示服务器返回信息
            debug: false,
            action: '/server/upload',
            params: {},
            button: null,
            multiple: true,
            maxConnections: 3,

            allowedExtensions: [],
            sizeLimit: 0,
            minSizeLimit: 0,

            // return false to cancel submit
            onSubmit: function(id, fileName) {
            },
            onProgress: function(id, fileName, loaded, total) {
            },
            onComplete: function(id, fileName, responseJSON) {
            },
            onCancel: function(id, fileName) {
            },

            messages: {
                typeError: "不允许 {file} 文件类型。允许的文件类型：  {extensions} ",
                sizeError: "{file} 文件尺寸超出了允许的最大值。允许的最大文件尺寸为： {sizeLimit}",
                minSizeError: "{file}文件尺寸太小，允许的最小文件尺寸为： {minSizeLimit}",
                emptyError: "{file} 文件为空。不允许上传空文件。",
                onLeave: "文件正在上传中。如果您现在退出，上传的文件将被取消。"
            },

            showMessage: function(message) {
                alert(message);
            }
        };

        Object.appendAll(this.options, options);

        // 正在上传中的文件数
        this.filesInProgress = 0;
        this.handler = this._createUploadHandler();

        if (this.options.button) {
            this.button = this._createUploadButton(this.options.button);
        }

        this._preventLeaveInProgress();
    }

    fileUploaderBasic.prototype = {
        setParams: function(params) {
            this.options.params = params;
        },

        getInProgress: function() {
            return this.filesInProgress;
        },

        _createUploadButton: function(element) {
            var self = this;

            return new uploadButton({
                element: element,
                multiple: this.options.multiple && uploadHandlerXhr.isSupported(),
                onChange: function(input) {
                    self._onInputChange(input);
                }
            });
        },

        _createUploadHandler: function() {
            var self = this, handlerClass;

            if (uploadHandlerXhr.isSupported()) {
                handlerClass = uploadHandlerXhr;
            } else {
                handlerClass = uploadHandlerForm;
            }

            var handler = new handlerClass({
                debug: this.options.debug,
                action: this.options.action,
                maxConnections: this.options.maxConnections,
                onProgress: function(id, fileName, loaded, total) {
                    self._onProgress(id, fileName, loaded, total);
                    self.options.onProgress(id, fileName, loaded, total);
                },

                onComplete: function(id, fileName, result) {
                    self._onComplete(id, fileName, result);
                    self.options.onComplete(id, fileName, result);
                },

                onCancel: function(id, fileName) {
                    self._onCancel(id, fileName);
                    self.options.onCancel(id, fileName);
                }
            });

            return handler;
        },

        _preventLeaveInProgress: function() {
            var self = this;

            web.event.addEvent(window, 'beforeunload', function(e) {
                if (!self.filesInProgress) {
                    return;
                }

                e = e || window.event;
                // for ie, ff
                e.returnValue = self.options.messages.onLeave;
                // for webkit
                return self.options.messages.onLeave;
            });
        },

        _onSubmit: function(id, fileName) {
            this.filesInProgress++;
        },

        _onProgress: function(id, fileName, loaded, total) {
        },

        _onComplete: function(id, fileName, result) {
            this.filesInProgress--;
            if (result.error) {
                this.options.showMessage(result.error);
            }
        },

        _onCancel: function(id, fileName) {
            this.filesInProgress--;
        },

        _onInputChange: function(input) {
            if (this.handler instanceof uploadHandlerXhr) {
                this._uploadFileList(input.files);
            } else {
                if (this._validateFile(input)) {
                    this._uploadFile(input);
                }
            }
            this.button.reset();
        },

        _uploadFileList: function(files) {
            for (var i = 0; i < files.length; i++) {
                if (!this._validateFile(files[i])) {
                    return;
                }
            }

            for (i = 0; i < files.length; i++) {
                this._uploadFile(files[i]);
            }
        },

        _uploadFile: function(fileContainer) {
            var id = this.handler.add(fileContainer);
            var fileName = this.handler.getName(id);

            if (this.options.onSubmit(id, fileName) !== false) {
                this._onSubmit(id, fileName);
                this.handler.upload(id, this.options.params);
            }
        },

        _validateFile: function(file) {
            var name, size;

            if (file.value) {
                // it is a file input
                // get input value and remove path to normalize
                name = file.value.replace(/.*(\/|\\)/, "");
            } else {
                // fix missing properties in Safari
                name = file.fileName != null ? file.fileName : file.name;
                size = file.fileSize != null ? file.fileSize : file.size;
            }

            if (! this._isAllowedExtension(name)) {
                this._error('typeError', name);
                return false;

            } else if (size === 0) {
                this._error('emptyError', name);
                return false;

            } else if (size && this.options.sizeLimit && size > this.options.sizeLimit) {
                this._error('sizeError', name);
                return false;

            } else if (size && size < this.options.minSizeLimit) {
                this._error('minSizeError', name);
                return false;
            }

            return true;
        },

        _error: function(code, fileName) {
            var message = this.options.messages[code];

            function r(name, replacement) {
                message = message.replace(name, replacement);
            }

            r('{file}', this._formatFileName(fileName));
            r('{extensions}', this.options.allowedExtensions.join(', '));
            r('{sizeLimit}', this._formatSize(this.options.sizeLimit));
            r('{minSizeLimit}', this._formatSize(this.options.minSizeLimit));

            this.options.showMessage(message);
        },

        _formatFileName: function(name) {
            if (name.length > 33) {
                name = name.slice(0, 19) + '...' + name.slice(-13);
            }
            return name;
        },

        _isAllowedExtension: function(fileName) {
            var ext = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
            var allowed = this.options.allowedExtensions;

            if (!allowed.length) {
                return true;
            }

            for (var i = 0; i < allowed.length; i++) {
                if (allowed[i].toLowerCase() == ext) {
                    return true;
                }
            }

            return false;
        },

        _formatSize: function(bytes) {
            var i = -1;
            do {
                bytes = bytes / 1024;
                i++;
            } while (bytes > 99);

            return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
        }
    };

    // --------------------------------------------------------- //

    function fileUploader(options) {
        fileUploaderBasic.apply(this, arguments);

        // additional options
        Object.appendAll(this.options, {
            element: null,
            // if set, will be used instead of qq-upload-list in template
            listElement: null,

            template: (function() {
                var s = [];
                s.push('<div class="qq-uploader">');
                s.push('<div class="qq-upload-drop-area"><span>Drop files here to upload</span></div>');
                s.push('<div class="qq-upload-button">Upload a file</div>');
                s.push('<ul class="qq-upload-list"></ul>');
                s.push('</div>');
                return s.join('');
            })(),

            // template for one item in file list
            fileTemplate: (function() {
                var s = [];
                s.push('<li>');
                s.push('<span class="qq-upload-file"></span>');
                s.push('<span class="qq-upload-spinner"></span>');
                s.push('<span class="qq-upload-size"></span>');
                s.push('<a class="qq-upload-cancel" href="#">Cancel</a>');
                s.push('<span class="qq-upload-failed-text">Failed</span>');
                s.push('</li>');
                return s.join('');
            })(),

            classes: {
                // used to get elements from templates
                button: 'qq-upload-button',
                drop: 'qq-upload-drop-area',
                dropActive: 'qq-upload-drop-area-active',
                list: 'qq-upload-list',

                file: 'qq-upload-file',
                spinner: 'qq-upload-spinner',
                size: 'qq-upload-size',
                cancel: 'qq-upload-cancel',

                // added to list item when upload completes
                // used in css to hide progress spinner
                success: 'qq-upload-success',
                fail: 'qq-upload-fail'
            }
        });

        Object.appendAll(this.options, options);

        this.element = this.options.element;
        this.element.innerHTML = this.options.template;
        this.listElement = this.options.listElement || this._find(this.element, 'list');

        this.classes = this.options.classes;

        this.button = this._createUploadButton(this._find(this.element, 'button'));

        this._bindCancelEvent();
        this._setupDragDrop();
    }

    Object.appendAll(fileUploader.prototype, fileUploaderBasic.prototype);

    Object.appendAll(fileUploader.prototype, {
        /**
         * Gets one of the elements listed in this.options.classes
         **/
        _find: function(parent, type) {
            var element = web.className(this.options.classes[type], parent)[0];
            if (!element) {
                throw new Error('element not found ' + type);
            }
            return element;
        },

        _setupDragDrop: function() {
            var self = this, dropArea = this._find(this.element, 'drop');

            var dz = new uploadDropZone({
                element: dropArea,
                onEnter: function(e) {
                    web.addClass(dropArea, self.classes.dropActive);
                    e.stopPropagation();
                },

                onLeave: function(e) {
                    e.stopPropagation();
                },

                onLeaveNotDescendants: function(e) {
                    web.removeClass(dropArea, self.classes.dropActive);
                },

                onDrop: function(e) {
                    dropArea.style.display = 'none';
                    web.removeClass(dropArea, self.classes.dropActive);
                    self._uploadFileList(e.dataTransfer.files);
                }
            });

            web.hide(dropArea);

            web.event.addEvent(document, 'dragenter', function(e) {
                if (!dz._isValidFileDrag(e)) {
                    return;
                }
                web.show(dropArea);
            });

            web.event.addEvent(document, 'dragleave', function(e) {
                if (!dz._isValidFileDrag(e)) {
                    return;
                }
                var relatedTarget = document.elementFromPoint(e.clientX, e.clientY);
                // only fire when leaving document out
                if (! relatedTarget || relatedTarget.nodeName == "HTML") {
                    web.hide(dropArea);
                }
            });
        },

        _onSubmit: function(id, fileName) {
            fileUploaderBasic.prototype._onSubmit.apply(this, arguments);
            this._addToList(id, fileName);
        },

        _onProgress: function(id, fileName, loaded, total) {
            fileUploaderBasic.prototype._onProgress.apply(this, arguments);

            var item = this._getItemByFileId(id);
            var size = this._find(item, 'size');
            web.css(size, 'display', 'inline');

            var text;
            if (loaded != total) {
                text = Math.round(loaded / total * 100) + '% from ' + this._formatSize(total);
            } else {
                text = this._formatSize(total);
            }

            setText(size, text);
        },

        _onComplete: function(id, fileName, result) {
            fileUploaderBasic.prototype._onComplete.apply(this, arguments);

            // mark completed
            var item = this._getItemByFileId(id);
            web.remove(this._find(item, 'cancel'));
            web.remove(this._find(item, 'spinner'));

            if (result.success) {
                web.addClass(item, this.classes.success);
            } else {
                web.addClass(item, this.classes.fail);
            }
        },

        _addToList: function(id, fileName) {
            var item = web.dom.parseDOM(this.options.fileTemplate);
            item.qqFileId = id;

            var fileElement = this._find(item, 'file');
            setText(fileElement, this._formatFileName(fileName));
            web.hide(this._find(item, 'size'));

            web.dom.insert(this.listElement, item);
        },

        _getItemByFileId: function(id) {
            var item = web.dom.first(this.listElement);

            while (item) {
                if (item.qqFileId == id) {
                    return item;
                }
                item = web.dom.next(item);
            }
        },

        /**
         * delegate click event for cancel link
         **/
        _bindCancelEvent: function() {
            var self = this, list = this.listElement;

            web.event.addEvent(list, 'click', function(e) {
                e = e || window.event;
                var target = e.target || e.srcElement;

                if (web.hasClass(target, self.classes.cancel)) {
                    // preventDefault(e);

                    var item = web.dom.parent(target);
                    self.handler.cancel(item.qqFileId);
                    web.remove(item);
                }
            });
        }
    });

    // ========================================================= //

    function uploadButton(options) {
        this.options = {
            element: null,
            // if set to true adds multiple attribute to file input
            multiple: false,
            // name attribute of file input
            name: 'file',
            onChange: function(input) {
            },
            hoverClass: 'qq-upload-button-hover',
            focusClass: 'qq-upload-button-focus'
        };

        Object.appendAll(this.options, options);

        this.element = this.options.element;

        starfish.web.czz(this.element, {
            position: 'relative',
            overflow: 'hidden',
            direction: 'ltr' // IE
        });

        this.input = this._createInput();
    }

    uploadButton.prototype = {
        getInput: function() {
            return this.input;
        },

        reset: function() {
            if (this.input.parentNode) {
                web.dom.dispose(this.input);
            }

            web.removeClass(this.element, this.options.focusClass);
            this.input = this._createInput();
        },

        _createInput: function() {
            var input = web.dom.elem("input");

            if (this.options.multiple) {
                input.setAttribute("multiple", "multiple");
            }

            input.setAttribute("type", "file");
            input.setAttribute("name", this.options.name);

            web.czz(input, {
                position: 'absolute',
                right: 0,
                top: 0,
                fontFamily: 'Arial',
                // 243, 236, 236, 118
                fontSize: '118px',
                margin: 0,
                padding: 0,
                cursor: 'pointer',
                opacity: 0
            });

            web.dom.insert(this.element, input);

            var self = this;

            web.event.addEvent(input, 'change', function() {
                self.options.onChange(input);
            });

            web.event.addEvent(input, 'mouseover', function() {
                web.addClass(self.element, self.options.hoverClass);
            });

            web.event.addEvent(input, 'mouseout', function() {
                web.removeClass(self.element, self.options.hoverClass);
            });

            web.event.addEvent(input, 'focus', function() {
                web.addClass(self.element, self.options.focusClass);
            });

            web.event.addEvent(input, 'blur', function() {
                web.removeClass(self.element, self.options.focusClass);
            });

            // IE & Opera 取消keyboard access
            if (window.attachEvent) {
                input.setAttribute('tabIndex', "-1");
            }

            return input;
        }
    };

    // ========================================================= //

    function uploadHandlerAbstract(options) {
        this.options = {
            debug: false,
            action: '/upload.php',
            // maximum number of concurrent uploads
            maxConnections: 999,
            onProgress: function(id, fileName, loaded, total) {
            },
            onComplete: function(id, fileName, response) {
            },
            onCancel: function(id, fileName) {
            }
        };
        Object.appendAll(this.options, options);

        this.queue = [];
        this.params = [];
    }

    uploadHandlerAbstract.prototype = {
        log: function(str) {
            if (this.options.debug && window.console) {
                console.log('[uploader] ' + str);
            }
        },

        /**
         * Adds file or file input to the queue
         **/
        add: function(file) {
        },

        /**
         * Sends the file identified by id and additional query params to the server
         */
        upload: function(id, params) {
            var len = this.queue.push(id);

            var copy = {};
            Object.appendAll(copy, params);
            this.params[id] = copy;

            // if too many active uploads, wait...
            if (len <= this.options.maxConnections) {
                this._upload(id, this.params[id]);
            }
        },

        cancel: function(id) {
            this._cancel(id);
            this._dequeue(id);
        },

        cancelAll: function() {
            for (var i = 0; i < this.queue.length; i++) {
                this._cancel(this.queue[i]);
            }
            this.queue = [];
        },

        /**
         * Returns name of the file identified by id
         */
        getName: function(id) {
        },

        /**
         * Returns size of the file identified by id
         */
        getSize: function(id) {
        },

        /**
         * Returns id of files being uploaded or
         * waiting for their turn
         */
        getQueue: function() {
            return this.queue;
        },

        /**
         * Actual upload method
         */
        _upload: function(id) {
        },

        /**
         * Actual cancel method
         */
        _cancel: function(id) {
        },

        /**
         * Removes element from queue, starts upload of next
         */
        _dequeue: function(id) {
            var i = this.queue.indexOf(id);
            this.queue.splice(i, 1);

            var max = this.options.maxConnections;

            if (this.queue.length >= max && i < max) {
                var nextId = this.queue[max - 1];
                this._upload(nextId, this.params[nextId]);
            }
        }
    };

    // ========================================================= //

    /**
     * 使用form或iframe上传文件
     */
    function uploadHandlerForm(options) {
        uploadHandlerAbstract.apply(this, arguments);
        this.inputs = {};
    }

    Object.appendAll(uploadHandlerForm.prototype, uploadHandlerAbstract.prototype);

    Object.appendAll(uploadHandlerForm.prototype, {
        add: function(fileInput) {
            fileInput.setAttribute('name', 'qqfile');
            var id = 'qq-upload-handler-iframe' + String.uniqueID();

            this.inputs[id] = fileInput;

            if (fileInput.parentNode) {
                web.dom.dispose(fileInput);
            }
            return id;
        },

        getName: function(id) {
            return this.inputs[id].value.replace(/.*(\/|\\)/, "");
        },

        _cancel: function(id) {
            this.options.onCancel(id, this.getName(id));

            delete this.inputs[id];

            var iframe = $(id);
            if (iframe) {
                iframe.setAttribute('src', 'javascript:false;');
                web.dom.dispose(iframe);
            }
        },

        _upload: function(id, params) {
            var input = this.inputs[id];

            if (!input) {
                throw new Error('指定id的文件没有被添加，可能它已经被上传或取消。');
            }

            var fileName = this.getName(id);

            var iframe = this._createIframe(id);
            var form = this._createForm(iframe, params);
            web.dom.insert(form, input);

            var self = this;
            this._attachLoadEvent(iframe, function() {
                self.log('iframe loaded');

                var response = self._getIframeContentJSON(iframe);

                self.options.onComplete(id, fileName, response);
                self._dequeue(id);

                delete self.inputs[id];

                setTimeout(function() {
                    web.dom.dispose(iframe);  // fix FF 3.6
                }, 1);
            });

            form.submit();
            web.dom.dispose(form);
            return id;
        },

        _attachLoadEvent: function(iframe, callback) {
            web.event.addEvent(iframe, 'load', function() {
                if (!iframe.parentNode) {
                    return;       // fix IE
                }

                // fix Opera 10.53
                if (iframe.contentDocument &&
                    iframe.contentDocument.body &&
                    iframe.contentDocument.body.innerHTML == "false") {
                    return;
                }

                callback();
            });
        },

        /**
         * Returns json object received by iframe from server.
         */
        _getIframeContentJSON: function(iframe) {
            // iframe.contentWindow.document - for IE<7
            var doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document,
                response;

            this.log("converting iframe's innerHTML to JSON");
            this.log("innerHTML = " + doc.body.innerHTML);

            try {
                response = eval("(" + doc.body.innerHTML + ")");
            } catch(err) {
                response = {};
            }

            return response;
        },

        /**
         * Creates iframe with unique name
         */
        _createIframe: function(id) {
            var iframe = web.dom.parseDOM('<iframe src="javascript:false;" name="' + id + '" />')[0];

            iframe.setAttribute('id', id);

            web.hide(iframe);
            web.dom.insert(document.body, iframe);

            return iframe;
        },

        /**
         * Creates form, that will be submitted to iframe
         */
        _createForm: function(iframe, params) {
            var form = web.dom.parseDOM('<form method="post" enctype="multipart/form-data"></form>')[0];

            var queryString = obj2url(params, this.options.action);

            form.setAttribute('action', queryString);
            form.setAttribute('target', iframe.name);

            web.hide(form);
            web.dom.insert(document.body, form);

            return form;
        }
    });

    // ========================================================= //

    /**
     * 使用xhr上传文件 (XMLHttpRequest)
     */
    function uploadHandlerXhr(options) {
        uploadHandlerAbstract.apply(this, arguments);

        this.files = [];
        this.xhrs = [];
        this.loaded = [];
    }

    // static method
    uploadHandlerXhr.isSupported = function() {
        var input = web.dom.elem('input');
        input.type = 'file';

        return (
            'multiple' in input &&
                typeof File != "undefined" &&
                typeof (new XMLHttpRequest()).upload != "undefined" );
    };

    Object.appendAll(uploadHandlerXhr.prototype, uploadHandlerAbstract.prototype);

    Object.appendAll(uploadHandlerXhr.prototype, {
        add: function(file) {
            if (!(file instanceof File)) {
                throw new Error('不是文件');
            }

            return this.files.push(file) - 1;
        },

        getName: function(id) {
            var file = this.files[id];
            // fix missing name in Safari 4
            return file.fileName != null ? file.fileName : file.name;
        },

        getSize: function(id) {
            var file = this.files[id];
            return file.fileSize != null ? file.fileSize : file.size;
        },

        /**
         * Returns uploaded bytes for file identified by id
         */
        getLoaded: function(id) {
            return this.loaded[id] || 0;
        },

        /**
         * Sends the file identified by id and additional query params to the server
         * @param {Object} params name-value string pairs
         */
        _upload: function(id, params) {
            var file = this.files[id],
                name = this.getName(id),
                size = this.getSize(id);

            this.loaded[id] = 0;

            var xhr = this.xhrs[id] = new XMLHttpRequest();
            var self = this;

            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    self.loaded[id] = e.loaded;
                    self.options.onProgress(id, name, e.loaded, e.total);
                }
            };

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    self._onComplete(id, xhr);
                }
            };

            // build query string
            params = params || {};
            params['qqfile'] = name;
            var queryString = obj2url(params, this.options.action);

            xhr.open("POST", queryString, true);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("X-File-Name", encodeURIComponent(name));
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.send(file);
        },

        _onComplete: function(id, xhr) {
            // the request was aborted/cancelled
            if (!this.files[id]) return;

            var name = this.getName(id);
            var size = this.getSize(id);

            this.options.onProgress(id, name, size, size);

            if (xhr.status == 200) {
                this.log("xhr - server response received");
                this.log("responseText = " + xhr.responseText);

                var response;

                try {
                    response = eval("(" + xhr.responseText + ")");
                } catch(err) {
                    response = {};
                }

                this.options.onComplete(id, name, response);

            } else {
                this.options.onComplete(id, name, {});
            }

            this.files[id] = null;
            this.xhrs[id] = null;
            this._dequeue(id);
        },

        _cancel: function(id) {
            this.options.onCancel(id, this.getName(id));

            this.files[id] = null;

            if (this.xhrs[id]) {
                this.xhrs[id].abort();
                this.xhrs[id] = null;
            }
        }
    });

    // ====================================================== //

    function uploadDropZone(options) {
        this.options = {
            element: null,
            onEnter: function(e) {
            },
            onLeave: function(e) {
            },
            // is not fired when leaving element by hovering descendants
            onLeaveNotDescendants: function(e) {
            },
            onDrop: function(e) {
            }
        };
        Object.appendAll(this.options, options);

        this.element = this.options.element;

        this._disableDropOutside();
        this._attachEvents();
    }

    uploadDropZone.prototype = {
        _disableDropOutside: function(e) {
            // run only once for all instances
            if (!uploadDropZone.dropOutsideDisabled) {
                web.event.addEvent(document, 'dragover', function(e) {
                    if (e.dataTransfer) {
                        e.dataTransfer.dropEffect = 'none';
                        e.preventDefault();
                    }
                });
                uploadDropZone.dropOutsideDisabled = true;
            }
        },

        _attachEvents: function() {
            var self = this;

            web.event.addEvent(self.element, 'dragover', function(e) {
                if (!self._isValidFileDrag(e)) {
                    return;
                }

                var effect = e.dataTransfer.effectAllowed;
                if (effect == 'move' || effect == 'linkMove') {
                    e.dataTransfer.dropEffect = 'move'; // for FF (only move allowed)
                } else {
                    e.dataTransfer.dropEffect = 'copy'; // for Chrome
                }

                e.stopPropagation();
                e.preventDefault();
            });

            web.event.addEvent(self.element, 'dragenter', function(e) {
                if (!self._isValidFileDrag(e)) {
                    return;
                }
                self.options.onEnter(e);
            });

            web.event.addEvent(self.element, 'dragleave', function(e) {
                if (!self._isValidFileDrag(e)) {
                    return;
                }
                self.options.onLeave(e);
                var relatedTarget = document.elementFromPoint(e.clientX, e.clientY);
                // do not fire when moving a mouse over a descendant
                if (contains(this, relatedTarget)) {
                    return;
                }

                self.options.onLeaveNotDescendants(e);
            });

            web.event.addEvent(self.element, 'drop', function(e) {
                if (!self._isValidFileDrag(e)) return;

                e.preventDefault();
                self.options.onDrop(e);
            });
        },

        _isValidFileDrag: function(e) {
            var dt = e.dataTransfer,
                // do not check dt.types.contains in webkit, because it crashes safari 4
                isWebkit = navigator.userAgent.indexOf("AppleWebKit") > -1;

            // dt.effectAllowed is none in Safari 5
            // dt.types.contains check is for firefox
            return dt && dt.effectAllowed != 'none' &&
                (dt.files || (!isWebkit && dt.types.contains && dt.types.contains('Files')));

        }
    };

    // ************************************************************* //

    function setText(element, text) {
        element.innerText = text;
        element.textContent = text;
    }

    function contains(parent, descendant) {
        // compareposition returns false in this case
        if (parent == descendant) {
            return true;
        }

        if (parent.contains) {
            return parent.contains(descendant);
        } else {
            return !!(descendant.compareDocumentPosition(parent) & 8);
        }
    }

    function obj2url(obj, temp, prefixDone) {
        var uristrings = [],
            prefix = '&',
            add = function(nextObj, i) {
                var nextTemp = temp
                    ? (/\[\]$/.test(temp)) // prevent double-encoding
                    ? temp
                    : temp + '[' + i + ']'
                    : i;
                if ((nextTemp != 'undefined') && (i != 'undefined')) {
                    uristrings.push(
                        (typeof nextObj === 'object')
                            ? obj2url(nextObj, nextTemp, true)
                            : (Object.prototype.toString.call(nextObj) === '[object Function]')
                            ? encodeURIComponent(nextTemp) + '=' + encodeURIComponent(nextObj())
                            : encodeURIComponent(nextTemp) + '=' + encodeURIComponent(nextObj)
                    );
                }
            };

        if (!prefixDone && temp) {
            prefix = (/\?/.test(temp)) ? (/\?$/.test(temp)) ? '' : '&' : '?';
            uristrings.push(temp);
            uristrings.push(obj2url(obj));
        } else if ((Object.prototype.toString.call(obj) === '[object Array]') && (typeof obj != 'undefined')) {
            // we wont use a for-in-loop on an array (performance)
            for (var i = 0, len = obj.length; i < len; ++i) {
                add(obj[i], i);
            }
        } else if ((typeof obj != 'undefined') && (obj !== null) && (typeof obj === "object")) {
            // for anything else but a scalar, we will use for-in-loop
            for (i in obj) {
                add(obj[i], i);
            }
        } else {
            uristrings.push(encodeURIComponent(temp) + '=' + encodeURIComponent(obj));
        }

        return uristrings.join(prefix)
            .replace(/^&/, '')
            .replace(/%20/g, '+');
    }

    return fileUploader;

}();
