if (typeof globalNS === 'undefined') {
	globalNS = typeof window !== 'undefined' ? window :
				typeof global !== 'undefined' ? global :
				typeof self !== 'undefined' ? self : this;
}

if (typeof addEvt === 'undefined') {
    function addEvt(evt, el, fn) {
        evt = evt.toLowerCase();
        if (el.addEventListener) {
            if (evt.startsWith('on')) {
                evt = evt.substring(2);
            }
            el.addEventListener(evt, fn);
        } else if (el.attachEvent) {
            if (!evt.startsWith('on')) {
                evt = 'on' + evt;
            }
            el.attachEvent(evt, fn);
        }
    }
}

if (typeof removeEvt === 'undefined') {
	function removeEvt(evt, el, fn) {
		evt = evt.toLowerCase();
		if (el.addEventListener) {
			if (evt.startsWith('on')) {
				evt = evt.substring(2);
			}
			el.removeEventListener(evt, fn);
		} else if (el.attachEvent) {
			if (!evt.startsWith('on')) {
				evt = 'on' + evt;
			}
			el.detachEvent(evt, fn);
		}
	}
}

if (typeof preventDefault === 'undefined') {
    preventDefault = function(ev) {
        if (ev.preventDefault) ev.preventDefault();
        else if (ev.stopPropagation) ev.stopPropagation();
    };
}

function bindAction(el, fn, keys) {
    var onKey;
    if (isArray(fn)) {
        function fire(ev) {
            ev = ev||window.event;
            fire.__actions.forEach(function(f) {
                f.call(this, ev);
            });
        }
        fire.__actions = fn;
        fn = fire;
    }
    addEvt('click', el, fn);
    onKey = isArray(keys) ? function __onKey(ev) {
        var which;
        ev = ev||window.event;
        which = ev.which;
        if (which === undefined || which === null)
            which = ev.keyCode;
        if (__onKey.keys.indexOf(which) >= 0) {
            __onKey.__action__.call(this, ev);
            preventDefault(ev);
        }
    } : function __onKey(ev) {
        var which;
        ev = ev||window.event;
        which = ev.which;
        if (which === undefined || which === null)
            which = ev.keyCode;
        if (which === 13) {
            __onKey.__action__.call(this, ev);
            preventDefault(ev);
        }        
    };
    onKey.__action__ = fn;
	onKey.keys = keys;
    addEvt('keydown', el, onKey);
	
	el.__$$action$$__ =  fn;
    el.__$$onClick$$__ = fn;
    el.__$$onKeydown$$__ = onKey;
}


function isArray(a) {
	return Array.isArray(a);
}

function isPlainObj(o) {
	return Object.prototype.toString.call(o) === '[object Object]';
}

var isPlainObject = isPlainObj;

globalNS.isDOMElt = function isDOMElt(obj) {
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement;
  }
  catch(e){
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have (works on IE7)
    return (typeof obj==="object") &&
      (obj.nodeType===1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument ==="object");
  }
};

/**
 * 
 * @param {type} el
 * @param {String} cls
 * @param {String} newClass
 * @returns {unresolved}
 */
replaceClass = function(el, cls, newClass) {
    if (!cls) {
        return el;
    }
    var classList = el.classList;
    if (classList) {
        var arr = cls.split(/\s/g);
        if (arr.length > 1) {
            arr.forEach(function(c) {
                classList.remove(c);
            });
            addCssClass(el, newClass);
        } else {
            classList.replace(cls, newClass);
        }
    } else {
        var c = el.className, p, ofs = 0, end;
        for (;;) {
            p = c.indexOf(ofs, cls);
            if (p < 0) {
                break;
            }
            end = p + cls.length;
            if ((ofs === 0 || " \t\b\0".indexOf(c.charAt(ofs - 1)) >= 0) &&
                    (end === c.length || " \t\b\0".indexOf(c.charAt(end)) >= 0)) {
                if (ofs > 0) {
                    if (end < c.length) {
                        el.className = c.substring(0, ofs).trim() + ' ' + newClass + ' ' + c.substring(end).trim();
                    } else {
                        el.className = c.substring(0, ofs).trim() + ' ' + newClass;
                    }
                } else {
                    if (end < c.length) {
                        el.className = newClass + ' ' + c.substring(end).trim();
                    } else {
                        el.className = newClass;
                    }
                }
                break;
            }
            ofs = end;
        }
    }
    
    return el;
};
/**
 * 
 * @param {type} el
 * @param {String} cls
 * @returns {unresolved}
 */
