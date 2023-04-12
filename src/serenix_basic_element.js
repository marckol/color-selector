if (typeof inBrowser === 'undefined') {
	inBrowser = typeof window !== 'undefined';
}

if (typeof globalNS === 'undefined') {
    globalNS = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this;
}

if (typeof SVG_START_REGEXP === 'undefined')
    SVG_START_REGEXP = /^(?:(?:<\?xml\s+version\s*=\s*"\d+(?:\.\d+)+"\s*encoding\s*=\s*"UTF-8"\s*\?>)?(?:<!DOCTYPE svg\s+PUBLIC\s+)?<svg\s+)/;


if (Number.parseFloat === undefined) {
    Number.parseFloat = parseFloat;
}

if (Number.parseInt === undefined) {
    Number.parseInt = parseInt;
}

/**
 * <p>Returns the list of touch points (TouchList object) whose Touch objects 
 * include all the touch points that contributed to the given touch event when 
 * the given target value is not equals to 'screen' or all 
 * the active touch points triggered on the screen otherwise.</p>
 * <p>When the event type is 'touchend', the result will be 
 * <b color="navy">changedTouches</b> property of the touch event regardless of the target argument.</p>
 * <h3>Touch points description</h3>
 * <p>We have the following touch points cases:</p>
 * <ul>
 * <li><b color="navy">touches</b>: A list of information for every finger currently touching the touch surface (screen), regardless of whether or not they've changed or what their target element was at touchstart time.
 * <p>You can think of it as how many separate fingers are able to be identified as touching the screen.</p>
 * </li>
 * <li><b color="navy">targetTouches</b>: Like touches, but is filtered to only the information for finger touches that started out within the same node</li>
 * <li><b color="navy">changedTouches</b>: A list of information for every finger involved in the event.
 * <p>The changedTouches read-only property is a TouchList whose touch points (Touch objects) varies depending on the event type, as follows:</p>
 * <ul>
 * <li>For the touchstart event, it is a list of the touch points that became active with the current event.</li>
 * <li>For the touchmove event, it is a list of the touch points that have changed since the last event.</li>
 * <li>For the touchend event, it is a list of the touch points that have been removed from the surface (that is, the set of touch points corresponding to fingers no longer touching the surface).</li>
 * </ul>
 * </li>
 * </ul>
 * <h3>Examples</h3>
 * <p>To better understand what might be in these lists, let’s go over some examples quickly. They vary according to the following rules:</p>
 * <ul>
 * <li>When I put a finger down, all three lists will have the same information. It will be in changedTouches because putting the finger down is what caused the event</li>
 * <li>When I put a second finger down, touches will have two items, one for each finger. targetTouches will have two items only if the finger was placed in the same node as the first finger. changedTouches will have the information related to the second finger, because it’s what caused the event</li>
 * <li>If I put two fingers down at exactly the same time, it’s possible to have two items in changedTouches, one for each finger</li>
 * <li>If I move my fingers, the only list that will change is changedTouches and will contain information related to as many fingers as have moved (at least one).</li>
 * <li>When I lift a finger, it will be removed from touches, targetTouches and will appear in changedTouches since it’s what caused the event</li>
 * <li>Removing my last finger will leave touches and targetTouches empty, and changedTouches will contain information for the last finger</li>
 * </ul>
 * @param {TouchEvent} ev The touch event
 * @param {String|Boolean} [target=false] The target  ('screen', 'target', '', false) : the event related to?
 *      <p><b>The string value must be lower case. If not, will be considered 
 *      as value 'target' when the value can be assimilated to true string 
 *      value.</b> 
 *      The followings caseless string values are assimilated to boolean false 
 *      value: 'false', 'no', 'none','n', 'off', 'nok', 'ko'. Other string 
 *      value is assimilated to boolean true value.</p>
 * @returns {TouchList}
 */
