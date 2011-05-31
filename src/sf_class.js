/**
 *  类定义工具
 */
starfish.clazz = {
	/**
	 * 定义类
	 * defineClass() -- a utility function for defining JavaScript classes.
	 *
	 * This function expects a single object as its only argument.  It defines
	 * a new JavaScript class based on the data in that object and returns the
	 * constructor function of the new class.  This function handles the repetitive
	 * tasks of defining classes: setting up the prototype object for correct
	 * inheritance, copying methods from other types, and so on.
	 *
	 * The object passed as an argument should have some or all of the
	 * following properties:
	 *
	 *      name: the name of the class being defined.
	 *            If specified, this value will be stored in the classname
	 *            property of the prototype object.
	 *
	 *    extend: The constructor of the class to be extended.  If omitted,
	 *            the Object() constructor will be used.  This value will
	 *            be stored in the superclass property of the prototype object.
	 *
	 * construct: The constructor function for the class. If omitted, a new
	 *            empty function will be used.  This value becomes the return
	 *            value of the function, and is also stored in the constructor
	 *            property of the prototype object.
	 *
	 *   methods: An object that specifies the instance methods (and other shared
	 *            properties) for the class.  The properties of this object are
	 *            copied into the prototype object of the class.  If omitted,
	 *            an empty object is used instead.  Properties named
	 *            "classname", "superclass", and "constructor" are reserved
	 *            and should not be used in this object.
	 *
	 *   statics: An object that specifies the static methods (and other static
	 *            properties) for the class.  The properties of this object become
	 *            properties of the constructor function.  If omitted, an empty
	 *            object is used instead.
	 *
	 *   borrows: A constructor function or array of constructor functions.
	 *            The instance methods of each of the specified classes are copied
	 *            into the prototype object of this new class so that the
	 *            new class borrows the methods of each specified class.
	 *            Constructors are processed in the order they are specified,
	 *            so the methods of a class listed at the end of the array may
	 *            overwrite the methods of those specified earlier. Note that
	 *            borrowed methods are stored in the prototype object before
	 *            the properties of the methods object above.  Therefore,
	 *            methods specified in the methods object can overwrite borrowed
	 *            methods. If this property is not specified, no methods are
	 *            borrowed.
	 *
	 *  provides: A constructor function or array of constructor functions.
	 *            After the prototype object is fully initialized, this function
	 *            verifies that the prototype includes methods whose names and
	 *            number of arguments match the instance methods defined by each
	 *            of these classes.  No methods are copied; this is simply an
	 *            assertion that this class "provides" the functionality of the
	 *            specified classes.  If the assertion fails, this method will
	 *            throw an exception.  If no exception is thrown, any
	 *            instance of the new class can also be considered (using "duck
	 *            typing") to be an instance of these other types.  If this
	 *            property is not specified, no such verification is performed.
	 *  
	 *  Example:
	 	  	// A very simple Rectangle class that provides Comparable
			var Rectangle = defineClass({
	    		name: "Rectangle",
	    		construct: function(w,h) { this.width = w; this.height = h; },
	    		methods: {
	        		area: function() { return this.width * this.height; },
	        		compareTo: function(that) { return this.area() - that.area(); }
	    		},
	    		provides: Comparable
			});
	
			// A subclass of Rectangle that chains to its superclass constructor,
			// inherits methods from its superclass, defines an instance method and
			// a static method of its own, and borrows an equals() method.
			var PositionedRectangle = defineClass({
	    		name: "PositionedRectangle",
	    		extend: Rectangle,
	    		construct: function(x,y,w,h) {
	        		this.superclass(w,h);  // chain to superclass
	        		this.x = x;
	        		this.y = y;
	    		},
	    		methods: {
	        		isInside: function(x,y) {
	            		return x > this.x && x < this.x+this.width &&
	                		y > this.y && y < this.y+this.height;
	        		}
	    		},
	    		statics: {
	        		comparator: function(a,b) { return a.compareTo(b); }
	    		},
	    		borrows: [GenericEquals]
			});
	 *            
	 *            
	 **/
    defineClass: function(data){
        var classname = data.name;
        var superclass = data.extend || Object;
        var constructor = data.construct || function(){};
        var methods = data.methods || {};
        var statics = data.statics || {};
        var borrows;
        var provides;
        
        // Borrows may be a single constructor or an array of them.
        if (!data.borrows) 
            borrows = [];
        else 
            if (data.borrows instanceof Array) 
                borrows = data.borrows;
            else 
                borrows = [data.borrows];
        
        // Ditto for the provides property.
        if (!data.provides) 
            provides = [];
        else 
            if (data.provides instanceof Array) 
                provides = data.provides;
            else 
                provides = [data.provides];
        
        // Create the object that will become the prototype for our class.
        var proto = new superclass();
        
        // Delete any noninherited properties of this new prototype object.
        for (var p in proto) 
            if (proto.hasOwnProperty(p)) 
                delete proto[p];
        
        // Borrow methods from "mixin" classes by copying to our prototype.
        for (var i = 0; i < borrows.length; i++) {
            var c = data.borrows[i];
            borrows[i] = c;
            // Copy method properties from prototype of c to our prototype
            for (var p in c.prototype) {
                if (typeof c.prototype[p] != "function") 
                    continue;
                proto[p] = c.prototype[p];
            }
        }
        
        // Copy instance methods to the prototype object
        // This may overwrite methods of the mixin classes
        for (var p in methods) 
            proto[p] = methods[p];
        
        // Set up the reserved "constructor", "superclass", and "classname"
        // properties of the prototype.
        constructor = constructor;
        proto.superclass = superclass;
        // classname is set only if a name was actually specified.
        if (classname) 
            proto.classname = classname;
        
        // Verify that our prototype provides all of the methods it is supposed to.
        for (var i = 0; i < provides.length; i++) { // for each class
            var c = provides[i];
            for (var p in c.prototype) { // for each property
                if (typeof c.prototype[p] != "function") 
                    continue; // methods only
                if (p == "constructor" || p == "superclass") 
                    continue;
                // Check that we have a method with the same name and that
                // it has the same number of declared arguments.  If so, move on
                if (p in proto &&
                typeof proto[p] == "function" &&
                proto[p].length == c.prototype[p].length) 
                    continue;
                // Otherwise, throw an exception
                throw new Error("Class " + classname + " does not provide method " 
                	+ c.classname + "." + p);
            }
        }
        
        // Associate the prototype object with the constructor function
        constructor.prototype = proto;
        
        // Copy static properties to the constructor
        for (var p in statics) 
            constructor[p] = data.statics[p];
        
        // Finally, return the constructor function
        return constructor;
    },
    
    /**
     * 实现类的继承
     * @param {class} subClass		子类
     * @param {class} superClass	父类
     * 
     * 例子:
     * 
     	// 父类
     	function Person(name) {
  			this.name = name;
		}

		// 实例方法
		Person.prototype.getName = function() {
  			return this.name;
		}
		
		// 子类
		function Author(name, books) {
			// 调用父类 构造函数
  			Author.superclass.constructor.call(this, name);
  			this.books = books;
		}
		
		// 继承
		starfish.clazz.extend(Author, Person);
		
		// 子类实例方法
		Author.prototype.getBooks = function() {
  			return this.books;
		};
		
		// 复写父类方法
		Author.prototype.getName = function() {
  			var name = Author.superclass.getName.call(this);
  			return name + ', Author of ' + this.getBooks().join(', ');
		};
		
	 *	
     */
    extend: function(subClass, superClass) {
    	// 避免创建父类的实例 因为父类可能很庞大、需要大量计算等
  		var F = function() {};
  		F.prototype = superClass.prototype;
  		subClass.prototype = new F();
  		subClass.prototype.constructor = subClass;
		
		// superclass属性用来弱化子类与父类之间的耦合
  		subClass.superclass = superClass.prototype;
  		if(superClass.prototype.constructor == Object.prototype.constructor) {
    		superClass.prototype.constructor = superClass;
  		}
	}
    
};

