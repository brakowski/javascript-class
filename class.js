/**
 * -----------------------------------
 * Simple Class System for JavaScript
 * -----------------------------------
 *
 * Features:
 * ´´´´´´´´´
 * -> Basic Inheritance
 * -> Mixins
 * -> Static Properties
 * -> Namespaces
 *
 *
 * Example:
 * ´´´´´´´´
 * Class('ClassName', {
 *     static: {
 *         STATICVAR: 'VAR',
 *         STATICFUNCTION: function(){}
 *     },
 *     extends: SuperClass 
 *     mixins: [MixinClass],
 *     constructor: function(){ }
 * });
 * 
 * @author Alexander Brakowski
 *
 */

var global = (window || this);

Function.prototype.isClass = function(){
	return this.hasOwnProperty("className");
}

Function.prototype.isMixin = function(){
	return this.prototype.hasOwnProperty("initMixin");
}

/* create given namespace */
function namespace(path, sep){
	var current = global;
	if(path == "") return current;
	
	var parts = path.split(sep || ".");

	for(var i=0; i<parts.length; ++i){
		current = current[parts[i]] = current[parts[i]] || {};
	}

	return current;
}

// add to global scope
global.namespace = namespace;

/* simple classmanager */
function ClassManager(){}
ClassManager.classes = {};
ClassManager.addClass = function(className, klass){
	ClassManager.classes[className] = klass;
}
ClassManager.removeClass = function(className){
	if(ClassManager.hasClass(className)) 
		delete ClassManager.classes[className];
}
ClassManager.hasClass = function(className){
	return ClassManager.classes.hasOwnProperty(className);
}
ClassManager.getClass = function(className){
	if(!ClassManager.hasClass(className)) return null;
	return ClassManager.classes[className];
}

// add to global scope
global.ClassManager = ClassManager;


/* class system */
var Class = (function(){
	function Class(name, definition){
		if(ClassManager.hasClass(name)) throw "Class '" + name + "' is already defined.";

		var klass,
			ns = "",
			clsName = name;
			reservedKeywords = [
				"constructor",    "className",  "extends", 
				"instanceNumber", "initMixins", "mixins", 
				"static",         "initConfig", "isInstanceOf"
			],
			isFunction = function(fn){
				return typeof(fn) == 'function';
			},
			ignoreProperty = function(key){
				return reservedKeywords.indexOf(key) !== -1;
			},
			instanceNumber = 0;

		if(name.indexOf('.') !== -1){
			var pos = name.lastIndexOf('.');
			ns = name.substring(0, pos);
			clsName = name.substring(pos + 1);
		}

		this.extends = function(child, parent){
			// copy properties from super class to child class
			for(var m in parent){
				if(parent.hasOwnProperty(m)) child[m] = parent[m];
			}

			// create new class and default constructor
			function construct() { 
				this.constructor = child;
			}

			// copy prototypes
			construct.prototype = parent.prototype;
			child.prototype = new construct;

			child.__super__ = child.super = child.prototype.super = parent.prototype;

			// copying mixins and remove reference to super class
			child.mixins = [];

			var mixins = parent.mixins || [];
			for(var i in mixins){
				child.mixins.push(mixins[i]);
			}

			return child;
		}

		/* create constructor */
		if(!definition.hasOwnProperty("constructor")){
			klass = function(){
				this.initConfig();
			}
		} else {
			klass = function(){
				this.initConfig();
				definition.constructor.apply(this, arguments);
			}
		}

		/* inheritance (extends) */
		if(definition.hasOwnProperty("extends")){
			this.extends(klass, definition.extends);
		}

		/* inheritance (mixins) */
		if(definition.hasOwnProperty("mixins")){
			klass.mixins = klass.mixins || [];

			for(var i in definition.mixins){
				var mixin = definition.mixins[i];
				if(!mixin.isMixin()) continue;

				klass.mixins.push(mixin.className);

				for(var key in mixin.prototype){
					if(ignoreProperty(key) || key == "initMixin") continue;
					klass.prototype[key] = mixin.prototype[key];
				}

				if(mixin.prototype.hasOwnProperty("static")){
					for(var v in mixin.prototype.static){
						klass[v] = mixin.prototype.static[v];
					}
				}
			}
		}

		/* static properties */
		if(definition.hasOwnProperty("static")){
			for(var v in definition.static){
				if(definition.static.hasOwnProperty(v)){
					klass[v] = definition.static[v];
				}
			}
		}

		/* copy definitions into prototype */
		for(var m in definition){
			if(ignoreProperty(m)) continue;
			klass.prototype[m] = definition[m];
		}

		// attach the classname as string to the class and prototype
		klass.className = klass.prototype.className = name;

		// get inheritance path
		klass.getInheritance = klass.prototype.getInheritance = function(asClass){
			var parents = [];
			var current = (klass.super || null);

			while(current != null){
				parents.push((asClass ? current : current.className));
				current = current.super || null;
			}

			// object is parent of all classes
			if(!asClass) parents.push("Object");

			return parents;
		}

		// check if class or instance inherits from given mixin
		klass.hasMixin = klass.prototype.hasMixin = function(mixin){
			if(typeof(mixin) !== 'string') mixin = mixin.className;

			var mixins = klass.mixins || [];
			return mixins.indexOf(mixin) !== -1;
		}

		// initial configuration of instance, has to be called in constructor
		klass.prototype.initConfig = function(){
			this.instanceNumber = ++instanceNumber;
			this.initMixins();
		}

		// call initMixin of each mixin
		klass.prototype.initMixins = function(){
			if(klass.hasOwnProperty("mixins")){
				for(var i in klass.mixins){
					var mixin = ClassManager.getClass(klass.mixins[i]);
					if(!mixin.isMixin()) continue;

					mixin.prototype.initMixin.call(this);
				}
			}
		}

		// check if instance is instance of a given class
		klass.prototype.isInstanceOf = function(cls){
			if(typeof(cls) === 'string'){
				if(!ClassManager.hasClass(cls)) return false;
				cls = ClassManager.getClass(cls);
			}

			return (this instanceof cls);
		}

		/* export class to global scope */
		namespace(ns)[clsName] = klass;

		ClassManager.addClass(name, klass);

		return klass;
	}

	return Class;
})();

// add to global scope
global.Class = Class;