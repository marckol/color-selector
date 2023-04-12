 /* 
 * The MIT License
 *
 * Copyright 2023 Marc KAMGA Olivier <kamga_marco@yahoo.com;mkamga.olivier@gmail.com>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


 
 //Inspired from https://github.com/iamapig120/simple-color-picker
 
;(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }    
})(this, 'createGradientColorPalette', function() {
	
	var currentSel;
	
	var forEach = Array.prototype.forEach;
	
	var colorPalettes = {};
	
	/**
   * Set Max and Min
   * @param {number} num
   * @param {number} max
   * @param {number} min
   */
  function _getBorder(num, max, min) {
	return Math.max(Math.min(num, max), min);
  }

  /**
   * 
   * @param {string} hex
   */
  var rgbToHsb = function($0) {
    var hsb = { h: 0, s: 0, b: 0 }
	var rgb;
	if (typeof $0 === 'string' || $0 instanceof String) {
		if ($0.indexOf('#') === 0) {
		  $0 = $0.substring(1)
		}
		if ($0.length === 3) {
		  $0 = $0
			.split('')
			.map(function(s) { return s + s})
			.join('')
		}
		if ($0.length !== 6) return false
		$0 = [$0.substr(0, 2), $0.substr(2, 2), $0.substr(4, 2)].map(function(s) {
		  return parseInt(s, 16)
		})
		rgb = {
		  r: $0[0],
		  g: $0[1],
		  b: $0[2]
		}
	} else if (isPlainObj($0)) {
		$0.r = $0.r||$0.red||0;
		$0.g = $0.g||$0.green||0;
		$0.b = $0.b||$0.blue||0;
		rgb = $0;
		$0 = [rgb.r, rgb.g, rgb.b]
	} else if (isArray($0)) {
		rgb = {
		  r: $0[0],
		  g: $0[1],
		  b: $0[2]
		}
	}
    var MAX = Math.max(...$0)
    var MIN = Math.min(...$0)
    //H start
    if (MAX === MIN) {
      hsb.h = 0
    } else if (MAX === rgb.r && rgb.g >= rgb.b) {
      hsb.h = (60 * (rgb.g - rgb.b)) / (MAX - MIN) + 0
    } else if (MAX === rgb.r && rgb.g < rgb.b) {
      hsb.h = (60 * (rgb.g - rgb.b)) / (MAX - MIN) + 360
    } else if (MAX === rgb.g) {
      hsb.h = (60 * (rgb.b - rgb.r)) / (MAX - MIN) + 120
    } else if (MAX === rgb.b) {
      hsb.h = (60 * (rgb.r - rgb.g)) / (MAX - MIN) + 240
    }
    //H end
    if (MAX === 0) {
      hsb.s = 0
    } else {
      hsb.s = 1 - MIN / MAX
    }
    hsb.b = MAX / 255
    return hsb
  }

  /**
   * 
   * @param {number} heightPercent
   * @returns {r: any,g: any,b: any}
   */
  var cursorPosToRgb = function(heightPercent) {
    heightPercent = 1 - heightPercent
    var rgb = { r: undefined, g: undefined, b: undefined }
    var percentInEach = heightPercent * 6
    return Object.entries(rgb).reduce(
      function (lastObj, nowArr, index) {
        return Object.assign(lastObj, {
          [nowArr[0]]: Math.floor(
            (function() {
              var left = ((index + 1) % 3) * 2
              var right = left + 2
              var differenceL = percentInEach - left
              var differenceR = right - percentInEach
              if (differenceL >= 0 && differenceR >= 0) {
                return 0
              }
              var distance = Math.min(
                Math.abs(differenceL),
                Math.abs(differenceR),
                Math.abs(6 - differenceL),
                Math.abs(6 - differenceR)
              )
              return Math.min(255, 255 * distance)
            })())
	    })
	  },
      {}
	)
  }
  /*!*
   * 
   * <ul>
   * <li>The left position is a number between 0 and 1 and relative to the
   * gradient box width (left position value divided by the width of 
   * gradient box).</li>
   * <li>The top position is a number between 0 and 1 and relative to
   * the gradient box height (top position value divided by the height
   * of gradient box).</li>
   * </ul>
   * @private
   * @param {Number|Object|Array} left Left (x) position value or xy position value.
   *     <p>When the value of the first argument is a number, the first 
   *     argument is used as left (x) position value, the second are is 
   *     required and used for top (y) position value.</p>
   *     <p>When the value is an array or an object, the value of the argument
   *     top is ignored and used values of left and top are computed from the
   *     first argument.</p>
   * @param {Number} top Top (y) position value divided by the height of gradient (black) box
   * @param {Number} cursorPos Selector's cursor top position divided by 100. Value between 0 and 1
   * @returns {Object}
   */   
  function xyAndBarCursorPosToRgb(left, top, cursorPos){
    var rgb = cursorPosToRgb(cursorPos)
    for (var key in rgb) {
      rgb[key] = (255 - rgb[key]) * (1 - left) + rgb[key]
      rgb[key] = rgb[key] * (1 - top)
    }
    return rgb
  }

  function rgbToHex(rgb) {
    return (
      Math.floor(rgb.r||rgb.red||0)
        .toString(16)
        .padStart(2, '0') +
      Math.floor(rgb.g||rgb.green||0)
        .toString(16)
        .padStart(2, '0') +
      Math.floor(rgb.b||rgb.blue||0)
        .toString(16)
        .padStart(2, '0')
    )
  }
  
  function arrayRgbToHex(rgb) {
    return (
      Math.floor(rgb[0]||0)
        .toString(16)
        .padStart(2, '0') +
      Math.floor(rgb[1]||0)
        .toString(16)
        .padStart(2, '0') +
      Math.floor(rgb[2]||0)
        .toString(16)
        .padStart(2, '0')
    )
  }
  
    var _toPx = typeof toPx === 'function' ? toPx : function (x) {
		if (typeof x === 'string') {
			return parseFloat(/px$/.test(x) ? x.substring(0, x.length -2) : x, 10);
		} else if (typeof x === 'number')
			return x;
	}

    /**
     * Hex To RGB
     * @param {string} hex
     */
    function hexToRgb(hex) {
        return {
          r: parseInt(hex.substr(0, 2), 16),
          g: parseInt(hex.substr(2, 2), 16),
          b: parseInt(hex.substr(4, 2), 16)
        }
    }

    /**
     * 
     * @param {HTMLElement} tag
     */
    function $el(tag) { return  document.createElement(tag);}

	function setMethods(selector) {
		selector.fireChange = function(ev, target) {
			var self = this;
			ev = ev||window.event;
			ev.eventType = 'change';
			ev.selector = this;
			ev.fireTimestamp = ev.fireTimeStamp = (new Date()).getTime();
		  this._changeHandlers.forEach(function(fn) {
			fn.call(target, ev, ev.selector);
		  })
		}
		/**
		 *
		 * @param {"change"} type
		 * @param {function} fn
		 */
		selector.addEventListener = function(type, fn) {
		  if (typeof fn !== 'function') {
			return
		  }
		  switch (type) {
			case 'change': {
			  this._changeHandlers.push(fn)
			  break
			}
		  }
		}
		
		selector.setValueMode = function(m) {
			this.__valueMode_ = !m ? 'value' : ['hex', 'rgb', 'hsb', 'value'].indexOf(m = m.toLowerCase()) >= 0 ? m  : (function() {
				throw new Error('Incorrect value mode: ' + m);
			})();
			return this;
		};
		
		selector.getValueMode = function() {
			return this.__valueMode_
		}

		selector.getValue = function(mode) {
		  switch (mode||this.getValueMode()||'value') {
			case 'hex': {
			  return this.__value_
			}
			case 'rgb': {
			  return hexToRgb(this.getValue('hex'))
			}
			case 'hsb': {
			  return rgbToHsb(this.getValue('hex'))
			}
			case 'value':
			default: {
			  return '#' + this.__value_
			}
		  }
		}
		
		selector.setValue = function(value, resetPosition) {
			function processHexColor(value) {
				if (value.indexOf('#') === 0) {
					value = value.substring(1)
				  }
				  if (value.length === 3) {
					value = value
					  .split('')
					  .map(s => s + s)
					  .join('')
				  }
				  if (value.length !== 6) {
					value = 'FFFFFF'
				  }
				  hex = value
			}
			
			function tokenize() {
				a = match[1];
				match = match[2].split(/\s*,\s*/);
				if (a && match.length < 4)
					match[3] = 1;
			}
		  var hex = ''
		  var a, match;
		  var U = SereniX.ColorUtils;
		  
		  if (value == undefined)
			value = resetPosition = false;
		  if (value instanceof String)
			  value = value.valueOf();
		  switch (typeof value) {
			case 'string': {
				if (/^(#|\d)/.test(value)) {
				  processHexColor(value);
				} else if (match = /^rgb(a)?\(([^\(\)]+)\)$/.exec(value)) {
					tokenize(match);
					if (a) {
						hex = arrayRgbToHex(rgbaToRgb(match[0], match[1], match[2], match[3]));
					} else {
						hex = arrayRgbToHex(hslToRgb(match[0], match[1], match[2]));
					}
				} else if (match = /^hsl(a)?\(([^\(\)]+)\)$/.exec(value)) {
					tokenize(match);
					if (a) {
						hex = arrayRgbToHex(rgbaToRgb(hslaToRgba(match[0], match[1], match[2], match[3])));
					} else {
						hex = rgbToHex(hslToRgb(match[0], match[1], match[2]));
					}
				} else if (match = /^hsv(a)?\(([^\(\)]+)\)$/.exec(value)) {
					tokenize(match);
					throw new Error('Not yet supported');
				} else if (match = /^hsb(a)?\(([^\(\)]+)\)$/.exec(value)) {
					tokenize(match);
					throw new Error('Not yet supported');
				} else {
					var c;
					if (U) {
						c = U.NATIVE_NAME_COLORS[value];
					}
					if (!c) {
						throw new Error('Incorrect color string value: ' + value);
					}
					processHexColor(c);
				}
				break
			}
			case 'object': {
			  hex = rgbToHex(value)
			}
		  }
		  var rgb
		  try {
			rgb = hexToRgb(hex)
		  } catch (error) {
			rgb = {
			  r: 255,
			  g: 255,
			  b: 255
			}
		  }
		  this.__value_ = rgbToHex(rgb).toUpperCase()
		  this.textInput.value = this.__value_
		  this._colorBlock.style.backgroundColor = this.getValue()
		  if (resetPosition) {
			var hsb = rgbToHsb(hex)
			var h = hsb.h, s = hsb.s, b = hsb.b
			this._height = 1 - h / 360
			if (h === 0) this._height = 0
			this._mouseX = s
			this._mouseY = 1 - b
		  } else {
			if (this._lastValue !== this.value) {
			  this.fireChange(null, null, this._lastValue)
			}
		  }
		  this._lastValue = this.value
		  
		  return this;
		}
		/**
		 * Computes the rgb color object that corresponds to x (left) and y (right) positions.
		 * <p>Below an example of code to explain how x and y are computed from mouse position.</p>
		 * @example
		 * <h4>Computation of x and y from mouse (event) position</h4>
		 *```
		 * var bbox = selector._gradientBlack.getBoundingClientRect()
         * var x = ev.clientX - bbox.left // * (p.width / bbox.width)
         * var y = ev.clientY - bbox.top // * (p.height / bbox.height)
		 * var rgb = selector.getRgbAt(x, y)
		 *```
		 * @param {Number} x The x (left) position relative to the gradient (black) element x position.
		 * @param {Number} y The y (top) position relative to the gradient (black) element y position.
		 * @returns {String|Object}
		 */
		selector.getRgbAt = function(x, y) {
			var el = this._element__;
			var gradientColor = this._gradientColor;
			var gradientBlack = this._gradientBlack;
			var rgb;
			var bbox;
			
			if (isArray(x)) {
				y = x[1];
				x = x[0];
			} else if (typeof x === 'object' && x) {
				y = x.y == undefined ? x.top : x.y;
				x = x.x == undefined ? x.left : x.x;
			}
			bbox = this._gradientBlack.getBoundingClientRect()
			return xyAndBarCursorPosToRgb(x/bbox.width, y/bbox.height, _toPx(this._rightBarPicker.style.top)/100);
		}
		
		selector.getValueAt = function(x, y) {
			var rgb = this.getRgbAt.apply(this, arguments);
			switch (this.getValueMode()||'value') {
			case 'hex': {
			  return rgbToHex(rgb)
			}
			case 'rgb': {
			  return rgb
			}
			case 'hsb': {
			  return rgbToHsb(rgb)
			}
			case 'value':
			default: {
			  return '#' + rgbToHex(rgb)
			}
		  }
		}
		
		selector.getBrightness = function() {
		  var rgb = this.getValue('rgb')
		  return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b
		}
		
		/**
		 * Returns the selector HTML/DOM element
		 * @return {HTMLDivElement}
		 */
		selector.getElement = selector.getElement||function() {
		  return this._element__;
		}
		/**
		 * Returns the selector HTML/DOM element
		 * @return {HTMLDivElement}
		 */
		selector.getDOM = function() {
		  return this._element__;
		}
		
		selector.mouseBorder = function() {
		  this._mouseX = _getBorder(
			this._mouseX / (this._gradientBlack.getBoundingClientRect().width - 2),
			1,
			0
		  )
		  this._mouseY = _getBorder(
			this._mouseY / (this._gradientBlack.getBoundingClientRect().height - 2),
			1,
			0
		  )
		}
		selector.mouseBorderBar = function() {
		  this._height = _getBorder(
			this._height / (this._rightBar.getBoundingClientRect().height - 2),
			1,
			0
		  )
		}
		selector.updateUI = function() {
		  var position = this.position
		  var target = this._gradientCircle
		  target.style.left = (position.x * 100) + '%';
		  target.style.top = (position.y * 100) + '%';
		  this._rightBarPicker.style.top = (this.height * 100) + '%';
		  var rgb = rgbToHex(cursorPosToRgb(this.height));
		  this._gradientColor.style.background = 'linear-gradient(to right,#FFFFFF,#' + rgb + ')';
		  if (this.getBrightness() > 152) {
			addCssClass(target, 'color-selector-circle-black')
			removeClass(target, 'color-selector-circle-white')
		  } else {
			removeClass(target, 'color-selector-circle-black')
			addCssClass(target, 'color-selector-circle-white')
		  }
		}
	}
	
	function readOnly() {
		throw new Error('Read only property');
	}
	
	function defProp(o, name, get, set, props) {
		var p = {
			get: get,
			set: set||readOnly,
			configurable: true,
			enumerable: true
		};
		Object.defineProperty(o, name, p);
		if (props)
			props[name] = p;
		return p;
	}
	
	function setProps(selector, props) {
		props = props||{};
		defProp(selector, 'position', function() {
		  return {
			x: this._mouseX,
			y: this._mouseY
		  }
		}, readOnly, props);
		defProp(selector, 'height', function() {
		  return this._height
		}, readOnly, props);
		defProp(selector, 'value', function() {
		  return this.getValue()
		},
		function(value) {
		  this.setValue(value, true)
		  this.updateUI()
		}, props);
	}
	
	/**
	 * Creates and/or paint a Gradient Color Palette/Selector.
	 * <p>No image used.</p>
	 * <p>No dependency.</p>
	 * <p>The below global functions are required. See an implementation in serenix_ui_basic_functions.js library</p>
	 * <ul>
	 * <li>To check is a value is an array or is a plain object global functions isArray and isPlainObj are used.</li>
	 * <li>To manipulate classes of HTML element, global functions addCssClass , removeClass are required.</p>
	 * <li>For DOM element events,  global functions isDOMElt, addEvt, removeEvt and preventDefault are required.</li>
	 * </ul>
	 * <p>The following Array (instance) method are required:</p>
	 * <ul>
	 * <li>Array.prototype.forEach</li>
	 * <li>Array.prototype.reduce</li>
	 * <li>Array.prototype.map</li>
	 * </ul>
	 * <p>When the above required Array method not supported by the browser used a polyfill (see for example the library serenix_basic_es6_array_functions.js)</p>
	 * @param {Object|Element|String} settings or HTML element to use as color palette or id of HTML element to use as color palette
	 * @param {Object} [selector] The selector object. It can be at the second or third position. 
		<p>When the selector not specified, a plain object is created and set as selector.</p>
	 * @param {Element|String} [el] The color palette element. It can be at the first, second or third position.
	 * @memberOf SereniX.ui
	 * @function
	 * @returns {Element} The gradient color selector's HTML element
	 * @version 1.0.0
	 * @license MIT
	 * @author  Marc KAMGA Olivier
	 * @created 2022-03-16
	 */
	function createGradientColorPalette(settings, selector) {
		var self;
		var colorIndex;
		var valueEl;
		var CPB = SereniX.ui.ColorPaletteBase;
		var cpbPalettes;
		var cpName;
		var el;
		var props;
		var x = arguments[2];
		var input;
		var value;
		var onChange = settings.onChange||settings.change||settings.action||settings.onUpdate||settings.update;
		
		if (settings instanceof String) {
			settings = settings.valueOf();
		}
		
		if (isDOMElt(settings)) {
			if (typeof selector === 'string') {
				settings = { el: el = settings, value: selector};
				selector = typeof x === 'object' && x ? x : {};
			} else if (typeof x === 'object' && x) {
				el = settings;
				settings = selector;
				selector = x;
			} else {
				settings = { el: el = settings};
			}
		} else if (typeof settings === 'string') {
			el = document.getElementById(settings);
			if (!el) {
				el = document.createElement('div');
				el.id = settings;
			}
			if (typeof selector === 'string') {
				settings = { el: el, value: selector};
				selector = typeof x === 'object' && x ? x : {};
			} else if (typeof x === 'object' && x) {
				settings = selector;
				selector = x;
			} else {
				settings = { el: el};
			}
		}
		
		el = el||settings.el||settings.element||settings.elt||settings.dom
		input = settings.input;
		value = settings.value||settings.color||settings.initialValue||settings.initialColor||'#FFF';
		colorIndex = settings.colorIndex||settings.colorInd||settings.colorIndexBox||settings.colorIndBox;
		valueEl = settings.valueEl||settings.valueElement||settings.colorBox||settings.colorBlock;
		
		/*if (colorIndex === undefined || colorIndex === null)
			colorIndex = false;
		else */if (isPlainObj(colorIndex)) {
			throw new Error('Color index object not supported');
		} else if (!isDOMElt(colorIndex)) {
			colorIndex = colorIndex === undefined || colorIndex === null ? true : toBool(colorIndex);
		}
		
		if (el instanceof String)
			el = el.valueOf();
		
		if (typeof el === 'string' && el)  {
			x = document.getElementById(el);
			if (x) {
				forEach.call(x.children, function(node) {
					node.remove()
				});
			} else {
				x = $el('div');
				x.id = el;
			}
			el = x;
		} else if (!isDOMElt(el)) {
			el = $el('div');
		} else {
			forEach.call(el.children, function(node) {
				node.remove()
			})
		}
		selector = selector||{};
		
		self = selector;
        selector.el = selector._element__ = el
	    el.selector = el.palette = selector;
		
		props = selector.__definedProperties__||(selector.__definedProperties__ = {});
		
		if (!selector.__CLASS__ && !(selector.mouseBorder
				|| selector.mouseBorderBar
				|| selector.updateUI
				|| selector.setValueMode) ) {
		  setProps(selector, props);
		  setMethods(selector);
	    }
		
		x = settings.dataType||settings.valueType;		
		if (x) {
			selector.dataType = x === 'hex' ? 'string' : x === 'rgb' || x === 'hsb' ? 'object' : x;
		}
		
		x = settings.valueMode||settings.mode||x;
		if (!x) {
			selector.setValueMode(x);
		}
      

      
      addCssClass(el, 'SereniX-color-selector SereniX-gradient-color-selector')

      var rightBar = $el('div')
      addCssClass(rightBar, 'color-selector-right-bar')
      var rightBarPicker = $el('div')
      addCssClass(rightBarPicker, 'color-selector-right-bar-selector')

      rightBar.appendChild(rightBarPicker)

      var colorBlock;
	  var outerColorBlock;
	  var outerColorIndex;
	  if (colorIndex === false) {
		  colorIndex = undefined;
	  } else if (colorIndex === true) {
		  colorIndex = $el('div');
	  } else {
		  outerColorIndex = true;
	  }
	  
	  if (valueEl) {
		  colorBlock = valueEl;
		  outerColorBlock = true;
	  } else {
		colorBlock = valueEl = $el('div')
	  }
	  
	  if (colorIndex)
		  addCssClass(colorIndex, 'color-index');
	  if (valueEl)
		  addCssClass(valueEl, 'color-value');
      
	  var colorPane;
	  if (outerColorBlock) {
		  if (!outerColorIndex) {
			  colorPane = colorIndex;
		  }
	  } else if (outerColorIndex) {
		  colorPane = colBlock;
	  } else if (valueEl && colorIndex) {
		  colorPane = $el('div')
		  colorPane.appendChild(colorBlock);
		  colorPane.appendChild(colorIndex);
		  addCssClass(colorPane, 'color-pane');
	  } else {
		  colorPane = colorBlock;
	  }
	  addCssClass(colorPane, 'color-selector-color-block')
      var gradientColor = $el('div')
	  gradientColor._colorBlock = colorBlock;
	  gradientColor._colorIndex = colorIndex;
	  gradientColor._colorPane = colorPane;
      addCssClass(gradientColor,
        'color-selector-gradients color-selector-gradient-color')
	  
      var gradientBlack = $el('div')
      addCssClass(gradientBlack,
        'color-selector-gradients color-selector-gradient-black')

      gradientColor.style.background =
        'linear-gradient(to right,#FFFFFF,#FF0000)'

      var gradientCircle = $el('div')
      addCssClass(gradientCircle, 'color-selector-circle')

      gradientBlack.appendChild(gradientCircle)

      var textInput = $el('input')
      var textInputBox = $el('div')
      addCssClass(textInputBox, 'color-selector-input')
      textInput.maxLength = 6
      textInput.style.width = '100%'
      textInput.style.height = '100%'
      textInput.type = 'text'
      textInputBox.appendChild(textInput)

      el.appendChild(rightBar)
      if (colorPane)
		  el.appendChild(colorPane)
      el.appendChild(textInputBox)
      el.appendChild(gradientColor)
      el.appendChild(gradientBlack)

      addEvt('change', textInput, function(ev) {
		  var sel = this.selector;
		  var lastVal = this._lastValue;
          sel.setValue(textInput.value, true)
          sel.fireChange(ev, textInput, sel, lastVal)
          sel.updateUI()
      });
	  
	  addEvt('mousemove', gradientBlack, handleGradientColorMouseOver);
	  addEvt('mouseleave', gradientBlack, handleGradientColorMouseLeave);

      selector.textInput = textInput
      selector._gradientBlack = gradientBlack
      selector._gradientColor = gradientColor
      selector._rightBar = rightBar
      selector._rightBarPicker = rightBarPicker
      selector._colorBlock = colorBlock
	  selector._colorIndex = colorIndex;
	  selector._colorPane = colorPane;
	  
	  gradientBlack.selector = gradientColor.selector= 
					textInput.selector = rightBar.selector = 
					rightBarPicker.selector = colorBlock.selector = selector;

      selector._gradientCircle = gradientCircle

      selector._height = 0
      selector._mouseX = 0
      selector._mouseY = 0

      selector.setValue(value, true)
      selector._lastValue = selector.value
      selector.updateUI()
      //selector.input = input
	  
	  function handleGradientColorMouseOver(ev) {
		var selector = this.selector;
		var x, y, bbox;
		if (selector._colorIndex) {
			bbox = self._gradientBlack.getBoundingClientRect()
			x = ev.clientX - bbox.left
			y = ev.clientY - bbox.top
			selector._colorIndex.style.background = '#' + rgbToHex(selector.getRgbAt(x, y));
		}
	  }
	  
	  function handleGradientColorMouseLeave(ev) {
		var selector = this.selector;
		if (selector._colorIndex) {
			selector._colorIndex.style.background = '';
		}
	  }

      function handleMouseMove(ev) {
		var sel = this.selector;
		if (sel) {
			currentSel = sel;
		} else
			sel = currentSel;
        window.addEventListener('mouseup', function handleMouseUp() {
          currentSel.getElement().style.userSelect = 'text'
          window.removeEventListener('mousemove', handleMouseMove)
          window.removeEventListener('mouseup', handleMouseUp)
        })
        var bbox = self._gradientBlack.getBoundingClientRect()
        sel._mouseX = ev.clientX - bbox.left // * (p.width / bbox.width)
        sel._mouseY = ev.clientY - bbox.top // * (p.height / bbox.height)
        sel.mouseBorder()
        sel.setValue(
          xyAndBarCursorPosToRgb(sel.position.x, sel.position.y, sel.height)
        )
        sel.updateUI()
		console.log('mousemove');
      }
      function handleBarMouseMove(ev) {
		var sel = this.selector;
		if (!sel) 
			sel = currentSel;
        window.addEventListener('mouseup', function mouseUpFunBar() {
          currentSel.getElement().style.userSelect = 'text'
          window.removeEventListener('mousemove', handleBarMouseMove)
          window.removeEventListener('mouseup', mouseUpFunBar)
        })
        var bbox = sel._rightBar.getBoundingClientRect()
        sel._height = ev.clientY - bbox.top // * (p.height / bbox.height)
        sel.mouseBorderBar()
        sel.setValue(
          xyAndBarCursorPosToRgb(sel.position.x, sel.position.y, sel.height)
        )
        sel.updateUI()
      }
      addEvt('mousedown', selector._gradientBlack, function(ev) {
		  var sel = this.selector;
        sel.getElement().style.userSelect = 'none'
        handleMouseMove.call(this, ev)
		currentSel = sel;
        window.addEventListener('mousemove', handleMouseMove)
      })
      addEvt('mousedown', selector._rightBar, function(ev) {
		  var sel = this.selector;
        sel.getElement().style.userSelect = 'none'
        handleBarMouseMove.call(this, ev)
		currentSel = sel;
        window.addEventListener('mousemove', handleBarMouseMove)
      })

      if ('ontouchstart' in window) {
        function handleTouch(ev) {
			var sel = this.selector;
          var bbox = thisClass._gradientBlack.getBoundingClientRect()
		  
		  preventDefault(ev = ev||window.event)
          ev = ev.touches[0]
		  
          sel._mouseX = ev.clientX - bbox.left // * (p.width / bbox.width)
          sel._mouseY = ev.clientY - bbox.top // * (p.height / bbox.height)
          sel.mouseBorder()
          sel.setValue(
            xyAndBarCursorPosToRgb(sel.position.x, sel.position.y, sel.height)
          )
          sel.updateUI()
        }
        function handleRightBarTouch(ev) {
			var sel = this.selector;
			var bbox = sel._rightBar.getBoundingClientRect()
          preventDefault(ev=ev||window.event)
          ev = ev.touches[0]
          sel._height = ev.clientY - bbox.top // * (p.height / bbox.height)
          sel.mouseBorderBar()
          sel.setValue(
            xyAndBarCursorPosToRgb(sel.position.x, sel.position.y, sel.height)
          )
          sel.updateUI()
        }
        addEvt('touchmove', selector._gradientBlack, handleTouch)
        addEvt('touchstart', selector._gradientBlack, handleTouch)
        addEvt('touchmove', selector._rightBar, handleRightBarTouch)
        addEvt('touchstart', selector._rightBar, handleRightBarTouch)
      }
	  
	  function addChangeHandler(onChange) {
		  if (typeof onChange === 'function') {
			 selector._changeHandlers = [onChange];
		  } else if (isPlainObj(onChange)) {
			  var handlers = ['handle', 'exec', 'fire', 'process', 'change'];
			  var i = 0, n = handlers.length;
			  var fn, name, handle;
			  for (; i < n; i++) {
				  fn = onChange[name=handlers[i]];
				  if (typeof fn  === 'function' || fn instanceof Function) {
					  handle = function handleChange(ev) {
						  handle.fn.call(handle._own, ev, this.selector);
					  }
					  handle.fn = fn;
					  handle._own = onChange;
					  selector._changeHandlers = [handle];
					  break;
				  }
			  }
		  }
	  }
	  
	  if (isArray(onChange)) {
		onChange.forEach(function(oc) {
			addChangeHandler(oc);
		});
	  } else if (onChange) {
		  addChangeHandler(onChange);
	  } else {
		selector._changeHandlers = [];
	  }
	  
	  el.getValue = function(mode) {
		  return this.selector.getValue(mode);
	  };
	  
	  el.setValue = function(val, resetPosition) {
		  this.selector.setValue(val, resetPosition);
		  return this;
	  };
	  defProp(el, 'value', el.getValue, el.setValue);
	  
	  defProp(el, 'color', el.getValue, el.setValue).alias = 'value';
	  
	  el.component = el._component_ = el.__component__ = selector;
	  var c, t;
	  var x = settings.className||settings.styleClass||settings.styleName||settings.cssName;
	  
	  if (x) {
		  addCssClass(el, x);
	  }
	  
	  var styl = settings.style||settings.css;
	  var w, h, len;
	  if (styl instanceof String)
		  styl = styl.valueOf();
	  if ((t = typeof styl) === 'object' && styl) {
		  w = _length(styl.width == undefined ? styl.size : styl.width);
		  h = _length(styl.height == undefined ? styl.size : styl.height);
		  if (w) {
			  el.style.width = w;
			  if (!h)
				h = w;
			  el.style.height = h;
		  } else if (h) {
			  el.style.width = el.style.height = h;
		  }
		  
		  len = _length(styl.minWidth);
		  if (len) {
			  el.style.minWidth = len;
		  }
		  len = _length(styl.minHeight);
		  if (len) {
			  el.style.minHeight = len;
		  }
		  
		  x = styl.position||settings.position;
		  if (typeof x === 'string')
			  el.style.position = x;
		  x = styl.display||settings.display;
		  if (typeof x === 'string')
			  el.style.display = x;
		  
	  } else if (t === 'string' && styl) {
		  el.style = styl;
	  } else {
		  if ((x = settings.position)) {
			  el.style = x;
		  }
		  
		  if ((x = settings.display)) {
			  el.display = x;
		  }
	  }
	  
	  x = settings.container||settings.appendTo||settings.parentElement||settings.parentEl||settings.parent;
	  if (x instanceof String) {
		  x = x.valueOf();
	  }
	  if (isDOMElt(x)) {
		  x.appendChild(el);
	  } else if (typeof x === 'string' && x) {
		  c = document.getElementById(x);
		  if (c) {
			  c.appendChild(el);
		  } else {
			  throw new Error('HTML element not found: ' + x);
		  }
	  }
	  
	    if (el.id) {
			if (CPB) CPB.register(el);
            colorPalettes[el.id] = el;
        }
		
		if (cpName) {
			if (CPB) CPB.register(el, cpName);
            colorPalettes[cpName] = el;
        }
	  
	  return el;
    }
	
	function _length(w) {
		if (w == undefined)
			return;
		var t, m;
		if (w instanceof String || w instanceof Number) {
		  w = w.valueOf();
		}
		if ((t = typeof w) === 'number') {
			return w + 'px';
		}
		if (t === 'string') {
			if ((m=/\[-]?\d+(?:\.\d+)(px|pt|pc|mm|cm|mozmm|Q|in|em|ex|ch|rem|lh|vw|vh|vmin|vmax|%)?/.exec(w))) {
				return m[1] ? w : w + 'px';
			}
		}
		throw new Error('Incorrect color selector\'s length: ' + w);
	}
	
	/**
	 * Adds or updates useful methods to selector's object
	 * @name SereniX.ui.createGradientColorPalette.setMethods
	 * @function
	 * @param {Object} selector
	 */
	createGradientColorPalette.setMethods = setMethods;
	/**
	 * 
	 * Adds or updates useful properties to selector's object
	 * @name SereniX.ui.createGradientColorPalette.setProps
	 * @function
	 * @param {Object} selector
	 * @param {Object} [props]
	 */
	createGradientColorPalette.setProps = setProps;
	
	createGradientColorPalette.__FUNCTION_NAME__ = createGradientColorPalette;
	
	createGradientColorPalette.__FUNCTION__ = createGradientColorPalette;
	
	
	return createGradientColorPalette;
	
});

if (typeof SereniX === 'undefined') {
	globalNS.SereniX = { ui: {createGradientColorPalette: createGradientColorPalette}};
} else if (SereniX.Namespace && typeof SereniX.Namespace.ns === 'function') {
	SereniX.Namespace.ns('SereniX.ui').addChild(createGradientColorPalette);
} else
	(SereniX.ui||(SereniX.ui={})).createGradientColorPalette = createGradientColorPalette;

SereniX.ui.createGradientColorSelector = createGradientColorPalette;

createGradientColorPalette.__ALIAS_NAME__ = 'createGradientColorSelector';