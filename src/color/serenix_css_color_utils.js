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


/**
  * 
  * @param {Number|Array|Object} $0
  * @param {Number|Boolean} $1
  * @param {Number} $2
  * @param {Boolean} obj
  * @returns {Array|Object}
  */
function rgbToHsb($0, $1, $2, obj) {
    var hsb = { h: 0, s: 0, b: 0 }
	var rgb;
	var obj;
	if (typeof $0 === 'string' || $0 instanceof String) {
		obj = arguments[1];
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
		obj = $1;
	} else if (isArray($0)) {
		rgb = {
		  r: $0[0],
		  g: $0[1],
		  b: $0[2]
		}
		obj = $1;
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
    return obj ? hsb : [hsb.h, hsb.s, hsb.b];
  }
/**
 * Hex To RGB
 * @param {string} hex
 */
function hexToRgb(hex) {
	if (hex[0] === '#')
		hex = hex.substring(1);
	return {
	  r: parseInt(hex.substr(0, 2), 16),
	  g: parseInt(hex.substr(2, 2), 16),
	  b: parseInt(hex.substr(4, 2), 16)
	}
}

function rgbToHex(r, g, b) {
    function toHex(i) {
        var t, u, digits = "0123456789abcdef";
		i = parseInt(i, 10);
        if (i >= 0 && i <= 255) {
            u = i%16;
            return digits[(i - u)/16] + digits[u];
        }
        throw new Error("Incorrect argument");
    }
    if (isArray(r)) {
        b = r[2];
        g = r[1];
        r = r[0];
    } else if (typeof r === 'object' && r) {
        b = r.b;
        if (b == undefined) {
            b = r.blue;
            g = r.green;
            r = r.red;
        } else {
            g = r.g;
            r = r.r;
        }
    }
	if (r == undefined && r == undefined && r == undefined)
		return '';
    return '#' + toHex(r) + toHex(g) + toHex(b);
}


function arrayRgbToHex(rgb) {
	if (rgb == undefined)
		return;
	if (rgb[0] == undefined && rgb[1] == undefined && rgb[2] == undefined)
		return '';
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

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the range 0 to 255 and
 * returns h, s, and v in the range 0 to 255.
 *
 * @param   {Number}  r       The red color value
 * @param   {Number}  g       The green color value
 * @param   {Number}  b       The blue color value
 * @returns {Array}            The HSV representation
 */
function rgbToHsv(r, g, b, obj) {
	if (isArray(r)) {
		obj = g;
		g = r[1];
		b = r[2];
		r = r[0];
	} else if (isPlainObj(r)) {
		obj = g;
		g = r.g;
		b = r.b;
		r = r.r;
	}
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
	h = 0; // achromatic
  } else {
	switch (max) {
	  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
	  case g: h = (b - r) / d + 2; break;
	  case b: h = (r - g) / d + 4; break;
	}

	h /= 6;
  }

  return [ h, s, v ];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the range 0 to 255 and
 * returns r, g, and b in the range 0 to 255.
 *
 * @param   {Number}  h       The hue
 * @param   {Number}  s       The saturation
 * @param   {Number}  v       The value
 * @returns {Array}            The RGB representation
 */
function hsvToRgb(h, s, v) {
	function val(v) {
		return Math.max(0, Math.min(Math.round(v), 255));
	}
	var r, g, b;

	var i = Math.floor(h * 6);
	var f = h * 6 - i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0: r = v; g = t; b = p; break;
		case 1: r = q; g = v; b = p; break;
		case 2: r = p; g = v; b = t; break;
		case 3: r = p; g = q; b = v; break;
		case 4: r = t; g = p; b = v; break;
		case 5: r = v; g = p; b = q; break;
	}
	return [ val(r * 255), val(g * 255), val(b * 255) ];
}

/**
 * 
 * Assumes that arguments in the range 0 to 1
 * @param {Number} h Hue
 * @param {Number} w Whiteness
 * @param {Number} b blackness
 * @returns {Array}
 */
function hwbToRgb (h, w, b) {
	if (isArray(r)){
		g = r[1];
		b = r[2];
		r = r[0];
	} else if (isPlainObj(r)) {
		g = r.g||r.green||0;
		b = r.b||r.blue||0;
		r = r.r||r.red||0;
	}
	var rgb = hslToRgb(h, 1, 0.5)

	for (var i = 0; i < 3; ++i) {
		var c = rgb[i] / 255

		c *= 1 - w - b
		c += w
		
		rgb[i] = Math.round(c * 255)
	}

	return rgb
}

// HWB [0, 1]
// RGB [0, 255]
function hwbToRgb(h, w, b) {
	if (isArray(h)){
		w = h[1];
		b = h[2];
		h = h[0];
	} else if (isPlainObj(h)) {
		w = h.w||h.whiteness||0;
		b = h.b||r.blackness||0;
		h = h.h||h.hue||0;
	}
  
    h *= 6;
  
    var v = 1 - b, n, f, i;
    if (!h) return {r:v, g:v, b:v};
    i = h|0;
    f = h - i;
    if (i & 1) f = 1 - f;
    n = w + f * (v - w);
    v = (v * 255)|0;
    n = (n * 255)|0;
    w = (w * 255)|0;

    switch(i) {
		case 6:
		case 0: return {r:v, g:n, b: w};
		case 1: return {r:n, g:v, b: w};
		case 2: return {r:w, g:v, b: n};
		case 3: return {r:w, g:n, b: v};
		case 4: return {r:n, g:w, b: v};
		case 5: return {r:v, g:w, b: n};
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
})(this, 'CssColorUtils', function() {
	
	var slice = Array.prototype.slice;
	
	function CssColorUtils() {};
	CssColorUtils.__FUNCTION__ = CssColorUtils;
	CssColorUtils.__FUNCTION__ = CssColorUtils;
	
	/**
	 * Each key (hex, hex value, name, ...) must represents a valid CSS color and each, represents the class
	 * @name SereniX.CssColorUtils.colorClasses
	 * @property {Object} colorClasses 
	 */
	CssColorUtils.colorClasses = {};
	
	var nativeColorNames = {};
	
	var nativeNames = {
		'aliceblue': '#f0f8ff',
		'antiquewhite': '#faebd7',
		'aqua': '#00ffff',
		'aquamarine': '#7fffd4',
		'azure': '#f0ffff',
		'beige': '#f5f5dc',
		'bisque': '#ffe4c4',
		'black': '#000000',
		'blanchedalmond': '#ffebcd',
		'blue': '#0000ff',
		'blueviolet': '#8a2be2',
		'brown': '#a52a2a',
		'burlywood': '#deb887',
		'cadetblue': '#5f9ea0',
		'chartreuse': '#7fff00',
		'chocolate': '#d2691e',
		'coral': '#ff7f50',
		'cornflowerblue': '#6495ed',
		'cornsilk': '#fff8dc',
		'crimson': '#dc143c',
		'cyan': '#00ffff',
		'darkblue': '#00008b',
		'darkcyan': '#008b8b',
		'darkgoldenrod': '#b8860b',
		'darkgray': '#a9a9a9',
		'darkgrey': '#a9a9a9',
		'darkgreen': '#006400',
		'darkkhaki': '#bdb76b',
		'darkmagenta': '#8b008b',
		'darkolivegreen': '#556b2f',
		'darkorange': '#ff8c00',
		'darkorchid': '#9932cc',
		'darkred': '#8b0000',
		'darksalmon': '#e9967a',
		'darkseagreen': '#8fbc8f',
		'darkslateblue': '#483d8b',
		'darkslategray': '#2f4f4f',
		'darkslategrey': '#2f4f4f',
		'darkturquoise': '#00ced1',
		'darkviolet': '#9400d3',
		'deeppink': '#ff1493',
		'deepskyblue': '#00bfff',
		'dimgray': '#696969',
		'dimgrey': '#696969',
		'dodgerblue': '#1e90ff',
		'firebrick': '#b22222',
		'floralwhite': '#fffaf0',
		'forestgreen': '#228b22',
		'fuchsia': '#ff00ff',
		'gainsboro': '#dcdcdc',
		'ghostwhite': '#f8f8ff',
		'gold': '#ffd700',
		'goldenrod': '#daa520',
		'gray': '#808080',
		'grey': '#808080',
		'green': '#008000',
		'greenyellow': '#adff2f',
		'honeydew': '#f0fff0',
		'hotpink': '#ff69b4',
		'indianred': '#cd5c5c',
		'indigo': '#4b0082',
		'ivory': '#fffff0',
		'khaki': '#f0e68c',
		'lavender': '#e6e6fa',
		'lavenderblush': '#fff0f5',
		'lawngreen': '#7cfc00',
		'lemonchiffon': '#fffacd',
		'lightblue': '#add8e6',
		'lightcoral': '#f08080',
		'lightcyan': '#e0ffff',
		'lightgoldenrodyellow': '#fafad2',
		'lightgray': '#d3d3d3',
		'lightgrey': '#d3d3d3',
		'lightgreen': '#90ee90',
		'lightpink': '#ffb6c1',
		'lightsalmon': '#ffa07a',
		'lightseagreen': '#20b2aa',
		'lightskyblue': '#87cefa',
		'lightslategray': '#778899',
		'lightslategrey': '#778899',
		'lightsteelblue': '#b0c4de',
		'lightyellow': '#ffffe0',
		'lime': '#00ff00',
		'limegreen': '#32cd32',
		'linen': '#faf0e6',
		'magenta': '#ff00ff',
		'maroon': '#800000',
		'mediumaquamarine': '#66cdaa',
		'mediumblue': '#0000cd',
		'mediumorchid': '#ba55d3',
		'mediumpurple': '#9370d8',
		'mediumseagreen': '#3cb371',
		'mediumslateblue': '#7b68ee',
		'mediumspringgreen': '#00fa9a',
		'mediumturquoise': '#48d1cc',
		'mediumvioletred': '#c71585',
		'midnightblue': '#191970',
		'mintcream': '#f5fffa',
		'mistyrose': '#ffe4e1',
		'moccasin': '#ffe4b5',
		'navajowhite': '#ffdead',
		'navy': '#000080',
		'oldlace': '#fdf5e6',
		'olive': '#808000',
		'olivedrab': '#6b8e23',
		'orange': '#ffa500',
		'orangered': '#ff4500',
		'orchid': '#da70d6',
		'palegoldenrod': '#eee8aa',
		'palegreen': '#98fb98',
		'paleturquoise': '#afeeee',
		'palevioletred': '#d87093',
		'papayawhip': '#ffefd5',
		'peachpuff': '#ffdab9',
		'peru': '#cd853f',
		'pink': '#ffc0cb',
		'plum': '#dda0dd',
		'powderblue': '#b0e0e6',
		'purple': '#800080',
		'red': '#ff0000',
		'rosybrown': '#bc8f8f',
		'royalblue': '#4169e1',
		'saddlebrown': '#8b4513',
		'salmon': '#fa8072',
		'sandybrown': '#f4a460',
		'seagreen': '#2e8b57',
		'seashell': '#fff5ee',
		'sienna': '#a0522d',
		'silver': '#c0c0c0',
		'skyblue': '#87ceeb',
		'slateblue': '#6a5acd',
		'slategray': '#708090',
		'slategrey': '#708090',
		'snow': '#fffafa',
		'springgreen': '#00ff7f',
		'steelblue': '#4682b4',
		'tan': '#d2b48c',
		'teal': '#008080',
		'thistle': '#d8bfd8',
		'tomato': '#ff6347',
		'turquoise': '#40e0d0',
		'violet': '#ee82ee',
		'wheat': '#f5deb3',
		'white': '#ffffff',
		'whitesmoke': '#f5f5f5',
		'yellow': '#ffff00',
		'yellowgreen': '#9acd32'
	};
	
	var nativeNamesList = [];
	
	(function() {
		var n, c;
		for (n in nativeNames) {
			nativeColorNames[c=nativeNames[n]] = n;
			nativeColorNames[c.substring(1)] = 
			nativeColorNames[c.substring(1).toUpperCase()] = 
			nativeColorNames[c.toUpperCase()] = n;
			nativeNamesList.push(n);
		}
	})();
	
	function lpad(i, len) {
        var s = "" + i;
		if (len == undefined)
			len = 2;
        for (var k = 0, n = len - s.length; k < n; k++) {
            s = "0" + s;
        }
        return s;
    }
	
	function hex2Int(h) {
		return parseInt(h, 16);
	}
	
	function getAlpha(a) {
		var v;
		if (a !== undefined && a !== null && a !== '') {
			if (a[a.length-1] === '%') {
				v = parseFloat(a.substring(0, a.length-1));
				if (v > 100)
					throw new Error('Incorrect alpha value: ' + a);
				return v/100;
			}
			return parseFloat(a);
		}
	}
	
	function rgbComponentVal(c) {
		var v = '' +c;
		if (v[v.length-1] === '%') {
			v = Math.floor(parseFloat(v.substring(0, v.length - 1), 10)*255/100);
		} else {		
			v = parseInt(c, 10);
		}
		if (v < 0 || v > 255 || isNaN(v))
			throw new Error('Incorrect RGB color component value: ' + c);
		return v;
	}
	
	CssColorUtils.rgbComponentVal = rgbComponentVal;
	
	function alphaVal(c) {
		var v = '' +c;
		if (v[v.length-1] === '%') {
			v = Math.floor(parseFloat(v.substring(0, v.length - 1), 10)/100);
		} else {		
			v = parseInt(c, 10);
		}
		if (v < 0 || v > 1 || isNaN(v))
			throw new Error('Incorrect RGB color component value: ' + c);
		return v;
	}
	
	CssColorUtils.alphaVal = alphaVal;
	
	function toHexValue(c) {
		return c === 'transparent' ? '' : '#' + toHex(c);
	}
	
	var _cmykRe = /^(cmyk?)\(\s*(\d+(?:\.\d+)?)%[ \t]*,[ \t]*(\d+(?:\.\d+)?)%[ \t]*,[ \t]*(\d+(?:\.\d+)?)%(?:[ \t]*,[ \t]*(\d+(?:\.\d+)?)%)\s*\)$/;
	var _rgbRe = /^(rgb(a)?)\(\s*(\d{1,3})[ \t]*,[ \t]*(\d{1,3})[ \t]*,[ \t]*(\d{1,3})(?:[ \t]*,[ \t]*(\d+(?:\d+)?))?\s*\)$/;
	var _hColorRe = /^(h(?:s(?:l|v)|wb)(a)?)\(\s*(\d+(?:\.\d+)?|\.\d+)(deg|rad|turn|grad|%)?(?:[ \t]*?(?:,[ \t]*|[ \t]+))(?:(\d+(?:\.\d+)?)(%)?)(?:[ \t]*?(?:,[ \t]*|[ \t]+))(?:(\d+(?:\.\d+)?)(%)?)(?:(?:[ \t]*?(?:,[ \t]*|[ \t]+?)(?:\/[ \t]*)?)(?:(\d+(?:\.\d+)?)(%)?))?\s*\)$/;
	
	function hueAngleRatio(angle) {
		if (!angle || angle === 'deg')
			return 1/360;
		if (angle === 'rad')
			return 1/2*Math.PI;
		if (angle === 'turn')
			return 1;
		if (angle === 'grad')
			return 400;
		if (angle === '%')
			return 100;
		throw new Error('Incorrect angle');
	}
	
	function _toHObj(match, fields) {
		var o = {};
		o[fields[0]] = parseFloat(match[3], 10)*hueAngleRatio(match[4]);
		o[fields[1]] = parseFloat(match[5], 10)/(match[6] ? 100 : 1);
		o[fields[2]] = parseFloat(match[7])/(match[8] ? 100 : 1)
		if (fields.length > 3)
			o[fields[3]] = parseFloat(match[9])/(match[10] ? 100 : 1)
		return o;
	}
	function toHex(c, map, nameAskey) {
		function _hMatchToHex(match) {			
			switch(match[1]) {
				case 'hsl':
					return rgbToHex(hslToRgb(_toHObj(match, ['h', 's', 'l'])));
				case 'hsv':
					return rgbToHex(hsvToRgb(_toHObj(match, ['h', 's', 'v'])))
				case 'hsb':
					return rgbToHex(hsbToRgb(_toHObj(match, ['h', 's', 'b'])))
				case 'hwb':
					return rgbToHex(hwbToRgb(_toHObj(match, ['h', 'w', 'b'])))
				default:
					throw new Error('Not yet supported');
			}
		}
		var match;
		var hex;
		var a;
		if (typeof c === 'string') {
			if (c === 'transparent')
				return '';
			if ((match = /^(#)?([0-9a-fA-F]+)$/.exec(c))) {
				switch((hex = match[2]).length) {
					case 6:
						return hex.toUpperCase();
					case 3:
						return (hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]).toUpperCase();
					case 8:
						return rgbToHex(rgbaToRgb({
							r: hex2Int(hex.substring(0,2), 10),
							g: hex2Int(hex.substring(2,4), 10),
							b: hex2Int(hex.substring(4,6), 10),
							a: hex2Int(hex.substring(6), 10)/255
						}));
					case 4:
						return rgbToHex(rgbaToRgb({
							r: hex2Int(hex[0] + hex[0], 10),
							g: hex2Int(hex[1] + hex[1], 10),
							b: hex2Int(hex[2] + hex[2], 10),
							a: hex2Int(hex[3] + hex[3], 10)/255
						}));
					default:
						throw new Error('Incorrect color hexadecimal value: ' + c);
				}
			} else if ((match = _rgbRe.exec(c))) {
				if (match[2]) { //if alpha component exists
					if ((a = getAlpha(match[6])) == undefined || a === 1) {
						return rgbToHex({r: rgbComponentVal(match[3]), g: rgbComponentVal(match[4]), b: rgbComponentVal(match[5])});
					} else {
						return rgbToHex(rgbaToRgb({r: rgbComponentVal(match[3]), g: rgbComponentVal(match[4]), b: rgbComponentVal(match[5])}));
					}
				} else {
					return rgbToHex({r: rgbComponentVal(match[3]), g: rgbComponentVal(match[4]), b: rgbComponentVal(match[5]), a: a});
				}
			} else if ((match = _hColorRe.exec(c))) {
				if (match[2]) { //if alpha component exists
					if ((a = getAlpha(match[8])) == undefined || a === 1) {
						return _hMatchToHex(match);
					} else {
						var rgb;
						switch(match[1]) {
							case 'hsl':
								rgb = rgbaToRgb(hsla2Rgba(_toHObj(match, ['h', 's', 'l', 'a'])))
							case 'hsv':
								rgb = rgbaToRgb(hsva2Rgba(_toHObj(match, ['h', 's', 'l', 'a'])))
							case 'hsb':
								rgb = rgbaToRgb(hsba2Rgba(_toHObj(match, ['h', 's', 'l', 'a'])))
							case 'hwb':
								rgb = rgbaToRgb(hwba2Rgba(_toHObj(match, ['h', 's', 'l', 'a'])))
							default:
								throw new Error('Incorrect color');
						}
						return rgbToHex(rgb);
					}
				} else {
					return _hMatchToHex(match);
				}
				throw new Error((match[1] + (match[2]||'')).toUpperCase() 
					+ ' Color\'s string value not yet supported: ' + c);
			} else if ((match = _cmykRe.exec(c))) {
				throw new Error('CMYK Color\'s string value not yet supported: ' + c);
			} else {
				return nameToHex(c, map, nameAskey);
			}
		}  else if (isPlainObj(c)) {
			var a = c.a === undefined ? c.alpha : c.a;
			keys = Object.keys(c);
			if (keys.length === 0)
				return '';
			if (keys.indexOf('r') >= 0) {
				if (a === undefined || a === 1) {
					hex = rgbToHex(c);
				} else {
					hex = rgbToHex(rgbaToRgb(c));
				}
			} else if (keys.indexOf('red') >= 0) {
				if (a === undefined || a === 1) {
					hex = toHexValue({r: c.red, g: c.green, b: c.blue});
				} else {
					hex = rgbToHex(rgbaToRgb(c));
				}
			} else if (keys.indexOf('h') >= 0) {
				if (a === undefined || a === 1) {
					
				} else {
					
				}
			} else if (keys.indexOf('hue')) {
				if (a === undefined || a === 1) {
					
				} else {
					
				}
			} else if (keys.indexOf('c')) {
				hex = cmykToHex(c).toUpperCase();
			}
		} else if (isArray(c)) {
			switch (c.length) {
				case 0:
					return '';
				default:
					if (a === undefined || a === 1) {
						hex = arrayRgbToHex(c).toUpperCase();
					} else {
						hex = rgbToHex(rgbaToRgb({r: c[0], g: c[1], b: c[2], a: a}));
					}
			}
		} else if (c == undefined) {
			return;
		} else {
			throw new Error('Incorrect c');
		}
		return hex;
	}
	
	
	
	function toRgbString(color) {
		var match;
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
			if ((match = /^(?:#)?([0-9a-fA-F]+)$/.exec(color))) {
				
			}
		} else if (isPlainObj(color)) {
			
		} else if (isArray(color)) {
			var percent = typeof color[0] === 'string' && /%$/.test(color[0]);
			if (color.length > 3) {
				if (percent) {
					color = color.map(function(c) {
						if (/%$/.test(c))
							throw new Error('Incorrect color value');
						return Math.floor(parseFloat(c, 10));
					})
					color[3] = color[3]/100;
				} else {
					color = color.map(function(c) {
						return parseInt(c, 10);
					})
				}
				color = rgbaToRgb(color);
				return 'rgb(' + color.join(', ') + ')';
			} else {
				return 'rgb(' + color.join(percent ? ' ' : ', ') + ')';
			}
		}
	}
	
	function percentToByte(c) {
		return Math.floor(parseFloat(c.substring(0, c.length - 1), 10)*255/100);
	}
	/**
	 * 
	 * @param {String|Object|Array} color
	 * @param {Object} [cn] 
	 * @param {Object} [nameAskey] 
	 * @returns {Object}
	 */
	function toRgb(color, cns, nameAskey) {
		function _hMatchToRgb(match) {
			switch(match[1]) {
				case 'hsl':
					return hslToRgb(_toHObj(match, ['h', 's', 'l']))
				case 'hsv':
					return hsvToRgb(_toHObj(match, ['h', 's', 'v']))
				case 'hsb':
					return hsbToRgb(_toHObj(match, ['h', 's', 'b']))
				case 'hwb':
					return hwbToRgb(_toHObj(match, ['h', 'w', 'b']))
				default:
					throw new Error('Not yet supported');
			}
		}
		var match;
		if (typeof color === 'string') {
			if (color === 'transparent')
				return {};
			if ((match = /^(?:#)?([0-9a-fA-F]+)$/.exec(color))) {
				var c = match[1];
				if (c.length === 6) {
					return {
						r: parseInt(c.substring(0, 2), 16),
						g: parseInt(c.substring(2, 4), 16),
						b: parseInt(c.substring(4, 6), 16)
					}
				} else if (match[1].length === 3) {
					return {
						r: parseInt(c[0] + c[0], 16),
						g: parseInt(c[1] + c[1], 16),
						b: parseInt(c[2] + c[2], 16)
					}
				} else if (match[1].length === 8) {
					return rgbaToRgb({
						r: parseInt(c.substring(0, 2), 16),
						g: parseInt(c.substring(2, 4), 16),
						b: parseInt(c.substring(4, 6), 16),
						a: parseInt(c.substring(6, 8), 16)/255
					})
				} else if (match[1].length === 4) {
					return rgbaToRgb({
						r: parseInt(c[0] + c[0], 16),
						g: parseInt(c[1] + c[1], 16),
						b: parseInt(c[2] + c[2], 16),
						a: parseInt(c[2] + c[2], 16)/255
					})
				} else if ((match = _rgbRe.exec(c))) {
					if (match[2]) { //if alpha component exists
						if ((a = getAlpha(match[6])) == undefined || a === 1) {
							return {
								r: rgbComponentVal(match[3]),
								g: rgbComponentVal(match[4]),
								b: rgbComponentVal(match[5])
							};
						} else {
							return {
								r: rgbComponentVal(match[3]),
								g: rgbComponentVal(match[4]),
								b: rgbComponentVal(match[5])
							};
						}
					} else {
						return rgbaToRgb({r: rgbComponentVal(match[3]), g: rgbComponentVal(match[4]), b: rgbComponentVal(match[5]), a: a});
					}
				} else if ((match = _hColorRe.exec(c))) {
					if (match[2]) { //if alpha component exists
						if ((a = getAlpha(match[9])) == undefined || a === 1) {
							return _hMatchToRgb(match);
						} else {
							switch(match[1]) {
								case 'hsl':
									return rgbaToRgb(hsla2Rgba(_toHObj(match, ['h', 's', 'l', 'a'])))
								case 'hsv':
									return rgbaToRgb(hsva2Rgba(_toHObj(match, ['h', 's', 'v', 'a'])))
								case 'hsb':
									return rgbaToRgb(hsba2Rgba(_toHObj(match, ['h', 's', 'b', 'a'])))
								case 'hwb':
									return rgbaToRgb(hwba2Rgba(_toHObj(match, ['h', 'w', 'b', 'a'])))
								default:
									throw new Error('Incorrect color');
							}
						}
					} else {
						return _hMatchToRgb(match);
					}
					throw new Error((match[1] + (match[2]||'')).toUpperCase() 
						+ ' Color\'s string value not yet supported: ' + c);
				} else if ((match = _cmykRe.exec(c))) {
					throw new Error('CMYK Color\'s string value not yet supported: ' + c);
				}  else {
					var c = nameToHex(color, cns, nameAskey)
					return {
						r: parseInt(c.substring(0, 2), 16),
						g: parseInt(c.substring(2, 4), 16),
						b: parseInt(c.substring(4, 6), 16)
					}
				}
			}
		} else if (isPlainObj(color)) {
			var a = color.a === undefined ? color.alpha : color.a;
			var r = color.r === undefined ? color.red : color.r;
			var g = color.g === undefined ? color.green : color.g;
			var b = color.b === undefined ? color.blue : color.b;
			if (r == undefined && g == undefined && b == undefined && a == undefined)
				return {};
			if (r != undefined){
				return a != undefined ? rgbaToRgb(color) : color;
			}
			if (color.l !== undefined) {
				return a != undefined ? rgbaToRgb(hslaToRgba(color)) : hslToRgb(color);
			} else if (color.v !== undefined) { //hsv
				return a != undefined ? rgbaToRgb(hsvaToRgba(color)) : hsvToRgb(color);
			} else if (color.b !== undefined) { //hsb
				return a != undefined ? hsbaToRgb(hsbaToRgba(color)) : hsbToRgb(color);
			} else if (color.w !== undefined) { //hwb
				return a != undefined ? rgbaToRgb(hwbaToRgba(color)) : hwbToRgb(color);
			} else if (color.c !== undefined) { //cmyk
				return cmykToRgb(color);
			}
			
		} else if (isArray(color)) {
			var percent = typeof color[0] === 'string' && /%$/.test(color[0]);
			if (color.length > 3) {
				if (percent) {
					color = color.map(function(c) {
						if (/%$/.test(c))
							throw new Error('Incorrect color value');
						return percentToByte(c);
					})
					color[3] = color[3]/100;
				} else {
					color = color.map(function(c) {
						return parseInt(c, 10);
					})
				}
				return rgbaToRgb(color);
			} else if (percent) {
				return { r: percentToByte(color[0]), g: percentToByte(color[1]), b: percentToByte(color[2])}
			} else {
				return { 
					r: parseInt(color[0], 10),
					g: parseInt(color[1], 10),
					b: parseInt(color[2], 10)
				}
			}
		}
	}

	function toRgbaString(color) {
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
		}
		if (Object.keys(color).length === 0)
			return 'transparent'
	}
	
	function _hFromArray(hsl) {
		return '(' + (hsl[0]*360) + ', ' + (hsl[1]*100) + '%' + ', ' + (hsl[2]*100) + '%)';
	}
	
	function _hFromObj(hsl) {
		return '(' + (hsl.h*360) + ', ' + (hsl.s*100) + '%' + ', ' + (hsl.l*100) + '%)';
	}

	function toHslString(color) {
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
		}
		if (isArray(color))
			return color.length ? 'hsl' + _hFromArray(color) : 'transparent';
		if (Object.keys(color).length === 0)
			return 'transparent'
		if (h.l !== undefined) { //hsl
			return 'hsl' + _hFromObj(color);
		} else if (h.r !== undefined) { //rgb
			color = rgbToHsl(color);
		} else if (h.v !== undefined) { //hsv
			
		} else if (h.w !== undefined) { //hwb
			
		} else if (h.s !== undefined) { //hsb
			
		}
	}

	function toHslaString(color) {
		
	}

	function toHsvString(color) {
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
		}
		if (isArray(color))
			return color.length ? 'hsv' + _hFromArray(color) : 'transparent';
		if (Object.keys(color).length === 0)
			return 'transparent'
		if (h.v !== undefined) { //hsl
			return 'hsv' + _hFromObj(color);
		} else if (h.r !== undefined) { //rgb
			color = rgbToHsl(color);
		} else if (h.l !== undefined) { //hsl
			
		} else if (h.w !== undefined) { //hwb
			
		} else if (h.s !== undefined) { //hsb
			
		}
	}

	function toHsbString(color) {
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
		}
		if (isArray(color))
			return color.length ? 'hsb' + _hFromArray(color) : 'transparent';
		if (Object.keys(color).length === 0)
			return 'transparent'
		if (h.w !== undefined) { //hsl
			return 'hsb' + _hFromObj(color);
		} else if (h.r !== undefined) { //rgb
			color = rgbToHwb(color);
		} else if (h.l !== undefined) { //hsl
			
		} else if (h.v !== undefined) { //hsv
			
		} else if (h.s !== undefined) { //hsb
			
		}
		if (isArray(color)) {
			return 'hsb' + _hFromArray(color);
		}
		if (isPlainObj(color)) {
			return 'hsb' + _hFromObj(color);
		}
	}

	function toHwbString(color) {
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
		}
		if (isArray(color))
			return color.length ? 'hwb' + _hFromArray(color) : 'transparent';
		if (Object.keys(color).length === 0)
			return 'transparent'
		if (h.w !== undefined) { //hsl
			return 'hwb' + _hFromObj(color);
		} else if (h.r !== undefined) { //rgb
			color = rgbToHwb(color);
		} else if (h.l !== undefined) { //hsl
			
		} else if (h.v !== undefined) { //hsv
			
		} else if (h.s !== undefined) { //hsb
			
		}
		if (isArray(color)) {
			return 'hwb' + _hFromArray(color);
		}
		if (isPlainObj(color)) {
			return 'hwb' + _hFromObj(color);
		}
	}

	function toCmykString(color) {
		if (isArray(color)) {
			return 'cmyk(' + color.join(', ') + ')';
		} 
		return 'cmyk(' + (color.c||color.cyan||0) + ', ' + (c.m||c.magenta||0) + ', ' + (c.y||c.yellow||0) + ', ' + (c.k||c.key||c.black||0) + ')';
	}
	
	function nameToHexValue(colorName, ncs, nameAskey) {
		var hex;
		var keys;
		var i, n, k;
		var fn;
		if (colorName === 'transparent')
			return '';
		if (ncs && ncs.toHex) {
			hex = ncs.toHex(colorName);
		} else if (ncs && ncs.toHexValue) {
			hex = ncs.toHexValue(colorName);
		} else if (isPlainObj(ncs)) {
			if (typeof (fn = ncs.toHexString||ncs.getHexValue||ncs.getHexString) === 'function') {
				hex = fn.call(ncs, colorName);
			} else if (nameAskey == undefined || nameAskey === '') {
				if (ncs['black']) {
					hex = ncs[colorName];
				} else {
					keys = Object.keys(ncs);
					if (/^#/.test(keys[0]) || /^[a-fA-F0-9]/.test(keys[0])) {
						i = 0;
						n = keys.length;
						for (; i < n; i++) {
							k = keys[i];
							if (ncs[k] === colorName) {
								hex = k;
								break;
							}							
						}
					} else {
						hex = ncs[colorName];
					}
				}
			} else if (nameAskey) {
				hex = ncs[colorName];
			} else {
				keys = Object.keys(ncs);
				i = 0;
				n = keys.length;
				for (; i < n; i++) {
					k = keys[i];
					if (ncs[k] === colorName) {
						hex = k;
						break;
					}							
				}
			}
		}
		if (hex && hex[0] != '#')
			return '#' + hex;
		return hex;
	}
	/*!*
	 * 
	 * @private
	 * @param {String} colorName
	 * @param {Object} [ncs] Color naming system or name colors map
	 * @param {Boolean} [nameAskey] name colors map keys represents color names?
	 * @returns {String}
	 */
	function nameToHex(colorName, ncs, nameAskey) {
		var hex;
		var keys;
		var i, n, k;
		var fn;
		if (colorName === 'transparent')
			return '';
		if (ncs && ncs.toHex) {
			hex = ncs.toHex(colorName);
		} else if (ncs && ncs.toHexValue) {
			hex = ncs.toHexValue(colorName);
		} else if (isPlainObj(ncs)) {
			if (typeof (fn = ncs.toHexString||ncs.getHexValue||ncs.getHexString) === 'function') {
				hex = fn.call(ncs, colorName);
			} else if (nameAskey == undefined || nameAskey === '') {
				if (ncs['black']) {
					hex = ncs[colorName];
				} else {
					keys = Object.keys(ncs);
					if (/^#/.test(keys[0]) || /^[a-fA-F0-9]/.test(keys[0])) {
						i = 0;
						n = keys.length;
						for (; i < n; i++) {
							k = keys[i];
							if (ncs[k] === colorName) {
								hex = k;
								break;
							}							
						}
					} else {
						hex = ncs[colorName];
					}
				}
			} else if (nameAskey) {
				hex = ncs[colorName];
			} else {
				keys = Object.keys(ncs);
				i = 0;
				n = keys.length;
				for (; i < n; i++) {
					k = keys[i];
					if (ncs[k] === colorName) {
						hex = k;
						break;
					}							
				}
			}
		} else {
			
		}
		//- if color naming system and the name does not match a hex value
		//  in that system, try fallback to check in native css/web color names
		//- if no color naming system, check in native css/web color names
		hex = hex||nativeNames[colorName.toLowerCase()];
		if (hex)
			return (hex[0] == '#' ? hex.substring(1) : hex).toUpperCase();
		throw new Error('No matching/found color for the given name: ' + colorName);
	}
	/**
	 * 
	 * @name SereniX.CssColorUtils.getColorName
	 * @param {String} color
	 * @param {Object|Function} [cns] The color naming system object of function to get the color name of the given color
	 * @param {Boolean} [nameAskey] The keys of the color name system object represents the names of the colors?
	 * @returns {String}
	 */
	function getColorName(color, cns, nameAskey) {
		var keys;
		var a, hex, n;
		if (color === 'transparent' || color === 'Transparent')
			return 'transparent';
		if (typeof color === 'string') {
			if (cns && cns.getColorName) {
				n = cns.getColorName(color);
			} else if (cns && cns.getName) {
				n = cns.getName(color);
			} else if (cns && (typeof cns.name === 'function')) {
				n = cns.name(color);
			} else if (typeof cns === 'function') {
				n = cns(color);
			} else if (isPlainObj(cns)) {
				n = cns[color];
			}
			if (n != undefined)
				return n;
			if (!/^(#?[0-9a-fA-F]{3,8}$|(?:(?:rgb|hs[lvb]|hwb)a?|cmyk)\s*\()/.test(color))
				return color;
		} else if (isPlainObj(color)) {
			var a = color.a === undefined ? color.alpha : color.a;
			keys = Object.keys(color);
			if (keys.length === 0)
				return 'transparent';
			if (keys.indexOf('r')) {
				if (a === undefined || a === 1) {
					hex = rgbToHex(color);
				}
			} else if (keys.indexOf('red')) {
				if (a === undefined || a === 1) {
					hex = toHexValue({r: color.red, g: color.green, b: color.blue});
				}
			} else if (keys.indexOf('h')) {
				if (a === undefined || a === 1) {
					
				}
			} else if (keys.indexOf('hue')) {
				if (a === undefined || a === 1) {
					
				}
			} else if (keys.indexOf('c')) {
				hex = cmykToHex(color);
			}
		} else if (isArray(color)) {
			switch (color.length) {
				case 0:
					return 'transparent';
				default:
					if (a === undefined || a === 1) {
						hex = arrayRgbToHex(color);
					} else {
						hex = rgbToHex(rgbaToRgb({r: color[0], g: color[1], b: color[2], a: a}));
					}
			}
		}
		
	}
	
	
	
	function rgbToHex(r, g, b) {
		function toHex(i) {
			var t, u, digits = "0123456789ABCDEF";
			if (i >= 0 && i <= 255) {
				u = i%16;
				return digits[(i - u)/16] + digits[u];
			}
			throw new Error("Incorrect argument");
		}
		if (isArray(r)) {
			b = r[2];
			g = r[1];
			r = r[0];
		} else if (typeof r === 'object' && r) {
			b = r.b;
			if (b == undefined) {
				b = r.blue;
				g = r.green;
				r = r.red;
			} else {
				g = r.g;
				r = r.r;
			}
		}
		return toHex(r) + toHex(g) + toHex(b);
	};
	
	function rgbToHexValue(r, g, b) {
		return '#' + rgbToHex.apply(this, arguments);
	}
	
	
	var rgbToHexVal = rgbToHexValue;

	/**
	   * Converts the CMYK colors to RGB colors
	   * @param {Number|Object|Array} c 
	   * @param {Number|Object} [m] 
	   * @param {Number} [y] 
	   * @param {Number} [k] 
	   * @returns {Object}
	   */
	function cmykToRgb(c, m, y, k) {
		var len = arguments.length, o;
		if (len === 1 || (typeof m === 'object' && m)) {
			o = m||{};
			if (isArray(c)) {
				m = c[1];
				y = c[2];
				k = c[3];
				c = c[0];
			} else if (typeof c === 'object' && c) {
				m = c.m;
				y = c.y;
				k = c.k;
				c = c.c;
			} else {
				throw new Error("Incorrect arguments");
			}
		}
		c /= 100;
		m /= 100;
		y /= 100;
		k /= 100;
		var r = 1 - Math.min( 1, c * ( 1 - k ) + k );
		var g = 1 - Math.min( 1, m * ( 1 - k ) + k );
		var b = 1 - Math.min( 1, y * ( 1 - k ) + k );

		o.r = Math.round(r * 255);
		o.g = Math.round(g * 255);
		o.b = Math.round(b * 255);

		return o;
	};

	cmykToHex = function() {
		return rgbToHex(cmykToRgb.call(null, arguments));
	};
	/**
	 * Converts the RGB colors to CMYK colors
	 * @param {Number|Object|Array} r 
	 * @param {Number|Object} [g] 
	 * @param {Number} [b] 
	 * @param {Object} [o] 
	 * @returns {Object}
	 */
	function rgbToCmyk(r, g, b, o) {
		var c, m, y, k, len = arguments.length;
		if (len === 1 || (typeof g === 'object' && g)) {
			o = g||{};
			if (isArray(r)) {
				b = r[2];
				g = b[1];
				r = r[0];
			} else if (typeof r === 'object' && r) {
				b = r.b;
				if (b == undefined) {
					b = r.blue;
					g = r.green;
					r = r.red;
				} else {
					g = r.g;
					r = r.r;
				}
			} else {
				throw new Error("Incorrect arguments");
			}
		} else {
			o = o||{};
		}
		r /= 255;
		g /= 255;
		b /= 255;
	 
		k = Math.min( 1 - r, 1 - g, 1 - b );
		if ((1 - k) == 0 ){
		  c = 0 ;
		  m = 0 ;
		  y = 0 ;
		} else {
		c = ( 1 - r - k ) / ( 1 - k );
		m = ( 1 - g - k ) / ( 1 - k );
		y = ( 1 - b - k ) / ( 1 - k );
		}
		c = Math.round( c * 100 );
		m = Math.round( m * 100 );
		y = Math.round( y * 100 );
		k = Math.round( k * 100 );

		o.c = c;
		o.m = m;
		o.y = y,
		o.k = k;
		return o;
	};
	/**
	 * 
	 * @param {unsigned byte} r The rgba color red component
	 * @param {unsigned byte} g The rgba color green component
	 * @param {unsigned byte} b The rgba color blue component
	 * @param {Number} a  The rgba color alpha value: number between 0 and 1
	 * @param {unsigned byte} r2  The background color red component
	 * @param {unsigned byte} g2  The background color green component
	 * @param {unsigned byte} b2  The background color blue component
	 * @returns {Array}
	 */
	function rgbaToRgb(r, g, b, a, r2,g2,b2){
		var $ = arguments, l = a.length,c;
		if (l === 2) {
			c = $[0];
			if (Array.isArray(c)) {
				r = c[0], g = c[1], b = c[2], a = c[3];
				c = $[1];
				if (typeof c === 'number') {
					r2=c,g2=c,b2=c;
				} else {
					r2 = c[0], g2 = c[1], b2 = c[2];
				}
			} else if (typeof c === 'object' && c) {
				r = c.red, g = c.green, b = c.blue, a = c.alpha;
				c = $[1];
				if (typeof c === 'number') {
					r2=c,g2=c,b2=c;
				} else {
					r2 = c.red, g2 = c.green, b2 = c.blue;
				}
			}
		} else if (arguments.length === 4) {
			r2=255,g2=255,b2=255;
		} else {
			if (g2 === undefined) g2 = r2;
			if (b2 === undefined) b2 = r2;
		}
		return [ Math.round(((1 - a) * r2) + (a * r)) , Math.round(((1 - a) * g2) + (a * g)) , Math.round(((1 - a) * b2) + (a * b)) ];
	}

	function rgb2hex(rgb) {
        rbg = rgb.match(rgbRegex);
        function lpad(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + lpad(rgb[1]) + lpad(rgb[2]) + lpad(rgb[3]);
    }
    
    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the range 0 to 255 and
     * returns h, s, and l in the range 0 to 1.
     *
     * @param   {Number}  r  The red color value
     * @param   {Number}  g  The green color value
     * @param   {Number}  b  The blue color value
	 * @param   {Boolean}  obj  Result as object?
     * @returns {Array|Object}   The HSL representation
     */
    function rgbToHsl(r, g, b, obj) {
		if (isArray(r)){
			obj = g;
			g = r[1];
			b = r[2];
			r = r[0];
		} else if (isPlainObj(r)) {
			obj = g;
			g = r.g||r.green||0;
			b = r.b||r.blue||0;
			r = r.r||r.red||0;
		}
      r /= 255, g /= 255, b /= 255;

      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if (max == min) {
        h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
      }

      return [ h, s, l ];
    }
    
    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the range 0 to 255 and
     * returns r, g, and b in the range 0 to 255.
     *
     * @param   {Number}  h       The hue
     * @param   {Number}  s       The saturation
     * @param   {Number}  l       The lightness
	 * @param   {Boolean} object
     * @return  {Array|Object}   The RGB representation
     */
    function hslToRgb(h, s, l, object) {
      var r, g, b;
	  if (isArray(h)){
		s = h[1];
		l = h[2];
		h = h[0];
		object = s;
	  } else if (isPlainObj(h)) {
		s = h.s||h.saturation||0;
		l = h.l||r.lightness||h.luminence||0;
		h = h.h||h.hue||0;
		object = s;
	  }

      if (s == 0) {
        r = g = b = l; // achromatic
      } else {
        function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
	  r *= 255
	  g *= 255
	  b *= 255
      return object ? {r: r, g: g, b: b} : [ r, g, b ];
    }

    /**
     * Converts an RGB color value to HSV. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes r, g, and b are contained in the range 0 to 255 and
     * returns h, s, and v in the range 0 to 255.
     *
     * @param   {Number}  r       The red color value
     * @param   {Number}  g       The green color value
     * @param   {Number}  b       The blue color value
	 * @param   {Boolean}  obj  Result as plain object?
     * @returns {Array}            The HSV representation
     */
    function rgbToHsv(r, g, b, obj) {
		if (isArray(r)){
			obj = g;
			g = r[1];
			b = r[2];
			r = r[0];
	    } else if (isPlainObj(r)) {
			obj = g;
			g = r.g||h.green||0;
			b = r.b||r.blue||0;
			r = r.r||r.red||0;
	    }
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
          h = 0; // achromatic
        } else {
			switch (max) {
			  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			  case g: h = (b - r) / d + 2; break;
			  case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
        }

        return obj ? {h: h, s: s, v: v} : [ h, s, v ];
    }

    /**
     * Converts an HSV color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes h, s, and v are contained in the range 0 to 255 and
     * returns r, g, and b in the range 0 to 255.
     *
     * @param   {Number}  h       The hue
     * @param   {Number}  s       The saturation
     * @param   {Number}  v       The value
	 * @param {Boolean} [obj] Result as object?
     * @return  {Array|Object}  The RGB representation
     */
    function hsvToRgb(h, s, v, obj) {
        function val(v) {
            return Math.max(0, Math.min(Math.round(v), 255));
        }
        var r, g, b;
		
		if (isArray(h)){
			obj = s;
			s = h[1];
			l = h[2];
			h = h[0];
		} else if (isPlainObj(h)) {
			obj = s;
			s = h.s||h.saturation||0;
			v = h.v||r.value||0;
			h = h.h||h.hue||0;
		}

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
		r = val(r * 255);
		g = val(g * 255);
		b = val(b * 255);
        return obj ? { r: r, g: g, b: b} : [ r, g, b ];
    }
	
	/**
	 * 
	 * @param {Number|String|Array|Object} r
	 * @param {Number} g
	 * @param {Number} b
	 * @param {Number} a
	 * @param {Boolean} array
	 * @returns {Array|String}
	 */
	function rgbaToHsla(r, g, b, a, array) {
		if (isArray(r)) {
			array = g;
			g = r[1]||0;
			b = r[2]||0;
			a = r[3]||0;
			r = r[0];
		} else if (typeof r === 'string') {
			array = g;
			var rgb = r, v,
				sep = rgb.indexOf(",") > -1 ? "," : " ";
			rgb = rgb.substr(5).split(")")[0].split(sep);

			for (var i = 0, n = rgb.length; i < n; i++) {
			  v = rgb[i];
			  if (r.indexOf("%") > -1) 
				rgb[i] = (i === 3 ? 1  : 255) *Math.round(r.substr(0,r.length - 1) / 100);
			}
			r = rgb[0];
			g = rgb[1];
			b = rgb[2];
			a = rgb[3];
		} else {
			g = r.green||r.g||r.Green||r.G||0; 
			b = r.blue||r.b||r.Blue||r.B||0; 
			a = r.alpha||r.Alpha||r.a||r.A||r.opacity||r.Opacity||r.o||r.O;
			r = r.red||r.r||r.Red||r.R||0;
		}
		var rgba = rgbToHsl(r, g, b, true);
		rgba[3] = a;
		return array ? rgba : 'rgba(' + rgba.join(',') + ')';
	}
	/**
	 * 
	 * @param {Number} h
	 * @param {Number} s
	 * @param {Number} l
	 * @param {Boolean} [array=false]  Return the result as an array?
	 * @returns {String|Array}
	 */
	function hsl2Rgb(h, s, l, array) {
		if (isArray(h)) {
			array = s;
			s = h[1]||0;
			l = h[2]||0;
			h = h[0];
		} else if (typeof h === 'string') {
			array = s;
			var sep = h.indexOf(",") > -1 ? "," : " ";
			h = h.substr(4).split(")")[0].split(sep);        
			s = h[1].substr(0,h[1].length - 1) / 100, //remove '%' in the s component
			l = h[2].substr(0,h[2].length - 1) / 100; //remove '%' in the l component
			h = h[0];
		} else {
			array = s;
			s = h.s||h.saturation||h.Saturation||h.S||0;
			l = h.l||h.lightness||h.luminence||h.luminance||h.Luminence||h.L||0;
			h = h.h||h.hue||h.Hue||h.H||0;
		}
		// Must be fractions of 1
		s /= 100;
		l /= 100;

		var c = (1 - Math.abs(2 * l - 1)) * s,
			x = c * (1 - Math.abs((h / 60) % 2 - 1)),
			m = l - c/2,
			r = 0,
			g = 0,
			b = 0;
		if (0 <= h && h < 60) {
		  r = c; g = x; b = 0;  
		} else if (60 <= h && h < 120) {
		  r = x; g = c; b = 0;
		} else if (120 <= h && h < 180) {
		  r = 0; g = c; b = x;
		} else if (180 <= h && h < 240) {
		  r = 0; g = x; b = c;
		} else if (240 <= h && h < 300) {
		  r = x; g = 0; b = c;
		} else if (300 <= h && h < 360) {
		  r = c; g = 0; b = x;
		}
		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);

		return array ? [r, g, b] : "rgb(" + r + "," + g + "," + b + ")";
		  
	}

	/**
	 * 
	 * @param {Number} h
	 * @param {Number} s
	 * @param {Number} l
	 * @param {Number} a
	 * @param {Boolean} [array=false]  Return the result as an array?
	 * @returns {String|Array}
	 */
	function hsla2Rgba(h, s, l, a, array) {
		if (isArray(h)) {
			array = s;
			s = h[1]||0;
			l = h[2]||0;
			a = (h[3]== undefined ? 1 : h[3]||0);
			h = h[0];
		} else if (typeof h === 'string') {
			array = s;
			var sep = h.indexOf(",") > -1 ? "," : " ";
			h = h.substr(4).split(")")[0].split(sep);        
			s = h[1].substr(0,h[1].length - 1) / 100, //remove '%' in the s component
			l = h[2].substr(0,h[2].length - 1) / 100; //remove '%' in the l component
			a = (h[3]== undefined ? 1 : h[3]||0);
			h = h[0];
		} else {
			array = s;
			s = h.saturation||h.s||h.Saturation||h.S||0;
			l = h.lightness||h.luminence||h.l||h.Luminence||h.L||0;
			a = (h.alpha||h.Alpha||h.a||r.A||h.opacity||h.Opacity||h.o||h.O||0);
			h = h.hue||h.h||h.Hue||h.H||0;
		}
		var _a = "" + a;
		if (_a.endsWith('%')) {
			a = parseFloat(_a.substr(0,_a.length - 1)) / 100;
		}
		
		var r = hslToRgb(h, s, l, true);
		r[3] = a;
		return array ? r : "rgba(" + r.join(',') + ")";
	}
	/**
	 * 
	 * @param {Number} h
	 * @param {Number} s
	 * @param {Number} l
	 * @param {Number} a
	 * @param {Boolean} Result as object ?
	 * @returns {Array|Object}
	 */
	function hslaToRgba(h, s, l, a, obj) {
		var c = hsla2Rgba.apply(this, arguments);
		return obj ? { r: c[0], g: c[1], b: c[2], a: c[3]} : c;
	}
	
	function colorEquals(c1, c2) {		
		return (c1 === c2) || (toHex(c1) === toHex(c2));
	}
	
	function isLightColor($) {
        var match;
        if (arguments.length > 1) {
            $ = slice.call(arguments);
        } else {
            if ($ instanceof String || $ instanceof Number || $ instanceof Boolean || $ instanceof Function) {
                $ = $.valueOf();
            }
            if (typeof $ === 'string') {
                $ = getColorFromString($);
            } else if (isPlainObj($)) {
                $ = [$.red||$.r||0, $.green||$.g||0, $.blue||$.b||0];
            } else if (!Array.isArray($)) {
                throw new Error('Incorrect argument: ' + $);
            }
        }
        //return (0.299 * red) + (0.587 * green) + (0.114 * blue) > 127 ;
        return (0.299 * ($[0]||0)) + (0.587 * ($[1]||0)) + (0.114 * ($[2]||0)) > 127 ;
    }
	
	var hexRe = /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})(?:[0-9a-fA-F]{2})?$/;
	/**
	 * Returns the color class of the given color
	 * @param {String} color CSS color value
	 * @param {Object} [classes] Defined color classes
	 * @return {String}
	 */
	function colorClass(color, classes) {
		function _getLightClass(match) {
			if (!match) return '';
			return ' ' + (isLightColor(parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)) ?
					'light-color' : 'dark-color');
		}
		var h = color.toLowerCase(),
			match,
			cls,
			lightClass;
			name,
			_classes =  CssColorUtils.colorClasses||{};
			
		classes = classes||{};
		if (h === 'transparent')
			return h;
		//get predefined class of the given color
		cls = classes[color];
		if (cls)
			return cls;
		if (color[0] === '#') {
			h = color.substring(1);			
		} else if (h.indexOf('(')) {
			h = toHex(h);
			return classes[h]||_classes[h]||(/^0+$/.test(h) ? 'black' : /^f+$/.test(h) ? 'white' : 'hex-' + h) + _getLightClass(hexRe.exec(h));
		} else if (/\d/.test(color)) {
			h = 'hex-' + toHex(color);
		} else {
			cls = classes[h]||_classes[h]||h;
			if (cls)
				return cls;
			name = h;
		}
		if (/^0+$/.test(h))
			return 'black dark-color';
		if (/^f+$/.test(h))
			return 'white light-color';
		if (/^ff0000$/.test(h))
			return 'green'  + _getLightClass(hexRe.exec('ff0000'));
		if (/^ff0000$/.test(h))
			return 'red' + _getLightClass(hexRe.exec('ff0000'));
		if (/^0000ff$/.test(h))
			return 'blue' + _getLightClass(hexRe.exec('0000ff'));
		if ((match=hexRe.exec(h))) { 
			lightClass = _getLightClass(match);
		    if (match[1] === match[2] && match[2] === match[3])
				return 'gray' + lightClass;
		}
		return (classes[h]||_classes[h]||name||('hex-' + h)) + (lightClass||'');
	}
	
	CssColorUtils.colorClass = colorClass;
	/**
	 * Compares the given color to CSS hex value representation.</p>
	 * @name SereniX.CssColorUtils.toHexValue
	 * @function
	 * @param {String|Object|Array} c Color to convert
	 */
	CssColorUtils.toHexValue = toHexValue;
	/**
	 * Compares the given color to CSS hex value representation.</p>
	 * @name SereniX.CssColorUtils.toHexValue
	 * @function
	 * @param {String|Object|Array} c Color to convert
	 */
	CssColorUtils.toHexVal = toHexValue;
	/**
	 * Compares the given color to hex representation.</p>
	 * @name SereniX.CssColorUtils.toHex
	 * @function
	 * @param {String|Object|Array} c Color to convert
	 */
	CssColorUtils.toHex = toHex;
	
	CssColorUtils.hex2Int = hex2Int;
	
	CssColorUtils.hexToInt = hex2Int;
	/**
	 * Compares the two given colors and returns true if the two colors are equals or false otherwise.
	 * <p>The colors are first of all, converted to hex representation and the two converted hex representations are compared.</p>
	 * @name SereniX.CssColorUtils.colorEquals
	 * @function
	 * @param {String|Object|Array} c1 First color to compare
	 * @param {String|Object|Array} c2 Second color to compare
	 */
	CssColorUtils.colorEquals = colorEquals;
	
	function arrayToRgb(color, offset) {
		var rgb = 'rgb';
		var a;
		var n = color.length;
		
		offset = offset||0;
		a=color[offset + 4];
		if (n - offset >= 4 && (a != undefined)) {
			n = offset + 4;
			a = parseFloat(a, 10);
			if (a < 0 || a > 1 || isNaN(a))
				throw new Error('Alpha component out of bounds: ' + color[offset + 4]);
			a = ', ' + a;
			rgb += 'a(';
		} else {
			a = '';
			n = offset + 3;
			rgb += '(';
		}
		for (var i = offset; i < n; i++) {
			rgb += (i > offset ? ', ' : '') + color[i];
		}
		return rgb + a + ')';
	}
	
	function arrayToHsl(color, offset) {
		var hsl = 'hsl';
		var a;
		var n = color.length;
		
		offset = offset||0;
		a=color[offset + 4];
		if (n - offset >= 4 && (a != undefined)) {
			n = offset + 4;
			a = parseFloat(a, 10);
			if (a < 0 || a > 1 || isNaN(a))
				throw new Error('Alpha component out of bounds: ' + color[offset + 4]);
			a = ', ' + a;
			hsl + 'a(';
		} else {
			a = '';
			n = offset + 3;
			hsl += '(';
		}
		for (var i = offset; i < n; i++) {
			hsl += (i > offset ? ', ' : '') + color[i];
		}
		return hsl + a + ')';
	}
	/**
	 * 
	 * @param {String} c Hex color starting with hexadecimal digit 
	 * @returns {String}
	 */
	function toHexColor(c) {
		if (c.length === 3) {
			return '#' + c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
		}
		if (c.length === 4) {
			return '#' + c[0] + c[0] + c[1] + c[1] + c[2] + c[2] + c[4] + c[4];
		}
		if (c.length === 6 || c.length === 8) {
			return '#' + c;
		}
	}
	/**
	 * 
	 * @param {String} hex Hex color starting with '#'
	 * @returns {String}
	 */
	function normalizeHexColor(hex) {
		if (hex.length === 4) {
			return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
		}
		if (hex.length === 5) {
			return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] + hex[4] + hex[4];
		}
		if (hex.length === 7 || hex.length === 9) {
			return hex;
		}
	}
	
	var rgbRe = /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+(?:\.\d+)?))?/;
	
	function getCssColor(c) {
		var match, h, x, v, _c, t;
		if (typeof c === 'string' || c instanceof String) {
			return (match = rgbRe.exec(c)) ? arrayToRgb(match, 1) : 
				/^[0-9a-fA-F]+$/.test(c) ? toHexColor(c) : 
				/^#[0-9a-fA-F]+$/.test(c) ? normalizeHexColor(c) : c;
		}
		if (isArray(c))
			return arrayToRgb(c);
		if (isPlainObj(c)) {
			if ((t = typeof (x = c.r == undefined ? c.red : c.r)) === 'number' || t === 'string') {
				return  arrayToRgb([
					x, 
					c.g == undefined ? c.green : c.g,
					c.b == undefined ? c.blue : c.b,
					c.a == undefined ? c.alpha : c.a
				]);
			} else if (typeof (h = c.h) === 'number') {
				if (typeof (x = c.s) === 'number') {
					if (typeof (x = c.l) === 'number') {
						arrayToHsl([h, x, c.l, c.a == undefined ? c.alpha : c.a]);
					} else if (typeof (x = c.b) === 'number') {
						
					} else if (typeof (x = c.v) === 'number') {
						
					} else {
						throw new Error('Incorrect color: ' + c);
					}					
				} else if (typeof (x = c.w) === 'number') {
					return 'hwb(' + h + ' ' + (x + '%') + ' ' + (c.b+ '%')
						+ ((t = typeof (x =  c.a == undefined ? c.alpha : c.a)) === 'number' ? 
							' /' + x :
							t === 'string' ? ' /' + x : '')
						+ ')';
				}				
			} else if (typeof (h = c.h) === 'string') {
				if (typeof (x = c.s) === 'string') {
					if (typeof (x = c.l) === 'string') {
						arrayToHsl([h, x, c.l, c.a == undefined ? c.alpha : c.a]);
					} else if (typeof (x = c.b) === 'string') {
						
					} else if (typeof (x = c.v) === 'string') {
						
					} else {
						throw new Error('Incorrect color: ' + c);
					}					
				} else if (typeof (x = c.w) === 'string') {
					return 'hwb(' + h + ' ' + (x + '%') + ' ' + (c.b+ '%')
						+ ((t = typeof (x =  c.a == undefined ? c.alpha : c.a)) === 'number' ? 
							' /' + x :
							t === 'string' ? ' /' + x : '')
						+ ')';
				}				
			} else if (typeof (x = c.c) === 'number') { //cmyk
				
			} else if ((x = c.hexValue||c.hexVal||c.hex)) {
				return /^[0-9a-fA-F]+$/.test(x) ? toHexColor(x) : 
						/^#[0-9a-fA-F]+$/.test(x) ? normalizeHexColor(x) : 
						(function() {
							throw new Error('Incorrect hex color: ' + x);
						})();
			}
		}
	}
	
	CssColorUtils.hslaToRgba = hslaToRgba;
	
	CssColorUtils.hsla2Rgba = hsla2Rgba;
	
	CssColorUtils.isLightColor = isLightColor;
	
	CssColorUtils.isDarkColor = function(color) {
		return !isLightColor(color);
	}
	
	CssColorUtils.getCssColor = getCssColor;
	CssColorUtils.arrayToRgb = arrayToRgb;
	CssColorUtils.arrayToHsl = arrayToHsl;
	CssColorUtils.toHexColor = toHexColor;
	CssColorUtils.normalizeHexColor = normalizeHexColor;
	CssColorUtils.getColorName = getColorName;
	/**
	 * Returns the hex value that corresponds to given color name. <b>The result not starts with '#'</b>.
	 * @param {String} colorName
	 * @param {Object} [ncs] Color naming system or name colors map
	 * @param {Boolean} [nameAskey] name colors map keys represents color names?
	 * @returns {String}
	 */
	CssColorUtils.nameToHex = nameToHex;
	/**
	 * Returns the hex value that corresponds to given color name. <b>The result starts with '#'</b>.
	 * @param {String} colorName
	 * @param {Object} [ncs] Color naming system or name colors map
	 * @param {Boolean} [nameAskey] name colors map keys represents color names?
	 * @returns {String}
	 */
	CssColorUtils.nameToHexValue = nameToHexValue;
	
	CssColorUtils.nameToHexColor = nameToHexValue;
	
	CssColorUtils.hueAngleRatio = hueAngleRatio;
	
	CssColorUtils.rgbToHex = rgbToHex;
	
	CssColorUtils.rgbToHexVal = rgbToHexValue;
	
	CssColorUtils.rgbToHexValue = rgbToHexValue;
	
	CssColorUtils.toRgb = toRgb;
	
	CssColorUtils.toRgbString = toRgbString;
	
	CssColorUtils.toRgbaString = toRgbaString;
	
	CssColorUtils.toCmykString = toCmykString;
	/**
	 * 
	 * @property {Array} WEB_COLOR_NAMES_LIST List of color names: names are in lower case format
	 */
	CssColorUtils.WEB_COLOR_NAMES_LIST = nativeNamesList;
	/**
	 * Keys represents color names and  values represents color hex values in lower case.
	 * @property {Object} WEB_COLORS_MAP
	 */
	CssColorUtils.WEB_COLOR_NAMES = nativeNames;
	/**
	 * Keys represents color hex values (with '#' or not) and  values represents color names.
	 * <p>Keys are in lower case strings and in upper case strings.</p>
	 * @property {Object} WEB_COLORS_MAP
	 */
	CssColorUtils.WEB_COLORS_MAP = nativeColorNames;
	
	/**
	 * Keys represents color hex values and  values represents color names.
	 * @property {Object} WEB_COLORS_MAP
	 */
	CssColorUtils.WEB_HEX_VALUE_NAMES = nativeColorNames;
	
	/**
	 * Keys represents color names and  values represents color hex values.
	 * @property {Object} WEB_COLORS_MAP
	 */
	CssColorUtils.WEB_NAMED_COLORS = nativeNames;
	
	function isColor(x, namedColors) {
		namedColors = namedColors||nativeNames;
		try {
			if (x === 'transparent' || toHex(x, namedColors))
				return true;
		} catch (err) {}
		return false;
	}
	
	
	
	CssColorUtils.isColor = isColor;
	
	function isTrue(v) {
		return !v ? false : !/^(false|n(?:ok?)?|off|(?:\+|-)?0|ko)$/i.test('' + v);
	}
	/**
	 * 
	 * @param {String|Object|Array} col
	 * @param {Number} pct  value in range from -100 to 100 representing a percent
	 * @param {Boolean} pound
	 * @returns {String}
	 */
	function lightenDarkenCol(col, pct, pound) {
		return lightenDarkenHex(pound == undefined || pound === '' || isTrue(pound) ? toHexValue(col) : toHex(col), pct);
	}
	/**
	 * 
	 * @param {String} hexCol RGB Color in hex format (with pound symbol or not) to lighten or darken
	 * @param {Number} pct value in range from -100 to 100 representing a percent
	 * @returns {String}
	 */
	function lightenDarkenHex(hexCol, pct) {  
		var usePound = false;
	  
		if (hexCol[0] == "#") {
			hexCol = hexCol.slice(1);
			usePound = true;
		}
		if (hexCol.length === 3) {
			hexCol = hexCol[0]+hexCol[0] + hexCol[1] + hexCol[1] + hexCol[2] + hexCol[2]
		}
		
		var amt = Math.round(2.55*pct)
	 
		var num = parseInt(hexCol,16);
	 
		var r = (num >> 16) + amt;
	 
		if (r > 255) r = 255;
		else if  (r < 0) r = 0;
	 
		var b = ((num >> 8) & 0x00FF) + amt;
	 
		if (b > 255) b = 255;
		else if  (b < 0) b = 0;
	 
		var g = (num & 0x0000FF) + amt;
	 
		if (g > 255) g = 255;
		else if (g < 0) g = 0;
	 
		return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
	  
	}
	
	function lightenHex(color, pct) {
		return lightenDarkenHex(color, -pct);
	}
	
	function darkenHex(color, pct) {
		return lightenDarkenHex(color, pct);
	}
	
	function lighten(color, pct, pound) {
		return lightenDarkenCol(color, pct, pound);
	}
	
	function darken(color, pct, pound) {
		return lightenDarkenCol(color, -pct);
	}
	
	CssColorUtils.darken = darken;
	
	CssColorUtils.lighten = lighten;
	
	CssColorUtils.lightenDarkenCol = lightenDarkenCol;
	
	if (typeof SereniX === 'undefined') {
		SereniX = { CssColorUtils: CssColorUtils};
	} else if (typeof SereniX.addChild === 'function') {
		SereniX.addChild(CssColorUtils);
	} else {
		SereniX.CssColorUtils = CssColorUtils;
	}
	
	return CssColorUtils;
});
	
	
