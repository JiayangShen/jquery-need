/*!
 * jQuery NeedJS v1.0.0 (https://github.com/JiayangShen/jquery-need/)
 * Copyright 2014-2014 JiayangShen
 * Licensed under MIT (http://www.opensource.org/licenses/MIT)
 */
(function($, doc)
{
    // User agent and feature test information.
    var env,
    // Reference to the <head> element (populated lazily).
    $head = $('head'), head = $head[0];
    
    var queue = [], pending = null;
   
    (function getEnv()
    {
        var ua = navigator.userAgent;
       
        env = {
            // True if this browser supports disabling async mode on dynamically
            // created script nodes. See
            // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
            async: doc.createElement('script').async === true
        };
       
        (env.safari = /AppleWebKit\//.test(ua))
            || (env.ie = /MSIE|Trident/.test(ua))
            || (env.opera = /Opera/.test(ua))
            || (env.gecko = /Gecko\//.test(ua))
            || (env.unknown = true);
    })();
    
    function createNode(name, attrs)
    {
        var node = doc.createElement(name), attr;
        for (attr in attrs)
        {
            if (attrs.hasOwnProperty(attr))
            {
                node.setAttribute(attr, attrs[attr]);
            }
        }
        return node;
    }
    
    function next()
    {
        if(!queue.length) return;
        
        if(!pending)
        {
            pending = queue.shift();
            head.appendChild(pending);
            pending.dfp.done(function(){ pending = null; next(); });
        }
        
    }

    /**
    Loads the specified resources, or the next resource of the specified type
    in the queue if no resources are specified. If a resource of the specified
    type is already being loaded, the new request will be queued until the
    first request has been finished.

    When an array of resource URLs is specified, those URLs will be loaded in
    parallel if it is possible to do so while preserving execution order. All
    browsers support parallel loading of CSS, but only Firefox and Opera
    support parallel loading of scripts. In other browsers, scripts will be
    queued and loaded one at a time to ensure correct execution order.
   
    @method load
    @param {String} type resource type ('css' or 'js')
    @param {String|Array} urls   URL or array of URLs to load
    @param {boolean} isAsync? To load asynchronously or not.
    @param {boolean} check? Check file has been loaded or not.
    @private
    */
    function load(type, urls, isAsync, check) 
    {
        var isCSS = type == 'css', isJS = type == 'js';
        isAsync = isAsync === true && isJS ? true : false;
        check = check === false ? false : true;
        
        var paths = $.isPlainObject(urls) ? urls.paths : urls;
        paths = typeof paths == 'string' ? [paths] : paths;
        paths = paths.slice();
        
        if(check)
        {
            var $loaded = $head.find(isJS ? 'script.loaded' : 'link.loaded');
            if($loaded.length)
            {
                var names = $.isPlainObject(urls) ? urls.names : urls;
                names = typeof names == 'string' ? [names] : names;
                names = names.slice();
                
                for(var i = 0, name; name = names[i]; ++i)
                {
                    for(var x = 0, elem; elem = $loaded[x]; ++x)
                    {
                        var path = isJS ? elem.src : elem.href;
                        if(path.indexOf(name) >= 0) 
                        {
                            paths.splice(i, 1); names.splice(i, 1); 
                            i--; break;
                        }
                    };
                }
            }
        }
        
        if(!paths.length) return $.Deferred().resolve().promise();
        
        var nodes = [], dfs = [];
        for (var j = 0, url; url = paths[j]; ++j) 
        {
            var node = isCSS ? createNode('link', {href: url, rel : 'stylesheet'}) : createNode('script', {src: url});
            
            node.className = 'loaded';
            node.setAttribute('charset', 'utf-8');
            node.async = isAsync;
            dfs.push($.Deferred());
            node.dfp = dfs[j].promise();
            nodes.push(node);
   
            if(env.ie && !isCSS && 'onreadystatechange' in node && !('draggable' in node))
            {
                node.onreadystatechange = (function (j) 
                {
                    return function(){
                        if (/loaded|complete/.test(node.readyState))
                        {
                            dfs[j].resolve();
                            node.onreadystatechange = null;
                        }
                    };
                })(j);
            } 
            else
            {
                node.onload = (function(j)
                { 
                    return function(){ dfs[j].resolve(); }; 
                })(j);
            }
        }
        
        if(isAsync || isCSS || env.async || env.gecko || env.opera)
        {
            for (var k = 0, nd; nd = nodes[k]; ++k)
            {
                head.appendChild(nd);
            }
        }
        else
        {
            queue = queue.concat(nodes);
            next();
        }
        
        return $.when.apply($, dfs).then(function(){ return $.Deferred().resolve().promise(); });
    }

    /**
    @param: 
    {
        urls: 
        {
            | String: URL of file to load dynamically.
            | Array: Array of URLs.
            | Object: 
            {
                paths: 
                {
                   | String: URL of file to load dynamically.
                   | Array: Array of URLs.
                },
                names: // Used for checking file loaded or not
                {
                   | String: Identify(or name) of a file to load.
                   | Array: Array of URLs. one-to-one correspondent to paths.
                }
            }
        },
        ? isAsync:
        {
            boolean: To load js asynchronously (default) or not.
        }
        ? check: 
        {
            boolean: Check (default) file has been loaded or not.
        }
    }
    @return: Object: jQuery Deferred
    */
    $.needJS = function(urls, isAsync, check) 
               { return load('js', urls, isAsync, check); };
    $.needCSS = function(urls, check)
                { return load('css', urls, null, check); };
})(jQuery, this.document);









