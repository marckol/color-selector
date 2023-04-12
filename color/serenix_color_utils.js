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
 * FITNESS FOR a PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
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
})(this, 'ColorUtils', function() {
	
	var ctx = document.createElement('canvas').getContext('2d');
	
	
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
			nativeColorNames[nativeNames[n]] = n;
			nativeNamesList.push(n);
		}
	})();
	
	
	function hex2Hsv(h) {
		h = (h.charAt(0) == '#') ? h.substring(1, 7) : h;
		var r = parseInt(h.substring(0, 2), 16) / 255;
		var g = parseInt(h.substring(2, 4), 16) / 255;
		var b = parseInt(h.substring(4, 6), 16) / 255;
		var result = {
			'h': 0,
			's': 0,
			'v': 0
		};
		var minVal = Math.min(r, g, b);
		var maxVal = Math.max(r, g, b);
		var delta = (maxVal - minVal);
		var del_R;
		var del_G;
		var del_B;
		var map;

		result.v = maxVal;
		if (delta === 0) {
			result.h = 0;
			result.s = 0;
		} else {
			result.s = delta / maxVal;
			del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
			del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
			del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;
			if (r == maxVal) {
				result.h = del_B - del_G;
			} else if (g == maxVal) {
				result.h = (1 / 3) + del_R - del_B;
			} else if (b == maxVal) {
				result.h = (2 / 3) + del_G - del_R;
			}
			if (result.h < 0) {
				result.h += 1;
			}
			if (result.h > 1) {
				result.h -= 1;
			}
		}

		return [
			round(result.h * 360),
			round(result.s * 100),
			round(result.v * 100)
		];
	};
	
	var hex2hsv = hex2Hsv;
	
	function hsv2Hsl(h, s, v) {
		var _h;
		var _s;
		var _l;
		var _H;
		var _S;
		var _L;
		var hsv;
		var r1;
		var g1;
		var b1;
		var maxColor;
		var minColor;

		if (typeof h == 'object') {
			_h = h[0];
			_s = h[1];
			_l = h[2];
		} else {
			_h = h;
			_s = s;
			_l = v;
		}

		hsv = hsv2rgb(_h, _s, _l);
		r1 = hsv.R / 255;
		g1 = hsv.G / 255;
		b1 = hsv.B / 255;
		maxColor = Math.max(r1, g1, b1);
		minColor = Math.min(r1, g1, b1);
		_L = (maxColor + minColor) / 2;
		_S = 0;
		_H = 0;
		if (maxColor != minColor) {
			if (_L < 0.5) {
				s = (maxColor - minColor) / (maxColor + minColor);
			} else {
				s = (maxColor - minColor) / (2.0 - maxColor - minColor);
			}
			if (r1 == maxColor) {
				h = (g1 - b1) / (maxColor - minColor);
			} else if (g1 == maxColor) {
				h = 2.0 + (b1 - r1) / (maxColor - minColor);
			} else {
				h = 4.0 + (r1 - g1) / (maxColor - minColor);
			}
		}
		_L = _L * 100;
		_S = _S * 100;
		_H = _H * 60;
		if (_H < 0) {
			_H += 360;
		}

		return [
			Math.floor(h),
			Math.floor(s),
			Math.floor(v)
		];
	};
	
	function round(num, precision) {
		return parseFloat(num.toFixed(precision||0));
	}
	
	/**
	 * 
	 * @static
	 * @class SereniX.ColorUtils
	 */
	function ColorUtils() {
		
	}
	
	
	ColorUtils.__CLASS__ = ColorUtils;
	
	ColorUtils.__CLASS_NAME__ = 'ColorUtils';
	
	ColorUtils.NATIVE_NAME_COLORS = nativeNames;
	
	ColorUtils.hsv2Hsl = hsv2Hsl;
	
	ColorUtils.hsv2hsl = hsv2Hsl;
	
	function randomInteger(max) {
		return Math.floor(Math.random()*(max + 1));
	}
	
	ColorUtils.randomInteger = randomInteger;

	ColorUtils.randomRgbColor = function randomRgbColor() {
		return [randomInteger(255), randomInteger(255), randomInteger(255)];
	}
	
	ColorUtils.randomRgbColorString = function randomRgbColorString() {
		return 'rgb(' + randomInteger(255) + ',' + randomInteger(255) + ',' + randomInteger(255) + ')';
	}
	
	ColorUtils.randomRgbaColor = function randomRgbaColor() {
		return [randomInteger(255), randomInteger(255), randomInteger(255), randomInteger(255)/255];
	}
	
	ColorUtils.randomRgbaColorString = function randomRgbaColorString() {
		return 'rgb(' + randomInteger(255) + ',' + randomInteger(255) + ',' + randomInteger(255) + ',' + (randomInteger(255)/255) + ')';
	}

	ColorUtils.randomHexColor = function randomHexColor() {
		var r = [randomInteger(255),
			g = randomInteger(255),
			b = randomInteger(255)];

		return "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
	}
  /**
   * Convert HSVA to RGBA.
   * @param {object} hsva Hue, saturation, value and alpha values.
   * @return {object} Red, green, blue and alpha values.
   */
  ColorUtils.hsvaToRgba = function hsvaToRgba(hsva) {
    var saturation = hsva.s / 100;
    var value = hsva.v / 100;
    var chroma = saturation * value;
    var hueBy60 = hsva.h / 60;
    var x = chroma * (1 - Math.abs(hueBy60 % 2 - 1));
    var m = value - chroma;

    chroma = (chroma + m);
    x = (x + m);

    var index = Math.floor(hueBy60) % 6;
    var red = [chroma, x, m, m, x, chroma][index];
    var green = [x, chroma, chroma, x, m, m][index];
    var blue = [m, m, x, chroma, chroma, x][index];

    return {
      r: Math.round(red * 255),
      g: Math.round(green * 255),
      b: Math.round(blue * 255),
      a: hsva.a
    };
  }

  /**
   * Convert HSVA to HSLA.
   * @param {object} hsva Hue, saturation, value and alpha values.
   * @return {object} Hue, saturation, lightness and alpha values.
   */
  ColorUtils.hsvaToHsla = function hsvaToHsla(hsva) {
    var value = hsva.v / 100;
    var lightness = value * (1 - (hsva.s / 100) / 2);
    var saturation;

    if (lightness > 0 && lightness < 1) {
      saturation = Math.round((value - lightness) / Math.min(lightness, 1 - lightness) * 100);
    }

    return {
      h: hsva.h,
      s: saturation || 0,
      l: Math.round(lightness * 100),
      a: hsva.a
    };
  }

  /**
   * Convert RGBA to HSVA.
   * @param {object} rgba Red, green, blue and alpha values.
   * @return {object} Hue, saturation, value and alpha values.
   */
  ColorUtils.rgbaToHsva = function rgbaToHsva(rgba) {
    var red   = rgba.r / 255;
    var green = rgba.g / 255;
    var blue  = rgba.b / 255;
    var xmax = Math.max(red, green, blue);
    var xmin = Math.min(red, green, blue);
    var chroma = xmax - xmin;
    var value = xmax;
    var hue = 0;
    var saturation = 0;

    if (chroma) {
      if (xmax === red ) { hue = ((green - blue) / chroma); }
      if (xmax === green ) { hue = 2 + (blue - red) / chroma; }
      if (xmax === blue ) { hue = 4 + (red - green) / chroma; }
      if (xmax) { saturation = chroma / xmax; }
    }

    hue = Math.floor(hue * 60);

    return {
      h: hue < 0 ? hue + 360 : hue,
      s: Math.round(saturation * 100),
      v: Math.round(value * 100),
      a: rgba.a
    };
  }

  /**
   * Parse a string to RGBA.
   * @param {string} str String representing a color.
   * @return {object} Red, green, blue and alpha values.
   */
  ColorUtils.strToRgba = function strToRgba(str) {
    var regex = /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i;
    var match, rgba;

    // Default to black for invalid color strings
    ctx.fillStyle = '#000';

    // Use canvas to convert the string to a valid color string
    ctx.fillStyle = str;
    match = regex.exec(ctx.fillStyle);

    if (match) {
      rgba = {
        r: match[3] * 1,
        g: match[4] * 1,
        b: match[5] * 1,
        a: match[6] * 1
      };

      // Workaround to mitigate a Chromium bug where the alpha value is rounded incorrectly
      rgba.a = +rgba.a.toFixed(2);

    } else {
      match = ctx.fillStyle.replace('#', '').match(/.{2}/g).map(function(h) { return parseInt(h, 16)});
      rgba = {
        r: match[0],
        g: match[1],
        b: match[2],
        a: 1
      };
    }

    return rgba;
  }

  /**
   * Convert RGBA to Hex.
   * @param {object} rgba Red, green, blue and alpha values.
   * @return {string} Hex color string.
   */
  ColorUtils.rgbaToHex = function rgbaToHex(rgba) {
    var r = rgba.r.toString(16);
    var g = rgba.g.toString(16);
    var b = rgba.b.toString(16);
    var a = '';

    if (rgba.r < 16) {
      r = '0' + r;
    }

    if (rgba.g < 16) {
      g = '0' + g;
    }

    if (rgba.b < 16) {
      b = '0' + b;
    }

    if (settings.alpha && (rgba.a < 1 || settings.forceAlpha)) {
      var alpha = rgba.a * 255 | 0;
      a = alpha.toString(16);

      if (alpha < 16) {
        a = '0' + a;
      }
    }

    return '#' + r + g + b + a;
  }

  /**
   * Convert RGBA values to a CSS rgb/rgba string.
   * @param {object+ ', rgba Red, green, blue and alpha values.
   * @return {string+ ', CSS color string.
   */
  ColorUtils.rgbaToStr = function rgbaToStr(rgba) {
    if (!settings.alpha || (rgba.a === 1 && !settings.forceAlpha)) {
      return 'rgb(' + rgba.r+ ', ' + rgba.g+ ', ' + rgba.b+ ')';
    } else {
      return 'rgba(' + rgba.r+ ', ' + rgba.g+ ', ' + rgba.b+ ', ' + rgba.a+ ')';
    }
  };

  /**
   * Convert HSLA values to a CSS hsl/hsla string.
   * @param {object+ ', hsla Hue, saturation, lightness and alpha values.
   * @return {string+ ', CSS color string.
   */
  ColorUtils.hslaToStr = function hslaToStr(hsla) {
    if (!settings.alpha || (hsla.a === 1 && !settings.forceAlpha)) {
      return 'hsl(' + hsla.h+ ', ' + hsla.s+ '%, ' + hsla.l+ ')';
    } else {
      return 'hsla(' + hsla.h+ ', ' + hsla.s+ '%, ' + hsla.l+ '%, ' + hsla.a+ ')';
    }
  }

	function name2Hex(n) {
		var hex = nativeNames[n.toLowerCase()];
		if (!hex)
			throw new Error('Invalid Color Name: ' + n);
		return hex;
	};
	
	ColorUtils.name2Hex = name2Hex;
	
	ColorUtils.name2hex = name2Hex;
	
	ColorUtils.nameToHex = name2Hex;
	
	function name2Hsv(n) {
		return hex2hsv(name2Hex(n));
	}
	
	ColorUtils.name2Hsv = name2Hsv;
	
	function name2Hsl(n) {
		return hsv2Hsl(hex2hsv(name2Hex(n)));
	}
	
	ColorUtils.name2Hsl = name2Hsl;
	
	function name2Rgb(n) {
		return hex2rgb(name2Hex(n));
	}
	
	ColorUtils.hex2Hsv = hex2Hsv;
	
	ColorUtils.hex2hsv = hex2Hsv;
	
	ColorUtils.hexToHsv = hex2Hsv;
	
	ColorUtils.name2Hsv = name2Hsv;
	
	var name2Rgb = function(name) {
		return hex2rgb(name2Hex(name));
	};
	
	function hex2Name(h) {
		return nativeColorNames[h]||'';
	}
	
	ColorUtils.hex2Name = hex2Name;
	
	ColorUtils.NATIVE_COLOR_NAMES_LIST = nativeNamesList;
	
    return ColorUtils;
});

if (typeof SereniX === 'undefined')
	globalNS.SereniX = { ColorUtils : ColorUtils };
else if (typeof SereniX.addChild === 'function')
	SereniX.addChild(ColorUtils);
else
	SereniX.ColorUtils = ColorUtils;
