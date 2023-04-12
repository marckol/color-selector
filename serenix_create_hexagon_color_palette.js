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
})(this, 'createHexagonColorPalette', function() {

	function createHexagonColorPalette($) {
		var ua=window.navigator.userAgent,
			isIE=ua.indexOf("MSIE ")>0,
			_ie=isIE?'-ie':'';
		
		function drawContent() {
			var i, n,
				oTd='<td class="color-cell" style="background-color:',
				cTd=isIE?'"><div style="width:5px;"></div></td>':'"><span></span></td>',
				oTable='<table class="'+ subPaletteClass +'"><tr>',
				cTable='</tr></table>';

			var h='<div class="main-palette color-palette-hcentered">';
			
			var col;
			// hexagon colors
			for(var r=0,rows=pColors.length;r<rows;r++){
				h+= '<div class="hexagon-row">' + oTable;
				var rColors=pColors[r];
				for(i=0,n=rColors.length;i<n;i++){
					h+=oTd+getCssColor(rColors[i])+cTd;
				}
				h+=cTable + '</div>';
			}
			
			h += '</div>';
			
			h+='<div class="horizontal-separator"></div>';
			h += ColorPaletteBase.drawGrayScaleColors('gray-scale-palette color-palette-hcentered', subPaletteClass);
			return h;
		}
		var el;
		var subPaletteClass;
		var selector;
		var palette;
		var id;
		var container;
		var colorIndex;
		var valueEl;
		var historyPane;
		var getCssColor = SereniX.CssColorUtils ? SereniX.CssColorUtils.getCssColor : function(c) {
			return c[0] === '#' ? c : '#' + c;
		};

		
		$ = $||{};
		
		el=el||$.element||$.el||$.dom;
		container = $.container||$.appendTo||$.parentELement||$.parentEl||$.containerId||$.containerID;
		colorIndex = colorIndex||$.colorIndex||$.colorInd;
		valueEl = valueEl||$.colorBox||$.colorBlock
					||$.colorValueElement||$.colorValueEl
					||$.valueElement||$.valueEl;
		
		subPaletteClass =  ($.paletteTableClass||$.subPaletteClass||'palette-table')+_ie;
		
		pColors = $.hexagonColors||$.colors||$.palette;
		if (!pColors) {
			pColors = ColorPaletteBase.webHexagonColors;
		} else if (!isArray(colors) || ColorPaletteBase.isHexagonArray(colors)) {
			throw new Error('Incorrect color palette');
		}
		
		
		if (typeof el === 'string') {
			id = $.id||$.Id||$.ID||el;
			el = false;
		} else {
			id=id||$.id;
		}
		
		
		
		if (!el && typeof id === 'string' && id) {
			el = document.getElementById(id);
		}
		
		el = el||document.createElement('div');
		
		if (id) {
			el.id = id;
		}
		
		selector = selector||ColorPaletteBase.newSelector(el);
		
		el.selector = selector;
		
		el.innerHTML = drawContent();

		ColorPaletteBase.initUntitledColorPane($, selector);
		
		ColorPaletteBase.setHistorySettings($, selector);
		
		el = ColorPaletteBase.setExts(el, valueEl, colorIndex, ColorPaletteBase.buildMorePane($, selector), container, selector, $);
		
		var props = selector.__definedProperties__||(selector.__definedProperties__ = {});
		
		if (!selector.__CLASS__ && !(selector.mouseBorder
				|| selector.mouseBorderBar
				|| selector.updateUI
				|| selector.setValueMode) ) {
		  ColorPaletteBase.setProps(selector, props);
		  ColorPaletteBase.setMethods(selector);
	    }
		
		x = $.dataType||$.valueType;		
		if (x) {
			selector.dataType = x === 'hex' ? 'string' : x === 'rgb' || x === 'hsb' ? 'object' : x;
		}
		
		x = $.valueMode||$.mode||x;
		if (x) {
			selector.setValueMode(x);
		}
		
		ColorPaletteBase.bindColorCellEvents(el);
		
		addCssClass(el, 'SereniX-color-selector hexagon');
		
		selector._element__ = el;
		
		return el;
	}
	
	return createHexagonColorPalette;

});