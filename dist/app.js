/*!
 * clipboard.js v2.0.1
 * https://zenorocha.github.io/clipboard.js
 * 
 * Licensed MIT © Zeno Rocha
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ClipboardJS"] = factory();
	else
		root["ClipboardJS"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(7)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(module, require('select'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.select);
        global.clipboardAction = mod.exports;
    }
})(this, function (module, _select) {
    'use strict';

    var _select2 = _interopRequireDefault(_select);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var ClipboardAction = function () {
        /**
         * @param {Object} options
         */
        function ClipboardAction(options) {
            _classCallCheck(this, ClipboardAction);

            this.resolveOptions(options);
            this.initSelection();
        }

        /**
         * Defines base properties passed from constructor.
         * @param {Object} options
         */


        _createClass(ClipboardAction, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = options.action;
                this.container = options.container;
                this.emitter = options.emitter;
                this.target = options.target;
                this.text = options.text;
                this.trigger = options.trigger;

                this.selectedText = '';
            }
        }, {
            key: 'initSelection',
            value: function initSelection() {
                if (this.text) {
                    this.selectFake();
                } else if (this.target) {
                    this.selectTarget();
                }
            }
        }, {
            key: 'selectFake',
            value: function selectFake() {
                var _this = this;

                var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                this.removeFake();

                this.fakeHandlerCallback = function () {
                    return _this.removeFake();
                };
                this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

                this.fakeElem = document.createElement('textarea');
                // Prevent zooming on iOS
                this.fakeElem.style.fontSize = '12pt';
                // Reset box model
                this.fakeElem.style.border = '0';
                this.fakeElem.style.padding = '0';
                this.fakeElem.style.margin = '0';
                // Move element out of screen horizontally
                this.fakeElem.style.position = 'absolute';
                this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                // Move element to the same position vertically
                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                this.fakeElem.style.top = yPosition + 'px';

                this.fakeElem.setAttribute('readonly', '');
                this.fakeElem.value = this.text;

                this.container.appendChild(this.fakeElem);

                this.selectedText = (0, _select2.default)(this.fakeElem);
                this.copyText();
            }
        }, {
            key: 'removeFake',
            value: function removeFake() {
                if (this.fakeHandler) {
                    this.container.removeEventListener('click', this.fakeHandlerCallback);
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                }

                if (this.fakeElem) {
                    this.container.removeChild(this.fakeElem);
                    this.fakeElem = null;
                }
            }
        }, {
            key: 'selectTarget',
            value: function selectTarget() {
                this.selectedText = (0, _select2.default)(this.target);
                this.copyText();
            }
        }, {
            key: 'copyText',
            value: function copyText() {
                var succeeded = void 0;

                try {
                    succeeded = document.execCommand(this.action);
                } catch (err) {
                    succeeded = false;
                }

                this.handleResult(succeeded);
            }
        }, {
            key: 'handleResult',
            value: function handleResult(succeeded) {
                this.emitter.emit(succeeded ? 'success' : 'error', {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                });
            }
        }, {
            key: 'clearSelection',
            value: function clearSelection() {
                if (this.trigger) {
                    this.trigger.focus();
                }

                window.getSelection().removeAllRanges();
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.removeFake();
            }
        }, {
            key: 'action',
            set: function set() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                this._action = action;

                if (this._action !== 'copy' && this._action !== 'cut') {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                }
            },
            get: function get() {
                return this._action;
            }
        }, {
            key: 'target',
            set: function set(target) {
                if (target !== undefined) {
                    if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                        if (this.action === 'copy' && target.hasAttribute('disabled')) {
                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                        }

                        if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                        }

                        this._target = target;
                    } else {
                        throw new Error('Invalid "target" value, use a valid Element');
                    }
                }
            },
            get: function get() {
                return this._target;
            }
        }]);

        return ClipboardAction;
    }();

    module.exports = ClipboardAction;
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var is = __webpack_require__(6);
var delegate = __webpack_require__(5);

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, __webpack_require__(0), __webpack_require__(2), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
        factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
        global.clipboard = mod.exports;
    }
})(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
    'use strict';

    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

    var _goodListener2 = _interopRequireDefault(_goodListener);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var Clipboard = function (_Emitter) {
        _inherits(Clipboard, _Emitter);

        /**
         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
         * @param {Object} options
         */
        function Clipboard(trigger, options) {
            _classCallCheck(this, Clipboard);

            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

            _this.resolveOptions(options);
            _this.listenClick(trigger);
            return _this;
        }

        /**
         * Defines if attributes would be resolved using internal setter functions
         * or custom functions that were passed in the constructor.
         * @param {Object} options
         */


        _createClass(Clipboard, [{
            key: 'resolveOptions',
            value: function resolveOptions() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                this.container = _typeof(options.container) === 'object' ? options.container : document.body;
            }
        }, {
            key: 'listenClick',
            value: function listenClick(trigger) {
                var _this2 = this;

                this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                    return _this2.onClick(e);
                });
            }
        }, {
            key: 'onClick',
            value: function onClick(e) {
                var trigger = e.delegateTarget || e.currentTarget;

                if (this.clipboardAction) {
                    this.clipboardAction = null;
                }

                this.clipboardAction = new _clipboardAction2.default({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    container: this.container,
                    trigger: trigger,
                    emitter: this
                });
            }
        }, {
            key: 'defaultAction',
            value: function defaultAction(trigger) {
                return getAttributeValue('action', trigger);
            }
        }, {
            key: 'defaultTarget',
            value: function defaultTarget(trigger) {
                var selector = getAttributeValue('target', trigger);

                if (selector) {
                    return document.querySelector(selector);
                }
            }
        }, {
            key: 'defaultText',
            value: function defaultText(trigger) {
                return getAttributeValue('text', trigger);
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                this.listener.destroy();

                if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                }
            }
        }], [{
            key: 'isSupported',
            value: function isSupported() {
                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                var actions = typeof action === 'string' ? [action] : action;
                var support = !!document.queryCommandSupported;

                actions.forEach(function (action) {
                    support = support && !!document.queryCommandSupported(action);
                });

                return support;
            }
        }]);

        return Clipboard;
    }(_tinyEmitter2.default);

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */
    function getAttributeValue(suffix, element) {
        var attribute = 'data-clipboard-' + suffix;

        if (!element.hasAttribute(attribute)) {
            return;
        }

        return element.getAttribute(attribute);
    }

    module.exports = Clipboard;
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var DOCUMENT_NODE_TYPE = 9;

