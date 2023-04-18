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
 
;(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }    
})(this, 'createMDStyleColorPalette', function() {
	
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
	
	var defaultValue = '#FFF';
	
	var materialPaletteFullKeys = [
		'50',
		'100',
		'200',
		'300',
		'400',
		'500',
		'600',
		'700',
		'800',
		'900',
		'a100',
		'a200',
		'a400',
		'a700'
	];
	
	var materialPaletteKeys = [
		'50',
		'100',
		'200',
		'300',
		'400',
		'500',
		'600',
		'700',
		'800',
		'900'
	];
	
	var materialPaletteAccentKeys = [
		'a100',
		'a200',
		'a400',
		'a700'
	];
	
	function colorCell(color, k, selected) {
		return '<td class="color-cell' +  (selected ? ' selected' : '') + '"' 
			+ (selected ? ' aria-selected="true"' : '') 
			+ (k ? ' data-entry-key="' + k + '"' : '')
			+ ' style="background-color:' + color + ';" tabindex="-1"></td>'
	}
	var newRowCell = '</tr><tr>';
	var _close = '</tr></table>';
	
	var defaultArrowBackIcon = '<svg fill="#000000" viewBox="0 0 24 24" xml-space="preserve" xmlns="http://www.w3.org/2000/svg"> <path d="M0 0h24v24H0z" fill="none"/> <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/> </svg>';
	
	function arrowBackCell(arrowIcon) { 
		return '<td class="arrow-back-cell"><div class="arrow-back-icon-wrapper">' + (arrowIcon||defaultArrowBackIcon) + '</div></td>';
	}
	
	function _initSubTbl(arrowIcon) {
		return '<table><tr>' + arrowBackCell(arrowIcon);
	}
	
	var getCssColor = SereniX.CssColorUtils ? SereniX.CssColorUtils.toHexValue : null;
	
	function getToColor(c) {
		if (isArray(c)) {
			c = c[0];
		}
		var keys = Object.keys(c);
		var U = SereniX.CssColorUtils;
		if (keys.length === 1) {
			return function(c) {
				return U.toHexValue(c[Object.keys(c)[0]]);
			}
		} else {
			return (getCssColor ? getCssColor : (getCssColor = U ? U.toHexValue : function(c) {
				return c[0] === '#' ? c : '#' + c;
			}));
		}
	}
	
	function backToMain(ev) {
		var pEl = this.parentElement.parentElement;
		         //td->tr->table->div
		var pane = (pEl.tagName||pEl.nodeName).toLowerCase() === 'tbody' ? pEl.parentElement.parentElement : pEl.parentElement;
		var selector = this.selector;
		var main = pane.parentElement.children[0];
		ev = ev||window.event;
		preventDefault(ev);
		
		pane.style.display = 'none'
		pane.currentCell = selector.currentCell
		//go to the main palette and make it visible
		main.style.display = 'block';
		
		
		selector.currentCell = main.querySelectorAll('.selected')[0]
		if (selector.currentCell) {
			selector.__value_ = getCssColor(selector.currentCell.style.backgroundColor);
		} else {
			selector.__value_  = undefined;
		}
		
	}
	
	function backToMainOnKey(ev) {
		var which;
		ev = ev||window.event;
		
		which = ev.which||ev.keyCode;
		
		if (which === 13) {
			backToMain.call(this, ev)
		}
	}
	
	function unbindArrowBack(el) {
		if (!el)
			return;
		removeEvt('click', el, backToMain);
		removeEvt('keydown', el, backToMainOnKey);
	}
	
	function bindArrowBack(el, selector) {
		if (!el)
			return;
		el.selector = selector;
		addEvt('click', el, backToMain);
		addEvt('keydown', el, backToMainOnKey);
	}
	
	function emptySubPalette(pane) {
		var CPB = SereniX.ui.ColorPaletteBase;
		var cells = pane.querySelectorAll('.color-cell');
		var i = 0,
			n = cells.length;
		if (!n)
			return;
		unbindArrowBack(cells[0].parentElement.children[0]);
		for (; i < n; i++) {
			CPB.unbindColorCell(cells[i]);
		}
		pane.innerHTML = '';
	}
	

	function createMDStyleColorPalette(settings, selector, el) {
		var args = Array.prototype.slice.call(arguments);
		
		/**
		 * 
		 * @param {Number} i The index where to add color's cell in the grid
		 * @param {Number} html
		 * @param {Number} columns
		 * @param {Number} k
		 * @param {Number} cs
		 * @param {Object} subColorsMap
		 * @param {Function} toColor
		 * @param {Number} colorIndex The index of the value of color that owns the sub palette in the sub palette
		 * @returns {String}
		 */
		function addColor(i, html, columns, k, cs, value, toColor, colorIndex) {
			var c;		
			if (i % columns === 0) {
				html += newRowCell;
			}
			if (isArray(cs)) {
				if (cs.length === 1) {
					c = toColor(cs[0]);
				} else {
					if (typeof k !== 'string') {
						throw new Error('Incorrect color palette');
					}
					subPaletteColorsMap[k] = subPaletteColors = [];
					_selectedColor = undefined;
					subColorsMap[k] = drawSubColors(cs, columns, value, toColor, c = (keyColors[k]||k));
					c = toColor(c);
					if (_selectedColor && !_currentSubPaletteHtml) {
						_currentSubPaletteHtml = subColorsMap[k];
						_selectedColors.push(_currentSubPaletteColor = _selectedColor);
					}
				}
			} else if (isPlainObj(cs)) {
				if (typeof k !== 'string') {
					throw new Error('Incorrect color palette');
				}
				var keys = Object.keys(cs);
				subPaletteColorsMap[k] = subPaletteColors = [];
				_selectedColor = undefined;
				keyColors[k] = c = toColor(getKeyColor(cs, k));
				subColorsMap[k] = drawObjSubColors(cs, keys, columns, value, toColor, c = (keyColors[k]||k));
				if (_selectedColor && !_currentSubPaletteColor) {
					_currentSubPaletteHtml = subColorsMap[k];
					_selectedColors.push(_currentSubPaletteColor = _selectedColor);
					_selectedColor = undefined;
				}
			} else if (k) {
				subPaletteColorsMap[k] = [c = toColor(cs)];
			}
			var selected;
			html += colorCell(c= (c||cs), k, (selected = (c === value)));
			if (selected) {
				_selectedColors.push(_selectedColor = c);
			}
			return html;
		}
		
		function _initTbl(columns, k, c, subColorsMap, value, toColor, colorIndex) {
			//i, html, columns, k, cs, value, toColor, colorIndex)
			return addColor(1, '<table><tr>', columns, k, c, value, toColor, colorIndex);
		}
		
		function drawSubColors(colors, columns, value, toColor, oColor, subPaletteColorsMap) {
			var toColor = getToColor(colors[1]);
			var html = _initSubTbl(colors[0], toColor, oColor, arrowIcon);
			var i = 0;
			var n = colors.length;
			for (; i < n; i++) {
				html = addColor(i + 1, html, columns, null, colors[i], value, toColor, namedColors[oColor]||oClor);
				subPaletteColors.push(c);
			}
			return html + _close;
		}
		
		var _selectedColor, _currentSubPaletteColor;
		var _currentSubPaletteHtml;
		var _selectedColors = [];
		var keyColors = {};
		
		function drawObjSubColors(colors, keys, columns, value, toColor, oColor) {
			var toColor = getToColor(colors[keys[0]]);
			var html = _initSubTbl(colors[0], toColor, oColor, arrowIcon);
			var i = 0;
			var n = colors.length;
			var c;
			keys.forEach(function(k) {
				html = addColor(++i, html, columns, null, c = toColor(colors[k]), value, toColor,  namedColors[oColor]||oColor);
				subPaletteColors.push(c);
			});
			return html + _close;
		};
		/**
		 * 
		 * @param {Array} colors The colors object
		 * @param {Number} columns The maximum number of columns of the grid
		 * @param {Object} subColorsMap The object that contains sub palettes html codes
		 * @param {Number} colorIndex  The index of the color that owns the sub palette
		 * @returns {String}
		 */
		function drawFromArray(colors, columns, subColorsMap, value, colorIndex, arrowIcon) {
			var toColor = getToColor(colors[1]);
			//(columns, k, c, subColorsMap, value, toColor, colorIndex)
			var html = _initTbl(columns, colors[0], colors[1], subColorsMap, value, toColor, colorIndex);
			var n = Math.floor(colors.length/2);
			var i = 1;
			for (; i < n; i++) {
				html = addColor(i, html, columns, colors[2*i], colors[2*i+1], value, toColor, colorIndex);
			}
			return html + _close;
		}
		
		function getKeyColor(c, k) {
			if (isPlainObj(c)) { //is object sub palette
				if (namedColors) {
					_c = namedColors[k];
				}
				_ks = subPaletteKeys||Object.keys(c);
				i = 0;
				n = _ks.length;
				found = false;
				for (; i < n; i++) {
					if (c[_ks[i]] === _c) {
						found = true;
						break;
					}
				}
				c= found ? _c : c[_ks[_ks.length === 1 ? 0 : 1]];
			} else if (isArray(c)) { //is array sub palette
				c= isArray(c[0]) ? c[0][1] : c[0];
			}
			return c;
		}
		/**
		 * 
		 * @param {Object} colors The colors object
		 * @param {Number} columns The maximum number of columns of the grid
		 * @param {Object} subColorsMap The object that contains sub palettes html codes
		 * @param {Array} keys The keys to acces colors object
		 * @param {Number} colorIndex  The index of the color that owns the sub palette
		 * @returns {String}
		 */
		function drawFromObj(colors, columns, subColorsMap, keys, value, colorIndex, arrowIcon) {
			var k,
				_c,
				_ks,
				found,
				html,
				n,
				i;
			if (!isArray(keys)) {
				keys = Object.keys(colors);
			}
			var k = keys[0];
			var c = getKeyColor(colors[k], k);
			var toColor = getToColor(c);
			
			//(columns, k, c, subColorsMap, value, toColor, colorIndex)
			html = _initTbl(columns, k, colors[k], subColorsMap, value, toColor, colorIndex);
			n = keys.length;
			i = 1;		
			for (; i < n; i++) {
				k = keys[i];
				html = addColor(i, html, columns, k, colors[k], value, toColor, colorIndex);
			}
			return html + _close;
		}
		
		
		function paletteFromString() {
			switch(palette) {
				case 'palette':
				case 'material-palette':
				case 'materialpalette':
				case 'default':
				case 'material':
					palette = materialPalette;
					subPaletteKeys = materialPaletteKeys;
					break;
				case 'palette-accent':
				case 'paletteaccent':
				case 'material-palette-accent':
				case 'materialpaletteaccent':
				case 'material-accent':
				case 'materialaccent':
					palette = materialPaletteAccent;
					subPaletteKeys = materialPaletteAccentKeys;
					break;
				case 'palette-full':
				case 'palettefull':
				case 'material-full':
				case 'materialfull':
					palette = globalNS.materialPaletteFull||(globalNS.materialPaletteFull = getMaterialFull());
					subPaletteKeys = materialPaletteFullKeys;
					break;
			}
		}
		
		function settingsFromEl() {
			settings = {};
			namedColors = MDBaseColors.NAMED_COLORS;
			x = el.getAttribute('color-size');
			if (x != undefined) {
				colorSize = parseFloat(x, 10);
			}
			x = el.getAttribute('colors-per-row');
			if (x == undefined) {
				x = el.getAttribute('max-colors-per-row');
				if (x == undefined) {
					x = el.getAttribute('columns');
					if (x == undefined) {
						x = el.getAttribute('max-columns');
					}
				}
			}
			columns = x||5;
			palette = el.getAttribute('palette')||materialPalette;
			if (typeof palette === 'string') {
				paletteFromString();
			}
			value = el.getAttribute('value')||defaultValue;
			initNamedColors();
		}
		
		function initNamedColors() {
			if ((typeof materialPalette !== 'undefined' && materialPalette === palette) 
				|| (typeof materialPaletteAccent !== 'undefined' && materialPaletteAccent === palette)
				|| (typeof materialPaletteFull !== 'undefined' && materialPaletteFull === palette)){
				namedColors = MDBaseColors.NAMED_COLORS;
			}
		}
		
		function fromSettingsObj() {
			id = settings.id||settings.Id||settings.ID||settings.elementId||settings.elementID;
			el = settings.element||settings.el||settings.dom;
			if (typeof el === 'string' && el) {
				id = el;
				el = '';
			} else if (!isDOMElt(el)) {
				el = false;
			}
			value = settings.value||settings.initialValue||settings.val||settings.initVal
						||settings.color||settings.initialColor||settings.initColor;
			container = settings.container||settings.appendTo
							||settings.parentElement||settings.parentEl||settings.parent||
							settings.containerId||settings.containerID;
			if ((palette = settings.palette||settings.colors||settings.data)) {					
				columns = settings.columns||settings.columnsPerRow
							||settings.maxColumns||settings.maxColumnsPerRow||5;
				namedColors = settings.namedColors||settings.namedColorsMap;
				if (typeof palette === 'string')
					paletteFromString();
				if (!namedColors) {
					initNamedColors();
				}
			} else {
				palette = materialPalette;
				namedColors = MDBaseColors.NAMED_COLORS;
				columns = settings.columns||settings.colorsPerRow||settings.columnsPerRow
							||settings.maxColumns||settings.maxColorsPerRow||settings.maxColumnsPerRow||5;
			}
		}
		
		var x;
		var columns = 5;
		var palette;
		var selector;
		var keys;
		var subPaletteKeys;
		var colorIndex;
		var subPaletteColorIndex
		var colorBlock;
		var colorBox;
		//keys represents top colors and values sub palettes
		var subColorsMap = {};
		var subPaletteColorsMap = {};
		var subPaletteColors;
		var arrowIcon;
		var namedColors;
		var id;
		var container;
		var colorSize;
		var colorMargin;
		var value, val;
		
		
		if (args.length === 0) {
			palette = materialPalette;
			namedColors = MDBaseColors.NAMED_COLORS;
			keys = materialPaletteKeys;
		} else if (isArray(settings)) {
			palette = settings;
			settings = {};
			if (isDOMElt(selector)) {
				
			} else if (isPlainObj(selector)) {
				
			} else if (typeof selector === 'string') {
				
			} else  if (typeof selector === 'number') {
				columns = selector;
				if (isPlainObj(el)) {
					selector = el;
					el = (isDOMElt(args[3]) || (typeof args[3] === 'string')) ? args[3] : null;
				}				
			}
		} else {
			if (args.length === 1) {
			    if (isDOMElt(settings)) {
					el = settings;
					settingsFromEl();
				} else if (isArray(settings)) {
					palette = settings;
					settings = undefined;
				} else {
					fromSettingsObj();
				}
			} else if (isDOMElt(settings)) {
				
			} else if (typeof settings === 'string' || settings) {
				if (isPlainObj(selector)) {
					if (isPlainObj(el)) {
						id = settings;
						settings = selector;
						selector = el;
					} else if (!el) {
						id = settings;
						settings = selector;
						selector = undefined;
					}
				}
			} else {
				
			}
		}
		settings = settings||{};
		keys = settings.keys||settings.topColors||Object.keys(palette);
		val = value||defaultValue;
		subPaletteColorIndex = subPaletteColorIndex||settings.subPaletteColorIndex||settings.subPaletteColorInd;
		
		subPaletteColorIndex = typeof subPaletteColorIndex !== 'number' || subPaletteColorIndex < 0 ? columns : subPaletteColorIndex;
		
		settings = settings||{};
		
		arrowIcon = settings.arrowBackIcon||settings.arrowIcon;
		
		namedColors = namedColors||(SereniX.CssColorUtils ? SereniX.CssColorUtils.NAMED_COLORS : {});
		var transparentColor = bool(settings, [
				'transparentColor',
				'allowTransparent',
				'allowTransparentColor',
				'withTransparent',
				'showTransparent',
				'withTransparentColor',
				'showTransparentColor'
			]);
		var showTransparentText = toBool(settings.showTransparentText);
		
		if (typeof id === 'string' && id) {
			el = document.getElementById(id);
		}
		
		el = el||document.createElement('div');
		
		el.selector = selector||(selector={getElement: function() { return this._element__;}});
		el.subColorsMap = selector.subColorsMap = subColorsMap;
		selector.subPaletteColorsMap = subPaletteColorsMap;
		selector.allowTransparentColor = transparentColor;
		selector.showTransparentText = showTransparentText;
		ColorPaletteBase.setHistorySettings(settings, selector);
		
		selector.getPaletteKey = function(color) {
			var map = this.subPaletteColorsMap;
			var c = getCssColor(color);
			for (var k in map) {
				if (map[k].indexOf(c) >= 0) {
					return k;
				}
			}
		}
		
		selector.findColor = function(color) {
			var map = this.subPaletteColorsMap;
			var c = getCssColor(color);
			var i;
			for (var k in map) {
				if ((i = map[k].indexOf(c)) >= 0) {
					return { paletteKey: k, colorIndex: i, cssColor: c, color: color};
				}
			}
		}
		
		selector.containsColor = function(color) {
			return selector.getPaletteKey(color) 
				|| (this.allowTransparentColor && color === 'transparent');
		}
		
		selector.setValue = function(val, colorCell) {
			var self = this;
			var p = this.findColor(val);
			if (!p) {
				if (val === 'transparent' && this.allowTransparentColor) {
					this.__value_ = val;
					throw new Error('Transparent val not yet supported');
					//return this;
				}
				throw new Error('Color not in palette');
			}
			this.__value_ = p.cssColor;
			var html = subColorsMap[p.paletteKey];
			var panes = this.getElement()._materialPanesContainer.children;
			var pane;
			var colorCells;
			var CPB = SereniX.ui.ColorPaletteBase;
			var bindColorCell = CPB.bindColorCell;
			if (!panes.length)
				return this;
			if (html) {
				emptySubPalette(pane = panes[1]);
				pane.innerHTML = html;
				pane.paletteKey = p.paletteKey;
				colorCells = pane.querySelectorAll('.color-cell');
				colorCells.forEach(function(cc) {
					cc.selector = self;
					bindColorCell(cc);
					if (getCssColor(cc.style.backgroundColor) === p.cssColor) {
						CPB.selectColorCell(cc, self.selectionClass);
						pane.currentCell = self.currentCell = cc;
						
					}
				})
				bindArrowBack(colorCells[0].parentElement.children[0], self);
				//hide main colors pane
				panes[0].style.display = 'none';
			} else {
				pane = panes[0]
				if (!colorCell) {
					var rows = pane.parentElement.children;
					var n = rows.length;
					var i= 0;
					var cells, j, len;
					for (; i < n; i++) {
						cells = rows[i].children;
						j = 0;
						len = cells.length;
						for (; j < len; j++) {
							if (getCssColor(cells[j].style.backgroundColor) === v) {
								colorCell = cells[j];
								break;
							}
						}
					}
				}
				CPB.selectColorCell(colorCell, self.selectionClass);
				pane.currentCell = self.currentCell = colorCell;
			}
			pane.style.display = 'block';
			return this;
		}
		
		if (!/^(string|function)$/.test(typeof selector.selectionContent)) {
			/**
			 * Returns HTML content (text or DOM) of the selected color cell
			 * @returns {String|HTMLELement}
			 */
			selector.getSelectionContent =  selector.getSelectionContent||function() {
				var colorSize = this.colorSize;
				
				var outerCircleSize, innerCircleSize;
				if (typeof colorSize === 'number' && colorSize > 0) {
					var insets = this.outerCircleInsets;
					if (isPlainObj(insets)) {
						insets = insets.left + insets.right;
					}
					outerCircleSize = colorSize - (insets||8);
					insets = this.innerCircleInsets;
					if (isPlainObj(insets)) {
						insets = insets.left + insets.right;
					}
					innerCircleSize = outerCircleWidth - (insets||14);
					innerCircleSize = ' style="width:' + innerCircleSize + 'px;height:' + innerCircleSize + 'px;"';
					outerCircleSize = ' style="width:' + outerCircleSize + 'px;height:' + outerCircleSize + 'px;"';
				} else {
					outerCircleSize = innerCircleSize = '';
				}
				return '<span  class="color-current-cell-content"><span class="outer-circle"' 
					+ outerCircleSize
					+ '></span> <span  class="inner-circle"' 
					+ innerCircleSize
					+ '></span></span>';
			} //end selector.getSelectionContent method		
		}
		
		value = val ? SereniX.CssColorUtils.toHexValue(val) : undefined;
		el.innerHTML = '<div class="main-colors">' 
				+ (isArray(palette) ? 
					drawFromArray(palette, columns, subColorsMap, value, subPaletteColorIndex, arrowIcon) : 
					drawFromObj(palette, columns, subColorsMap, keys, value, subPaletteColorIndex, arrowIcon)) 
				+ '</div><div class="sub-colors"></div>';
		var materialPanesContainer = el;
		var CPB = SereniX.ui.ColorPaletteBase;
		
		if (_currentSubPaletteHtml) {
			el.children[0].style.display = 'none';
			el.children[1].innerHTML = _currentSubPaletteHtml;
			el.children[1].style.display = 'block';
			_currentSubPaletteHtml = undefined;
		} else {
			el.children[0].style.display = 'block';
			el.children[1].style.display = 'none';
		}
		
		
		
		selector.subPaletteColorsMap = subPaletteColorsMap;
		
		colorIndex = colorIndex||settings.colorIndex||settings.colorInd;
		colorBox = colorBox||settings.colorBox||settings.colorBlock
					||settings.colorValueElement||settings.colorValueEl
					||settings.valueElement||settings.valueEl;
					
		if (selector.showDisplaysWhenHistory) {
			if (colorIndex == undefined)
				colorIndex = true;
			if (colorBox == undefined)
				colorBox = true;
		}
		
		if ((id = id||settings.id||settings.Id||settings.ID)) {		
			el.id = id;
			if (selector.id !== id) {
				selector.id = id;
			}
		}
		el = selector._element__ = CPB.setExts(el, !!colorBox, !!colorIndex, 
				CPB.buildMorePane(settings, selector),
				container, selector, settings);
		
		var props = selector.__definedProperties__||(selector.__definedProperties__ = {});
		
		if (!selector.__CLASS__ && !(selector.mouseBorder
				|| selector.mouseBorderBar
				|| selector.updateUI
				|| selector.setValueMode) ) {
		  CPB.setProps(selector, props);
		  CPB.setMethods(selector);
	    }
		
		x = settings.dataType||settings.valueType;		
		if (x) {
			selector.dataType = x === 'hex' ? 'string' : x === 'rgb' || x === 'hsb' ? 'object' : x;
		}
		
		x = settings.valueMode||settings.mode||x;
		if (x) {
			selector.setValueMode(x);
		}
		
		bindArrowBack(el.querySelectorAll('.arrow-back-cell')[0], selector);
		
		CPB.bindColorCellEvents(el);
		
		if (!_selectedColor && value && value !== 'transparent') {
			console.log('Color value not in palette: ' + value);
		}
		
		addCssClass(el, 'SereniX-color-selector SereniX-color-palette md-like');
		el._materialPanesContainer = materialPanesContainer;
		return el;
	}
	
	function getMaterialFull() {
		function copy(dest, src) {
			for (var k in src) {
				dest[k] = src[k];
			}
		}
		var o = {};
		[materialPalette, materialPaletteAccent].forEach(function(p) {
			var v;
			for (var k in p) {
				v = p[k];
				if (typeof v === 'string') {
					o[k] = v;
				} else {
					copy(o[k]||(o[k] = {}), v);
				}
			}
		})
		return o;
	}
	
	return createMDStyleColorPalette;

});
