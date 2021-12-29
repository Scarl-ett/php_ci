/**
 * @author 이준한
 * @version 1.0
 * 
 * Javascript Framework
 * ARBITER.init('my-module-name', ['util', 'form'], function(dom, lms) {
 *    // some codes 
 * });
 * 
 */
if (typeof ARBITER === 'undefined' || !ARBITER) {
    var ARBITER = {};
}

if (typeof jQuery === 'undefined') {
    throw new Error('ARBITER requires jQuery javascript library.');
}

(function($, w) {
    
    var URI = '/Api/arbiter/index/';
    
    var modules = {};
    
    var info = {
        received: {},
        receivedQueue: []
    };    
    
    /**
     * 샌드박스 패턴으로 로딩한다.
     * 
     * @function
     * @public
     * @param {string} moduleId 외부에서 참조가 필요한 경우 식별자 ID (optional)
     * @param {function} factoryFunction javascript 함수 구현체
     *
     * @example
     * 
     * ARBITER.init('my-module-name', ['util', 'form'], function(dom, lms) {
     *    // some codes 
     * });
     * 
     * @memberOf ARBITER
     */
    function init() {
        
        var args
        
        args = {
            id: arguments[0],
            dom: ['element', jQuery],
            requires: arguments[1],
            factory: arguments[2]
        };
        
        // load required libraries
        if (args.requires && args.requires.length > 0) {
            var requirements = [];
            for (inx = 0, limitInx = args.requires.length; inx < limitInx; inx++) {
                requirements.push('ARBITER.' + args.requires[inx]);
            }
            ARBITER.require(requirements);
        }
        
        // execute factory function
        if (args.factory) {
            $(document).ready(function() {
                var dom;
                
                if (args.dom !== null) {
                    dom = $(document.body);
                }
                
                if (dom.length == 0) {
                    throw new Error('Unexpected error. document body not found.');
                } else if (dom.length > 1) {
                    throw new Error('Unexpected error. Multiple document body were found.');
                }
                
                var ret = args.factory.call(dom.get(0), dom, ARBITER);
                
                if (args.id) {
                    modules[args.id] = ret;
                }

                return;
            });
        }
    }
    
    function get(moduleId) {
        return modules[moduleId];
    }    
    
    function remove(moduleId) {
        try {
            delete modules[moduleId];
        } catch(err) {
            // continue
        }
    }
    
    function require(classNames) {
    
        var inx, limitInx;
        var resources = []; // 캐쉬 되지 않아 ajax 요청할 놈들
    
        classNames = typeof classNames === 'string' ? [classNames] : classNames;
        
        if (!classNames || classNames.constructor !== Array) {
            throw new Error('Invalid classnames type. Expected string or array, received ' + (typeof classNames) + ' instead.');
        }
    
        for (inx = 0, limitInx = classNames.length; inx < limitInx; inx++) {
            
            // pathThrough 되어있지 않고, ARBITER 객체에 없으면
            if (!info.received[classNames[inx]] && !namespace(classNames[inx]).__defined__) {
                resources.push(classNames[inx]);
            }
        }
        //resources.sort();
        
        getResources(resources);
    }
    
    function getResources(resources) {
        
        if (resources.length == 0) return;
        
        //var uri = URI + '?files=' + resources.join('-');
        
        $.ajax({
            method: "POST",
            url: URI,
            data: {files: resources.join('-')},
            dataType: 'script',
            cache: true,
            async: false,
            success: function(data, textStatus) {},
            error: function(jqXHR, textStatus, errorThrown) {}
        });

        flushQueue_();
    }
    
    function flushQueue_() {

        var each, response;
        while (each = info.receivedQueue.shift()) {
            
            if (each.factory && typeof each.factory === 'function') {
                
                // 라이브러리 실행
                response = {};
                each.factory(response);
                
                // 구현체가 있으면 해당 클래스에 연결해준다.
                if (response.implement && typeof response.implement === 'function' || response.implement.constructor === Object) {
                    attach_(each.className, response.implement);
                }
                
                // 해당 라이브러리 안에 필요한 라이브러리가 또 있으면 추가한다.
                if (each.requirements.constructor == Array && each.requirements.length > 0) {
                    ARBITER.require(each.requirements);
                }
                
            }
        }
    }    
    
    function attach_(className, implementation) {
    
        var moduleName,
           ns = namespace(className), props = {},
           parts = className.split('.'),
           parent = ARBITER, inx, limitInx, key;

        if (ns.__defined__ || typeof ns === 'function') {
            ns.__defined__ = true;
            return;
        }
            
        for (key in ns) {
            if (ns.hasOwnProperty(key)) {
                props[key] = ns[key];
            }
        }
        
        if (parts[0] === 'ARBITER') {
            parts = parts.slice(1);
        }
        modulename = parts.pop();

        for (inx = 0, limitInx = parts.length; inx < limitInx; inx++) {
            if (typeof parent[parts[inx]] === 'undefined') {
                parent[parts[inx]] = {
                    __defined__: false
                };
            }
            parent = parent[parts[inx]];
        }

        parent[modulename] = implementation;
        
        ns = namespace(className);
        for (key in props) {
            if (typeof ns[key] === 'undefined') {
                ns[key] = props[key];
            }
        }
        ns.__defined__ = true;
    }    
        
    /**
     * ARBITER 객체에서 네임스페이스에 해당하는 객체를 반환한다.
     * (해당 네임스페이스가 없는 경우 노드트리를 생성하여 빈 객체를 반환한다.)
     * 
     * @function
     * @public
     * @param {string} namespace 네임스페이스
     * @returns {object} namespace object
     * @memberOf ARBITER
     */
    function namespace(ns) {
        var parts = ns.split('.'),
           parent = ARBITER,
           inx;

        if (parts[0] === 'ARBITER') {
            parts = parts.slice(1);
        }

        for (inx = 0; inx < parts.length; inx++) {
            if (typeof parent[parts[inx]] === 'undefined') {
                parent[parts[inx]] = {
                    __defined__: false
                };
            }
            parent = parent[parts[inx]];
        }
        return parent;
    }    
    
    function declare(className, requirements, factory) {
        
        if (info.received[className] || namespace(className).__defined__) {
            // already defined or received.
            return;
        }
        if (!className || typeof className !== 'string') {
            throw new Error('Invalid classname type. Expected string, received ' + (typeof className) + ' instead.');
        }
        if (requirements && typeof requirements === 'function') {
            factory = requirements;
            requirements = [];
        }
        if (!requirements || requirements.constructor !== Array) {
            throw new Error('Invalid requirements type. Expected array, received ' + (typeof requirements) + ' instead.');
        }
        if (!factory || typeof factory !== 'function') {
            throw new Error('Invalid factory type. Expected function, received ' + (typeof factory) + ' instead.');
        }
        
        // ajax 요청 후 해당 리소스 저장
        info.received[className] = true;
        info.receivedQueue.push({
            className: className,
            requirements: requirements, 
            factory: factory
        });        
        
    };        
    
    ARBITER.get = get;
    ARBITER.remove = remove;
    ARBITER.require = require;
    ARBITER.declare = declare;
    ARBITER.namespace = namespace;
    
    ARBITER.init = init;
    
})(jQuery, window);