function eventTouches(ev, target) {
    if (target === 'target' || target === true || ((typeof target !== 'string' || ['target', 'screen', ''].indexOf(target) < 0) && toBool(target))) {
        return ev.targetTouches;
    }
    if (target === 'screen' && ev.type !== 'touchend') return ev.touches;
    return ['touchstart', 'touchmouve', 'touchend'].indexOf(ev.type) >= 0 ?  ev.changedTouches : ev.touches;
}
/**
 * Returns the mouse position
 * @param {Event} ev
 */
function getMousePosition(ev) {
    var touches = [ 'touchstart', 'touchmove', 'touchend'].indexOf(ev.type) >= 0 ?  ev.changedTouches :ev.touches;
    ev = touches ? touches[touches.length - 1] : ev;
    return {
        x: ev.clientX,
        y: ev.clientY
    };
}

if (typeof toHtml === 'undefined') {
	toHtml = function(o) {
		var t;
		if (o instanceof String || o instanceof Number || o instanceof Boolean) {
			o = o.valueOf();
		}
		if ((t = typeof o) === 'function' || o instanceof Function) {
			o = o();
		}
		if (['string', 'number', 'boolean'].indexOf(t) >= 0) {
			return escapeHTML("" + o);
		} else if (isPlainObj(o)) {
			var html = o.html;
			if (html === true) {
				return typeof o.text === 'function' ? o.text() : o.text||o.value;
			} else if (html === false) {
				return escapeHTML(typeof o.text === 'function' ? o.text() : o.text||o.value);
			} else if ((t = typeof html) === 'string') {
				return html;
			} else if (t === 'function') {
				return o.html();
			} else if ((t = typeof o.htmlText) === 'string') {
				return o.htmlText;
			} else if (t === 'function') {
				return o.htmlText();
			}
		}
		return "";
	};
}
  /**
   * A bare-bones `Array#reduce` like utility function.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function called per iteration.
   * @returns {*} The accumulated result.
   */
  function reduce(array, callback) {
    var accumulator = null;
    each(array, function(value, index) {
      accumulator = callback(accumulator, value, index, array);
    });
    return accumulator;
  }

  /**
   * Removes leading and trailing whitespace from a string.
   *
   * @param {string} string The string to trim.
   * @returns {string} The trimmed string.
   */
  function trim(string) {
    return String(string).replace(/^ +| +$/g, '');
  }
  
