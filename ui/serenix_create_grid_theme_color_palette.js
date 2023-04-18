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
})(this, 'createGridThemeColorPalette', function() {
	
	function $el(tag) {
		return document.createElement(tag||'div');
	}
	
	var forEach = Array.prototype.forEach;

	var defaultLabels = {
		colors: {
			theme : 'Theme Colors',
			standard : 'Standard Colors',
			web: 'Web Colors'
		},
		history: 'History'
	};

	var ua=window.navigator.userAgent,
		isIE=ua.indexOf("MSIE ")>0;
		
		
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
	var closeCell=isIE?'"><div style="width:2px;"></div></td>':'"><span></span></td>'

	function colorCell(colors, i, colorString) {
		return '<td class="color-cell" style="background-color:' 
				+ colorString(colors[i]) 
				+ ';' 
				+ closeCell;
	}
	
	
	function drawGrid(colorString, baseThemeColors, subThemeColors, standardColors, labels,
						value, paletteColors, transparentColor) {
		var oTRTH='<tr><th colspan="10" class="ui-widget-content">';
		var html = '<table class="'+('palette-table' + (isIE ? '-ie' : ''))+'"><tr>';
		
		var _i;
		var themes = baseThemeColors.length;
		var subThemes = subThemeColors.length;
		var subThemeRows = subThemes/themes;		
		var innerRows = subThemeRows - 1;
		var stdColorsLabel = labels ? (labels.colors ? labels.colors.standard||labels.colors.std : labels[1]||labels.standardColors||labels.standardcolors)||'Standard Colors' : null;
		
		// base theme colors
		for(i=0;i<themes;i++){
			html += colorCell(baseThemeColors, i, colorString);
			paletteColors.push(baseThemeColors[i]);
		}
		html+='</tr>';
		if(!isIE){
			html+='<tr><th colspan="' + themes + '"></th></tr>';
		}
		html+='<tr class="top">';
		// theme colors
		for(i=0;i<themes;i++){
			html += colorCell(subThemeColors, i, colorString, value);
			paletteColors.push(subThemeColors[i]);
		}
		for(var r=1;r<innerRows;r++){
			html+='</tr><tr class="in">';
			for(i=0;i<themes;i++){
				html += colorCell(subThemeColors, _i = r*themes+i, colorString, value);
				paletteColors.push(subThemeColors[_i]);
			}
		}
		html+='</tr><tr class="bottom">';
		for(i=innerRows*themes;i<subThemes;i++){
			html += colorCell(subThemeColors, i, colorString, value);
			paletteColors.push(subThemeColors[i]);
		}
		html+='</tr></table>';
		return html;
	}
	
	function drawStandardColors(colorString, colors, columns, paletteColors) {
		var cls = 'palette-table' + (isIE ? '-ie' : '');
		var html = '<table class="'+cls+'">';
		
		for(var i=0, n = colors.length;i<n;i++){
			if (i % columns === 0) {
				html += '<tr>';
			}
			html += colorCell(colors, i, colorString);
			paletteColors.push(colors[i]);
		}
		html+='</tr></table>';
		return html;
	}
	
	
	
	
	function createGridThemeColorPalette(settings, selector, el) {
		var self;
		var container;
		var props;
		var x = arguments[2];
		var input;
		var onChange;
		var labels;
		var stdColorsLabel; //=labels[1]
		var picker;
		var colorString;
		var orientation;
		var colorIndex;
		var colorBox;
		var paletteColors = [];
		
		var CPB = SereniX.ui.ColorPaletteBase;
		var GTCP = SereniX.ui.GridThemeColorPalette;
		
		settings = CPB.getSettings.apply(this, arguments);
		
		colorString = settings.getCssColor||settings.colorString||SereniX.CssColorUtils.getCssColor;
		el = el||settings.el||settings.element||settings.elt||settings.dom
		container = settings.container||settings.appendTo||settings.parentElement||settings.parentEl;
		input = settings.input;
		value = settings.value||settings.color||settings.initialValue||settings.initialColor||'#FFF';
		
		labels = settings.labels||defaultLabels;
		
		stdColorsLabel = (labels.colors ? labels.colors.standard||labels.colors.std : labels[1]||labels.standardColors||labels.standardcolors)||'Standard Colors';
		
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
		
		props = selector.__definedProperties__||(selector.__definedProperties__ = {});
		
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
		
		x = settings.colors||settings.palette;
		if (!isPlainObj(x))		
			x = settings.themeColors||settings.baseThemeColors ? settings : GTCP;
		
		themeColors = x.themeColors||x.baseThemeColors||x.baseTheme;
		subThemeColors = x.subThemeColors||x.baseSubThemeColors||x.subTheme;
		standardColors = x.standardColors||x.baseStandardColors||x.standard;
		
		/*
		settings.transparentColor === undefined ? 
				(settings.allowTransparent === undefined ? settings.allowTransparentColor : settings.allowTransparent) :
				settings.transparentColor
				*/
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
		
		var title, tit, _tit;
		
		var main = document.createElement('div');
		
		var std = document.createElement('div');
		var morePane;
		
		ColorPaletteBase.initUntitledColorPane(settings, selector);
		
		addCssClass(main, 'main');
		main.innerHTML = drawGrid(colorString, themeColors, subThemeColors, standardColors,
							labels, value, paletteColors, transparentColor);
							
		tit = settings.title||settings.label;
		if (tit instanceof String || tit instanceof Boolean
				|| tit instanceof Number
				|| tit instanceof Function) {
			tit = tit.valueOf();
		}
		if ((function() {
			if (toBool(settings.noTitle))
				return false;
			if (typeof tit === 'string') {
				_tit = tit.toLowerCase();
				return _tit === 'true' ? true : _tit === 'false' ? false : tit;
			} else if (typeof tit === 'number')
				return !!tit;
			else if (typeof tit === 'function')
				return tit(selector, settings);
			return tit == undefined ? 'Theme Colors' : tit;
		})()) {
			title = document.createElement('div');
			addCssClass(title, 'title inner-title');
			title.innerHTML = escapeHTML(tit === true ? 'Theme Colors' : tit||'Theme Colors');
			el.appendChild(title);
		}
		
		
		el.appendChild(main);
		
		// transparent color
		if(transparentColor){
			var div = document.createElement('div');
			if (showTransparentText)
				div.innerHTML = escapeHTML(ColorPaletteBase.getTransparentText(settings));
			addCssClass(div, ColorPaletteBase.transparentColorClass);
			div.selector = selector;
			el.appendChild(div);
			selector._transparentColorEl = div;
		}
		
		var label = settings.standardColorsTitle||settings.standardColorsLabel||'Standards Colors';
		std.innerHTML = '<div class="title inner-title">' 
				+ escapeHTML(label) 
				+ '</div><div class="standard-colors-content">' 
				+ drawStandardColors(colorString, standardColors, themeColors.length, paletteColors)
				+ '</div>';
		addCssClass(std, 'standard-colors-block');
		el.appendChild(std);
		selector.__paletteColors__ = paletteColors;
		return ColorPaletteBase.finalize(el, selector, settings, colorBox, colorIndex, morePane, container, 
			'SereniX-color-selector SereniX-theme-color-selector theme-grid');
	}
	
	return createGridThemeColorPalette;
});
