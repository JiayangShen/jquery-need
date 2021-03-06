# jQuery NeedJS
*[jQuery NeedJS](https://github.com/JiayangShen/jquery-need), a jQuery plugin that can load JS, CSS files dynamically, and integrated with jQuery Deferred.*

This plugin is based on [jQuery](http://jquery.com), some part code is borrowed form [LazyLoad](https://github.com/rgrove/lazyload).

## Features:

- Loading JS, CSS files into web browser dynamically, in demand, in parallel while preserving execution order.
- Integrated with jQuery Deferred, making asynchronous operation callbacks invoking streamline and easier.
- Dynamical noblocking JS loading, no cross domain problem.
- JS can also be set to execute asynchronously.
- By default, it will check whether each JS or CSS file has been loaded, try best to avoid repeating loading. And, you can cancel this default action.

## Browsers Supporting Note:

For old version Firefox, old version Chrome, and Safari, though CSS files can be loaded and execute as expected, callbacks register to jQuery Deferred method such as `done()` won't execute. Because these browser don't truly support the `onload` event of the `<link>` DOM element. But if you like, you can fork this repository and fix the bug by yourself.

## APIs

This plugin includes two static methods of the `$` or `jQuery` object: `$.needJS()` and `$.needCSS()`.

### $.needJS(urls, isAsync?, check?)

This method is used to load one or more JS files.
#### Parameters:
1. **urls**: URLs of external js files to be loaded. Its type can be `String` or `Array` or a plain `Object` has the two properties `paths` and `names`. 
2. **isAsync**: Whether to execute JS asynchronously. Optional, can be set to `true` or `false`, default is false, mean to execute JS not asynchronously.
3. **check**: Whether to check each JS file has been loaded or not. Optional, can be set to `true` or `false`, default is false, mean do checking.

### $.needCSS(urls, check?)

This method is used to load one or more CSS files.
#### Parameters:
1. **urls**: URLs of external CSS files to be loaded. Its type can be `String` or `Array` or a plain `Object` has the two properties `paths` and `names`. 
3. **check**: Whether to check each CSS file has been loaded or not. Optional, can be set to `true` or `false`, default is false, mean do checking.

## Usage

Grab the plugin from `release/jquery-need-min.js` and include it in page like this:

```html
<!-- jQuery is required before this plugin -->
<script type="text/javascript" src="js/lib/jquery.min.js"></script>
<!-- include this plugin in page -->
<script type="text/javascript" src="js/plugin/jquery.need.min.js"></script>
```

Then, you can load external JS or CSS files dynamically like this:

```js
$.needJS('foo.js')
.done(function()
{
    //foo.js has been loaded and executed, you can do some thing...
});
```

Load and execute foo.js asynchronously:

```js
$.needJS('foo.js', true)
.done(function()
{
    //foo.js has been loaded and executed, you can do some thing...
});
```

Load more than one JS files:

```js
$.needJS(['foo.js', '/js/modules/module1.js'])
.done(function()
{
    //js files have been loaded and executed, you can do some thing...
});
```

Load CSS files:

```js
$.needCSS(['foo.css', '/css/bar.css'])
.done(function()
{
    //CSS files have been loaded, you can do some thing...
});
```

[`done()`](http://api.jquery.com/deferred.done/) is a common method available on any Object implements the [jQuery Deferred](http://api.jquery.com/category/deferred-object/) Pattern. We can use it to attach one or more **successful** callbacks. In this plugin, `done()` is the only recommonded method to use. Some jQuery Deffered method, such as `fail()`, have no effect in the APIs of this plugin.

The true power of this plugin is, you can coperate the functionality of this plugin with other asynchronous operations that integrated with jQuery Deferred. For example, you want to make a AJAX request while loading a JS file, do something when all of the two asynchronous operations have been finished, like this:

```js
var loadAction = $.needJS('foo.js')
.done(function()
{
    //foo.js has been loaded and executed, you can do some thing...
});

var ajaxAction = $.ajax('/ajax')
.done(function(response)
{
    //ajax request has been successfully finished, and you can do some thing...
});

//$.when() is a jQuery Deferred related static method, included in jQuery itself.
$.when(ajaxAction, loadAction)
.done(function(ajaxResponse)
{
    //foo.js loading and ajax request all have been successfully finished,
    //and you can do some thing...
    /*
    var data = ajaxResponse[0];
    ....
    */
});
```

## License

**[The MIT License](http://www.opensource.org/licenses/MIT)**

© 2014 [JiayangShen](https://github.com/JiayangShen) (the "Author").
All Rights Reserved.