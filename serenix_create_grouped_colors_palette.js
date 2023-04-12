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
	 SereniX.ui = {};
 }
 
//A part of the design is inspired from https://codepen.io/cmegown/pen/VaMzQq
 
;(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }    
})(this, 'createGroupedColorPalette', function() {
	
	
	function objToHtmlFormat(fmt) {
		var html, fn, f;
		if (typeof (html = fmt.html) === 'function') {
			fn = function fn(x) {
				return fn.fmt.html(x, selector, $);
			}
			fn.fmt = fmt;
		} else if (typeof (f = fmt.htmlText||fmt.getHtmlText) === 'function') {
			fn = function fn(x) {
				return fn.html.call(fn._own, x, selector, $);
			}
			fn.html = f;
			fn._own = fmt;
		} else if (toBool(html)) {
			fn = function fn(x) {
				return fn.text.call(fn._own, x, selector, $);
			}
			fn.text = fmt.getText||fmt.text||fmt.getContent||fmt.content;
			fn._own = fmt;
		} else {
			fn = function fn(x) {
				return escapeHTML(fn.text.call(fn._own, x, selector, $));
			}
			fn.text = fmt.getText||fmt.text||fmt.getContent||fmt.content;
			fn._own = fmt;
		}
		return fn;
	}
	
	var defaultMainColorsLayout = 'list';
	
	var defaultMainItemType = 'color';
	
	function getGridDim(colors) {
		var r, f;
		if (colors <= 9)
			return [1, colors];
		var min = 10;
		for (var i = 9; i > 3; i--) {
			r = colors % i;
			if (r === 0) {
				f = i;
				return [colors/i, i]
			}
			if (r < min) {
				min = r;
				f = i;
			}
		}
		return [Math.ceil(colors/f), f]
	}

	function createTopThemeColors(palette, themes, sizing) {
		var el = document.createElement('div');
		var colorSize;
		var colorsTotalWidth;
		var colorHeight;
		var colorWidth;
		var colorSize;
		if (isPlainObj(sizing)) {
			colorHeight = colorWidth = sizing.colorSize||sizing.colorHeight;
			colorWidth = sizing.colorSize||sizing.colorWidth;
			if (!colorWidth) {
				colorsTotalWidth = sizing.colorsTotalWidth||sizing.colorsPartWidth||sizing.colorsWidth;
			}
		} else if (total == undefined || toBool(total)) {
			colorsTotalWidth = sizing;
		} else {
			colorHeight = colorWidth = sizing;
		}
		themes.forEach(function(theme, i) {
			var cEl;
			var rEl;
			var colors = palette[theme];
			var dim = getGridDim(colors);
			var themEl = document.createElement('div');
			el.appendChild(themEl);
			addCssClass(themEl, 'theme');
			var n = colors.length;
			var columns = dim[1];
			var r = 0,
				rows = dim[0] - 1;
				
			themEl.style.width = (columns * colorSize) + 'px';
			addCssClass(themEl, 'theme row')
			for (; r < rows; r++) {
				rEl = document.createElement('div');
				rEl.style.width = (columns * colorSize) + 'px';
				addCssClass(rEl, 'colors-row row')
				colorSize = colorWidth||(colorsTotalWidth/len);
				for (var c = 0, len = dim[1]; c < len; c++) {
					addCell(rEl, colors, r*columns + c, colorSize, colorHeight)
				}
				el.appendChild(rEl);
			}
			c = rows*dim[1];
			n = colors.length;
			if (c < n) {
				var _cSize = (colorsTotalWidth||(columns*colorSize))/(n - c)
				rEl = document.createElement('div');
				rEl.style.width = (columns * colorSize) + 'px';
				addCssClass(rEl, 'colors-row row')
				for (; c < n; c++) {
					addCell(rEl, colors, c, _cSize, colorHeight)
				}
			}
		})
		return el;
	}

	function createLeftThemeColors(palette, themes, sizing, total) {
		var el = document.createElement('div');
		var colorsTotalWidth;
		var colorHeight;
		var colorWidth;
		var colorSize;
		if (isPlainObj(sizing)) {
			colorHeight = colorWidth = sizing.colorSize||sizing.colorHeight;
			colorWidth = sizing.colorSize||sizing.colorWidth;
			if (!colorWidth) {
				colorsTotalWidth = sizing.colorsTotalWidth||sizing.colorsPartWidth||sizing.colorsWidth;
			}
		} else if (total == undefined || toBool(total)) {
			colorsTotalWidth = sizing;
		} else {
			colorHeight = colorWidth = sizing;
		}
		themes.forEach(function(theme, i) {
			var cEl;
			var rEl;
			var colors = palette[theme];
			var dim = getGridDim(colors);
			var themEl = document.createElement('div');
			
			addCssClass(themEl, 'theme');
			var colorsEl = document.createElement('div');
			
			var n = colors.length;
			var columns, len;
			var r = 0,
				rows = (columns = dim[0]) - 1;
			for (; r < rows; r++) {
				rEl = document.createElement('div');
				len = dim[1];
				colorSize = colorWidth||(colorsTotalWidth/len);
				for (var c = 0; c < len; c++) {
					addCell(rEl, colors, r*columns + c, colorSize, colorHeight)
				}
				colorsEl.appendChild(rEl);
			}
			c = rows*dim[1];
			n = colors.length;
			if (c < n) {
				var _cSize =( colorsTotalWidth||(columns*colorSize))/(n - c)
				rEl = document.createElement('div');
				for (; c < n; c++) {
					addCell(rEl, colors, c, _cSize, colorHeight)
				}
				colorsEl.appendChild(rEl);
			}
			addCssClass(themEl, 'theme theme-cell');
			wrap = document.createElement('div');
			addCssClass(wrap, 'theme-container');
			themEl.style.display = 'inline-block';
			colorsEl.style.display = 'inline-block';
			wrap.appendChild(themEl);
			wrap.appendChild(colorsEl);
			el.appendChild(wrap);
		})
		return el;
	}
	function addCell(rEl, colors, index, w, h) {
		var color = colors[index];
		cEl = document.createElement('div');
		addCssClass(cEl, 'color-cell');
		cEl.style.display = 'inline-block';
		cEl.style.background = getCssColor(color);
		cEl._val = color;
		cEl.colorIndex = index;
		cEl.style.width = w + 'px';
		if (h)
			cEl.style.height = h + 'px';
		rEl.appendChild(cEl);
	}


	
	
	function createGroupedColorPalette(settings, selector, el) {
		var CPB = SereniX.ui.ColorPaletteBase;
		var $ = CPB.getSettings.apply(this, arguments);
		var U = SereniX.CssColorUtils;
		function _applyFormat(color, fmt) {			
			if (typeof fmt === 'function') {
				return fmt(color);
			}
			
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
					return U.getColorName(color, nameColors);
				case 'cmyk':
					return U.toCmykString(color);
			}
			
		}
		
		
		var mainColorsLayout = $.mainColorsLayout; //list|combobox|grid
		var nameColors = $.namingColorSystem||$.colorNamingSystem||$.colorNameSystem||$.colorNames||$.colorsOfNames;

		var separatedPanes = $.singleSubPaletteVisible;

		var subPaletteLayout = $.subPaletteLayout||$.subPaletteType;

		var subPaletteColumns = $.subPaletteColumns||$.maxSubPaletteColumns||$.subPaletteColorsPerRow||$.maxSubPaletteColumns||$.maxSubPaletteColorsPerRow;

		var groupColumns = $.groupColumns||$.themeColumns||$.topLevelColumns||$.mainColumns;
		
		var variableColumns = toBool(coalesce($, ['variableColumns', 'autoColumns', 'autoCols']))
		
		if (variableColumns || /^(?:auto|var(?:iable)?)(?:-?columns)?$/i.test(subPaletteLayout||'')) {
			subPaletteLayout = 'auto-columns';
			variableColumns = true;
		}
		
		var colors = $.colors||$.palette;
		var mainItems = $.mainItems||$.mainColors||$.keys||$.mainKeys;
		var subPaletteField;
		//keys represents top colors and values sub palettes
		var subColorsMap = {};
		var subPaletteColorsMap = {};
		
		var x;
		var err = 'Colors not supported'
		var pairs, entries;
		var titledSubPalette = coalesce($, ['titledSubPalette', 'subPaletteTitled', 'subPaletteWithTitle']);
		var subPalettesDivWrap;
		var colorBoxPlace = $.colorBoxPlace||$.colorPanePlace||$.colorValuePlace||$.colorPlace;
		var own;
		var morePane;
		var container;
		var colorBox, colorIndex;
		var mainDiv
		
		var mainColorsTag = /combo/.test(mainColorsLayout) ? 'select' : 'div';
		
		var mainColorsItemTag = mainColorsTag === 'select' ? 'option' : 'div'
		
		var tabbed = coalesce($, ['tabs', 'tabbed', 'tabbedpane', 'tabbedPane']);
		
		if (!mainColorsLayout) {
			mainColorsLayout = /bar$/.test(subPaletteLayout||'') ? /^h/.test(subPaletteLayout) ? 'vertical-bar' : 'horizontal-bar' : 'list';
		}
		
		if (tabbed != undefined && tabbed !== '')
			separatedPanes = toBool(tabbed);
		else
			separatedPanes = separatedPanes == undefined || separatedPanes === '' ?
				/list|select|combo(?:box)?|grid/i.test(mainColorsLayout) :
				toBool(separatedPanes) ;
		
		if (/^(combo(?:box)?|select)$/i.test(mainColorsLayout)) {
			mainColorsLayout = 'combobox'
		}
		var bar, match;
		var mainColorsOrientation = mainColorsLayout === 'combobox' ? 'vertical' :
			$.mainColorsOrientation||(/^(?:(h(?:oriz(?:ontal))?)|(v(?:ert(?:i(?:cal)?)?)?))$/i.exec($.orientation||'') ? 
			(match[1] ? 'vertical' : 'horizontal') :
			mainColorsLayout === 'horizontal-bar' ? 'horizontal' :
			mainColorsLayout === 'vertical-bar' ? 'vertical' :
			(mainColorsLayout === 'list' ? 'vertical' : 'horizontal')) ; //horizontal|vertical
		
		var namedGroup = coalesce($, ['namedBarGroup', 'namedGroup']);
		
		
		
		
		
		el = $.el||$.element;
		selector = $.selector||{};
		
		if (variableColumns) {
			var colorSize = $.colorSize;
			var colorWidth = $.colorWidth||$.colorCellWidth;
			var colorHeight = $.colorHeight||$.colorCellHeight;
			var colorsTotalWidth = $.colorsTotalWidth||$.colorsWidth||$.mainWidth;
		} else if ((match = /^((horizontal|vertical)(-?))?bar$/.test(bar = subPaletteLayout||''))) {
			namedGroup = selector.namedBarGroup = namedGroup == undefined ? true : toBool(namedGroup);
			if (!match[1]) {
				subPaletteLayout = $.subPaletteLayout = mainColorsOrientation + '-bar';
			} else if (!match[3]) {
				subPaletteLayout = $.subPaletteLayout = match[2] + '-bar';
			}
		} else if (!separatedPanes) {
			if (namedGroup == undefined)
				selector.namedBarGroup = namedGroup = true;
			if (!subPaletteLayout)
				subPaletteLayout = $.subPaletteLayout = 'row-group'
		}
		if (subPaletteLayout === 'row-group') {
			selector.namedBarGroup = namedGroup = true;
			separatedPanes = false;
			mainColorsLayout = 'row-group';
			if (subPaletteColumns == undefined) {
				subPaletteColumns = $.subPaletteMaxColumns||$.columns||$.colorsPerRow||$.maxColumns||$.maxColorsPerRow;
			}
		}
		selector.subPaletteLayout = $.subPaletteLayout;
		
		if ($.showTransparentText == undefined)
			$.showTransparentText = selector.showTransparentText = true
		
		var keyFields = selector.keyFields = $.keyFields||$.keyFieldNames||$.keyNames
		var colorFields = selector.colorFields = $.colorFields||$.colorFieldNames||$.colorNames
		var fields = $.fields||$.fieldNames||$.names
		if (fields) {
			selector.fields = fields;
		} else if (colorFields || keyFields)
			selector.fields = { color: colorFields, key: keyFields}
		
		selector.nameColors = nameColors;
		mainDiv = separatedPanes ? document.createElement('div') : undefined;
		
		var subPalettesDiv = separatedPanes ? document.createElement('div') : undefined

		var mainColorsContainer = mainDiv||(subPaletteLayout === 'row-group' ? (function() {
			var cnt = document.createElement('div');
			addCssClass(cnt, 'content-pane');
			el.appendChild(cnt);
			var g = document.createElement('div'); //this element is created to be able to center row groups horizontaly with name of the group align at the left and also center sub palettes horizontaly
			addCssClass(g, 'grid-body');
			cnt.appendChild(g);
			return g;
		})() : el);

		var subPaletteContainer = subPalettesDiv||el;
		
		var subPalettesDivWrap = separatedPanes ? document.createElement('div') : undefined
		
		if (subPalettesDivWrap) {
			addCssClass(mainDiv, 'main-colors')
			subPaletteTitle = document.createElement($.subPaletteTitleTag||'h2');
			addCssClass(subPaletteTitle, 'sub-palette-title')
			subPalettesDivWrap.appendChild(subPaletteTitle);
			subPalettesDivWrap.appendChild(subPalettesDiv);
			addCssClass(subPalettesDivWrap, 'sub-palettes-container' + ($.subPalettesContainerClass ? ' ' + $.subPalettesContainerClass : ''));
		}
		
		if (subPalettesDiv) {
			addCssClass(subPalettesDiv, 'sub-palettes' + ($.subPalettesClass ? ' ' + $.subPalettesClass : ''));
		}
		var cmb;
		if (mainColorsTag === 'select') {
			cmb = document.createElement('select')
			mainColorsContainer.appendChild(cmb);
			mainColorsContainer = cmb;
		}
		
		var cp = el;
		var subPalettesContainer = subPalettesDivWrap||subPalettesDiv
		if (separatedPanes && !/combo/.test(mainColorsLayout)) {
			addCssClass(mainDiv, 
				'main-' 
				+ (mainItemIsColor ? 'colors' : 'items') 
				+ ' ' + mainColorsOrientation
				+ ' main-list' //this can be setted to list items container (for example 'ol' or 'ul') and removed here if list element is used and wrapped by this div
				);
		}
		if (separatedPanes) {
			
			selector.singleSubPaletteVisible = selector.tabs = true;
			if (($.colorBox !== false && !isDOMElt($.colorBox)) || ($.colorIndex !== false && !isDOMElt($.colorIndex))) {
				cp = document.createElement('div')
				el.appendChild(cp);
				addCssClass(cp, 'content-pane');
			}
			if (colorBoxPlace == undefined || colorBoxPlace === '' ) {
				if (mainColorsLayout === 'list')
					colorBoxPlace = 'none';
			}
			if (colorBoxPlace === 'top') {
				cp.appendChild(colorBox = document.createElement('div'));
				if (/vertical/.test(mainColorsOrientation)) {
					own = document.createElement('div')
					cp.appendChild(own);
				} else {
					own = cp;
				}
				own.appendChild(mainDiv);
				own.appendChild(subPalettesContainer);
			} else {
				cp.appendChild(mainDiv);
				if (colorBoxPlace === 'left') {
					own = document.createElement('div')
					cp.appendChild(own);
					own.appendChild(colorBox = document.createElement('div'));
					own.appendChild(subPalettesContainer);
				} else if (colorBoxPlace === 'right') {
					own = document.createElement('div')
					cp.appendChild(own);
					own.appendChild(subPalettesContainer);
					own.appendChild(colorBox = document.createElement('div'));
				} else if (colorBoxPlace === 'bottom') {
					cp.appendChild(subPalettesContainer);
					cp.appendChild(colorBox = document.createElement('div'));
				} else if (colorBoxPlace === 'none') {
					cp.appendChild(subPalettesContainer);
				} else {
					throw new Error('Incorrect color box place: ' + colorBoxPlace);
				}
			}
		}
		
		el.subColorsMap = selector.subColorsMap = subColorsMap;
		selector.subPaletteColorsMap = subPaletteColorsMap;
		selector._subPaletteTitle = subPaletteTitle;
		selector._mainDiv = mainDiv;
		var c0, c1;
		colorCellClass = settings.colorCellClass||settings.colorItemClass||settings.colorClass||settings.itemClass
		
		function getColorFields(c1) {
			var hash, d, hex;
			var strings = [];
			var fields = {};
			c1.forEach(function(c, i) {
				if (typeof c === 'string') {
					if (/^#/.test(c)) {
						if (hash !== undefined) {
							strings.push(i);
						} else {
							hash = i;
						}
					} else if (/^\d+$/.test(c)) {
						if (d !== undefined) {
							strings.push(i);
						} else {
							d = i;
						}
					} else if (hex !== undefined && hash !== undefined && /^[0-9a-fA-F]{3,9}$/.test(c)) {
						hex = i;
					} else {
						strings.push(i);
					}
				}
			})
			if (hash != undefined) {
				fields.color = hash;
				if (d != undefined) {
					fields.weight = d;
				}
			} else if (hex != undefined) {
				fields.color = hex;
				if (d != undefined) {
					fields.weight = d;
				}
			} else if (d  != undefined) {
				fields.color = d;
			} else  {
				throw new Error('Incorrect array color palette')
			}
			if (strings.length) {
				fields.name = strings[0];
				if (strings.length > 1)
					fields.desc = strings.slice();
			}
			return fields;
		}
		
		function getKeyFields(c1) {
			var hash, d, hex;
			var strings = [];
			var fields = {};
			c1.forEach(function(c, i) {
				if (typeof c === 'string') {
					if (/^#/.test(c)) {
						if (hash !== undefined) {
							strings.push(i);
						} else {
							hash = i;
						}
					} else if (hex !== undefined && hash !== undefined && /^[0-9a-fA-F]{3,9}$/.test(c)) {
						hex = i;
					} else {
						strings.push(i);
					}
				}
			})
			if (hash != undefined) {
				fields.color = hash;
			} else if (hex != undefined) {
				fields.color = hex;
			}
			if (strings.length) {
				fields.name = strings[0];
				if (strings.length > 1)
					fields.desc = strings.slice(1);
			} else if (fields.color == undefined)  {
				throw new Error('Incorrect array color palette')
			}
			return fields;
		}
		
		function _setFields(c0, c1) {
			if (keyFields) {
				if (!colorFields) {
					colorFields = getColorFields(c1[0]);
				}
			} else if (colorFields) {
				keyFields = getKeyFields(c0);
			} else if (fields) {
				colorFields = fields.color||fields.colors||getColorFields(c1[0]);
				keyFields = fields.key||fields.keys||getKeyFields(c0);
			} else {
				colorFields = getColorFields(c1[0]);
				keyFields = getKeyFields(c0);
			}
		}
		
		if (isPlainObj(colors)) {
			mainItems = mainItems||Object.keys(colors);
		} else if (isArray(colors)) {
			if (typeof colors[0] === 'string') {
				if (!isArray(colors[1])) {
					throw new Error(err);
				}
				pairs = true;
			} else if ((isArray(c0 = colors[0]) && isArray(c0[0]) && !isArray(c0[0][0])) 
						&& (isArray(c1 = c0[1]) && isArray(c1[0]))) {
				_setFields(c0[0], c1)
				entries = true;
			} else if (isArray(c0 = colors[0]) && !isArray(c0) && isArray(c1 = colors[1]) 
						&& isArray(c1[0])) {
				_setFields(c0, c1);
				pairs = true;
			} else if (isPlainObj(colors[0])) {
				if (isArray(x = colors[1])) {
					pairs = true;
				} else if (isArray(x.colors)) {
					subPaletteField = 'colors';
				} else if (isArray(x.palette)) {
					subPaletteField = 'palette';
				} else if (isArray(x.variations)) {
					subPaletteField = 'variations';
				} else if (isArray(x.items)) {
					subPaletteField = 'items';
				} else {
					throw new Error(err);
				}
			} else if (isArray(colors[0])) {
				throw new Error('Not yet supported');
			} else {
				throw new Error(err);
			}
		}

		if (subPaletteLayout === 'grid') {
			subPaletteColumns = subPaletteColumns||5;
		} else if (!subPaletteLayout) {
			if (typeof subPaletteColumns === 'number') {
				subPaletteLayout = subPaletteColumns > 1 ? 'grid' : 'list';
			} else {
				subPaletteColumns = 5;
				subPaletteLayout = 'grid';
			}
		}
		
		var subPaletteColorClass  = selector._itemBaseClass = subPaletteLayout === 'grid'  ? 'color-cell' : 'color-item';
		if (colorCellClass) {
			subPaletteColorClass += ' ' + colorCellClass;
		}
		
		var rowEl;
		
		function addFieldsSingleRowColor(color, i, container) {
			var cssColor = getCssColor(color[colorFields.color]);
			var el = createSubPaletteItem(cssColor);
			addCssClass(el, subPaletteColorClass);
			container.appendChild(el);	
			paletteColors.push(color);
			_subPaletteItems.push(cssColor);
		}
		
		function addSingleRowColor(color, i, container) {
			var cssColor;
			var el = createSubPaletteItem(cssColor = getCssColor(color));
			addCssClass(el, subPaletteColorClass);
			container.appendChild(el);	
			paletteColors.push(color);
			_subPaletteItems.push(cssColor);
		}

		var addSubPaletteColor = subPaletteLayout === 'row-group' ? (
			colorFields && subPaletteColumns > 1 ? function(color, i, container) {
				var cssColor = getCssColor(color[colorFields.color]);
				var el = createSubPaletteItem(cssColor);
				addCssClass(el, subPaletteColorClass);
				if (i % subPaletteColumns === 0) {
					container.appendChild(rowEl = document.createElement('div'));
				}
				rowEl.appendChild(el);	
				paletteColors.push(color);
				_subPaletteItems.push(cssColor);
			} : colorFields ? addFieldsSingleRowColor
			: subPaletteColumns > 1 ? function(color, i, container) {
				var cssColor;
				var el = createSubPaletteItem(cssColor = getCssColor(color));
				addCssClass(el, subPaletteColorClass);
				if (i % subPaletteColumns === 0) {
					container.appendChild(rowEl = document.createElement('div'));
				}
				rowEl.appendChild(el);	
				paletteColors.push(color);
				_subPaletteItems.push(cssColor);
			} : addSingleRowColor
		) //end row group case
		: colorFields ? addFieldsSingleRowColor
		: _mainItemColorIndex || !mainItemIsColor ? addSingleRowColor
		: function(color, i, container) {
			var cssColor;
			var el = createSubPaletteItem(cssColor = getCssColor(color));
			addCssClass(el, subPaletteColorClass);
			container.appendChild(el);	
			_subPaletteItems.push(cssColor);
			if (paletteColors.indexOf(color) < 0)
				paletteColors.push(color);
		}

		function createColor(color, tag) {
			var el = document.createElement(tag||colorCellTag||'div');
			if (color === 'transparent') {
				addCssClass(el, 'color SereniX-color-transparent');
			} else {
				el.style.background = getCssColor(color);
				addCssClass(el, 'color');
			}
			return el;
		}
		
		var parseExpr;
		
		var getCssColor = $.getCssColor||U.getCssColor
		
		var formatColor = $.formatColor||$.colorFormat;
		var html;
		var fn;
		if (typeof formatColor === 'function' || formatColor instanceof Function) {
			fn = function fn(color) {
				return escapeHTML(fn.fmt(color, selector, $));
			}
			fn.fmt = formatColor;
		} else if (typeof (formatColor = unboxVal(formatColor)) === 'string' && formatColor) {
			fn = function fn(color, selector) {
				var str = '';
				var start, end;
				var i = 0, j;
				var pattern = fn.pattern;
				var expr;
				while ((start = pattern.indexOf('{{', i)) >= 0 && (end = pattern.indexOf('}}', j = start + 2)) >= 0) {
					str += pattern.substring(i, start);
					str += parseExpr(pattern.substring(j, end), color, selector, $);
					i = end + 2;
				}
				return escapeHTML(str + pattern.substring(i));
			}
			fn.pattern = formatColor;
		} else if (isPlainObj(formatColor)) {
			fn = objToHtmlFormat(formatColor);
		} else if (isArray(formatColor)) {
			fn = function fn(color) {
				var str = '';
				fn.tokens.forEach(function(token, i) {
					if (typeof token === 'string' || token instanceof String) {
						if ((match = /^(?:(?:"([^"]|\\")*")|(?:"([^"]|\\")*"))$/.exec(token))) {
							str += escapeHTML((match[1]||match[2]).replace(new RegExp('\\\\(' + match[0][0] + ')', 'g'), function($0, $1) {
								return $1
							}))
						} else if (/^\{\{/.test(token)) {
							str += escapeHTML('' + parseExpr(token, color, selector, $));
						} else {
							str += escapeHTML(_applyFormat(color, token));
						}
					} else if (typeof token === 'function' || token instanceof Function) {
						str += escapeHTML(token(color, selector, $))
					} else if (isPlainObj(token)) {
						str += objToHtmlFormat(token)(color, selector, $)||''
					} else {
						str += escapeHTML(token);
					}
				})
				return str;
			}
			fn.tokens = formatColor;
		} else {
			formatColor = function fn(color, selector, $) {
				var name;
				var hex;
				var fields;
				if (color === 'transparent' || (isArray(color) && !color.length) || !(hex = U.toHexValue(color = unboxVal(color))))
					return 'Transparent';
				if (typeof (color) === 'string') {
					name = U.getColorName(color, fn.nameColors)||'';
				} else if (isPlainObj(color)) {
					name = color.name;
					if (!name) {
						name = U.getColorName(color, fn.nameColors)||'';
					}
				} else if (isArray(color) && selector 
						&& (fields = selector.colorFields||(selector.fields ? selector.fields.color : undefined))
						&& fields.name != undefined) {
					name = color[fields.name]||U.getColorName(color, fn.nameColors)||''
				} else {
					name = U.getColorName(color, fn.nameColors)||'';
				}
				return name && !/[#\d]/.test(name[0]) ? name + ' (' + hex + ')' : hex;
			}
			formatColor.nameColors = nameColors;
		}
		selector.formatColor = formatColor = fn||formatColor;
		
		var lookAndFeel = $.colorLookAndFeel||$.colorLayout;
		
		if (typeof lookAndFeel !== 'string' && !(lookAndFeel instanceof String)) {
			lookAndFeel = '';
		}
		
		function getListItemContent(match) {
			var shape = document.createElement('div');
			var txt = document.createElement('div');
			shape.style.display = 'inline-block';
			addCssClass(shape, 'color-shape ' + match[1]);
			if (match[1] === 'circle') {
				shape.style.borderRadius = '50%';
			} else if (match[2]) {
				shape.style.borderRadius = match[2]+ (match[3]||'px');
			}
			txt.style.display = 'inline-block';
			txt.innerHTML = formatColor(color)||'';
			return { shape: shape, txt: txt }
		}
		var match;
		
		var createSubPaletteItem = mainColorsLayout === 'list' ? (
		/^(background|bg)$/.test(lookAndFeel) ? createColor :
		/^(background|bg)\s*\+\s*text$/.test(lookAndFeel) ? function(color, tag) {
			
		} : (match = /^(circle|rect(?:angle)?(?:(?:-?border-?)?-?radius(\d+(?:\.\d+)?)(px|%|em|rem|mm|cm))?)\s*\+\s*text$/.exec(lookAndFeel)) ? function(color, tag) {
			var c = getListItemContent(match);
			el.appendChild(c.shape);
			el.appendChild(c.txt);
			return el;
		} : (match = /^text\s*\+\s*(circle|rect(?:angle)?(?:(?:-?border)?-?radius(\d+(?:\.\d+)?)(px|%|em|rem|mm|cm)))$/.exec(lookAndFeel)) ? function(color, tag) {
			var el = document.createElement(tag||'div');
			var c = getListItemContent(match);
			el.appendChild(c.txt);
			el.appendChild(c.shape);
			return el;
		} : function(color, tag) {
			var el = createColor.apply(this, arguments);
			el.innerHTML = formatColor(color, selector)||'';
			return el;
		}) : createColor;
		
		var colorCellTag;
		var n;
		var i = 0;
		var mc;
		var subPalette;

		var mainItemClass = $.mainItemClass; //'main-color'

		var mainItemIsColor = coalesce($, ['mainItemIsColor', 'mainItemSsColor', 'mainItemColor' ])
		var mainItemType = $.mainItemType;
		var mainItemColorIndex = coalesce($, ['mainItemColorIndex', 'mainColorIndex'])
		var paletteColors = [];
		var _mainItemColorIndex;
		
		if ((_mainItemColorIndex = typeof mainItemColorIndex === 'number' && mainItemColorIndex >= 0)) {
			mainItemIsColor = true;
		} else if (mainItemIsColor == undefined) {
			if (!mainItemType) {
				if (/list|select|combo(?:box)?|grid/i.test(mainColorsLayout))
					mainItemIsColor = /color/.test(defaultMainItemType||'color');
			} else {
				mainItemIsColor = /color/.test(mainItemType);
			}
		} else {
			mainItemIsColor = toBool(mainItemIsColor);
		}

		mainItemClass = mainItemIsColor ? 
			(mainItemClass||'main-color') + ' main-color-cell' : 
			(mainItemClass||'main-item') + ' color-group-cell';
		
		var _palette;
		
		function getPaletteKey(mc) {
			if (typeof mc === 'string') {
				return mc;
			}
			if (isPlainObj(mc)) {
				return mc.name||mc.key||mc.color||mc.hex||mc.value||mc.hexValue||mc.hexVal;
			}
		}
		var paletteKey;
		var _subPalettes = {};
		var subPaletteTitle;
		function getPaletteTitle(mc) {
			var title;
			if (typeof mc === 'string')
				return escapeHTML(mc);
			if (isPlainObj(mc)) {
				title = mc.title||mc.header||mc.name;
				if (typeof title === 'string') {
					return escapeHTML(title);
				} else if (typeof title === 'function') {
					
				} else if (isPlainObj(mc)) {
					
				}
			}
		}
		
		function _addSubPalette(mc, key, subPal) {
			subPalette = subPal||document.createElement('div');
			addCssClass(subPalette, 'sub-palette');
			subPaletteContainer.appendChild(subPalette);
			_subPalettes[paletteKey = key||getPaletteKey(mc)] = subPalette;
			subPaletteColorsMap[paletteKey] = _subPaletteItems = [];
		}
		var _initSubPalette = separatedPanes ? function (mc, i, el, key, subPal) {
			_addSubPalette(mc, key, subPal);			
			selector._themeElsMap[paletteKey] = el;		
			initBuild(subPalette, subPaletteColumns, subPaletteLayout);
			if (i == 0) {
				subPalette.style.display = 'block'
				subPaletteTitle.innerHTML = getPaletteTitle(mc)
				selector._currentSubPalette = subPalette;
				selector._currentPaletteKey = paletteKey;
				selector._currentThemeIndex = i;
				selector._currentThemeEl = el;
				selector._currentTab = el;
				addCssClass(el, 'active-tab')
			} else {
				subPalette.style.display = 'none'
			}
			el._val = mc;
			el.selector = selector;
			el.paletteIndex = i;
			el.paletteKey = paletteKey;
			addEvt('click', el, function(ev) {
				var selector = this.selector;
				var currentTab = selector._currentTab;
				if (this === currentTab)
					return;
				var currentSubPalette = selector._currentSubPalette;
				var mainDiv = selector._mainDiv;
				selector._subPaletteTitle.innerHTML = getPaletteTitle(this._val);
				if (currentTab)
					removeClass(currentTab, 'active-tab');
				if (currentSubPalette) {
					removeClass(currentSubPalette, 'selected');
					currentSubPalette.removeAttribute('aria-selected')
					currentSubPalette.style.display = 'none'
				}
				
				addCssClass(this, 'active-tab');
				var subPalette = selector._subPalettes[this.paletteKey];
				addCssClass(subPalette, 'selected');
				subPalette.setAttribute('aria-selected', 'true')
				selector._currentSubPalette = subPalette;
				subPalette.style.display = 'block'
				selector._currentTab = this;
			})
		} : function(mc, i, el, key, subPal) {
			_addSubPalette(mc, key, subPal);			
			selector._themeElsMap[paletteKey] = el;		
			initBuild(subPalette, subPaletteColumns, subPaletteLayout);
		}
		
		var _getPaletteKey = keyFields ? function (mc) {
			return keyFields.key != undefined ? mc[keyFields.key]: 
					keyFields.name != undefined ? mc[keyFields.name] : 
					(keyFields.title != undefined ? mc[keyFields.title]: 
					keyFields.name != undefined ? mc[keyFields.name] : mc)
		} : function(mc) {
			return typeof mc === 'string' || mc instanceof String ? mc : mc.paletteKey||mc.key||mc.name||mc.title;
		}
		
		var _getPaletteHeadText = keyFields ? function (mc) {
			return keyFields.label != undefined ? mc[keyFields.label]: 
					keyFields.title != undefined ? mc[keyFields.title] : 
					keyFields.header != undefined ? mc[keyFields.header] :
					(keyFields.name != undefined ? mc[keyFields.name]: 
					keyFields.key != undefined ? mc[keyFields.key] : mc)
		} : function(mc) {
			return typeof mc === 'string' || mc instanceof String ? mc : mc.label||mc.title||mc.header||mc.name||mc.key;
		}
		
		var groupMultiColumnClass = groupColumns > 1 && subPaletteLayout === 'row-group' ? ' multi-column' : '';
		var groupContainer;
		var _setGroupContainer = groupColumns > 1 ? function(i, container) {
			subPaletteContainer = document.createElement('div');
			if (i % groupColumns === 0) {
				groupContainer = document.createElement('div');
				addCssClass(groupContainer, 'group-sub-grid');
				container.appendChild(groupContainer);
			}
		} : function(i, container) {
			subPaletteContainer = document.createElement('div');
			groupContainer = container;
		}
		var addMainItem = namedGroup  && !separatedPanes ? function(g, container, i) {
			var gEl = document.createElement('div');
			_setGroupContainer(i, container);
			gEl.innerHTML = escapeHTML(_getPaletteHeadText(g)||'');
			addCssClass(gEl, mainItemClass + ' group-name');
			subPaletteContainer.appendChild(gEl);
			addCssClass(subPaletteContainer, 'sub-palette-container');
			groupContainer.appendChild(subPaletteContainer);
			_initSubPalette(g, i, gEl, _getPaletteKey(g));
		} : !namedGroup && !separatedPanes ? function(mc, container, i) {			
			_setGroupContainer(i, container);
			groupContainer.appendChild(subPaletteContainer);
			addCssClass(subPaletteContainer, 'sub-palette-container');
			_initSubPalette(mc, i, null, _getPaletteKey(mc));
		} : keyFields ? function(mc, container, i) {
			function _key(mc) {
				return keyFields.key != undefined ? mc[keyFields.key]: 
					keyFields.name != undefined ? mc[keyFields.name] : null
			}
			function _title(mc) {
				return keyFields.title != undefined ? mc[keyFields.title]: 
					keyFields.name != undefined ? mc[keyFields.name] : mc[keyFields.key]
			}
			function _name(mc) {
				return keyFields.name != undefined ? mc[keyFields.name] : null
			}
			function getColor() {
				var c = (mainItemColorIndex != undefined ? _palette[mainItemColorIndex]: mc[keyFields.color])||mc;
				return colorFields ? c[colorFields.color] : c;
			}
			
			var el = createColor(getColor(), mainColorsItemTag, mc);
			var title;
			addCssClass(el, mainItemClass);
			container.appendChild(el);
			_initSubPalette(
				title = _title(mc)||mc,
				i, el, _key(mc)||title||mc);
		} :_mainItemColorIndex ? function(mc, container, i) {
			var el = createColor(_palette[mainItemColorIndex]||mc, mainColorsItemTag, mc);
			addCssClass(el, mainItemClass);
			container.appendChild(el);
			_initSubPalette(mc, i, el);
		} : !mainItemIsColor ? function(mc, container, i) {
			var el = createColor(mc, mainColorsItemTag);
			addCssClass(el, mainItemClass);
			container.appendChild(el);
			_initSubPalette(mc, i, el);
		} :  function(mc, container, i) {
			var el = createColor(mc, mainColorsItemTag);
			addCssClass(el, mainItemClass);
			container.appendChild(el);	
			paletteColors.push(mc);
			_initSubPalette(mc, i, el);
		}
		var _subPaletteItems;
		
		function _getColumnMaxIndex(dataLength, columns) {
			var n = Math.floor(dataLength/columns);
			var r = dataLength % columns;
			var max = [];
			
			while (--r >= 0) {
				max[r] = 1;
			}
			max[0] = (max[0]||0) + n;
			for (var i = 1; i < columns; i++) {
				max[i] = n + (max[i]||0) + max[i-1]
			}

			
			return max;
		}
		var _columnsMax;
		var colIndex = 0;
		var _colorContainer;
		var _cp, tbl;
		var _addColorContainer
		var _getPaletteColorContainer
		
		_addColorContainer = function (tag, cls) {
			_colorContainer = document.createElement(tag||'div');
			addCssClass(_colorContainer, cls||'list-column-container')
			_cp.appendChild(_colorContainer)
		}
		
		function _getItem(palette, layout, colorIndex, columns) {
			//
			if (layout === 'grid') {
				var rows = palette.children[0].children[0].children;
				var row = rows[Math.floor(colorIndex/columns)];
				return row.children[colorIndex % columns];
			} else if (columns > 1) {
				var columnEls = palette.children;
				var items;
				var i = 0;
				var x;
				for (var c = 0, n = columnEls.length; c < n; c++) {
					items = columnEls[c].children
					if ((x = i + items.length) > colorIndex) {
						return items[colorIndex - i]
					} else {
						i = x;
					}
				}
			} else {
				return palette.children[colorIndex]
			}
		}
		
		function initBuild(paletteEl, columns, layout, data) {
			colIndex = 0;
			colorCellTag = 'div';
			if (layout === 'list' && columns > 1) {
				_columnsMax = _getColumnMaxIndex((data||_palette).length, columns);
				_cp = paletteEl;
				_addColorContainer();
			} else if (layout === 'grid') {
				tbl = document.createElement('table');
				_cp = document.createElement('tbody');
				tbl.appendChild(_cp);
				paletteEl.appendChild(tbl);
				_addColorContainer('tr', 'colors-grid-row')
				colorCellTag = 'td';
			}
			_getPaletteColorContainer = layout === 'list' && columns > 1 ? function(i, col) {
				if (i === _columnsMax[colIndex]) {
					_addColorContainer()
					colIndex++
				}
				return _colorContainer;
			} : layout === 'grid' ? function(i, c) {
				if (i % columns === 0) {
					_addColorContainer('tr', 'colors-grid-row')
				}
				return _colorContainer;
			} : layout === 'horizontal-bar' || layout === 'vertical-bar' ? function(i, c) {
				return paletteEl;
			} : function (i, c) {
				return paletteEl;
			}
		}
		
		function getMaxColumns() {
			var max = 0;
			if (mainItems) {
				if (subPaletteField) {
					
				} else {
					mainItems.forEach(function(mc, i) {
						_palette = colors[mc]||[]
						max = Math.max(max, _palette.length);
					})	
				}
			} else if (pairs) {
				n = colors.length/2;
				i = 0;
				for (; i < n; i++) {
					_palette = colors[2*i+1];
					max = Math.max(max, _palette.length);
				}
			} else if (entries) {
				colors.forEach(function(e, i) {
					_palette = e[1];
					max = Math.max(max, _palette.length);
				})
			} else if (subPaletteField) {
				colors.forEach(function(mc, i) {
					_palette = mc[subPaletteField]||[];
					max = Math.max(max, _palette.length);
				})
			}
			return max < 9 ? max : 9;
		}
		selector.subPaletteColumns = subPaletteColumns;
		selector.subPaletteLayout = subPaletteLayout;
		selector._themeElsMap = {};
		if (variableColumns) {			
			if (!colorsTotalWidth) {
				if (typeof subPaletteColumns !== 'number' || subPaletteColumns <= 0) {
					subPaletteColumns = getMaxColumns();
				}
				colorsTotalWidth = ((colorWidth = colorWidth||colorSize||30))*subPaletteColumns;
				if (!colorHeight) {
					colorHeight = colorSize||colorWidth;
				}
			}
		}
		if (!mainColorsContainer)
			mainColorsContainer = el;
		if (mainItems) {
			if (subPaletteField) {
				
			} else {
				mainItems.forEach(function(mc, i) {
					_palette = colors[mc]||[]
					addMainItem(mc, mainColorsContainer, i);
					_palette.forEach(function(c, j) {
						addSubPaletteColor(c, j, _getPaletteColorContainer(j, c));
					})
				})	
			}
		} else if (pairs) {
			n = colors.length/2;
			i = 0;
			for (; i < n; i++) {
				_palette = colors[2*i+1];
				addMainItem(colors[2*i], mainColorsContainer, i);
				_palette.forEach(function(c, j) {
					addSubPaletteColor(c, j, _getPaletteColorContainer(j, c));
				})
			}
		} else if (entries) {
			colors.forEach(function(e, i) {
				_palette = e[1];
				addMainItem(e[0], mainColorsContainer, i);
				_palette.forEach(function(c, j) {
					addSubPaletteColor(c, j, _getPaletteColorContainer(j, c));
				})
			})
		} else if (subPaletteField) {
			colors.forEach(function(mc, i) {
				_palette = mc[subPaletteField]||[];
				addMainItem(mc.value||mc.color||mc.hex||mc.hexValue, mainColorsContainer, i);
				_palette.forEach(function(c, j) {
					addSubPaletteColor(c, j, _getPaletteColorContainer(j, c));
				})
			})
		}
		selector.__paletteColors__ = paletteColors;
		selector.getCssColor = getCssColor
		selector.setValue = function(val, colorEl) {
			var self = this;
			var item,
			    p, v,
				i, n, colors,
				found,
				colorEl;
				
			if (isDOMElt(colorEl)) {
				found = true;
			} else {
				p = this.findColor(val);
				if (!p) {
					if (isArray(colors = this.extraColors)) {
						i = 0;
						n = colors.length;
						v = this.getCssColor(val);
						for (; i < n; i++) {
							if (v === this.getCssColor(val)) {
								found = true;
								this._valEl = this._extraColorsEl.children[i];
								break;
							}
						}
					}
					
					if (!found) {
						if (val === 'transparent' && this.allowTransparentColor) {
							found = true;
							this._valEl = this._transparentColorEl;
						} else {
							throw new Error('Color not in palette');
						}
					}
				}
			}
			
			
			if (!p) { //is click on extra color
				this.__value_ = this.getCssColor(val);
				if (colorEl != undefined && hasClass(colorEl, 'extra-color-cell')) {
					var themEl = this._themeElsMap[this._currentPaletteKey];
					
					if (themEl) {						
						//removeClass(themEl, 'active-tab')						
						//this._currentSubPalette.style.display = 'none';					
					}
					
					if ((item = this._currentItem)) {
						removeClass(item, 'selected');
						item.removeAttribute('aria-selected');
					}
					/*if (this._currentTab)
						removeClass(this._currentTab, 'active-tab')*/
					
					//this._currentSubPalette = undefined;
					//this._currentPaletteKey = undefined
					//this._currentTab = undefined;
					this._currentItem = undefined;
					this._valEl = colorEl;
				} else { //click on opened list/grid's item/cell
					this._valEl = this._currentItem = colorEl;
					addCssClass(colorEl, 'selected');
					colorEl.setAttribute('aria-selected', 'true');
				}
				
			} else if (this.singleSubPaletteVisible) {
				if (p && this._currentPaletteKey  === p.paletteKey && this._currentColorIndex === p.colorIndex) {
					return this;
				}
				var colorIndex = p.colorIndex
				var subPalette = this._subPalettes[p.paletteKey];				
				
				this.__value_ = p.cssColor;
				
				themEl = this._themeElsMap[this._currentPaletteKey];
				removeClass(themEl, 'active-tab')	
				this._currentSubPalette.style.display = 'none';
				
				if ((item = this._currentItem)) {
					removeClass(item, 'selected');
					item.removeAttribute('aria-selected');
				}
				
				item = _getItem(subPalette, selector.subPaletteLayout, colorIndex, selector.subPaletteColumns);
				
				addCssClass(item, 'selected');
				item.setAttribute('aria-selected', 'true');
				subPalette.style.display = 'block';
				
				addCssClass(themEl = this._themeElsMap[this._currentPaletteKey = p.paletteKey], 'active-tab')
				
				this._subPaletteTitle.innerHTML = getPaletteTitle(themEl._val);
				
				this._currentSubPalette = subPalette;
				this._currentColorIndex = colorIndex;
				this._currentItem = this._valEl = item;
			} else {
				this.__value_ = p.cssColor;	
			}
			this.syncVal();
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
		selector._subPalettes = _subPalettes;
		container = settings.container||settings.appendTo||settings.parentElement||settings.parentEl||settings.parentNode||settings.parent;
		el = ColorPaletteBase.finalize(el, selector, settings, colorBox, colorIndex,
			morePane, container,
			'SereniX-color-selector SereniX-grouped-color-selector grouped-grid' 
				+ ' '
				+ ( separatedPanes ? 
					(subPaletteLayout||defaultSubPaletteLayout||'list') + '-sub-palettes' :
					subPaletteLayout||'row-group')
				+ (' ' + mainColorsOrientation + '-main-colors')
				+ groupMultiColumnClass
			);
		if (namedGroup  && !separatedPanes) {
			adjustBarGroupSizes(mainColorsLayout, selector);
		}
		return el;
	}
	
	createGroupedColorPalette.objToHtmlFormat = objToHtmlFormat;
	
	objToHtmlFormat.__NAMESPACE_NAME__ = 'SereniX.ui';
	objToHtmlFormat.__FUNCTION__ = objToHtmlFormat;
	objToHtmlFormat.__FUNCTION_NAME__ = 'objToHtmlFormat';
	
	function adjustBarGroupSizes(mainColorsLayout, selector) {
		var field = mainColorsLayout === 'vertical-bar' ? 'width' : 'height';
		var gEls = selector._themeElsMap;
		var k;
		var size = 0;
		
		for (k in gEls) {
			size = Math.max(size, gEls[k].getBoundingClientRect()[field]);
		}
		field = 'min' + field[0].toUpperCase() + field.substring(1);
		
		if (isIE) {
			//TODO: includes insets to the value of size
			
		}
		size += 'px';
		for (k in gEls) {
			gEls[k].style[field] = size;
		}
	}
	
	var ua = window.navigator.userAgent,
		isIE = ua.indexOf("MSIE ") > 0;
	
	
	createGroupedColorPalette.__FUNCTION__ = createGroupedColorPalette;
	createGroupedColorPalette.__FUNCTION_NAME__ = 'createGroupedColorPalette';
	
	if (typeof SereniX.ui.addChild === 'function') {
		SereniX.ui.addChild(createGroupedColorPalette);
		SereniX.ui.addChild(objToHtmlFormat);
	} else {
		SereniX.ui.createGroupedColorPalette = createGroupedColorPalette;
		SereniX.ui.objToHtmlFormat = objToHtmlFormat;
	}
	
	SereniX.objToHtmlFormat = objToHtmlFormat;
	SereniX.createGroupedColorPalette = createGroupedColorPalette;
	
	return createGroupedColorPalette;
});