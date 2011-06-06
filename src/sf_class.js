/**
 *  类定义工具
 *
 * @namespace org.shen.Starfish
 * @module clazz
 */
starfish.clazz = {
    /**
     * 实现类的继承
     * @method extend
     * @param {Class} subClass		子类
     * @param {Class} superClass	父类
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