if (!Array.prototype.includes) {
	Array.prototype.includes = function(v) {
		console.log('Polyfilled Array.prototype.includes');
	   //or use Object.defineProperty
	   Array.prototype.includes = function(search){
		return !!~this.indexOf(search);
	  }
	};
}
if (!Array.prototype.indexOf){
	console.log("Polyfilled Array.prototype.indexOf");
	Array.prototype.indexOf = (function(Object, max, min){
	  "use strict";
	  return function indexOf(member, fromIndex) {
		if(this===null||this===undefined)throw TypeError("Array.prototype.indexOf called on null or undefined");

		var that = Object(this), Len = that.length >>> 0, i = min(fromIndex | 0, Len);
		if (i < 0) i = max(0, Len+i); else if (i >= Len) return -1;

		if(member===void 0){ for(; i !== Len; ++i) if(that[i]===void 0 && i in that) return i; // undefined
		}else if(member !== member){   for(; i !== Len; ++i) if(that[i] !== that[i]) return i; // NaN
		}else                           for(; i !== Len; ++i) if(that[i] === member) return i; // all else

		return -1; // if the value was not found, then return -1
	  };
	})(Object, Math.max, Math.min);
}
function isIOS() {
	var iosQuirkPresent = function () {
        var audio = new Audio();

        audio.volume = 0.5;
        return audio.volume === 1;   // volume cannot be changed from "1" on iOS 12 and below
    };
    var isAppleDevice = navigator.userAgent.includes('Macintosh');
    var isTouchScreen = navigator.maxTouchPoints >= 1;   // true for iOS 13 (and hopefully beyond)

  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  ||/iPad|iPhone|iPod/.test(navigator.userAgent)
  || (isAppleDevice && (isTouchScreen || iosQuirkPresent()))
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
var isIos = isIOS;
/**
 * Picks the OS name from an array of guesses.
 *
 * @param {Array} guesses An array of guesses.
 * @param {String} [ua=navigator.userAgent]
 * @returns {null|string} The detected OS name.
 */
function getOS(guesses, ua) {
  /**
   * A utility function to clean up the OS name.
   *
   * @private
   * @param {string} os The OS name to clean up.
   * @param {string} [pattern] A `RegExp` pattern matching the OS name.
   * @param {string} [label] A label for the OS.
   */
  function cleanupOS(os, pattern, label) {
    // Platform tokens are defined at:
    // http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    // http://web.archive.org/web/20081122053950/http://msdn.microsoft.com/en-us/library/ms537503(VS.85).aspx
    var data = {
      '10.0': '10',
      '6.4':  '10 Technical Preview',
      '6.3':  '8.1',
      '6.2':  '8',
      '6.1':  'Server 2008 R2 / 7',
      '6.0':  'Server 2008 / Vista',
      '5.2':  'Server 2003 / XP 64-bit',
      '5.1':  'XP',
      '5.01': '2000 SP1',
      '5.0':  '2000',
      '4.0':  'NT',
      '4.90': 'ME'
    };
    // Detect Windows version from platform tokens.
    if (pattern && label && /^Win/i.test(os) && !/^Windows Phone /i.test(os) &&
        (data = data[/[\d.]+$/.exec(os)])) {
      os = 'Windows ' + data;
    }
    // Correct character case and cleanup string.
    os = String(os);

    if (pattern && label) {
      os = os.replace(RegExp(pattern, 'i'), label);
    }

    os = format(
      os.replace(/ ce$/i, ' CE')
        .replace(/\bhpw/i, 'web')
        .replace(/\bMacintosh\b/, 'Mac OS')
        .replace(/_PowerPC\b/i, ' OS')
        .replace(/\b(OS X) [^ \d]+/i, '$1')
        .replace(/\bMac (OS X)\b/, '$1')
        .replace(/\/(\d)/, ' $1')
        .replace(/_/g, '.')
        .replace(/(?: BePC|[ .]*fc[ \d.]+)$/i, '')
        .replace(/\bx86\.64\b/gi, 'x86_64')
        .replace(/\b(Windows Phone) OS\b/, '$1')
        .replace(/\b(Chrome OS \w+) [\d.]+\b/, '$1')
        .split(' on ')[0]
    );

    return os;
  }
  return reduce(guesses, function(result, guess) {
	var pattern = guess.pattern || qualify(guess);
	if (!result && (result =
		  RegExp('\\b' + pattern + '(?:/[\\d.]+|[ \\w.]*)', 'i').exec(ua||navigator.userAgent||"")
		)) {
	  result = cleanupOS(result, pattern, guess.label || guess);
	}
	return result;
  });
}


/*!
 * get from Platform.js
 * Copyright 2014-2020 Benjamin Tan
 * Copyright 2011-2013 John-David Dalton
 * Available under MIT license
 * @private
 */
/**
 * Detectable operating systems (order is important).
 */
var detectableOS = [
  'Windows Phone',
  'KaiOS',
  'Android',
  'CentOS',
  { 'label': 'Chrome OS', 'pattern': 'CrOS' },
  'Debian',
  { 'label': 'DragonFly BSD', 'pattern': 'DragonFly' },
  'Fedora',
  'FreeBSD',
  'Gentoo',
  'Haiku',
  'Kubuntu',
  'Linux Mint',
  'OpenBSD',
  'Red Hat',
  'SuSE',
  'Ubuntu',
  'Xubuntu',
  'Cygwin',
  'Symbian OS',
  'hpwOS',
  'webOS ',
  'webOS',
  'Tablet OS',
  'Tizen',
  'Linux',
  'Mac OS X',
  'Macintosh',
  'Mac',
  'Windows 98;',
  'Windows '
];

function isEdge(ua) {
	ua = (ua||navigator.userAgent).toLowerCase();
    if ((ua.indexOf('chrome') !== -1) 
            && (ua.indexOf('edg') !== -1)) {
        return true;
    }
    return false;
}

var isMsEdge = isEdge;

var isMicrosoftEdge = isEdge;

function getEdgeVersion(ua) {
    var match;
    var ua = (ua||navigator.userAgent).toLowerCase();
    if (isMsEdge(ua)) {
        if (match = ua.match(/edg\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/)) {
            return match[1];
        }
    }
}

var msEdgeVersion = getEdgeVersion;


var getEdgeBrowserVersion = getEdgeVersion;

var getMicrosoftEdgeBrowserVersion = getEdgeVersion;

var getMsEdgeBrowserVersion = getEdgeVersion;

var getMicrosoftEdgeVersion = getEdgeVersion;

var getMsEdgeVersion = getEdgeVersion;

function isChromiumEdge (ua) {
	return (ua||navigator.userAgent).indexOf("Edg/") > -1; // for new edge chromium
}
function getIEVersion(ua) {
	var rv;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		if (rv = /(?:MSIE[ ]||Trident\/.*; rv:)(\d+(?:\.\d+)*)/.exec(ua||navigator.userAgent))
		  return rv[1];
	}
}

