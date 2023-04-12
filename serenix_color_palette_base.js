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

if (typeof SereniX === 'undefined') {
	SereniX = { ui: {}};
} else if (!SereniX.ui) {
	if (typeof SereniX.Namespace === 'function' 
			&& typeof SereniX.Namespace.ns === 'function') {
		SereniX.Namespace.ns('SereniX.ui');
	} else {
		SereniX.ui = {};
	}
}


 
 ;(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }    
})(this, 'ColorPaletteBase', function() {
	
	var ua = window.navigator.userAgent,
		isIE = ua.indexOf("MSIE ") > 0,
		_ie = isIE?'-ie':'';
	
	var doc = document;
	
	var blockTitleTag = 'h3';
	
	var blockTitleClass = 'block-title';
	
	var chevrons = {
		'bottom': '<svg xmlns="http://www.w3.org/2000/svg" style="fill:#030104;" viewBox="0 0 32 32" xml:space="preserve" class="icon icon-chevron-bottom" aria-hidden="true"><path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"/></svg>',
		/**
		 * Identical to bottom
		 * @type String
		 */
		'down': '<svg xmlns="http://www.w3.org/2000/svg" style="fill:#030104;" viewBox="0 0 32 32" xml:space="preserve" class="icon icon-chevron-bottom" aria-hidden="true"><path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z"/></svg>',
		'left': '<svg xmlns="http://www.w3.org/2000/svg" style="fill:#030104;" viewBox="0 0 32 32" xml:space="preserve" class="icon icon-chevron-left" aria-hidden="true"><path d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z"/></svg>',
		'right': '<svg xmlns="http://www.w3.org/2000/svg" style="fill:#030104;" viewBox="0 0 32 32" xml:space="preserve" class="icon icon-chevron-right" aria-hidden="true"><path d="M18.629 15.997l-7.083-7.081L13.462 7l8.997 8.997L13.457 25l-1.916-1.916z"/></svg>',
		'top': '<svg xmlns="http://www.w3.org/2000/svg" style="fill:#030104;" viewBox="0 0 32 32" xml:space="preserve" class="icon icon-chevron-top" aria-hidden="true"><path style="fill:#030104;" d="M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"/></svg>',
		/**
		 * Identical to top
		 * @type String
		 */
		'up': '<svg xmlns="http://www.w3.org/2000/svg" style="fill:#030104;" viewBox="0 0 32 32" xml:space="preserve" class="icon icon-chevron-top" aria-hidden="true"><path style="fill:#030104;" d="M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z"/></svg>'
	}
	
	function $el(tag) {
		return doc.createElement(tag);
	}
		
	var forEach = Array.prototype.forEach;
	
	var colorPalettes = {};
	
	var ui = SereniX.ui;
	
	var transparentColor = 'rgba(0,0,0,0)';	
	
	function ColorPaletteBase() {}
	
	var CPB = ColorPaletteBase;
	
	CPB.__CLASS_NAME__ = 'ColorPaletteBase';
	CPB.__CLASS__ = CPB;
	
	CPB.historyMaxItems = 18;
	CPB.historyData = [];
	
	
	var webColors = [];
	
	var webHexagonColors=[
			['003366','336699','3366cc','003399','000099','0000cc','000066'],
			['006666','006699','0099cc','0066cc','0033cc','0000ff','3333ff','333399'],
			['669999','009999','33cccc','00ccff','0099ff','0066ff','3366ff','3333cc','666699'],
			['339966','00cc99','00ffcc','00ffff','33ccff','3399ff','6699ff','6666ff','6600ff','6600cc'],
			['339933','00cc66','00ff99','66ffcc','66ffff','66ccff','99ccff','9999ff','9966ff','9933ff','9900ff'],
			['006600','00cc00','00ff00','66ff99','99ffcc','ccffff','ccccff','cc99ff','cc66ff','cc33ff','cc00ff','9900cc'],
			['003300','009933','33cc33','66ff66','99ff99','ccffcc','ffffff','ffccff','ff99ff','ff66ff','ff00ff','cc00cc','660066'],
			['333300','009900','66ff33','99ff66','ccff99','ffffcc','ffcccc','ff99cc','ff66cc','ff33cc','cc0099','993399'],
			['336600','669900','99ff33','ccff66','ffff99','ffcc99','ff9999','ff6699','ff3399','cc3399','990099'],
			['666633','99cc00','ccff33','ffff66','ffcc66','ff9966','ff6666','ff0066','d60094','993366'],
			['a58800','cccc00','ffff00','ffcc00','ff9933','ff6600','ff0033','cc0066','660033'],
			['996633','cc9900','ff9900','cc6600','ff3300','ff0000','cc0000','990033'],
			['663300','996600','cc3300','993300','990000','800000','993333']
		];
		
		
		
	
	// default rgb values of colors
	CPB.DEFAULT_RGB_COLORS = [
            "0,0,0", "68,68,68", "102,102,102", "153,153,153", "204,204,204", "238,238,238", "243,243,243", "255,255,255",
            null,
            "255,0,0", "255,153,0", "255,255,0", "0,255,0", "0,255,255", "0,0,255", "153,0,255", "255,0,255",
            null,
            "244,204,204", "252,229,205", "255,242,204", "217,234,211", "208,224,227", "207,226,243", "217,210,233", "234,209,220",
            "234,153,153", "249,203,156", "255,229,153", "182,215,168", "162,196,201", "159,197,232", "180,167,214", "213,166,189",
            "224,102,102", "246,178,107", "255,217,102", "147,196,125", "118,165,175", "111,168,220", "142,124,195", "194,123,160",
            "204,0,0", "230,145,56", "241,194,50", "106,168,79", "69,129,142", "61,133,198", "103,78,167", "166,77,121",
            "153,0,0", "180,95,6", "191,144,0", "56,118,29", "19,79,92", "11,83,148", "53,28,117", "116,27,71",
            "102,0,0", "120,63,4", "127,96,0", "39,78,19", "12,52,61", "7,55,99", "32,18,77", "76,17,48"
    ];
	
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
	
	function isHexagonArray(arr) {
		var n = arr.length;
		var middle = (n-1)/2;
		if (Math.floor(middle) !== middle)
			return false;
		var	max = arr[middle].length;
		
		for (var j = 1; j <= middle; j++) {
			if (!isArray(arr[middle+j]) 
				|| arr[middle+j].length !== max - j 
				|| !isArray(arr[middle-j])
				|| arr[middle-j].length !== max - j) {
				return false;
			}
		}
		return true;
	}
	
	webHexagonColors.forEach(function(colors) {
		colors.forEach(function(c) {
			webColors.push(c);
		});
	});
	
	CPB.setProps = function setProps(selector, props) {
		props = props||{};
		defProp(selector, 'value', function() {
		  return this.getValue()
		},
		function(value) {
		  this.setValue(value, true)
		  this.updateUI()
		}, props);
		//colorLabelFormat
		defProp(selector, 'colorLabelFormat', function() {
		  return this.getColorLabelFormat()
		},
		function(fmt) {
		  this.setColorLabelFormat(fmt)
		}, props);
	}
	
	CPB.setElement = function setElement(el, selector) {
		el.getValue = function(mode) {
		  return this.selector.getValue(mode);
	    };
	  
	    el.setValue = function(val, resetPosition) {
		  this.selector.setValue(val, resetPosition);
		  return this;
	    };
	    defProp(el, 'value', el.getValue, el.setValue);
	  
	    defProp(el, 'color', el.getValue, el.setValue).alias = 'value';
	  
	    el.component = el._component_ = el.__component__ = selector||el.selector;
	}
    CPB.setMethods = function setColorPaletterBaseMethods(selector) {
		selector.fireChange = function(ev, target) {
			var self = this;
			ev = ev||window.event;
			if (!ev)
				return;
			ev.eventType = 'change';
			ev.selector = this;
			ev.fireTimestamp = ev.fireTimeStamp = (new Date()).getTime();
		  (this._changeHandlers||[]).forEach(function(fn) {
			fn.call(target, ev, ev.selector);
		  })
		}
		/**
		 *
		 * @param {String} type  type is "change"
		 * @param {function} fn
		 */
		selector.addEventListener = function(type, fn) {
		  if (typeof fn !== 'function') {
			return
		  }
		  switch (type) {
			case 'change': {
			  (this._changeHandlers||(this._changeHandlers=[])).push(fn)
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
		/**
		 * 
		 * @param {String} [mode]
		 * @returns {String|Object}
		 */
		selector.getValue = selector.getValue||function(mode) {
			if (!this.__value_)
				return;
			var transparent = this.__value_ === 'transparent';
		    switch (mode||this.getValueMode()||'value') {
				case 'hex': {
				  return transparent ? '' : this.__value_
				}
				case 'rgb': {
				  return transparent ? {} : hexToRgb(this.getValue('hex'))
				}
				case 'hsb': {
				  return transparent ? {} : rgbToHsb(toRgb(this.__value_))
				}
				case 'hsl': {
				  return transparent ? {} : rgbToHsl(this.getValue('hex'))
				}
				case 'hwb': {
				  return transparent ? {} : rgbToHwb(this.getValue('hex'))
				}
				case 'cmyk': {
				  return transparent ? {} : rgbToCmyk(toRgb(this.__value_))
				}
				case 'value':
				default: {
				  return transparent ? 'transparent' : 
					(this.__value_[0] !== '#' ? '#' : '') + this.__value_
				}
		    }
		}
		
		selector.setColorLabelFormat = function(fmt) {
			if (typeof fmt === 'string' || typeof fmt === 'function') {
				this.__colorLabelFormat_ = fmt;
				return this;
			}
			throw new Error('Incorrect argument');
		}
		selector.getColorLabelFormat = function() {
			return this.__colorLabelFormat_;
		}
		/**
		 * Returns the string representation of the given format that corresponds to the value of this.colorLabelFormat
		 * @param {String|Object|Array} color
		 * @returns {String}
		 */
		selector.formatColor = function(color) {
			var fmt = this.__colorLabelFormat_||'hex-value';
			var U;
			if (typeof fmt === 'function') {
				return this.__colorLabelFormat_(color, this);
			}
			U = SereniX.CssColorUtils;
			switch(fmt) {
				case 'value':
					if (color === 'transparent')
						return 'transparent'
					break;
				case 'hex-value':
					if (color === 'transparent')
						return ''
					return U.toHexValue(color);
				case 'hex':
					return U.toHexString(color);
				case 'rgb':
					if (color === 'transparent')
						return ''
					return U.toRbgString(color);
				case 'rgba':
					return U.toRbgaString(color);
				case 'hsl':
					return U.toHslString(color);
				case 'hsla':
					return U.toHslaString(color);
				case 'hsb':
					return U.toHsbString(color);
				case 'hsba':
					return U.toHsbaString(color);
				case 'hsv':
					return U.toHsvString(color);
				case 'hsva':
					return U.toHsvaString(color);;
				case 'hwb':
					return U.toHwbString(color);
				case 'name':
					return U.getColorName(color, this.namingColorSystem||this.colorNamingSystem||this.colorNames);
				case 'cmyk':
					return U.toCmykString(color);
			}
			
		}
		
		
		
		function toRgb(val) {
			if (val instanceof String) {
				val = val.valueOf();
			}
			if (typeof val === 'string') {
				if (val === 'transparent')
					return {};
				if (val[0] === '#')
					return hexToRgb(val);
				if (/^\d/.test(value)) {
				  return hexToRgb('#' + val);
				} else if (match = /^rgb(a)?\(([^\(\)]+)\)$/.exec(value)) {
					tokenize(match);
					if (a) {
						return rgbaToRgb(match[0], match[1], match[2], match[3]);
					} else {
						return { 
							r: parseInt(match[0], 10),
							g: parseInt(match[1], 10),
							b: parseInt(match[2], 10)
						};
					}
				} else if (match = /^hsl(a)?\(([^\(\)]+)\)$/.exec(value)) {
					tokenize(match);
					if (a) {
						return rgbaToRgb(hslaToRgba(match[0], match[1], match[2], match[3]));
					} else {
						return hslToRgb(match[0], match[1], match[2]);
					}
				} else if (match = /^hsv(a)?\(([^\(\)]+)\)$/.exec(value)) {
					tokenize(match);
					throw new Error('Not yet supported');
				} else if (match = /^hsb(a)?\(([^\(\)]+)\)$/.exec(value)) {
					tokenize(match);
					if (a) {
						throw new Error('Not yet supported');
					} else {
						return hsbToRgb(match[0], match[1], match[2]);
					}
				} else {
					var c;
					var ncs = this.hexFromColorName||this.namingColorSystem||this.colorNamingSystem;
					if (typeof ncs === 'function' || ncs instanceof Function) {
						c = ncs(value);
					} else if (!(isPlainObj(ncs) && (c = ncs[value]))) {
						
						if (U) {
							c = U.NATIVE_NAME_COLORS[value];
						}
						if (!c) {
							throw new Error('Incorrect color string value: ' + value);
						}
					}
					return toRgb(c);
					
				}
			}
		}
		/**
		 * 
		 * @name selector.setValue
		 * @param {String|Object|Array} color 
		 * @param {Boolean} [resetPosition]
		 * @returns {Object}
		 */
		selector.setValue = selector.setValue||function(value, resetPosition) {
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
		  var U = SereniX.ColorUtils
		  var rgb, v
		  var msg = 'Incorrect color string value';
		  
		  if (value == undefined)
			value = resetPosition = false;
		  if (value instanceof String)
			  value = value.valueOf();
		  if (value === 'transparent') {
			  if (!this.allowTransparentColor) {
				  throw new Error(msg + ': ' + value);
			  }
			  v = value;
		  } else {
			  switch (typeof value) {
				case 'string': {
					if (/^(#|\d)/.test(value)) {
					  processHexColor(value);
					} else if (match = /^rgb(a)?\(([^\(\)]+)\)$/.exec(value)) {
						tokenize(match);
						if (a) {
							hex = arrayRgbToHex(rgbaToRgb(match[0], match[1], match[2], match[3]));
						} else {
							hex = rgbToHex(match[0], match[1], match[2]);
						}
					} else if (match = /^hsl(a)?\(([^\(\)]+)\)$/.exec(value)) {
						tokenize(match);
						if (a) {
							hex = arrayRgbToHex(rgbaToRgb(hslaToRgba(match[0], match[1], match[2], match[3])));
						} else {
							hex = arrayRgbToHex(hslToRgb(match[0], match[1], match[2]));
						}
					} else if (match = /^hsv(a)?\(([^\(\)]+)\)$/.exec(value)) {
						tokenize(match);
						throw new Error('Not yet supported');
					} else if (match = /^hsb(a)?\(([^\(\)]+)\)$/.exec(value)) {
						tokenize(match);
						throw new Error('Not yet supported');
					} else {
						var c;
						var ncs = this.hexFromColorName||this.namingColorSystem||this.colorNamingSystem;
						if (typeof ncs === 'function' || ncs instanceof Function) {
							c = ncs(value);
						} else if (!(isPlainObj(ncs) && (c = ncs[value]))) {
							
							if (U) {
								c = U.NATIVE_NAME_COLORS[value];
							}
							if (!c) {
								throw new Error(msg + ': ' + value);
							}
						}
						processHexColor(c);
						
					}
					break
				}
				case 'object': {
				  hex = rgbToHex(value)
				}
			  }
			  
			  try {
				rgb = hexToRgb(hex)
			  } catch (err) {
				rgb = {
				  r: 255,
				  g: 255,
				  b: 255
				}
			  }
			  v = rgbToHex(rgb).toUpperCase()
			  if (v && v[0]  != '#')
				  v = '#' + v;
		  }
		  this.__value_ = v;
		  syncVal(this, v);
		  if (resetPosition) {
			var hsb = rgbToHsb(hex)
			var h = hsb.h, s = hsb.s, b = hsb.b
			this._height = 1 - h / 360
			if (h === 0) this._height = 0
			this._mouseX = s
			this._mouseY = 1 - b
		  } else {
			if (this._lastValue !== this.value) {
			  this.fireChange()
			}
		  }
		  this._lastValue = this.__value_
		  
		  return this;
		}
		/**
		 * @return {HTMLDivElement}
		 */
		selector.getDOM = function() {
		  return this._element__;
		}
		selector.getBrightness = function() {
		  var rgb = this.getValue('rgb')
		  return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b
		}
		
		selector.syncVal = function() {
			syncVal(this, this.__value_);
		}
	}
	
	function _getFormattedText(formattedVal, val, selector) {
		return formattedVal||(val === 'transparent' ? getTransparentText(selector) : '')
	}
	
	function syncVal(selector, v) {
		
		var val = selector.__value_;
		if (selector.textInput)
			  selector.textInput.value = val
		  if (selector._colorBlock) {
			  if (val === 'transparent') {
				selector._colorBlock.style.backgroundColor = '';
				addCssClass(selector._colorBlock, transparentColorClass);
			  } else {
				removeClass(selector._colorBlock, transparentColorClass);
				selector._colorBlock.style.backgroundColor = val
			  }
			  if (selector._colorBlock.label) {
				  selector._colorBlock.label.innerHTML = _getFormattedText(selector.formatColor(val), val, selector)
			  }
		  } else if (selector._colorBox)
			  selector._colorBox.style.backgroundColor = val
		  if (selector._colorBlockLabel) {
			  selector._colorBlockLabel.innerHTML = _getFormattedText(selector.formatColor(val), val, selector)
		  }
	}
	
	CPB.syncVal = syncVal;
	
	CPB.transparentColor = transparentColor;
	
	CPB.webHexagonColors = webHexagonColors;
	CPB.webColors = webColors;
	
	var GTCP = SereniX.ui.GridThemeColorPalette;
	if (GTCP) {	
	    
		CPB.baseThemeColors = GTCP.baseThemeColors;
		CPB.standardColors = GTCP.standardColors;
		
		GTCP.webHexagonColors = webHexagonColors;
	    GTCP.webColors = CPB.webColors;
		GTCP.transparentColor = transparentColor;
	}
	
	function toHex(i) {
		var h=i.toString(16);
		if(h.length==1){
			h='0'+h;
		}
		return h;
	}
	
	CPB.toHex = toHex;
	
	function grayHex(ubyte){
		var h=toHex(ubyte);
		return h+h+h;
	}
	
	CPB.grayHex = grayHex;
	
	CPB.drawGrayScaleColors = function(className, tableClass) {
		var oTd='<td class="color-cell gray-color-cell" style="background-color:#',
			cTd=isIE?'"><div style="width:5px;"></div></td>':'"><span></span></td>',
			tblRow='<table class="' + (tableClass ? tableClass : 'gray-scale-palette') +_ie+'"><tr>',
			closeTbl='</tr></table>';
		// gray scale colors
		var h2='';
		var h= '<div' + (className ? ' class="' + className + '"' : '') + '>' + tblRow;
		for(i=255;i>10;i-=10){
			h+=oTd+grayHex(i)+cTd;
			i-=10;
			h2+=oTd+grayHex(i)+cTd;
		}
		h+=closeTbl+tblRow+h2+closeTbl+'</div>';
		return h;
	}
	
	CPB.isHexagonArray = isHexagonArray;
	
	function getColorValue(cEl) {
		return hasClass(cEl, 'SereniX-color-transparent') || hasClass(cEl, 'SereniX-color-transparent-bg') ?
				'transparent' : 
				cEl._bgColoredEl ? cEl._bgColoredEl.style.backgroundColor :
				cEl.style.backgroundColor;
	}
	
	CPB.getColorValue = getColorValue;
	
	function fireAction(selector, ev, self) {
		preventDefault(ev=ev||window.event);
		var oldHexVal = selector.getValue('hex'),
			hexVal, 
			oldVal,
			val,
			color;
		
		oldVal = val;
		//'this' object represents the target color cell
		color =  getColorValue(this);
		selector.setValue(color, this);
		if (selector._history) {
			selector._history.push(color);
		}
		var valueChanged = oldHexVal !== (hexVal = selector.getValue('hex'));
		if (selector.fireChange 
				&& valueChanged && ev) {
			ev.oldValue = oldVal;
			ev.value = oldVal;
			ev.oldHexValue = oldHexVal;
			ev.hexValue = hexVal;
			ev.selector = selector;
			ev.colorPane = ev.cp = this.cp;
			ev.colorCell = ev.cell = this;
			selector.fireChange(ev, this);
		}
	}
	
	function _getItemColor(el) {
		return (el._bgColoredEl||el).style.backgroundColor;
	}
	
	function handleColorMouseOver(ev) {
		var selector = this.selector||this.selectorEl.selector;
		var color = _getItemColor(this)
		if (selector._colorIndex) {
			selector._colorIndex.style.backgroundColor = color;
			if (selector._colorIndex.label) {
				selector._colorIndex.label.innerHTML = _getFormattedText(selector.formatColor(color), color, selector)
			}
		}
		if (selector._colorIndexLabel) {
			selector._colorIndexLabel.innerHTML = selector.formatColor(color)
		}
	}
	
	function handleColorMouseLeave(ev) {
		var selector = this.selector||this.selectorEl.selector;
		if (selector._colorIndex) {
			selector._colorIndex.style.backgroundColor = '';
			if (selector._colorIndex.label) {
				selector._colorIndex.label.innerHTML = ''
			}
		}
		if (selector._colorIndexLabel) {
			selector._colorIndexLabel.innerHTML = ''
		}
	}
	
	function handleColorCellClick(ev) {
		var selector = this.selector||this.selectorEl.selector;
		if ((selector.editable != undefined && !selector.editable) || selector.disabled) {
			return;
		}
		fireAction.call(this, selector, ev, this);
	}
	function handleColorCellKeyEvent(ev) {
		var selector = this.selector||this.selectorEl.selector;
		var which = (ev=ev||window.event).which||ev.keyCode;
		if (!selector.editable || selector.disabled) {
			return;
		}
		if (which === 13) {
			fireAction.call(this, selector, ev, this);
		}
		
	}
	
	function handleColorCellMouseLeave(ev) {
		var selector = this.selector||this.selectorEl.selector;
		preventDefault(ev=ev||window.event);
		if (selector.disabled) {
			return;
		}
		handleColorMouseLeave.call(this, ev);
	}
	
	function handleColorCellMouseOver(ev) {
		var selector = this.selector||this.selectorEl.selector;
		preventDefault(ev=ev||window.event);
		if (selector.disabled) {
			return;
		}
		handleColorMouseOver.call(this, ev);
	}
	
	function bindColorCell(cc) {
		addEvt('click', cc, handleColorCellClick);
		addEvt('keydown', cc, handleColorCellKeyEvent);
		addEvt('mouseover', cc, handleColorCellMouseOver);
		
		addEvt('mouseleave', cc, handleColorCellMouseLeave);
	}
	
	CPB.bindColorCell = bindColorCell;
	
	function unbindColorCell(cc) {
		removeEvt('click', cc, handleColorCellClick);
		removeEvt('keydown', cc, handleColorCellKeyEvent);
		removeEvt('mouseover', cc, handleColorCellMouseOver);
		
		removeEvt('mouseleave', cc, handleColorCellMouseLeave);
	}
	
	CPB.unbindColorCell = unbindColorCell;
	
	function bindColorCellEvents(el, itemClass) {
		if (el.id) {
			ColorPaletteBase.register(el);
        }
		forEach.call(el.getElementsByClassName(itemClass||'color-cell'), function (cc) {
			var content;
			var cls = colorClass(cc);
			var sel = el.selector;
			if (cls) {
				addCssClass(cc, cls);
			}
			cc.selector = sel;
			cc.selectorEl = cc.cp = cc.colorPalette = cc.palette = el;	

			if (hasClass(cc, 'selected')) {
				//TODO: synchronize display elements and fire a virtual change events
				sel.currentCell = cc;
				if (typeof sel.getSelectionContent === 'function') {
					content = sel.getSelectionContent(cc.style.backgroundColor);
				} else if (typeof (content = sel.selectionContent) === 'function') {
					content = sel.selectionContent(cc.style.backgroundColor);
				}
				if (typeof content === 'string') {
					cc.innerHTML = content;
				} else {
					cc.appendChild(content);
				}
				cc.tabIndex = 0;
			}
			var x = cc.getAttribute('data-entry-key');
			if (x) {
				cc.subColorsMap = el.subColorsMap;
			}
			
			bindColorCell(cc)
		})
		
		forEach.call(el.getElementsByClassName('extra-color-cell'), function (cc) {
			bindColorCell(cc)
		})
		
		forEach.call(el.getElementsByClassName('SereniX-color-transparent'), function (cc) {
			addEvt('mouseover', cc, function(ev) {
				var selector = this.selector;
				if (selector._colorIndex) {
					selector._colorIndex.style.backgroundColor = '';
					addCssClass(selector._colorIndex, 'SereniX-color-transparent-bg');
					selector._colorIndex.style.backgroundImage = "repeating-linear-gradient(135deg,black, black 1px,white 1px,white 3px)";
					if (selector._colorIndex.label) {
						selector._colorIndex.label.innerHTML = getTransparentText(selector);
					}
				}
				if (selector._colorIndexLabel) {
					selector._colorIndexLabel.innerHTML = getTransparentText(selector);
				}
			})
			
			addEvt('mouseleave', cc, function(ev) {
				var selector = this.selector;
				if (selector._colorIndex) {
					removeClass(selector._colorIndex, 'SereniX-color-transparent-bg');
					selector._colorIndex.style.backgroundImage = "";
					if (selector._colorIndex.label) {
						selector._colorIndex.label.innerHTML = ''
					}
				}
				if (selector._colorIndexLabel) {
					selector._colorIndexLabel.innerHTML = ''
				}
			})
			
			addEvt('click', cc, handleColorCellClick)
			
			addEvt('keydown', cc, handleColorCellKeyEvent)
		})
		
		//.SereniX-color-transparent-bg
	}
	
	CPB.bindColorCellEvents = bindColorCellEvents;
	
	
	/**
	 * 
	 * @param {HTMLElement|Object} cp
	 * @param {String} [key]
	 */
	CPB.registerColorPalette = function (cp, key) {
		var x;
		if (typeof cp === 'string') {
			x = cp;
			cp = key;
			key = x;
		}
		if (key) {
			colorPalettes[key] = cp;
		} else {
			if (cp.id) {
				colorPalettes[cp.id] = cp;
			}
		}
	}
	
	CPB.unregisterColorPalette = function (cp) {
		var c, key;
		if (isPlainObj(cp)) {
			cp = cp.id||cp.Id||cp.ID||cp.key;
		}
		
		if ((typeof cp === 'string' && cp) || typeof cp === 'number') {
			c = colorPalettes[cp];
			delete colorPalettes[cp];
			return c;
		}
	}
	
	CPB.register = CPB.registerColorPalette;
	
	CPB.unregister = CPB.unregisterColorPalette;
	/**
	 * Returns registered color palette that corresponds to the given key.
	 * @param {String|Number} key
     * @returns {HTMLElement|Object}
     */	 
	CPB.getColorPalette = function(key) {
		return colorPalettes[cp];
	}
	
	CPB.colorPalettes = colorPalettes;
	
	function colorClass(cell) {
		var c = cell.style.backgroundColor;
		if (!c)
			console.log('No background color');
		if (CssColorUtils) {
			return CssColorUtils.colorClass(c);
		}
	}
	
	function selectColorCell(cell) {
		var sel = cell.selector;
		var curr = sel.currentCell;
		if (curr) {
			if (curr === cell)
				return;
			removeClass(curr, (sel.selectionClass||'selected'));
			curr.removeAttribute('aria-selected');
			curr.innerHTML = '';
			sel.__prevSelectedCell__ = curr;
		}
		addCssClass(cell, (sel.selectionClass||'selected'));
		cell.setAttribute('aria-selected', 'true');
		var scontent, t;
		if (sel.getSelectionContent) {
			scontent = sel.getSelectionContent(cell.style.backgroundColor)
		} else {
			scontent = unboxVal(sel.selectionContent);
			if ((t = typeof scontent) === 'function') {
				scontent = sel.selectionContent(cell.style.backgroundColor)||'';
			}
		}
		if (isDOMElt(scontent)) {
			cell.innerHTML = '';
			cell.appendChild(scontent);
		} else if (scontent) {
			cell.innerHTML = scontent;
		}
		sel.currentCell = cell;
	}
	
	CPB.selectColorCell = selectColorCell;
	
	function newSelector(el) {
		
		var s = {
			_element__: el,
			getElement: function() { return this._element__;},
			getDOM: function() { return this._element__;}
		}
		var prop = {
			name: 'element',
			get: s.getElement,
			set: function(e) {
				throw new Error('Read only property');
			},
			configurable : true,
			enumerable: true
		};
		
		s.__definedProperties__ = { element: prop };
		
		s.__definedPropertiesList__ = [prop];
		
		
		if (el.id) {
			s._id__ = el.id;
			s.getId = function() {
				return this._id__;
			}
			s.setId = function(id) {
				this._id__ = id;
				return this;
			}
			s.__definedPropertiesList__.push(prop = {
				name: 'id',
				get: s.getId,
				set: s.setId,
				configurable : true,
				enumerable: true
			});
			
			s.__definedProperties__.id = prop;
		}
		
		Object.defineProperties(s, s.__definedProperties__);
		
		return s;
	}
	
	CPB.createSelector = CPB.newSelector = newSelector;
	
	CPB.chevrons = chevrons;
	
	var defaultExpandedIcon = CPB.defaultExpandedIcon = chevrons.up;
	var defaultCollapsedIcon = CPB.defaultCollapsedIcon = chevrons.down;
	
	function createHistory(maxColors, data, selector, pagesContainer) {
		
		function _pushRepeat(color, self) {
			var children;
			var cEl = self.__boxes__[color];
			var cp = self.__cp__;
			var arr = self.__boxesList__;
			var self = self;
			var counts = self.__counts__;
			var c;
			if (self.empty) {
				cp.innerHTML = '';
				
				self.empty = false;
			}
			children = cp.children;
			if (typeof self.maxColors === 'number' && (diff = self.data.length - self.maxColors) >= 0) {
				var count = diff + 1;
				self.data.splice(self.data.length - count, count);
				while (diff-- >= 0) {
					cp.removeChild(c = children[children.length - 1]);
					if (counts[c.backgroundColor] === 1) {
						delete counts[c.backgroundColor];
					}
				}
			}
			cEl = createColorBox(color, self);
			counts[color] = (counts[color]||0) + 1;
			self.data.splice(0, 0, color);
			if (children.length)
				cp.insertBefore(cEl, children[0]);
			else
				cp.appendChild(cEl);
		}
		
		function _pushFreq(color, self) {
			var children;
			var cEl = self.__boxes__[color];
			var cp = self.__cp__;
			var arr;
			var counts = self.__counts__;
			var sortOrder = self.sortOrder;
			if (typeof sortOrder === 'string') {
				sortOrder = /^de|rtl|right[-]?to[-]?left/i.test(sortOrder) ? -1 : 1;
			} else {
				sortOrder = sortOrder < 0 ? -1 : 1;
			}
			arr = self.__boxesList__;
			if (self.empty) {
				//Remove empty text
				cp.innerHTML = '';
				
				self.empty = false;
			}
			if (!cEl) {
				if (typeof self.maxColors === 'number' && (diff = self.data.length - self.maxColors) >= 0) {
					self.data.splice(0, diff + 1);
					children = cp.children;
					if (sortOrder < 0) {
						var n = children.length;
						while (diff-- >= 0) {
							cp.removeChild(children[n--]);
						}
					} else {
						while (diff-- >= 0) {
							cp.removeChild(children[0]);
						}
					}
				}
				cEl = createColorBox(color, self);
				counts[color] = 1;
				self.data.push(color);
				if (!arr.length || sortOrder < 0) {
					cp.appendChild(el);
				} else {
					cp.insertBefore(el, arr[0]);
				}
			} else {
				counts[color] = counts[color] + 1;
				var oldChildIndex = arr.indexOf(cEl);					
				arr.sort(function(a, b) {
					return sortOrder*(counts[a.backgroundColor] - counts[b.backgroundColor])
				});
				var newChildIndex = arr.indexOf(cEl);
				if (newChildIndex !== oldChildIndex) {
					cp.innerHTML = '';
					arr.forEach(function(el) {
						cp.appendChild(el);
					});
				}
			}
			return self;
		}
		
		function showPalette(selector, cEl) {
			var layout = selector.historyLayout||'';
			if (/^tab-?collapsible$/.test(layout)) {
				throw new Error('Not yet supported');
			} else if (selector.historyOverlap === 'main') {
				otherView = selector.otherView;
				/*if (!otherView) {
					el = el.parentElement;
				}*/
				selector.selView.style.display = 'block';
				this.pane.style.display = 'none';
				selector.__$$hideView$$__ = selector.selView;
				selector.currentView = otherView;
				otherView.style.display = 'none';
			} else if (selector.historyOverlap === 'part') {
				var selView = selector.selView;
				selView._overlapablePart.style.display = 'block';
				selView._historyPane.style.display = 'none';
				selView.currentPane = selView._historyPane;
				if (selector._colorPane && selector.showDisplaysWhenHistory) {
					selector._colorPane.style.display = 'none';
				}
			}
		}
		
		function createColorBox(color, self) {
			var cEl = $el('div');
			cEl.style.display = 'inline-block';
			if (color === 'transparent') {
				cEl.style.backgroundColor = '';
				addCssClass(cEl, 'history-color-box SereniX-color-transparent-bg');
				cEl.style.backgroundImage = "repeating-linear-gradient(135deg,black, black 1px,white 1px,white 3px)";
			} else {
				cEl.style.backgroundColor = color;
				addCssClass(cEl, 'history-color-box');
			}
			self.__cp__.appendChild(cEl);
			self.__boxes__[color] = cEl;
			cEl.__cHistory__ = self;
			cEl.selector = self.selector;
			addEvt('click', cEl, function(ev) {
				var hist = this.__cHistory__;
				var selector = hist.selector;
				var val;
				var color;
				var eq = SereniX.CssColorUtils ? SereniX.CssColorUtils.colorEquals : function(c1, c2) {
					return c1 === c2;
				};
				preventDefault(ev||window.event);
				if (selector) {
					val = selector.getValue();
					if (!eq(val, color = getColorValue(this))) {
						selector.setValue(color, ev, this);
						hist.push(color);
						showPalette(selector, this);
					}
				}
			})
			addEvt('mouseover', cEl, handleColorMouseOver)
			addEvt('mouseleave', cEl, handleColorMouseLeave)
			return cEl;
		}
		
		var histEl = $el('div');
		var cp = $el('div');
		var title = $el('div');
		var _hist = { 
			maxColors: maxColors||18,
			data: data||[],
			_element__: histEl,
			__cp__: cp,
			__title__: title,
			__counts__: {},
			__boxes__: {},
			__boxesList__: [],
			getMode: function() {
				return this.__mode_||'repeat';
			},
			setMode: function(mode) {
				if (mode === 1 || /^r(?:ep(?:eat)?)?$/i.test(mode)) {
					this.__mode_ = 'repeat';
				} else if (mode === 2 || /^f(?:req(?:uency)?)?$/i.test(mode)) {
					this.__mode_ = 'frequency';					
				} else {
					throw new Error('Incorrect history mode: ' + mode);
				}
			},
			getElement: function() {
				return this._element__;
			},
			push: function(color) {
				if (this.getMode() === 'repeat') {
					_pushRepeat(color, this);
				} else {
					_pushFreq(color, this);
				}
			},
			selector: selector
			
		};
		
		selector._history = _hist;
		_hist.maxItems = selector.maxColors;
		
		Object.defineProperty(_hist, 'mode', {
			get: _hist.getMode,
			set: _hist.setMode,
			configurable: true,
			enumerable: true
		})
		var historyTitle = escapeHTML(getHistoryTabLabel(selector))||'History';
		if (/^(?:tab|inline)-?collapsible$/i.test(selector.historyLayout||'')) {
			throw new Error('Not yet supported');
		} else {
			if (selector.historyLayout === 'collapsible') {
				title.innerHTML = '<div>' + historyTitle 
				+ '</div class="history-title-text"><div class="collapsible-button" style="width:24px;height:24px;display:inline-block;position:absolute;right:10px;top:0px;">'
				+ (selector.expandedIcon||defaultExpandedIcon)
				+ '</div>';
			} else {
				title.innerHTML = historyTitle;
			}
			addCssClass(title, 'history-title');
			addCssClass(cp, 'history-body');
			histEl.appendChild(title);
			histEl.appendChild(cp);
			title.selector = selector;
		}
		
		var coallpsibleBtn = title.children[1]
		if (coallpsibleBtn) {
			coallpsibleBtn.selector = selector;
			addEvt('click', coallpsibleBtn, function(ev) {
				var selector = this.selector;
				var titleBody = this.parentElement.parentElement.children[1]
				if ((this.expanded = !this.expanded)) {
					titleBody.style.display = 'block';
					this.innerHTML = selector.expandedIcon||defaultExpandedIcon;
				} else {
					titleBody.style.display = 'none';
					this.innerHTML = selector.collapsedIcon||defaultCollapsedIcon;
				}
			})
			coallpsibleBtn.expanded = true;
		}
		
		if (pagesContainer) {
			pagesContainer.appendChild(histEl);
		}
		
		
		if (isArray(data) && data.length) {
			var i, n = data.length;
			var children;
			var cEl;
			var cp = _hist.__cp__;
			var arr = _hist.__boxesList__;
			var counts = _hist.__counts__||(_hist.__counts__ = {});
			var c;
			var color;
			cp.innerHTML = '';
			if (_hist.getMode() === 'repeat') {
				i = 0;
				if (n > _hist.maxColors) {
					data.slice(data.length - (n = _hist.maxColors));
				}
				for (; i < n; i++) {
				    color = data[i];
					cEl = createColorBox(color, _hist);
					counts[color] = (counts[color]||0) + 1;
					cp.appendChild(cEl);
				}
			} else {
				throw new Error('Not yet supported');
			}
			
			_hist.empty = false;
		} else {
			cp.innerHTML = 'No history';
			_hist.empty = true;
		}
		
		histEl.history =_hist;
		return histEl;
	}
	
	CPB.createHistory = createHistory;
	/**
	 * 
	 * @param {Object} [$]
	 * @returns {Object|String|undefined}
	 */
	function getLocale($) {
		var _locale;
		if (!$)
			//if there is a global locale, return it. Otherwise, return undefined
			return typeof locale != 'undefined' ? locale : undefined;
		_locale = $.locale;
		if (!_locale) {
			//if there is a global locale, return it. Otherwise, return undefined
			_locale = typeof locale !== 'undefined' ? locale : undefined;
		}
		if (_locale instanceof String) {
			_locale = _locale.valueOf();
		}
		if (typeof _locale === 'string' && _locale) {
			if (typeof locales != 'undefined' && locales) {
				return locales[_locale];
			}
		}
		return _locale;
	}
	
	CPB.getLocale = getLocale;
	
	function getTransparentText($) {
		var str;
		var locale = getLocale($);
		str = $.backToPaletteLabel||$.backToPaletteText||$.backToPaletteCaption;
		if (str)
			return str;
		if (isPlainObj(locale)) {
			if (locale.texts) {
				str = locale.texts.transparent||locale.texts.Transparent;
			}
			str = str||locale.transparent||locale.Transparent;
			return str ? str[0].toUpperCase() + str.substring(1) : 'Transparent';
		} else if (typeof locale === 'string') {
			throw new Error('Not yet supported');
		}
		return 'Transparent';
	}
	
	CPB.getTransparentText = getTransparentText;
	
	function getBackToPaletteText($) {
		var str;
		var locale = getLocale($);
		str = $.backToPaletteLabel||$.backToPaletteText||$.backToPaletteCaption;
		if (str)
			return str;
		if (isPlainObj(locale)) {
			if (locale.texts) {
				str = locale.texts['back to palette']||locale.texts['Back to palette'];
			}
			str = str||locale['back to palette']||locale['Back to palette'];
			return str ? str[0].toUpperCase() + str.substring(1) : 'Back to palette';
		} else if (typeof locale === 'string') {
			throw new Error('Not yet supported');
		}
		return 'Back to palette';
	}
	
	function getHistoryTabLabel($) {
		var str;
		var locale = getLocale($);
		str = $.historyLabel||$.historyTitle||$.historyCaption||$.historyText;
		if (str)
			return str;
		if (isPlainObj(locale)) {
			if (locale.texts) {
				str = locale.texts.history||locale.texts.History;
			}
			str = str||locale.history||locale.History;
			return str ? str[0].toUpperCase() + str.substring(1) : 'History';
		} else if (typeof locale === 'string') {
			throw new Error('Not yet supported');
		}
		return 'History';
	}
	
	function createHistoryTab(selector, own) {
		var tab = $el('span');
		addCssClass(tab, 'more-tab history-tab tab');
		tab.innerHTML = escapeHTML(getHistoryTabLabel(own||selector)||'History');
		tab.selector = selector;
		tab.own = own;
		tab.historyTab = true;
		addEvt('click', tab, showHistory);
		addEvt('keyboard', tab, function(ev) {
			var which;
			ev = ev||window.event;
			which = ev.which||ev.keyCode;
			if (which === 13) {
				showHistory.call(this, ev);
			}
		});
		return tab;
	}
	
	function getTranslatedText(text, $) {
		var locale = getLocale($);
		var str;
		var lower = text.toLowerCase();
		if (isPlainObj(locale)) {
			if (locale.texts) {
				str = locale.texts[lower]||locale.texts[text];
			}
			str = str||locale[lower]||locale[text];
			return str ? str[0].toUpperCase() + str.substring(1) : 'Transparent';
		} else if (typeof locale === 'string') {
			throw new Error('Not yet supported');
		}
		return text;
	}
	
	CPB.getTranslatedText = getTranslatedText;
	
	function startsWithUpper(str) {
		return text[0] === text[0].toUpperCase();
	}
	/**
	 * Translates the given text, converts the translation in HTML and set innerHTML of the given HTML element
	 * @name SereniX.ui.ColorPaletteBase.setTranslatedInnerText
	 * @function
	 * @param {HTMLElement} el The HTML element
	 * @param {String} text The text to translate
	 * @param {Object} [$] The component that can hold locale
	 * @returns {HTMLElement}
	 */
	function setTranslatedInnerText(el, text, $) {
		var locale = getLocale($);
		var s = text;
		var lower = text.toLowerCase();
		if (isPlainObj(locale)) {
			if (locale.texts) {
				s = locale.texts[lower]||locale.texts[text];
			}
			s = s||locale[lower]||locale[text];
		} else if (typeof locale === 'string') {
			throw new Error('Not yet supported');
		} else if (typeof locale === 'function') {
			s = locale(text);
		}
		el.innerHTML  = escapeHTML(
				typeof $.formatText === 'function' ? s = $.formatText(s) :
				startsWithUpper(s) ? s[0].toUpperCase() + s.substring(1) : s);
		return el;
	}
	
	CPB.setTranslatedInnerText = setTranslatedInnerText;
	
	function _getPane(m, own) {
		var x = m.pane||m.content||m.contentPane||m.view||m.el||m.element;
		if (isDOMElt(x) || typeof x.getElement === 'function')
			return x;
		else if (typeof x === 'string') {
			
		}
	}
	
	function buildMorePane(settings, selector, own) {
		var historyType = selector.historyType||settings.historyType;
		var history = selector.allowHistory == undefined ? settings.history : selector.allowHistory;
		var $ = own||selector;
		if (historyType) {
			if (historyType !== 'repeat' && historyType !== 'frequency' && historyType !== 'none') {
				historyType = bool(settings, [
					'history',
					'allowHistory',,
					'withHistory',
					'showHistory'
				]) ? 'repeat' : 'none';
			}
		} else if (isArray(history)) {
			historyType = 'repeat';
		} else if (isPlainObj(history)) {
			historyType = history.historyType||history.type||'repeat';
		} else if (history) {
			historyType = 'repeat';
		} else {
			historyType = 'none';
			history = false;
		}
		
		var more = settings.more||settings.selectors||settings.palettes||settings.otherSelectors||settings.tabs;
		var paletteIndex = settings.paletteIndex;
		
		var el, tab;
		
		if (isArray(more) && more.length) {
			el = _createMorePane();
			more.forEach(function(m, i) {
				if (m === selector || paletteIndex === i)
					return;
				tab = $el('span');
				addCssClass(tab, 'more-tab tab');
				tab.innerHTML = escapeHTML(m.title||m.label||m.name||('Tab ' + lpad(i, 2)));
				tab.selector = selector;
				tab.own = own;
				tab.pane = _getPane(m, own);
				tab.selector = selector;
				if (typeof paletteIndex === 'number' && paletteIndex >= 0) {
					tab.paletteIndex = paletteIndex;
					tab.paletteTab = true;
				}
				addEvt('click', tab, showPane);
				addEvt('keyboard', btn, function(ev) {
					var which;
					ev = ev||window.event;
					which = ev.which||ev.keyCode;
					if (which === 13) {
						showPane.call(this, ev);
					}
				});
				el.appendChild(tab);
			})
		}
		
		if ($.historyLayout === 'link' || historyType === 'link') {
			el = el||_createMorePane();
			el.appendChild(tab = createHistoryTab(selector, own));
			tab.pane = createHistoryLink(selector, own, tab);
		} else if (historyType !== 'none') {
			el = el||_createMorePane();			
			if (/grid|list|collapsible/.test($.historyLayout||'')) {
				el.appendChild(_createHistoryPane(selector, own));
			} else {
				el.appendChild(tab = createHistoryTab(selector, own));	
				tab.pane = _createHistoryPane(selector, own, tab);
			}
		}
		return el;
	}
	
	function createHistoryLink(selector, own, tab) {
		var os = own||selector;
		var fn = os.getHistoryPane ? function _getPane() {
			return _getPane.os.getHistoryPane();
		} : function _getPane() {
			return _getPane.os._historyPane;
		};
		fn.os;
		return fn;
		
	}
	
	function _createMorePane() {
		var p = $el('div');
		addCssClass(p, 'more-tabs');
		return p;
	}
	
	function addHistBackButton(own, selector, hpane, tab) {
		var btn = $el('div');
		btn.style.display = 'inline-block';
		addCssClass(btn, 'back-button');
		btn.innerHTML = getBackToPaletteText(own||selector)||'Back to palette';
		btn.style.display = 'inline-block';
		addEvt('click', btn, backToPalette);
		addEvt('keyboard', btn, function(ev) {
			var which;
			ev = ev||window.event;
			which = ev.which||ev.keyCode;
			if (which === 13) {
				backToPalette.call(this, ev);
			}
		});
		btn.selector = selector;
		btn.own = own;
		btn.tab = tab;
		btn.hpane = tab.pane = hpane;
		
		var back = $el('div');
		addCssClass(back, 'back-button-wrapper')
		back.appendChild(btn);
		
		hpane.appendChild(back);
		
		hpane.backButton = back;
		
		back.own = own;
		back.selector = selector;
	}
	
	function _createHistoryPane(selector, own, tab) {
		var title;
		var cp =  getHistoryPane(own||selector);
		addCssClass(cp, 'history-content-pane');
		
		var hpane = $el('div');
		addCssClass(hpane, 'history');
		hpane.appendChild(cp);
		
		if (selector.historyLayout === 'tab' || selector.historyLayout == undefined) {
			addHistBackButton(own, selector, hpane, tab);
			hpane.style.display = 'none';
		} else {
			hpane.style.display = 'block';
			if (selector.historyLayout === 'collapsible') {
				title = cp.children[0];
				title.selector = own||selector;
				addEvt('click', title, function(ev) {
					
				});
			}
		}
		
		return hpane;
	}
	
	function showPane(ev) {
		var pane = this.pane;
		var x;
		var os;
		
		if (typeof pane === 'function') {
			pane = this.pane();
		}
		if (isPlainObj(pane)) {
			if (pane.getElement) {
				pane = pane.getElement();
			} else if (isDOMElt(x=pane.element)) {
				pane = x;
			} else if (typeof x === 'function') {
				pane = pane.element();
			} else if (x) {
				throw new Error('Incorrect pane');
			} else if (isDOMElt(x=pane.el)) {
				pane = x;
			} else if (typeof x === 'function') {
				pane = pane.el();
			} else {
				throw new Error('Incorrect pane');
			}
		} else if (typeof pane === 'string') {
			if (this.own)
				pane = (this.own.pages||this.own.panes)[pane];
			else
				pane = doc.getElementById(pane);
		} else if (!isDOMElt(pane)) {
			throw new Error('Incorrect pane');
		}
		preventDefault(ev||window.event);
		this.selector.getElement().style.display = 'none';
		pane.style.display = 'block';
		
		if (( os = this.own||this.selector))
			os.currentPane = pane;
	}
	
	function showHistory(ev) {
		var os = (this.own||this.selector);
		var el = os.getElement(),
			otherView;
		
		preventDefault(ev||window.event);
		if (os.historyOverlap === 'main') {
			otherView = os.otherView;
			if (!otherView) {
				el = el.parentElement;
			}
			el.selView.style.display = 'none';
			this.pane.style.display = 'block';
			os.__$$hideView$$__ = el.selView;
			os.currentView = otherView;
			otherView.style.display = 'block';
		} else if (os.historyOverlap === 'part') {
			var selView = el.selView;
			selView._overlapablePart.style.display = 'none';
			selView._historyPane.style.display = 'block';
			selView.currentPane = selView._historyPane;
			if (os._colorPane && os.showDisplaysWhenHistory) {
				os._colorPane.style.display = 'block';
			}
		}
	}
	
	function backToPalette(ev) {
		var tab = this.tab;
		var os = (tab.own||tab.selector);
		var selView;
		preventDefault(ev||window.event);
		if (os.historyOverlap === 'main') {
			tab.pane.style.display = 'none';
			os.__$$hideView$$__.style.display = 'block';
			os.currentView = os.__$$hideView$$__;
			os.__$$hideView$$__ = undefined;
		} else {
			var hpane = this.parentElement.parentElement;
			selView = hpane.parentElement;
			selView._overlapablePart.style.display = 'block';
			hpane.style.display = 'none';
			selView.currentPane = selView._overlapablePart;
			if (os._colorPane && os.showDisplaysWhenHistory) {
				os._colorPane.style.display = 'none';
			}
		}
	}
	
	function getHistoryPane($) {
		var data;
		var maxHistoryItems;
		var histEl;
		var historyData;
		var globalHistory;
		if ($ && $.history !== 'global' && $.history !== 'globale') {
			maxHistoryItems = $.historyMaxItems||$.maxHistoryItems
				||CPB.historySize||CPB.historyMaxColors||18;
			historyData = $.initialHistory||$.initialHistoryData||$.historyData;
			if (!historyData) {
				if (isPlainObj($.history)) {
					var h = $.history;
					historyData = h.data||h.items||[];
					maxHistoryItems = h.historyMaxItems||h.maxHistoryItems
						||maxHistoryItems;
				} else {
					historyData = isArray($.history) ? $.history : [];
				}
			}
			
		} else {
			globalHistory = true;
			maxHistoryItems = CPB.historyMaxItems||18;
			historyData = CPB.historyData
			if (!historyData)
				historyData = CPB.historyData = [];
		}
		$.historyData = historyData;
		
		return createHistory(maxHistoryItems, historyData, $);
	}
	
	function _addColorBlock(vEl) {
		var el = $el('div');
		var lbl = $el('div');
		addCssClass(lbl, 'color-label');
		lbl.style.display = 'inline-block';
		el.appendChild(vEl);
		el.appendChild(lbl);
		vEl.label = lbl;
		addCssClass(el, 'color-value-wraper');
		return el;
	}
	
	/**
	 *
	 * @static
	 * @name SereniX.ui.ColorPaletteBase.transparentColorClass
	 * @property {String} transparentColorClass
	 */
	var transparentColorClass = CPB.transparentColorClass = "SereniX-color-transparent";
	/**
	 * Adds transparent color if allowed and not yet added to the selector
	 * @static
	 * @function
	 * @name SereniX.ui.ColorPaletteBase.addTransparentColor
	 * @param {Boolean} allow Allow to add or not
	 * @param {Boolean} showText  Show the transparent text ? 
	 * @param {Object} $ The selector settings
	 * @param {HTMLElement} container  The container where to add transparent color element
	 * @param {Object} selector  The selector
	 */
	function addTransparentColor(allow, showText, $, container, selector) {
		var cEl; //color element
		var tag
		if(allow && !selector._transparentColorEl){
			tag = (container.nodeName||container.tagName).toLowerCase();
			selector._transparentColorEl = cEl = $el(tag === 'tr' ? 'td' : 'div');
			if (showText)
				cEl.innerHTML = escapeHTML(getTransparentText($));
			addCssClass(cEl, transparentColorClass);
			cEl.selector = selector;
			container.appendChild(cEl);
		}
	}
	
	CPB.addTransparentColor = addTransparentColor;
	
	function detectScreenOrientation() {
		return screen.availHeight > screen.availWidth ? "portrait" : "landscape";
	}

	function isLandscape() {
		return screen.availHeight < screen.availWidth;
	}

	function isPortrait() {
		return screen.availHeight < screen.availWidth;
	}
	
	CPB.isLandscape = isLandscape;
	
	CPB.isPortrait = isPortrait;
	
	CPB.detectScreenOrientation = detectScreenOrientation;
	
	function createExtraColorCell(color, selector, tag) {
		var x;
		addCssClass(cEl = $el(tag), 'extra-color-cell');
		var x = selector.paintExtraColor;
		if (typeof x === 'function') {
			x = x(cEl, color, selector)||'';
			if (isDOMElt(x))
				cEl.appendChild(x)
			else
				cEl.innerHTML = x;
		} else {
			_paintColorCell(cEl, color, selector.dottedExtraColor, selector.labeledExtraColor, selector)
		}
		cEl.selector = selector;
		return cEl;
	}
	
	function _paintColorCell(cEl, color, dotted, labeled, selector, labelBefore) {
		var dot, txt, bgEl;
		var content;
		var title;
		if (arguments.length < 6 && !isPlainObj(selector)) {
			labelBefore = toBool(selector);
		} else if (labelBefore == undefined) {
			labelBefore = !selector || toBool(selector.extraColorLabelBefore)
		}
		if (dotted || dotted == undefined) {
			if (labeled == undefined || toBool(labeled)) {
				bgEl = addCssClass(dot = $el('div'), 'color-dot');
				addCssClass(txt = $el('div'), 'color-text extra-color-text');
				dot.style.display = 'inline-block';
				dot.style.verticalAlign = 'middle';
				txt.style.display = 'inline-block';
				txt.style.verticalAlign = 'middle';
				if (labelBefore) {
					cEl.appendChild(txt);
					cEl.appendChild(dot);
					addCssClass(txt, 'left before');
				} else {
					cEl.appendChild(dot);
					cEl.appendChild(txt);
					addCssClass(txt, 'right after');
				}
				cEl._bgColoredEl = cEl._dot = dot;
				cEl.style.verticalAlign = 'middle';
				addCssClass(cEl, 'labeled dotted')
				txt.innerHTML = escapeHTML(CssColorUtils.getColorName(color, selector.colorNamingSystem));
			} else {
				bgEl = cEl
			}
		} else {
			bgEl = cEl;
		}
		bgEl.style.backgroundColor = CssColorUtils.toHexValue(color);
	}
	
	CPB.createExtraColorCell = createExtraColorCell;
	
	function createBlockTitle() {
		var e = $el(blockTitleTag);
		addCssClass(e, 'title ' + blockTitleTag);
		return e;
	}
	
	function addExtraColors(colors, showTransparentText,  $, container, selector) {
		if (!colors.length)
			return;
		var cEl; //color element
		var tag = (container.nodeName||container.tagName).toLowerCase();
		var cell = CPB.createExtraColorCell;
		var title =  createBlockTitle(), content = $el('div');
		var transpContainer;
		tag = tag === 'tr' ? 'td' : 'div'
		container.appendChild(cEl = $el('div'))
		addCssClass(cEl, 'extra-colors ' + (selector.extraColorsLayout === 'grid' ? 'grid' : selector.extraColorsLayout === 'vertical' ? 'vertical' : 'horizontal'));		
		
		cEl.appendChild(title);
		addCssClass(title, 'title')
		title.innerHTML = escapeHTML(getTranslatedText('Extra colors', selector));
		
		cEl.appendChild(selector._extraColorsEl = content);
		addCssClass(content, 'content')
		
		colors.forEach(function(color) {
			if (color === 'transparent') {
				addTransparentColor(true, showTransparentText, $, transpContainer||content, selector);
			} else {
				//The static method ColorPaletteBase.createExtraColorCell can be overrided 
				//outside of this library and may be can reference to ColorPaletteBase.
				//That's why the use call
				content.appendChild(cell.call(CPB, color, selector, tag));
			}
		})
	}
	
	CPB.addExtraColors = addExtraColors;
	
	function setHistorySettings($, selector) {
		var x = coalesce($, ['history', 'historyData', 'allowHistory', 'initialHistory', 'initialHistoryData']);
		var arr;
		var U;
		if (x != undefined) {
			if (typeof x === 'string') {
				if (/^(?:f(?:alse)?|n(?:o(?:ne?|k)?)?|off|0)$/.test(x)) {
					selector.allowHistory = false;
				} else {
					selector.allowHistory = true;
					if (/^tab(?:-?grid)?$/i.test(x)) {
						selector.historyLayout = 'tab';
					} else if (/^(?:grid|all-?visibles?|list|block|view)$/i.test(x)) {
						selector.historyLayout = 'grid';
					} else {
						if ((arr = x.split(/\s*|\s*/)).length > 1) {
							selector.historyData = arr;
						} else if (U = SereniX.CssColorUtils ? U.isColor(x) : false) {
							selector.historyData = [x];
						}
						selector.historyLayout = 'tab';
					}
				}
			} else if (typeof x === 'boolean') {
				selector.allowHistory = x;
			} else if (typeof x === 'number') {
				if ((selector.allowHistory = !!x))
					selector.historyMaxItems = x;
			} else if (isArray(x)) {
				selector.historyData = x;
				selector.allowHistory = true;
				/*if (x.length)  {
					selector.historyType = typeof x[0].count === 'number' ? 'frequency' : 'repeat';
				}*/
			}
		}
		if (selector.allowHistory === true || selector.allowHistory == undefined) {
			x = $.historyMaxItems||$.maxHistoryItems
					||$.historySize||$.historyMaxColors
					||$.maxHistoryColors;
			if (typeof x === 'number') {
				if (x === 0) {
					selector.historyMaxItems = 0;
					selector.allowHistory = false;
				} else if (x > 0) {
					selector.historyMaxItems = x;
					selector.allowHistory = true;
				}
			}
		}
		if (selector.allowHistory === true || selector.allowHistory == undefined) {
		    x = $.historyLayout||$.historyLayoutType;
			if (typeof x === 'string') {
				if (/^tab(?:-?grid)?$/i.test(x)) {
					selector.historyLayout = 'tab';
				} else if (/^(?:grid|all-?visibles?|list|block|view)$/i.test(x)) {
					selector.historyLayout = 'grid';
				} else if (/^collaps(?:ible|e)$/i.test(x)) {
					selector.historyLayout = 'collapsible';
				} else {
					selector.historyLayout = 'tab';
				}
				selector.allowHistory = true;
			}
			
			x = $.historyType;
			if (typeof x === 'string') {
				if ((match = /^(r(?:ep(?:eat)?)?)-?(tab|grid|collapsible)?$/i.exec(x))) {
					selector.historyType = 'repeat';
					if (match[2])
						selector.historyLayout = match[2].toLowerCase()
				} else if ((match=/^(f(?:req(?:uency)?)?)-?(tab|grid|collapsible)?$/i.exec(x))) {
					selector.historyType = 'frequency';
					if (match[2])
						selector.historyLayout = match[2].toLowerCase()
				} else if (/^none$/i.test(x)) {
					selector.historyType = 'none';
					selector.allowHistory = false;
				} else if (/^tab(?:-?grid)?$/i.test(x)) {
					selector.historyLayout = 'tab';
					selector.historyType = 'repeat';
				} else if (/^(?:grid|all-?visibles?|list|block|view)$/i.test(x)) {
					selector.historyLayout = 'grid';
					selector.historyType = 'repeat';
				} else {
					selector.historyType = 'repeat';
				}
			} else if (x == undefined && selector.allowHistory) {
				selector.historyType = 'repeat';
			}
		}
		if (!selector.allowHistory || /(grid|collapsible)/.test(selector.historyLayout||'')) {
			selector.historyOverlap = 'none';
		} else {
			x = unboxVal($.historyOverlap||$.historyOverlaping);
			if (typeof x === 'string' && x) {
				selector.historyOverlap = /^main(?:-?view)?/i.test(x) ? 'main' : 'part';
			} else {
				selector.historyOverlap = 'part';
			}
		}
		
		x = coalesce($, ['showDisplaysWhenHistory', 'showDisplayWhenHistory', 'showColorPaneWhenHistory', 'displaysWhenHistory', 'displayWhenHistory']);
		selector.showDisplaysWhenHistory = toBool(x);
	}
	
	CPB.setHistorySettings = setHistorySettings;
	
	function objToHtml(o) {
		var html, f, x, y;
		if (typeof (html = o.html) === 'function') {
			return o.html(selector, $);
		} else if ((t = typeof (x = o.htmlText||o.htmlContent)) === 'function') {
			return x.call(o, selector);
		} else if (t === 'string') {
			return x;
		} else if ((t = typeof (x = o.getHtmlText||o.toHtml)) === 'function') {
			return x.call(o, selector);
		} else {
			x = o.getText||o.getContent||o.text||o.content
			t = typeof x === 'function'
			if (toBool(html)) {
				return t ? x.call(o, selector) : x;
			} else {
				return escapeHTML(t ? x.call(o, selector) : x);
			}
		}
	}
	CPB.objToHtml = objToHtml;
	/**
	 * Sets the extensions of the selector when defined in selector settings
	 * <ul>
	 *   <li>transparent color element</li>
	 *   <li>more tabs</li>
	 *   <li>history</li>
	 *   <li>color pane for color box (value) and color index elements</li>
	 * </ul>
	 * @static 
	 * @function
	 * @name SereniX.ui.ColorPaletteBase.setExts
	 * @param {HTMLElement} el The color palette's element
	 * @param {Boolean} colorBox  Create a color box (element) that shows the selected value of the selector
	 * @param {Boolean} colorIndex Create a color index that shows the color at the mouse position (on mouse over event).
	 * @param {HTMLElement} morePane Tabs pane for more elements
	 * @param {HTMLElement} container
	 * @param {HTMLElement} selector The selector
	 * @param {HTMLElement} $ Selector settings
	 * @returns {HTMLElement} The selector's element
	 */
	function setExts(el, colorBox, colorIndex, morePane, container, selector, $) {
		function addPane(cp, pane, cls, p) {
			if (!cp) {
				cp = $el('div');
				addCssClass(cp, cls);
				cp.appendChild(p);
			}
			cp.appendChild(pane);
			return cp;
		}
		var colorPane, x;
		var tabs;
		var i, n;
		var _palettes, _sel, others, other, cp, ocp;
		var selView;
		var _histPane;
		var moreTabsContainer = $.moreTabsContainer||$.morePaneContainer;
		
		var head = $.head||$.header||$.title;
		var headEl;
		
		
		
		selector = selector||el.selector;
		
		if (typeof head === 'string' && head) {
			headEl = document.createElement('div');
			headEl.innerHTML = escapeHTML(head);
		} else if (typeof head === 'function') {
			headEl = document.createElement('div');
			headEl.innerHTML = escapeHTML(head(selector));
		} else if (isDOMElt(head)) {
			headEl = head;
		} else if (isPlainObj(head)) {
			headEl = document.createElement('div');
			headEl.innerHTML = objToHtml(head, selector)||''
		}
		
		if (morePane && moreTabsContainer) {
			moreTabsContainer.appendChild(morePane);
		} else if (morePane) {
			forEach.call(morePane.children, function(tab) {
				var pane = tab.pane;
				if (pane) {
					if (isPlainObj(pane)) {
						
					} else if (hasClass(pane, 'SereniX-color-selector') || hasClass(pane, 'SereniX-color-palette')) {
						if (!_sel) {
							_sel = pane;
						} else {
							_palettes = addPane(_palettes, pane, 'selectors-pane', _sel);
						}
					} else if (hasClass(pane, 'palettes-card')) {
						
					} else if (tab.historyTab && selector.historyOverlap === 'part') {
						_histPane = tab.pane;
					} else if (!other) {
						other = pane;
					} else {
						others = addPane(others, pane, 'others-pane', other);
					}
				}
			})
			
			x = $el('div');
			x.selector = selector;
			if (el.parentElement) {
				el.parentElement.insertBefore(x, el);
			}
			if (_palettes) {
				_palettes.insertBefore(el, _palettes.children[0]);
			} else if (_sel) {
				_palettes = $el('div');
				_palettes.appendChild(el);
				_palettes.appendChild(_sel);
                addCssClass(_palettes, 'palettes');				
			} else {
				_palettes = el;
			}
			
			selView = $el('div');
			addCssClass(selView, 'selector-main-view');
			cp = $el('div');
			addCssClass(selView, 'palettes-wrapper');
			cp.appendChild(_palettes);
			ocp = others||other;
			cp._palettes = x._palettes = _palettes;
			cp.selView = x.selView = selector.selView = selView;
			cp.otherView = x.otherView = selector.otherView = ocp;
			x._mainEl = el;
			x.cp = cp;
			selView.cp = cp;
			el = x;
			if (selector.historyOverlap === 'part') {
				x = document.createElement('div');
				x.appendChild(cp);
				x.appendChild(morePane);
				addCssClass(x, 'overlapable-part');
				selView.appendChild(x);
				selView._overlapablePart = x;
				x.selector = selector;
			} else {
				selView.appendChild(cp);
				selView.appendChild(morePane);
			}
			el.appendChild(selView);
			if (ocp)
				el.appendChild(ocp);
			if (_histPane) {
				selView.appendChild(selView._historyPane = _histPane)
			}
		} else {
			selView = el._mainEl = el.selViewEl = el;
		}
		if (isArray(selector.extraColors)) {
			addExtraColors(
				selector.extraColors,
				selector.showTransparentText, 
				$, cp||selView,
				selector);
		}
		//Add transparent color if allowed and not yet added to the selector
		addTransparentColor(
				selector.allowTransparentColor && !selector.transparentInExtra,
				selector.showTransparentText, 
				$, cp||selView,
				selector);
		
		colorPane = addValuesPane(colorBox, colorIndex, selView, selector, $);
		
		if (isDOMElt(container)) {
			container.appendChild(el);
		} else if (typeof container === 'string' && container) {
			x = doc.getElementById(container);
			if (x) {
				x.appendChild(el);
			} else {
				console.log('HTML element not found: ' + container);
				doc.getElementsByTagName('body')[0].appendChild(el);
			}
		} else if (!el.parentElement) {
			doc.getElementsByTagName('body')[0].appendChild(el);
		}
		
		if (colorPane && selector.showDisplaysWhenHistory) {
			colorPane.style.display = 'none';
		}
		if (head) {
			addCssClass(headEl, 'SereniX-color-selector-head')
			x = document.createElement('div');
			x.appendChild(headEl);
			el.parentElement.insertBefore(x, el);
			x.appendChild(el);
			x._mainEl = el._mainEl;
			x.selViewEl = el.selViewEl
			x.selView = el.selView
			x.otherView = el.otherView;
			x._palettes = el._palettes
			el = x;
		}
		return el;
	}
	
	function addValuesPane(colorBox, colorIndex, selView, selector, $) {
		function _createPane() {
			var p = $el('div');
			addCssClass(p, 'color-pane');
			return p;
		}
		function _addEl(el) {
			if (_cp)
				_cp.appendChild(el)
			else
				pane = _addColorBlock(colorBox);
		}
		var pane
		var titleEl;
		var _cp;
		if (colorBox == undefined || colorBox === true || colorBox === 1) {
			colorBox = $el('div');
			addCssClass(colorBox, 'color-value');
			selector._colorBlock = colorBox;
		}
		
		if (colorIndex == undefined || colorIndex === true || colorIndex === 1) {
			colorIndex = $el('div');
			addCssClass(colorIndex, 'color-index');
			selector._colorIndex = colorIndex;
		}
		if (selector.titledColorPane == undefined || toBool(selector.titledColorPane)) {
			titleEl = createBlockTitle();
			titleEl.innerHTML = getTranslatedText('Values', selector);
			pane = _createPane();
			_cp = $el('div');
			addCssClass(titleEl, 'title');
			addCssClass(_cp, 'content');
			pane.appendChild(titleEl);
			pane.appendChild(_cp);
		}
		if (isDOMElt(colorBox)) {
			if (isDOMElt(colorIndex)) {				
				pane = pane||_createPane();
				(_cp||pane).appendChild(_addColorBlock(colorBox));
				
				(_cp||pane).appendChild(_addColorBlock(colorIndex));
			} else {
				_addEl(colorBox)
			}
		} else if (isDOMElt(colorIndex)) {
			_addEl(colorIndex);
		}
		
		if (pane) {
			selView.appendChild(pane);
			selView._colorPane = selector._colorPane = pane;
		}
		return pane;
	}
	
	CPB.setExts = setExts;
	CPB.getHistoryPane = getHistoryPane;
	CPB.buildMorePane = buildMorePane;
	
	CPB.initUntitledColorPane = function($, selector) {
		var titledColorPane = coalesce($, ['titledColorPane', 'titledValuesPane']);
		if (titledColorPane == undefined || titledColorPane === '') {
			selector.titledColorPane = $.titledColorPane = false;
		}
	}
	
	function bool(settings, names) {
		var v;
		var i = 0, n = names.length;
		for (; i < n; i++) {
			v = settings[names[i]];
			if (v !== undefined && v !== null)
				return toBool(v);
		}
				
		if (v instanceof String || v instanceof Boolean || v instanceof Number) {
			v = v.valueOf();
		}
		return v = typeof v === 'string' ?
			v !== '' && !/^(?:f(?:alse)?|n(?:o(?:ne|k)?)?|off|0|ko)$/.test(v) :
			!!v;
	}
	
	function getDefaultExtraColors(_transparentColor) {
		var extraColors = [ '#000000', '#ffffff']
		if (_transparentColor) {
			extraColors.push('transparent')
		}
		return extraColors
	}
	
	CPB.getDefaultExtraColors = getDefaultExtraColors;
	
	CPB.getSettings = function(settings, selector, el) {
		var x;
		var transparentInExtra;
		if (arguments.length === 0)
			return {};
		
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
		} else {
			if (isDOMElt(el)) {
				settings.el = settings.element = el;
			} else if (typeof el === 'string' && el) {
				settings.el = document.getElementById(el);
				if (!settings.el) {
					settings.el = document.createElement('div');
					settings.el.id = el;
				}
				settings.element = el = settings.el;
			} else if (typeof (x = settings.id||settings.Id||settings.ID) === 'string' && x) {
				settings.el = document.getElementById(x);
				if (!settings.el) {
					settings.el = document.createElement('div');
					settings.el.id = x;
				}
				settings.element = el = settings.el;
			}
			
			onChange = settings.onChange||settings.change||settings.action
						||settings.onUpdate||settings.update;
			if (isPlainObj(selector)) {
				settings.selector = selector;
			} else {
				selector = settings.selector;
			}
		}
		
		if (typeof x === 'function') {
			onChange = x;
		} else if (isDOMElt(x)) {
			el = x;
		} else if (isPlainObj(x)) {
			if (!selector)
				selector = x;
		}
		selector = selector||{};
		if (settings) {
			var place;
			var transparentColor = coalesce(settings, [
				'transparentColor',
				'allowTransparent',
				'allowTransparentColor',
				'withTransparent',
				'showTransparent',
				'withTransparentColor',
				'showTransparentColor'
			]); 
			var extraColors = coalesce(settings, ['extraColors', 'extra', 'extend', 'extends', 'ext']);
			var whiteColor, blackColor;
			whiteColor = bool(settings, [
				'extraWhiteColor',
				'whiteColor',
				'allowWhite',
				'allowWhiteColor',
				'withWhite',
				'showWhite',
				'withWhiteColor',
				'showWhiteColor'
			]);
			blackColor = bool(settings, [
				'extraBlackColor',
				'blackColor',
				'allowBlack',
				'allowBlackColor',
				'withBlack',
				'showBlack',
				'withBlackColor',
				'showBlackColor'
			]);
			_transparentColor = toBool(transparentColor);
			if (isPlainObj(extraColors = unboxVal(extraColors))) {
				x = extraColors.colors ? extraColors.colors : extraColors.extra;
				place = extraColors.place||extraColors.position
						||extraColors.layoutPosition||extraColors.layoutPos||'';
				if (/^n(?:o(?:ne)?)?$/i.test(place)) {
					extraColors = false;
					settings.extraColorsPlace = 'none';
				} else if (isArray(x) && extraColors.length) {
					settings.extraColorsPlace = place;
					extraColors = x;
				} else if (typeof x === 'string' && x) {
					extraColors = x.split(/\s*[ ,\|]+\s*/);
					settings.extraColorsPlace = place;
				}
			}
			if (isArray(extraColors)) {
				settings.extraColors = extraColors;
			} else if (extraColors === 'default') {
				extraColors = getDefaultExtraColors(_transparentColor);
			} else {
				if (extraColors = toBool(extraColors)) {
					extraColors = getDefaultExtraColors(_transparentColor);
				} else {
					if (blackColor){
						extraColors = [ '#000000'];
					}
					
					if (blackColor){
						if (extraColors)
							extraColors.push('#ffffff');
						else 
							extraColors = [ '#ffffff'];
					}
				}				
			}
					
			x = undefined;
			if (whiteColor != undefined) {				
				if (settings.extraWhiteColor = toBool(whiteColor)) {
					if (isArray(extraColors)) {
						if (!(settings.whiteColorInExtra = containsColor(extraColors, 'white'))) {
							x = x||extraColors.splice();
							x.push('#ffffff');
						}
					}
				} else {
					settings.extraWhiteColor = false;
				}
			}
			if (blackColor != undefined) {				
				if (settings.extraBlackColor = toBool(blackColor)) {
					if (isArray(extraColors)) {
						if (!(settings.blackColorInExtra = containsColor(extraColors, 'black'))) {
							x = x||extraColors.splice();
							x.push('#000000');
						}
					}
				} else {
					settings.extraBlackColor = false;
				}
			}
			
			if (transparentColor != undefined) {				
				if ((settings.allowTransparentColor = _transparentColor)) {
					if (isArray(extraColors)) {
						if (!(settings.transparentInExtra = containsColor(extraColors, 'transparent'))) {
							x = x||extraColors.splice();
							x.push('#000000');
						}
					}
				}
			} else {
				settings.allowTransparentColor = settings.transparentInExtra = !isArray(extraColors) ? false : containsColor(extraColors, 'transparent');
			}
			selector.extraColors = x ? x : extraColors;
			
			selector.extraColorClass = coalesce(settings, [
					'extraColorClass', 'extraColorClassName',
					'extraColorStyleClass', 'extraColorStyleName',
					'extraColorCssName'
			])||'';
						
			selector.paintExtraColor = getColorCellPaint(
				coalesce(selector, [
					'dottedExtraColor', 'dotedExtraColor', 'dotExtraColor', 
					'extraColorWithDot',
					'extraColorDotted', 'extraColorDoted']),
				selector.extraColorType||'',
				coalesce(settings, ['labeledExtraColor', 'extraColorLabeled']),
				coalesce(settings, ['extraColorRenderer', 'extraColorRender', 'renderExtraColor']),
				coalesce(selector, ['extraColorFormater', 'extraColorFormat', 'formatExtraColor']),
				selector
			);
			
			selector.transparentInExtra = settings.transparentInExtra;
			selector.extraWhiteColor = settings.extraWhiteColor;
			selector.extraBlackColor = settings.extraBlackColor;
			selector.extraColors = settings.extraColors;
			selector.allowTransparentColor = settings.allowTransparentColor;
		} else {
			settings = { el: el, selector: selector };
		}
		settings.selector = selector;
		settings.el = settings.element = settings.element||settings.el||el||document.createElement('div');
		settings.onChange = onChange;
		//box of color at the mouse position
		settings.colorIndex = coalesce(settings, ['colorIndex', 'settings.colorInd', 'mousePosColorBox', 'mousePositionColorBox']);
		//box of selecte/setted color value
		settings.colorBox = coalesce(settings, ['colorBox', 'settings.colorBlock',
					'colorValueElement', 'settings.colorValueEl', 
					'valueElement', 'settings.valueEl']);
		//where to place color (value) box, old color value box, color index
		//(corresponds to color at the mouse position), ...
		settings.valuesPlace = coalesce(settings, [
			'valuePlace', 'valuesPlace',
			'valuePosition', 'valuesPosition'
			, 'valuePos', 'valuesPos'], 'bottom')
		return settings;
	}
	
	function _paint(cEl, x) {
		if (typeof x === 'string') {
			cEl.innerHTML = x;
		} else {
			cEl.appendChild(x);
		}
	}
	
	function getColorCellPaint(dotted, type, labeld, renderer, fmt, selector) {
		var fn;
		var U = SereniX ? SereniX.CssColorUtils : undefined;
		if (typeof renderer === 'function') {
			return renderer;
		}
		if (isPlainObj(renderer)) {
			if (typeof renderer.render === 'function') {
				fn = function fn(cEl, color, selector) {
					_paint(cEl, fn._own.render(color, selector)||'');
				}
				fn._own = render;
				return fn;
			} else {
				throw new Error('Incorrect renderer')
			}
		}
		if (dotted == undefined) {
			dotted = type;
		}
		
		if (dotted != undefined) {
			if (typeof dotted === 'string') {
				if ((match = /^(color|dot|circle|rect(?:angle)?)\s*\+\*(label|text|caption)$/.exec(dotted))) {
					fn = function fn(cEl, color, dotted, labeled, selector) {
						_paintColorCell(cEl, color, fn.dotted, fn.labeled, selector, fn.labelBefore);
					}
					fn.dotted = dotted;
					fn.labeled =labeled;
					fn.labelBefore = false;
					return fn;
				} else if ((match = /^(label|text|caption)\s*\+\s*(dot|circle|rect(?:angle)?|color)$/.exec(dotted))) {
					fn = function fn(cEl, color, dotted, labeled, selector) {
						_paintColorCell(cEl, color, fn.dotted, fn.labeled, selector, fn.labelBefore);
					}
					fn.dotted = dotted;
					fn.labeled =labeled;
					fn.labelBefore = true;
					return fn;
				} else if (/^(background|bg)(?:-?color)?$/i.test(dotted)) {
					return function(cEl, color) {
						cEl.style.backgroundColor = U ? U.toHexValue(color) : color;
					}
				} else if (/^text-?color$/i.test(dotted)) {
					return function(cEl, color) {
						cEl.style.color = U ? U.toHexValue(color) : color;
					}
				} else if (/^text$/i.test(dotted)) {
					
				} else if (/^name$/i.test(dotted)) {
					
				} else {
					selector.dottedExtraColor = toBool(dotted);
				}
			} else if (isArray(dotted)) {
				
			} else {
				dotted = toBool(dotted);
			}
		} else if (typeof fmt === 'function') {
			fn  = function fn(cEl, color, selector) {
				cEl.innerHTML = escapeHTML(fn.format(color, selector))
			}
			fn.format = fmt;
			return fn;
		} else {
			dotted = dotted == undefined ? true : toBool(dotted);
		}
	}
	
	function getColorIndex(colors, color, namedColors) {
		var U = SereniX.CssColorUtils;
		var eq = U ? U.colorEquals||function(c1, c2) {
			var s1, s2;
			if (typeof c1 === 'string') {
				s1 = c1.toLowerCase();
			}
			if (typeof c2 === 'string') {
				s2 = c2.toLowerCase();
			}
			if ((s1||c1) === (s2||c2))
				return true;
			return U.toHex(c1) === U.toHex(c2)
		} : function(c1, c2) {
			function _color(c) {
				if (typeof c === 'string') {
					if (c[0] === '#') {
						c = c.substring(1).toLowerCase();
					} else {
						c = namedColors[c = c.toLowerCase()]||c;
					}
					
				}
				return c;
			}
			return _color(c1) === _color(c2);
		}
		var i = 0, n = colors.length;
		var c;
		namedColors = namedColors||{
			white: 'ffffff',
			black: '000000',
			red: 'ff0000',
			green: '00ff00',
			blue: '0000ff'
		}
		for (; i < n; i++) {
			if (eq(colors[i], color)) {
				return i;
			}
		}
	}
	
	CPB.getColorIndex = getColorIndex;
	
	function containsColor(colors, color, namedColors) {
		return getColorIndex(colors, color, namedColors) >= 0;
	}
	
	CPB.containsColor = containsColor;
	
	function finalize(el, selector, settings, colorBox, colorIndex, morePane, container, cls) {
		var colorPane;
		var value = value = settings.value||settings.color||settings.initialValue||settings.initialColor||'#FFF';
		
		
		colorIndex = colorIndex||settings.colorIndex||settings.colorInd;
		colorBox = colorBox||settings.colorBox||settings.colorBlock
					||settings.colorValueElement||settings.colorValueEl
					||settings.valueElement||settings.valueEl;
					
		selector.el = selector._element__ = el
	    el.selector = el.palette = selector;
		
		setHistorySettings(settings, selector);
		
		if (typeof container === 'string' && container) {
			var x = document.getElementById(container);
			if (!x) {
				throw new Error('HTML element not found: ' + container)
			}
			container = x;
		}
		
		if (morePane !== false)
			morePane = CPB.buildMorePane(settings, selector);
		//el may be changed in the execution of setExts function
		el = setExts(el, colorBox, colorIndex, morePane, container, selector, settings);
		
		if (!selector.getElement) {
			selector.getElement = function() {
				return this._element__;
			}
		}
		
		selector.findColor = function(color) {
			var eq = typeof colorEquals === 'function' ? colorEquals : 
				CssColorUtils && CssColorUtils.colorEquals ? CssColorUtils.colorEquals : 
				function(c1, c2) {
					return c1 === c2;
				};
			var colors;
			var i, n;
			var c;
			var map = this.subPaletteColorsMap;
			
			if (map) {
				c = this.getCssColor(color);				
				for (var k in map) {
					colors = map[k];
					for (i = 0, n = colors.length; i < n; i++) {
						if (eq(c = colors[i], color)) {
							return { paletteKey: k, colorIndex: i, cssColor: c, color: color};
						}
					}
				}
			} else {
				colors = this.__paletteColors__;				
				for (i = 0, n = colors.length; i < n; i++) {
					c = colors[i];
					if (eq(c, color)) {
						return { colorIndex: i, cssColor: c, color: color};
					}
				}
			}
		}

		
		selector.getColorIndex = selector.getColorIndex||function(color) {
			var colors = this.__paletteColors__;
			var i = 0,
				n = colors.length;
			var c;
			var eq = typeof colorEquals === 'function' ? colorEquals : 
					CssColorUtils && CssColorUtils.colorEquals ? CssColorUtils.colorEquals : 
					function(c1, c2) {
						return c1 === c2;
					};
			
			for (; i < n; i++) {
				c = colors[i];
				if (eq(c, color)) {
					return i;
				}
			}
			return -1;
		}
		
		selector.containsColor = selector.containsColor||function(color) {
			return this.getColorIndex(color) >= 0;
		}
		
		ColorPaletteBase.setMethods(selector);
		
		ColorPaletteBase.setProps(selector);
		
		bindColorCellEvents(el, selector._itemBaseClass);
		
		if (cls)
			addCssClass(el, cls); //'SereniX-color-selector SereniX-theme-color-selector theme-grid'
		if (selector.el !== el) {
			selector.el = selector._element__ = el
			el.selector = el.palette = selector;
		}
		
		if (value) {
			selector.setValue(value);
		}
		
		return el;
	}
	
	CPB.finalize = finalize;
	
	if (typeof ui.addChild === 'function') {
		ui.addChild(CPB);
	} else {
		ui.ColorPaletteBase = CPB;
	}
	
	return CPB;
	
});