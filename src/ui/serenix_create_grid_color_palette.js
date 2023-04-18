/* 
 * The MIT License
 *
 * Copyright 2022 Marc KAMGA Olivier <kamga_marco@yahoo.com;mkamga.olivier@gmail.com>.
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
 
 if (typeof globalNS === 'undefined') {
	 globalNS = typeof window !== 'undefined' ? window :
					typeof global !== 'undefined' ? global :
					typeof self !== 'undefined' ? self : this;
 }

;(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }    
})(this, 'createGridColorPalette', function() {
    //list of named color palettes
    var colorPalettes = {};
    
    var doc = document;
	
	
    /**
     * Creates a color palette.
     * <p>When no argument specified, the scope global colors variable is used.</p>
     * @param {Object|Array|Function} [$] 
     *      <p>When the argument is a plain object it represents the editor.</p>
     *      <p>When the argument is an array it represents the colors.</p>
     *      <p>When the argument is a function it represents the action.</p>
     * @param {Function} [action] This argument is considered/used when the first argument is not a function
     * @param {Array} [colors] The default colors to use when no colors specified by the previous arguments.
     * @param {HTMLElement} [cPalette] The color palette that corresponds to default colors
     * @returns {HTMLElement}
     */
    function createGridColorPalette($, action, colors, cPalette, toCssColor, getHtmlText) {
        
        var el;
		var selector;
        function cpColors(colors) {
            if (isPlainObj(colors)) {
                cpName = colors.id||colors.Id||colors.ID||colors.name||colors.Name;
                var data = unboxVal(colors.colors||colors.colorsList||colors.data);
                if (typeof data === 'string')
                    return data.split(/[ \t]*\|[ \t]*/);
                if (!isArray(data))
                    throw new Error('Incorrect data');
                return data;
            }
            return colors;
        }
        function fire(ev) {
            var cp = this.palette, tr;
            ev = ev||window.event;
            ev.color = ev.val = ev.value = cp.value;
            if (cp.action)
                cp.action.call(this, ev);
            if (fire.action)
                fire.action.call(this, ev);
            if (cp.currentColorIndex >= 0 && this.colorIndex !== cp.currentColorIndex) {
                cp.cells[cp.currentColorIndex].children[0].tabIndex = -1;
                cp._current = this;
                this.tabIndex = 0;
                cp.currentColorIndex = this.colorIndex;
            }
        }  
        fire.action = action||function(ev) {};
        
        function onCellFocus(ev) {
            var cp = this.palette, tr;
            ev = ev||window.event;
            ev.color = ev.val = ev.value = cp.value;
            if (cp.currentColorIndex >= 0 && this.colorIndex !== cp.currentColorIndex) {
                cp.cells[cp.currentColorIndex].children[0].tabIndex = -1;
                cp._current = this;
                this.tabIndex = 0;
                cp.currentColorIndex = this.colorIndex;
            }
            var fn = cp.onCellFocus||cp.onColorFocus;
            if (typeof fn === 'function') {
                fn.call(this, ev);
            }
        }
		
		function getDefaultColorPaletteColumns() {
			var i = 0, count = 0, n = _colors.length;
			var c;
			for (; i< n; i++) {
				c = _colors[i];
				if (c === null || c === undefined || (typeof c === 'string' && c[0] === '-')) {
					if (count)
						return i;
					count = 0;
				} else {
					count++;
				}
			}
			return count % 7 === 0 ? 7 : 
				count % 8 === 0 ? 8 :
				count % 9 === 0 ? 9 :
				count % 10 === 0 ? 10 :
				count % 11 === 0 ? 11 :
				count % 12 === 0 ? 12 : 
				count % 13 === 0 ? 13 : 
				count % 14 === 0 ? 14 :
				count % 15 === 0 ? 8 :
				count < 7 ? count : 7;
		}
        
        var _colors, 
            ed, //The editor
            cpName  //the name of the color palette: used to cache the color 
                    //palette
        ;
        
        var tbl = document.createElement('table'), tr,
			td, 
            columns,
			cel,
			i = 0,
			x,
			rowIndex = -1,
			cells = [];
		var _toHtml = getHtmlText||(typeof toHtml === 'function' ? toHtml : escapeHTML||function(c) { return c.text||c.title||c.head||c.name||''});
		
		var groupNode;
		function group(c) {
			var key;
			if (tr) tbl.appendChild(tr);
			td = doc.createElement('td');
			spannedTds.push(td);
			maxCols = Math.max(Math.min(i, columns), maxCols);
			key = (td.innerHTML = c || c == undefined ? '' : (_toHtml(c)||'').trim()) ? 'group' : 'separator';
			addCssClass(td, 'colors-' + key);
			tr = doc.createElement('tr');
			tr.appendChild(td);
			tbl.appendChild(tr);
			rowIndex++;
			i = 0;
			tr = null;
		}
			
		function paintColorCell(c, j) {
			//1. value that does not start with a digits represents directly
			//a valid HTML/CSS color (hexa, egb, egba, hsk, hsla, 
			//color name).
			//
			//2. value that starts with a digit need to be combined with 
			//'rgb(' prefix and ')' to get a valid HTML/CSS color.
			cel.style.backgroundColor = c;
			addCssClass(cel, 'color');
			cel.value = cel.val = cel.color = c;
			cel.palette = el; 
			cel.colorIndex = j;
			cel.rowIndex = rowIndex;
			if (_current) {
				cel.tabIndex = -1;
			} else {
				_current = cel;
				el._current = cel;
				el.currentColorIndex = j;
				cel.tabIndex = 0;
				el.currentCellIndex = c;
			}
			addEvt('focus', cel, onCellFocus);
			bindAction(cel, fire);
			tr.appendChild(td);
			i++;
			count++;
		}
		
		function addGroupCell(cls) {
			if (tr) tbl.appendChild(tr);
			tr = doc.createElement('tr');
			td = doc.createElement('td');
			td.appendChild(cel = document.createElement('div'));
			spannedTds.push(td);
			maxCols = Math.max(Math.min(i, columns), maxCols);
			i = 0;
			addCssClass(cel, cls);
		}
		
		var newSelector = ColorPaletteBase ? ColorPaletteBase.newSelector : function(el, id) {
			var s = {_element__: el, getElement: function(){ return this._element__;}};
			if (id)
				s.id = id;
			el.id = id;
			return s;
		}
        
		
		var self;
		var el;
		var props;
		var x = arguments[2];
		var value;
		var onChange;
		var len = arguments.length;
		var cpbPalettes;
		
		if ($ instanceof String) {
			$ = $.valueOf();
		}
		
		if (len === 0) { 
			$ = {colors: colors = _colors = ColorPaletteBase.DEFAULT_RGB_COLORS};
			selector = {};
		} else if (len === 1) {
			if (isDOMElt($)) {
				el = $;
				selector = {};
				action = undefined;
			} else if (typeof $ === 'object' && $) {
				selector = $.selector;
				el = $.el||$.element;
				action = $.action;
				colors = $.colors;
				cPalette = $.cPalette||$.colorPalette;
				onChange = $.onChange||$.change||$.onUpdate||$.update;
			} else if (typeof $ === 'string' && $) {
				el = document.getElementById($);
				if (!el) {
					el = document.createElement('div');
					el.id = $;
				}
				selector = {};
				action = undefined;
			} else {
				throw new Error('Incorrect arguments');
			}
		} else if (isDOMElt($)) {
			if (typeof selector === 'string') {
				$ = { el: el = $, value: selector};
				selector = typeof x === 'object' && x ? x : {};
			} else if (typeof x === 'object' && x) {
				el = $;
				$ = selector;
				selector = x;
			} else {
				$ = { el: el = $};
			}
		} else if (typeof $ === 'string') {
			el = document.getElementById($);
			if (!el) {
				el = document.createElement('div');
				el.id = $;
			}
			if (typeof selector === 'string') {
				$ = { el: el, value: selector};
				selector = typeof x === 'object' && x ? x : {};
			} else if (typeof x === 'object' && x) {
				$ = selector;
				selector = x;
			} else {
				$ = { el: el};
			}
		} else if (isPlainObj($)) {
			if (typeof action === 'function') {
				
			} else if (isPlainObj(action)) {
				selector = action;
				if (len === 2) {
					colors = selector.colors;
					action = selector.action;
					cPalette = selector.cPalette||selector.colorPalette;
					onChange = selector.onChange||selector.change||selector.onUpdate||selector.update;
				}
			} else if (isArray(action)) {
				x = action;
				if (typeof colors === 'function') {
					action = colors;
					colors = x;
				}
			}
		}
		
		
        if (isArray(action)) {
            x = action;
            action = colors;
            colors = x;
        }
        if ((x = typeof ($ = unboxVal($))) ==='function' || $ instanceof Function) {
            x = $;
            $ = unboxVal(action);
            action = x;
        }
        if (typeof $ === 'string') {
            if ((el = colorPalettes[x])) {
                return el;
            } else {
                
            }
        } else if (isPlainObj($)) {
            ed = $;   
            //cpColors sets the variable cpName and returns the colors of the
            //palette
            _colors = cpColors($.colors)||ColorPaletteBase.DEFAULT_RGB_COLORS;
            if (cpName && (el = colorPalettes[cpName])) {
                return el;
            }
			if (!toCssColor)
				toCssColor = $.toCssColor||$.getCssColor;
        } else if (isArray($)) {
            _colors = $;
            $ = undefined;
        } else {
            throw new TypeError('Incorrect argument');
        }
		
		if ($) {
			el = el||$.el||$.element||$.elt||$.dom
			value = $.value||$.color||$.initialValue||$.initialColor||'#FFF';
		}
        
        if (!_colors) {
            _colors = colors;
        }
                
        if (colors === _colors && cPalette) {
            return cPalette;
        }
        
        var _current;
		var count = 0;
		
        
        el = el||document.createElement('div');
        el.colors = _colors;
        el.cells = cells;
        el.ed = el.editor = ed;
		
		if (selector instanceof String)
			selector = selector.valueOf();
		if (typeof selector === 'string' && selector) {
			selector = newSelector(el, selector);
		}
		
		selector = selector||newSelector(el);
        
        addCssClass(el, 'SereniX-color-palette');
        
        columns = ed ? ed.createColorPaletteColumns
						||ed.colorPaletteColumns
						||ed.colorsPerRow
						||ed.maxColorsPerRow
						||ed.colorPaletteColorsPerRow
						||getDefaultColorPaletteColumns() :
				  getDefaultColorPaletteColumns();
		var spannedTds = [];
		var maxCols = 0;
		var groupNode, groupParent;
		var _toCssColor = toCssColor||SereniX.CssColorUtils.getCssColor;
		var paletteColors = [];
        _colors.forEach(function(c, j) {
            var match;
            if (typeof (c = unboxVal(c)) === 'string') {
                if ((match = /\[\[((?:[^\]]|\\\])+)\]\]/.exec(c)))
                    c = { 
                        text : match[1].replace(/\\(\\|\])/g, function($0, $1) {
                            return $1;
                        })
                    };
            } else if (!c) {
                c = {};
            } else if (!isPlainObj(c))
                throw new TypeError('Incorrect color');
            
			if (c == null || c === '') {
				addGroupCell('colors-separator');
            } else if (typeof c === 'string') {
				if ((match = /^\s*[-]+\s*([^-]+)[-]+\s*/.exec(c))) {
					addGroupCell('colors-' + (match[1] ? 'group' : 'separator'));
					if (match[1])
						cel.innerHTML = escapeHTML(match[1]);
				} else if ( /^>/.test(c)) { // collapsible or tree node
				    if (groupNode) {
						groupParent = groupNode;
					}
					groupNode = document.createElement('div');
					if (groupParent) {
						groupParent.appendChild(groupNode)
					}
					throw new Error('Not yet supported');
				} else {
					if (i % columns === 0) {
						if (tr) tbl.appendChild(tr);
						tr = doc.createElement('tr');
						rowIndex++;
					}
					td = doc.createElement('td');
					td.appendChild(cel = document.createElement('div'));
					try {
						c = _toCssColor(c);
						if (typeof c === 'string' && c[0] === '#') {
							console.log(c);
						}
						if (c) {
							paletteColors.push(c);
							paintColorCell(c, j);
						} else {
							group(c)
						}
					} catch(err) {
						group(c);
					}
				}
            } else {
				try {
					c = _toCssColor(c);
					if (c) {
						paintColorCell(c, j);
					} else {
						group(c)
					}
				} catch(err) {
					group(c)
				}
                
            }
            cells.push(td);
        });
		spannedTds.forEach(function(td) {
			td.colSpan = maxCols;
		});
        if (i && tr) tbl.appendChild(tr);
        el.appendChild(tbl);
        if (cpName) {
			ColorPaletteBase.register(el, cpName);
            colorPalettes[cpName] = el;
        }
		if (el.id) {
			ColorPaletteBase.register(el);
            colorPalettes[el.id] = el;
        }
	    addCssClass(el, 'SereniX-color-selector .SereniX-color-palette grid');
		el.selector = selector;
		
		selector.__paletteColors__ = paletteColors||[];
		
		selector.getColorIndex = function(color) {
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
		selector.containsColor = function(color) {
			return this.getColorIndex(color) >= 0;
		}
		
		if (!selector.getValue && !selector.setValue) {
			ColorPaletteBase.setMethods(selector);
		}
		
		ColorPaletteBase.setProps(selector);
		
		ColorPaletteBase.setElement(el);
		
        return el;
    }
    
    createGridColorPalette.__FUNCTION_NAME__ = 'createGridColorPalette';
    
    createGridColorPalette.__NAME__ = 'createGridColorPalette';
    
    return createGridColorPalette;
});

if (typeof SereniX === 'undefined') {
	globalNS.SereniX = { ui: {createGridColorPalette: createGridColorPalette}};
} else if (SereniX.Namespace && typeof SereniX.Namespace.ns === 'function') {
	SereniX.Namespace.ns('SereniX.ui').addChild(createGridColorPalette);
} else
	(SereniX.ui||(SereniX.ui={})).createGridColorPalette = createGridColorPalette;

globalNS.colorPalette = createGridColorPalette;

colorPalette.__ALIAS_NAME__ = 'colorPalette';

SereniX.ui.colorPalette = createGridColorPalette;