function getBrowser() {
	var os = getOS(detectableOS, ua), i, b, v;
	if (v = getEdgeVersion(ua)) {
		b = "edge";		
	} else if (v = getIEVersion(ua)) {
		b = "internet explorer";
	} else {
		if(match = (re = /chrome|chromium|crios/g.exec(_ua))){
			b = "chrome";
			v = ua.substring(re.lastIndex);
		}else if(match = (re = /firefox|fxios/g.exec(_ua))){
			b = "firefox";
		}  else if(match = (re = /safari/g.exec(_ua))){
			b = "safari";
			v = ua.substring(re.lastIndex - match[0].lastIndex + 7);
            if ((i = ua.indexOf("Version")) != -1)
                v = ua.substring(i + 8);
		}else if(match = (re = /\bOpera/g.exec(ua))){
			b = "opera";
		} else if(match = (re = /edg/g.exec(_ua))){
			b = "edge";
		} else if(match = (re = /webview/g.exec(_ua))){
			b = "webview";
		}// For other browser "name/version" is at the end of ua
        else if ((i = (ua = navigator.userAgent).lastIndexOf(' ') + 1) <
            (pos = ua.lastIndexOf('/'))) {
            b = _ua.substring(i, pos).toLowerCase();
            v = _ua.substring(pos + 1);
            if (b.toLowerCase() == b.toUpperCase()) {
                b = navigator.appName.toLowerCase();
            }
        } else{
			return undefined;
		}
		if (v == undefined) {
			i = re.lastIndex - match[0].length;
			
		}
		// Trimming the fullVersion string at
        // semicolon/space if present
        if ((i = v.indexOf(";")) != -1)
            v = v.substring(0, i);
        if ((i = v.indexOf(" ")) != -1)
            v = v.substring(0, i);
	}
	return { os: os, version: v, browser: b, browserName: b, ios: isIOS(), android: os === 'Android' };
}
/**
 * Returns true if the browser supports 'button' HTML element.
 * @return {Boolean}
 */
function supportsButton() {
	var ua = navigator.userAgent; _ua = ua.toLowerCase(), b, v, i, mobile = "", pos, re;
	var browsers = [ 'chrome', 'edge', 'firefox', 'internet explorer', 'opera', 'safari', 'chrome android', 'firefox android', 'opera android', 'safari ios', 'samsung Internet', 'webview android' ];
	var versions = [ 1, 12, 1, 5.5, 12.1, 3, 18, 4, 12.1, 1, 1.0, 1 ], match;
	var b = getBrowser(), name = b.browser;
	
	v = b.version;
	i = v.indexOf(".");
	if (i > 0) {
		v = v.substring(0, i + 1) + v.substring(i + 1).replace(/\.(\d+)/g, function($0, $1) { return ($1.length < 2 ? "0" : "") + $1; })
	}
	i = browsers[name + (mobile = b.ios ? (name === "safari" ? "ios" : "") : (b.os === 'Android' ? "android" : "") ? " " + mobile : "")];
	return i != undefined && i >= 0 ? parseFloat(v) >= versions[i] : true;
}