/**
 * A polyfill for Element.matches()
 */
if (typeof Element !== 'undefined' && !Element.prototype.matches) {
    var proto = Element.prototype;

    proto.matches = proto.matchesSelector ||
                    proto.mozMatchesSelector ||
                    proto.msMatchesSelector ||
                    proto.oMatchesSelector ||
                    proto.webkitMatchesSelector;
}

/**
 * Finds the closest parent that matches a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @return {Function}
 */
function closest (element, selector) {
    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
        if (typeof element.matches === 'function' &&
            element.matches(selector)) {
          return element;
        }
        element = element.parentNode;
    }
}

module.exports = closest;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var closest = __webpack_require__(4);

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function _delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Delegates event to a selector.
 *
 * @param {Element|String|Array} [elements]
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(elements, selector, type, callback, useCapture) {
    // Handle the regular Element usage
    if (typeof elements.addEventListener === 'function') {
        return _delegate.apply(null, arguments);
    }

    // Handle Element-less usage, it defaults to global delegation
    if (typeof type === 'function') {
        // Use `document` as the first parameter, then apply arguments
        // This is a short way to .unshift `arguments` without running into deoptimizations
        return _delegate.bind(null, document).apply(null, arguments);
    }

    // Handle Selector-based usage
    if (typeof elements === 'string') {
        elements = document.querySelectorAll(elements);
    }

    // Handle Array-like based usage
    return Array.prototype.map.call(elements, function (element) {
        return _delegate(element, selector, type, callback, useCapture);
    });
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

function select(element) {
    var selectedText;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;


/***/ })
/******/ ]);
});
var app = (function (parent) {

  var helper = {};

  helper.ready = function (fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading")
      fn();
    else
      document.addEventListener('DOMContentLoaded', fn);
  }

  helper.parseHTML = function (str) {
    if (typeof document['createRange'] === 'function') {
      return document.createRange().createContextualFragment(str);
    } else {
      var el = document.createElement('div');
      el.innerHTML = str;
      return el.children[0];
    }
  };

  /*
    add/remove class
    credits: https://www.sitepoint.com/add-remove-css-class-vanilla-js/
   */
  helper.addClass = function (elements, myClass) {

    // if there are no elements, we're done
    if (!elements) {
      return;
    }

    // if we have a selector, get the chosen elements
    if (typeof (elements) === 'string') {
      elements = document.querySelectorAll(elements);
    }

    // if we have a single DOM element, make it an array to simplify behavior
    else if (elements.tagName) {
      elements = [elements];
    }

    // add class to all chosen elements
    for (var i = 0; i < elements.length; i++) {

      // if class is not already found
      if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') < 0) {

        // add class
        elements[i].className += ' ' + myClass;
      }
    }
  }
  helper.removeClass = function (elements, myClass) {

    // if there are no elements, we're done
    if (!elements) {
      return;
    }

    // if we have a selector, get the chosen elements
    if (typeof (elements) === 'string') {
      elements = document.querySelectorAll(elements);
    }

    // if we have a single DOM element, make it an array to simplify behavior
    else if (elements.tagName) {
      elements = [elements];
    }

    // create pattern to find class name
    var reg = new RegExp('(^| )' + myClass + '($| )', 'g');

    // remove class from all chosen elements
    for (var i = 0; i < elements.length; i++) {
      elements[i].className = elements[i].className.replace(reg, ' ');
    }
  }

  /*
    fade in/out
    credits: http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/
   */
  // fade out
  helper.fadeOut = function (el) {
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= .1) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }
  // fade in
  helper.fadeIn = function (el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";

    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += .1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }

  // Ajax Request
  helper.sendRequest = function (queryUrl, cb) {
    var request = new XMLHttpRequest();
    if (!request) {
      alert('Cannot create an XMLHTTP instance :(');
      return;
    }
    request.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          if (typeof cb === 'function') {
            cb(this.responseText);
          }
        } else {
          console.error('Error!');
          alert('Error sending request to "' + queryUrl + '" :(');
        }
      }
    };
    request.open('GET', queryUrl, true);
    request.send();
    request = null;
  }

  // Parse Url
  // Credits: 

  parent.helper = helper;
  return parent;

})(app || {});

