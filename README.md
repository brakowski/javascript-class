Simple class system for JavaScript
==================================

Sometimes when programming in JavaScript you'll want to use Classes. Because I was not happy with all the class systems available for JavaScript I created this simple class system for JavaScript.

Features
--------
* Namespaces
* Basic Inheritance
* Mixins
* Static Properties

How to use
----------

```javascript
Class("Test", {
    static: {
        STATIC_VAR: 'VALUE'
    },

    extends: OtherClass,
    mixins: [MixinClass],

    constructor: function(){
        console.log("constructor called");
    }
});
```


 