function isMobileOS() {
	var b = getBrowser()
	var mobile = b.ios ? true : b.os === 'Android' ? true;
}

function getMobileOS() {
  var ua = navigator.userAgent;
  if (/android/i.test(ua)) {
    return "Android";
  }
  else if (/iPad|iPhone|iPod/.test(ua)
     || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)){
    return "iOS";
  }
  return /\bWindows Phone\b/.test(ua) ? "Windows Phone" : "Other";
}

function createImg(i, el) {
	var tag, cls, id = "";
	
	if (i instanceof String) {
		i = i.valueOf();
	}
	
	if (isPlainObj(i)) {
		cls = i["class"]||i.className||i.styleName||i.cssName;
		id = i.id||i.Id||i.ID||"";
		i = i.src||i.url||i.path||i.Src||i.Url||i.Path;
	}
	
	if (typeof i === 'string') {
		if (!el) {
			el = document.createElement(/<svg\s/.test(i) ? 'span' : /^(?:&|<b>|<i>|<strike>|<u>)/.test(i) ? 'span' : 'img');
			el.style.display = "inline-block";
		}
		if (/<svg\s/.test(i)) {
                    el.innerHTML = i;
		} else if (/^(?:&|<b>|<i>|<strike>|<u>)/.test(i)) {
                    el.innerHTML = i;
                } else {
                    el.src = i;
		}
		el.id = id;
		addCssClass(el, cls ? "SereniX-image " + cls : cls);
	}
	return el;
}

function createBtn(b) {
	var tag, btn, cls, caption, img, imageBefore;
	if (b instanceof String) {
		b = b.valueOf();
	}
	if (arguments.length > 1) {
		imageBefore = toBool(arguments[1]);
	}
	if (typeof b === 'string') {
		tag = supportsButton() ? "button" : "span";
		if (/<svg /.test(b)) {
			caption = "";
			img = b;
		} else {
			caption = b;
		}
	} else if (isPlainObj(b)) {
		tag = b.tag||b.tagName||(supportsButton() ? "button" : "span");
		cls = b["class"]||b.className||b.styleName||b.cssName;
		caption = b.text||b.caption||b.label||b.title||b.name;
		if (img = b.image||b.img||b.icon) {
			if (imageBefore == undefined) {
				imageBefore = b.imageBefore;
				if (imageBefore == undefined) {
					imageBefore = b.imgBefore;
					if (imageBefore == undefined) {
						imageBefore = b.iconBefore;
					}
				}
			}
			imageBefore = imageBefore == undefined ? true : toBool(imageBefore);
		}
	} else {
		throw new Error("Incorrect argument");
	}
	btn = document.createElement(tag);
	if (tag === 'span') {
	    btn.setAttribute("tabindex", "0");
		btn.tabIndex = 0;
	} else if (tag === 'a') {
		btn.style.textDecoration = "none";
	}
	addCssClass(btn, cls ? "SereniX-button " + cls : "SereniX-button");
	if (img) {
		if (caption) {
			var span = document.createElement("span");
			span.innerHTML = toHtml(caption);
			if (imageBefore) {
				btn.appendChild(createImg(img));
				btn.appendChild(span);
			} else {
				btn.appendChild(span);
				btn.appendChild(createImg(img));
			}
		} else {
			btn.appendChild(createImg(img));
		}
	} else if (caption) {
		btn.innerHTML = toHtml(caption);
	}
	return btn;
}

var createButton = createBtn;
