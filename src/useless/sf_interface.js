/**
 * 接口类
 *
 * @namespace org.shen.Starfish
 * @module interfacez
 *
 *  例子:
 *
 // 要实现的接口 interfaces:
 var Composite = new starfish.interfacez('Composite', ['add', 'remove', 'getChild']);
 var FormItem = new starfish.interfacez('FormItem', ['save']);

 // 小技巧
 Function.prototype.method = function(name, fn) {
 this.prototype[name] = fn;
 return this;
 }

 // 要检查的对象 CompositeForm class
 var CompositeForm = function(id, method, action) { // implements Composite, FormItem

 };

 // 添加 接口中的方法
 CompositeForm.method('add', function() {
 ;
 });

 CompositeForm.method('remove', function() {
 ;
 }).method('getChild', function() {
 ;
 }).method('save', function() {
 ;
 });

 function addForm(formInstance) {
 starfish.interfacez.ensureImplements(formInstance, Composite, FormItem);
 // This function will throw an error if a required method is not implemented,
 // halting execution of the function.
 // All code beneath this line will be executed only if the checks pass.
 }

 addForm(new CompositeForm());

 // end
 *
 * 构造一个'接口'对象
 * @param {String}     name     此接口的名字
 * @param {Array}      methods  此接口要实现的方法名称数组
 */
starfish.interfacez = function(name, methods) {
    if (arguments.length != 2) {
        throw new Error("Interface constructor called with " + arguments.length
            + "arguments, but expected exactly 2.");
    }

    this.name = name;
    this.methods = [];
    for (var i = 0, len = methods.length; i < len; i++) {
        if (typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be "
                + "passed in as a string.");
        }
        this.methods.push(methods[i]);
    }

};

/**
 * 对传入的对象检查其是否包含了要实现接口的所有方法
 * 此方法至少要求两个参数:
 *         1.想要检查的对象
 *         2.对这个对象想要检查的接口
 *
 * @method ensureImplements
 */
starfish.interfacez.ensureImplements = function(object) {
    if (arguments.length < 2) {
        throw new Error(
            "Function starfish.interfacez.ensureImplements called with "
                + arguments.length
                + "arguments, but expected at least 2.");
    }

    for (var i = 1, len = arguments.length; i < len; i++) {
        var _interface = arguments[i];
        if (_interface.constructor !== starfish.interfacez) {
            throw new Error(
                "Function starfish.interfacez.ensureImplements expects arguments "
                    + "two and above to be instances of Interface.");
        }

        for (var j = 0, methodsLen = _interface.methods.length; j < methodsLen; j++) {
            var method = _interface.methods[j];
            if (!object[method]
                || starfish.getType(object[method]) !== 'function') {
                throw new Error(
                    "Function starfish.interfacez.ensureImplements: object "
                        + "does not implement the " + _interface.name
                        + " interface. Method " + method
                        + " was not found.");
            }
        }
    }

};