var app = (function (parent) {

  /*
    private methods
   */

  function clearOutput() {
    parent.helper.removeClass('.table2csv-output', 'table2csv-output--active');
    document.querySelector('.table2csv-output__controls').innerHTML = '';
    document.querySelector('.table2csv-output__result').innerHTML = '';
  }

  function parseCell(cellItem, options) {

    // first: remove invisible elements in cells
    var every_el = cellItem.querySelectorAll('*');
    for (var i = 0; i < every_el.length; i++) {
      var el = every_el[i];
      if (el.style.display == 'none' || getComputedStyle(el, 'display') == 'none') {
        el.parentNode.removeChild(el);
      }
    }

    var line = cellItem.textContent || cellItem.innerText;
    if (options.trim === true) {
      line = line.trim();
    }
    if (options.remove_n === true) {
      line = line.replace(/\r?\n|\r/g, ' ');
    }

    // escape double quotes in line
    if (/\"/.test(line)) {
      line = line.replace(/\"/g, '""');
    }

    // put line in double quotes
    // if line break, comma or quote found in line
    if (/\r|\n|\"|,/.test(line)) {
      line = '"' + line + '"';
    }

    return line;
  }

  function copyMsgAnimation(e) {
    // fade in/out copy msg
    var copyMsg = e.trigger.nextElementSibling;
    parent.helper.fadeIn(copyMsg, 'inline-block');
    setTimeout(function () {
      parent.helper.fadeOut(copyMsg);
    }, 300);
    // e.clearSelection();
  }

  function concatAllTables() {
    // concat tables from textareas
    var text = '';
    var textareas = document.querySelectorAll('.table2csv-output__csv');
    var textareasLen = textareas.length;
    var lastIdx = textareasLen - 1;
    for (var i = 0; i < textareasLen; i++) {
      text += textareas[i].value;
      if (i !== lastIdx)
        text += '\n';
    }
    return text;
  }

  function clearBtnCb(e) {
    // clear output
    clearOutput();
    return false;
  }

  function downloadBtnCb(e) {
    var targetId = e.target.getAttribute('data-download-target');
    var el = document.getElementById(targetId);
    var csvString = el.textContent || el.innerText;

    // Download
    // src: 
    // 1. https://stackoverflow.com/a/14966131/5732518
    // 2. https://stackoverflow.com/a/17836529/5732518
    if (window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([csvString]);
        window.navigator.msSaveOrOpenBlob(blob, 'myFile.csv');
    } else {
        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' +  encodeURIComponent(csvString);
        a.target = '_blank';
        a.download = targetId + '.csv';
        document.body.appendChild(a);
        a.click();
    }
  }

  function sendRequest(queryUrl, options) {
    parent.helper.sendRequest(queryUrl, function (responseText) {
      var data = JSON.parse(responseText);

      // remove images to prevent 404 errors in console
      var markup = data.parse.text['*'].replace(/<img[^>]*>/g, '');
      // parse HTML
      var dom = parent.helper.parseHTML(markup);
      // find tables
      var tables = dom.querySelectorAll(options.tableSelector);
      if (tables.length <= 0) {
        alert('Error: could not find any tables on page ' + queryUrl);
        return;
      }

      // loop tables
      var tablesLen = tables.length;
      for (var i = 0; i < tablesLen; i++) {

        console.debug('Parsing table ' + i);

        var tableEl = tables[i];
        var csv = parseTable(tableEl, options);

        var blockId = i + 1;
        var csvContainer = '<div class="mb-5">' +
          '<h5>Table ' + blockId + '</h5>' +
          '<textarea id="table-' + blockId + '" class="table2csv-output__csv form-control" rows="7">' + csv + '</textarea>' +
          '<div class="mt-2">' +
          '<button class="table2csv-output__download-btn btn btn-outline-primary" data-download-target="table-' + blockId + '">Download</button>' +
          '<button class="table2csv-output__copy-btn btn btn-outline-primary" data-clipboard-target="#table-' + blockId + '">Copy to clipboard</button>' +
          '<span class="table2csv-output__copy-msg">Copied!</span>' +
          '</div>' +
          '</div>';
        parent.helper.addClass('.table2csv-output', 'table2csv-output--active');
        document.querySelector('.table2csv-output__result').insertAdjacentHTML('beforeend', csvContainer);
      }
      
      // download btn event handler
      var dlBtns = document.getElementsByClassName('table2csv-output__download-btn');
      for (var i = 0; i < dlBtns.length; i++) {
        dlBtns[i].addEventListener('click', downloadBtnCb);
      }

      // insert clear output button
      var clearBtn = '<button class="table2csv-output__clear-btn btn btn-outline-primary">Clear Output</button>';
      document.querySelector('.table2csv-output__controls').insertAdjacentHTML('beforeend', clearBtn);
      document.querySelector('.table2csv-output__clear-btn').addEventListener('click', clearBtnCb);

      // init clipboard functions
      var clipboard = new ClipboardJS('.table2csv-output__copy-btn');
      clipboard.on('success', copyMsgAnimation);

      // insert copy all button
      if (tablesLen > 1) {
        var copyAllBtn = '<button class="table2csv-output__copy-all-btn btn btn-outline-primary">Copy all tables to clipboard</button>' +
          '<span class="table2csv-output__copy-msg">Copied!</span>';
        document.querySelector('.table2csv-output__controls').insertAdjacentHTML('beforeend', copyAllBtn);
        // init clipboard fn
        var clipboardAll = new ClipboardJS('.table2csv-output__copy-all-btn', {
          text: concatAllTables
        });
        clipboardAll.on('success', copyMsgAnimation);
      }
      
    });

  }

  function parseTable(element, options) {
    var result = '',
        rows = element.querySelectorAll('tr'),
        colsCount = rows[0].children.length,
        allSpans = {};

    // loop tr
    for (var rowsIdx = 0, rowsLen = rows.length; rowsIdx < rowsLen; rowsIdx++) {
      var row = rows[rowsIdx],
          csvLine = [],
          cells = row.querySelectorAll('th, td'),
          spanIdx = 0;

      // loop cells
      for (var cellIdx = 0; cellIdx < colsCount; cellIdx++) {
        var cell = cells[cellIdx],
            rowSpan = 1,
            colSpan = 1;

        // get rowSpan & colSpan attr
        if (typeof cell !== 'undefined') {
          var attr1 = cell.getAttribute('rowSpan')
          if (attr1) {
            rowSpan = parseInt(attr1);
          }
          var attr2 = cell.getAttribute('colSpan')
          if (attr2) {
            colSpan = parseInt(attr2);
          }
        }

        // loop colSpan, set rowSpan value
        for (var j = 0; j < colSpan; j++) {

          // check if there is a cell value for this index (set earlier by rowspan)
          // console.debug('spanIdx', spanIdx)
          while (allSpans.hasOwnProperty(spanIdx.toString())) {
            // console.debug('Has value at span index', spanIdx)
            var val = allSpans[spanIdx.toString()][1];
            csvLine.push(val);

            // decrease by 1 and remove if all rows are covered
            allSpans[spanIdx.toString()][0] -= 1;
            if (allSpans[spanIdx.toString()][0] == 0) {
              delete allSpans[spanIdx.toString()];
            }
            spanIdx += 1;
          }
          
          // parse cell text
          // don't append if cell is undefined at current index
          if (typeof cell !== 'undefined') {
            var cellText = parseCell(cell, options);
            csvLine.push(cellText);
          }
          if (rowSpan > 1) {
            allSpans[spanIdx.toString()] = [rowSpan - 1, cellText];
          }
          spanIdx += 1;            
          
        }
      }
      result += csvLine.join() + '\n';
    }
    return result
  }

  function returnInputError() {
    alert('Error reading Wikipedia url. Please enter a valid Wikipedia url (e. g. https://en.wikipedia.org/wiki/List_of_airports)');
  }

  /*
    public methods
   */

  parent.submitClickCb = function (e) {
    e.preventDefault();
    var urlVal = parent.form.querySelector('.table2csv-form__url-input').value.trim();
    if (!urlVal) {
      returnInputError();
      return;
    }
    var title = null;
    var domain = null;

    // Parse Url
    // Reference: https://www.mediawiki.org/wiki/Manual:Short_URL
    var urlMatch = urlVal.match(/^https?\:\/{2}(\w+\.\w+\.org)\/(?:w\/index\.php\?title\=([^&\#]+)|[^\/]+\/([^&\#]+)).*$/);
    console.debug(urlMatch);

    if (!urlMatch) {
      returnInputError();
      return;
    }

    // get domain
    if (urlMatch[1]) {
      domain = urlMatch[1];      
    } else {
      returnInputError();
      return;
    }

    // get title
    if (typeof urlMatch[2] !== 'undefined') {
      title = urlMatch[2];
    } else if (typeof urlMatch[3] !== 'undefined') {
      title = urlMatch[3];
    } else {
      returnInputError();
      return;
    }

    var queryUrl = 'https://' + domain + '/w/api.php?action=parse&format=json&origin=*&page=' + title + '&prop=text';
    var options = {
      trim: document.querySelector('.table2csv-form__trim').checked,
      remove_n: document.querySelector('.table2csv-form__remove-n').checked,
      tableSelector: parent.form.querySelector('.table2csv-form__table-selector').value,
    };


    // clear output
    clearOutput();

    console.debug('Title: ' + title);
    console.debug('URL: ' + queryUrl);
    console.debug('Options', options);

    // send request
    sendRequest(queryUrl, options);

    return false;
  }

  return parent;

})(app || {});

var debug = true;
if (!debug) {
	console.debug = function () {};
}

var app = (function (parent) {

	parent.init = function () {
		parent.form = document.getElementsByClassName('table2csv-form')[0];
		document.querySelector('.table2csv-form__btn-submit').addEventListener('click', parent.submitClickCb);
	}

	return parent;

})(app || {});
