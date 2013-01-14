Simple class system for JavaScript
==================================

Sometimes when programming in JavaScript you'll want to use Classes. Because I was not happy with all the class systems available for JavaScript I created this simple class system for JavaScript.

License
--------
Use, distribute and modify the code however you want. A simple acknowledgement would be great, but not required.
 
Features
--------
* Namespaces
* Basic Inheritance
* Mixins
* Static Properties
* Class manager

## Syntax
```javascript
Class(ClassName, ClassDefinition);
```

Where **ClassName** is a string and defines the name of the class, and **ClassDefinition** is an object the contains the class definition. 
Both of these arguments are required to create an class.

### Reserved keywords

There are some keywords that are used internally, which should not be used in the class definition, because they will be overriden on class creation.

#### Can be overriden
* constructor
* extends
* static
* mixins

#### Do not use
* className
* instanceNumber
* initMixins
* initConfig
* isInstanceOf
* getInheritance

### How to use - Simple example

```javascript
Class("Test", {
    static: {
        STATIC_VAR: 'VALUE'
    },

    extends: OtherClass,
    mixins: [MixinClass],

    constructor: function(){
        // call super constructor
        this.super.constructor.call(this);

        console.log("constructor called");
    }
});
```

#### Create an instance of a Class with new
```javascript
var testInstance = new Test();
```
 
Mixins
------
A Mixin is a class which can do everything a normal class can do, but has to implement a **initMixin** function, which will be called automatically on construction of an instance.

### Example 
```javascript
Class("MixinClass", {
    initMixin: function(){
       console.log("init mixin");
    }
});
```

Static Properties
-----------------
Static properties have to be defined as a object as a **static** property in the class definition.

### Example
```javascript
Class("StaticTest", {
    static: {
        STATICVAR: 'value'
    }
});
```

### How to access a static property
```javascript
var staticvalue = StaticTest.STATICVAR;
```

Inheritance
-----------
You can also inherit from other classes by using the **extends** keyword in the class definition.
If you are overriding the constructor, you will probably want to call the constructor of the parent class, which you can do like this:

```javascript
this.super.constructor.call(this);
```

or like this (where *ClassName* is the name of the class):

```javascript
ClassName.super.constructor.call(this);
```

You can also always get the parent classes of an class, by calling **getInheritance** of that class.

- **getInheritance** will return the names of the parent classes as an array of string. 
- **getInheritance(true)** will return the parent class as an array of classes

Class manager
-------------
Every class that is defined will be registered in the class manager, you can check if a class is defined, and even get a class by it's name.

### The ClassManager methods

- **addClass(className, class)**: adds a class to the class manager
- **removeClass(className)**: removes a given class from the class manager
- **getClass(className)**: retrieves a class by it's name
- **hasClass(classname)**: checks if a class by the given name exists