removeClass = function(el, cls) {
    if (!cls) {
        return el;
    }
    var classList = el.classList, tokens;
    if (classList) {
        cls.split(/\s+/).forEach(function(c) {
            classList.remove(c);
        });        
    } else {
        var c = el.className, p, ofs = 0, end;
        for (;;) {
            p = c.indexOf(ofs, cls);
            if (p < 0) {
                break;
            }
            end = p + cls.length;
            if ((ofs === 0 || " \t\b\0".indexOf(c.charAt(ofs - 1)) >= 0) &&
                    (end === c.length || " \t\b\0".indexOf(c.charAt(end)) >= 0)) {
                if (ofs === 0) {
                    c = c.substring(end).trim();
                } else if (end < c.length) {
                    c = c.substring(0, ofs).trim() + ' ' + 
                            c.substring(end).trim();
                } else {
                    c = c.substring(0, ofs).trim();
                }
            }
        }
    }
    return el;
};
/**
 * Adds CSS class name(s) to the given HTML element.
 * @param {HTMLElement} el
 * @param {String|Array&lt;String&gt;} cls
 * @returns {HTMLElement}
 */
addCssClass = function(el, cls) {
    if (cls instanceof String) {
        cls = cls.valueOf();
    }
    if (typeof cls === 'string') {
        cls = cls.trim();
        if (cls)
            cls = cls.replace(/[ \t\n\r]+/g, ' ').split(/[ ]/g);
    } else if (isArray(cls)) {
        var cList = [], s;
        for (var i = 0, n = cls.length; i < cls.length; i++) {
            s = cls[i].trim().replace(/[ \t\n\r]+/g, ' ').split(/[ ]/g);
            for (var j = 0, l = s.length; j < l; j++) {
                cList.push(s[j]);
            }
        }
        cls = cList;
    }
    if (!cls.length) {
        return el;
    }
    var classList = el.classList;
    
    if (classList) {
        for (var i = 0, n = cls.length; i< n; i++) {
            classList.add(cls[i]);
        }
    } else {
        var c = el.className||"", p, ofs = 0, end, _cls;
        for (var i = 0, n = cls.length; i< n; i++) {
            ofs = 0;
            _cls = cls[i];
            for (;;) {
                p = c.indexOf(ofs, _cls);
                if (p < 0) {
                    c += (c ? ' ' : '') + _cls;
                    break
                }
                end = p + _cls.length;
                if ((ofs === 0 || " \t\b\0".indexOf(c.charAt(ofs - 1)) >= 0) &&
                        (end === c.length || " \t\b\0".indexOf(c.charAt(end)) >= 0)) {
                    break;
                }
                ofs = end;
            }
        }
    }
    return el;
};

/**
 * Returns true if the element has all the given class names
 * @param {HTMLElement} el
 * @param {String|Array&lt;String&gt;} cls Class names to check. 
 *      When the argument is a atring, separate class names using white space.
 * @returns {Boolean}
 */
function hasClass(el, cls) {
    var args = Array.prototype.slice.call(arguments, 1);
    var eClass = el.getAttribute('class');
    var i = 0, n;
    function _has(c) {
        return (new RegExp("(^|\\s)" + c + "(\\s|$)")).test(eClass);
    }
    if (args.length > 1) {
        cls = args;
    } else if (typeof cls === 'string' || cls instanceof String) {
        cls = cls.split(/\s+/);
    } else if (!isArray(cls)) {
        throw new TypeError('Incorrect argument');
    }
    for (n = cls.length; i < n; i++) {
        if (!_has(cls[i]))
            return false;
    };
    return true;
}