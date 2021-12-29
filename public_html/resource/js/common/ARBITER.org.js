/**
 * @author ������
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
     * ����ڽ� �������� �ε��Ѵ�.
     * 
     * @function
     * @public
     * @param {string} moduleId �ܺο��� ������ �ʿ��� ��� �ĺ��� ID (optional)
     * @param {function} factoryFunction javascript �Լ� ����ü
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
        var resources = []; // ĳ�� ���� �ʾ� ajax ��û�� ���
    
        classNames = typeof classNames === 'string' ? [classNames] : classNames;
        
        if (!classNames || classNames.constructor !== Array) {
            throw new Error('Invalid classnames type. Expected string or array, received ' + (typeof classNames) + ' instead.');
        }
    
        for (inx = 0, limitInx = classNames.length; inx < limitInx; inx++) {
            
            // pathThrough �Ǿ����� �ʰ�, ARBITER ��ü�� ������
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
                
                // ���̺귯�� ����
                response = {};
                each.factory(response);
                
                // ����ü�� ������ �ش� Ŭ������ �������ش�.
                if (response.implement && typeof response.implement === 'function' || response.implement.constructor === Object) {
                    attach_(each.className, response.implement);
                }
                
                // �ش� ���̺귯�� �ȿ� �ʿ��� ���̺귯���� �� ������ �߰��Ѵ�.
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
     * ARBITER ��ü���� ���ӽ����̽��� �ش��ϴ� ��ü�� ��ȯ�Ѵ�.
     * (�ش� ���ӽ����̽��� ���� ��� ���Ʈ���� �����Ͽ� �� ��ü�� ��ȯ�Ѵ�.)
     * 
     * @function
     * @public
     * @param {string} namespace ���ӽ����̽�
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
        
        // ajax ��û �� �ش� ���ҽ� ����
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