// A simple helper that allows you to bind new functions to the
// prototype of an object
Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
};

// --------------------------------------------------------------------- //
//Douglas Crockford’s Classical Inheritance-Style JavaScript Functions

// A (rather complex) function that allows you to gracefully inherit
// functions from other objects and be able to still call the 'parent'
// object's function
Function.method('inherits', function(parent) {
	// Keep track of how many parent-levels deep we are
	var depth = 0;
	// Inherit the parent's methods
	var proto = this.prototype = new parent();
	// Create a new 'priveledged' function called 'uber', that when called
	// executes any function that has been written over in the inheritance
	this.method('uber', function uber(name) {
		var func; // The function to be execute
		var ret; // The return value of the function
		var v = parent.prototype; // The parent's prototype
		// If we're already within another 'uber' function
		if (depth) {
		// Go the necessary depth to find the orignal prototype
			for ( var i = d; i > 0; i += 1) {
				v = v.constructor.prototype;
			}
			// and get the function from that prototype
			func = v[name];
			// Otherwise, this is the first 'uber' call
		} else {
			// Get the function to execute from the prototype
			func = proto[name];
			// If the function was a part of this prototype
			if (func == this[name]) {
			// Go to the parent's prototype instead
				func = v[name];
			}
		}
		// Keep track of how 'deep' we are in the inheritance stack
		depth += 1;
		// Call the function to execute with all the arguments but the first
		// (which holds the name of the function that we're executing)
		ret = func.apply(this, Array.prototype.slice.apply(arguments, [1]));
		// Reset the stack depth
		depth -= 1;
		// Return the return value of the execute function
		return ret;
	});
	return this;
});
// A function for inheriting only a couple functions from a parent object,
// not every function using new parent()
Function.method('swiss', function(parent) {
	// Go through all of the methods to inherit
	for ( var i = 1; i < arguments.length; i += 1) {
		// The name of the method to import
		var name = arguments[i];
		// Import the method into this object's prototype
		this.prototype[name] = parent.prototype[name];
	}
	return this;
});

/**
 * Example:
	// Create a new Person object constructor
	function Person( name ) {
		this.name = name;
	}
	
	// Add a new method to the Person object
	Person.method( 'getName', function(){
		return name;
	});
	
	// Create a new User object constructor
	function User( name, password ) {
		this.name = name;
		this.password = password;
	},
	
	// Inherit all the methods from the Person object
	User.inherits( Person );
	
	// Add a new method to the User object
	User.method( 'getPassword', function(){
		return this.password;
	});
	
	// Overwrite the method created by the Person object,
	// but call it again using the uber function
	User.method( 'getName', function(){
		return "My name is: " + this.uber('getName');
	});
 * 
 */
// --------------------------------------------------------------------- //
