/* 
 * The MIT License
 *
 * Copyright 2021 Marc KAMGA Olivier <kamga_marco@yahoo.com;mkamga.olivier@gmail.com>.
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

//

/**
 * Normalizes color string value : add '#' at the begining or remove unneeded white spaces before and after tokens
 * @param {String} sc The color string value
 * @returns {String}
 */
function normalizeColor(sc) {
    var m, c;
    var byte = "25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?";
    var opacity = "0(?\\.\\d+)?|1(?:\\.0+)?";
    if ((c = /^(?:(#)?(?:([a-f0-9]{3})|([a-f0-9]{6}))|(?:(rgb)\([ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[ \t]*[,][ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[ \t]*[,][ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\))|(?:(rgba)\([ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[ \t]*[,][ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[ \t]*[,][ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[ \t]*[,][ \t]*(0(?:\.\d+)?|(?:1(?:\.0+)?))\)))$/i.exec(sc))) {
        //'#' : 1
        //hhh : 2
        //hhhhhh : 3
        //'rgb' : 4
        //  -> r : 5
        //  -> g : 6
        //  -> b : 7
        //'rgba' : 8
        //  -> r : 9
        //  -> g : 10
        //  -> b : 11
        //  -> a : 12
        return (m = c[2]) ? (c[1] ? c[1] : "#") + m[0] + m[0] + m[1] + m[1] + m[2] +m[2] :
                (m = c[3]) ? (c[1] ? c[1] : "#") + m : 
                m[4] ? 'rgb(' + c[5] + ',' + c[6] + ',' + c[7] + ')' :
                'rgba(' + c[9] + ',' + c[10] + ',' + c[11] + ',' + c[12] + ')';
    } else {
        var pct = "(?:[0](?:\\.0+)?|[1](?:[0](?:\\.\\d+|[0](?:\\.0+)?)?|[1-9])?|[2-9][0-9]?(?:\\.\\d+)?)%";
        var re = new RegExp("^rgb\\s*\\(\\s*" 
                + "(" + pct + ")"
                +"\\s*,\\s*"
                + "(" + pct + ")"
                +"\\s*,\\s*"
                + "(" + pct + ")"
                + "\\s*\\)\\s*$");
        if (m = re.exec(sc)) {
            return "rgb(" + m[1] + "," + m[2] + "," + m[3] + ")";
        }
        re = new RegExp("^rgba\\s*\\(" 
                + "(" + byte + ")"
                +"\\s+"
                + "(" + byte + ")"
                +"\\s+"
                + "(" + byte + ")"
                + "\\s*/\\s*"
                + "(" + opacity + "|" + pct + ")"
                + "\\s*\\)\\s*$"
                );
        if (m = re.exec(sc)) {
            return "rgba(" + m[1] + " " + m[2] + " " + m[3] + " / " + m[4] + ")";
        }
    }
}

var colorFromHtmlName = (function() {
    var cached = {};
    /**
     * convert named colors
     * @param {type} color
     * @returns {undefined|window.getComputedStyle.color}
     */
    function colorFromHtmlName(color) {
        var cc = cached[color];
        if (cc) return cc;
        if (/[a-z][a-z0-9_]*/i.test(color)) {
            // intentionally use unknown tag to lower chances of css rule override with !important
            var el = document.body.appendChild(document.createElement('fictum')); 
            var flag = 'rgb(1, 2, 3)'; // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14
            el.style.color = flag;
            if (el.style.color !== flag)
                    return; // color set failed - some monstrous css rule is probably taking over the color of our object
            el.style.color = color;
            if (el.style.color === flag || el.style.color === '')
                    return; // color parse failed
            color = getComputedStyle(el).color;
            document.body.removeChild(el);
            return color;
        }
    }
    return colorFromHtmlName;
})();

var HSL_COLOR_STRICT_REGEX =/(hsl)\((\d+)(?:(?:,([0-9]|100|[1-9][0-9])%)(?:,([0-9]|100|[1-9][0-9])%)|(?:[ ]([0-9]|100|[1-9][0-9])%)(?:[ ]([0-9]|100|[1-9][0-9])%))\)/;
var HSLA_COLOR_STRICT_REGEX =/(hsla)\((\d+)(?:(?:,([0-9]|100|[1-9][0-9])%)(?:,([0-9]|100|[1-9][0-9])%)|(?:[ ]([0-9]|100|[1-9][0-9])%)(?:[ ]([0-9]|100|[1-9][0-9])%)),(0(?:\.\d+)?|1(?:\.0+)?|(?:[0](?:\.\d+)%?|([1-9][0-9]?(?:\.\d+)|100(?:\.\0+)?)%))\)/;

var HSL_COLOR_REGEX =/(hsl)\([ \t]*(\d+)(?:(?:[ \t]*,[ \t]*([0-9]|100|[1-9][0-9])%)(?:[ \t]*,[ \t]*([0-9]|100|[1-9][0-9])%)|(?:[ \t]+([0-9]|100|[1-9][0-9])%)(?:[ \t]+([0-9]|100|[1-9][0-9])%))\)/;
var HSLA_COLOR_REGEX =/(hsla)\([ \t]*(\d+)(?:(?:[ \t]*,[ \t]*([0-9]|100|[1-9][0-9])%)(?:[ \t]*,[ \t]*([0-9]|100|[1-9][0-9])%)|(?:[ \t]+([0-9]|100|[1-9][0-9])%)(?:[ \t]+([0-9]|100|[1-9][0-9])%)),(0(?:\.\d+)?|1(?:\.0+)?|(?:[0](?:\.\d+)%?|([1-9][0-9]?(?:\.\d+)|100(?:\.\0+)?)%))\)/;

/**
 * Regular expression to parse color hex string without '#' symbol or to parse rgb or rgba color string with spaces
 * @type RegExp
 */
var COLOR_REGEX = /^(?:(#)?(?:([a-f0-9]{3})|([a-f0-9]{6}))([a-f0-9]{1,2})?|(?:(rgb)\([ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[ \t]*[,][ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[ \t]*[,][ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\))|(?:(rgba)\([ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[ \t]*[,][ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[ \t]*[,][ \t]*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[ \t]*[,][ \t]*(0(?:\.\d+)?|(?:1(?:\.0+)?))\))|(?:(hsl)\([ \t]*(\d+)(?:(?:[ \t]*,[ \t]*([0-9]|100|[1-9][0-9])%)(?:[ \t]*,[ \t]*([0-9]|100|[1-9][0-9])%)|(?:[ \t]+([0-9]|100|[1-9][0-9])%)(?:[ \t]+([0-9]|100|[1-9][0-9])%))\)|(?:(hsla)\([ \t]*(\d+)(?:(?:[ \t]*,[ \t]*([0-9]|100|[1-9][0-9])%)(?:[ \t]*,[ \t]*([0-9]|100|[1-9][0-9])%)|(?:[ \t]+([0-9]|100|[1-9][0-9])%)(?:[ \t]+([0-9]|100|[1-9][0-9])%)),(0(?:\.\d+)?|1(?:\.0+)?|(?:[0](?:\.\d+)%?|([1-9][0-9]?(?:\.\d+)|100(?:\.\0+)?)%))\))))$/i;
/**
 * 
 * @type RegExp
 */
var COLOR_STRICT_REGEX = /^(?:#(?:([a-f0-9]{3})|([a-f0-9]{6}))([a-f0-9]{1,2})?|(?:(rgb)\((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[,](25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[,](25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\))|(?:(rgba)\((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[,](25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[,](25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)[,](0(?:\.\d+)?|(?:1(?:\.0+)?))\)))$/i;

/**
 * 
 * @param {type} c
 * @param {Boolean} [array=false]
 * @returns {String|Array&lt;Number&gt;|undefined}
 */
function toRgb(c, array) {
    if (c instanceof String) {
        c = c.valueOf();
    }
    var m;
    if (isArray(c)) {
        m = [ c[0]||0, c[1]||0, c[2]||0];
    } else if (typeof c === 'string') {  
        if ((c = COLOR_REGEX.exec(c))||(c = COLOR_REGEX.exec(colorFromHtmlName(c)||""))) {
            //'#' : 1
            //hhh : 2
            //hhhhhh : 3
            //o : 4
            //'rgb' : 5
            //  -> r : 6
            //  -> g : 7
            //  -> b : 8
            //'rgba' : 9
            //  -> r : 10
            //  -> g : 11
            //  -> b : 12
            //  -> a : 13
            m = /* #hhh */(m = c[2]) ? [parseInt(m[0] + m[0], 16), parseInt(m[1] + m[1], 16), parseInt(m[2] +m[2], 16)] :
                    /* #hhhhhh(?:hh)? */(m = c[3]) ? [parseInt(m.substring(0, 2), 16), parseInt(m.substring(2, 4), 16), parseInt(m.substring(4), 16)]: 
                    /* rgb */c[5] ? [c[6], c[7], c[8]] :
                    /* rgba */c[9] ? [c[10], c[11], c[12]]:
                    /* hsl */c[13] ? hslToRgb([c[14]||c[17]||0, (c[15]||c[18]||0)+'%', (c[16]||c[19]||0)+'%'], true) : 
                    /* hsla *//*m[20] ?*/ hslToRgb([c[21]||c[25]||0, (c[22]||c[26]||0)+'%', (c[23]||c[27]||0)+'%'], true);
        }
    } else if (isPlainObject(c)) {
        m = [c.red||c.Red||c.r||c.R||0, c.green||c.Green||c.g||c.G||0, c.blue||c.Blue||c.b||c.B||0];
    }
    return !m ? undefined : array ? m : 'rgb(' + m.join(',') + ')';
}
/**
 * 
 * @param {type} c
 * @param {Boolean} [array=false]
 * @returns {Array&lt;Number&gt;|String|undefined}
 */
var rgb = toRgb;
/**
 * 
 * @param {type} color
 * @returns {String}
 */
function rgbString(color) {
    return toRgb(color, false);
}
/**
 * 
 * @param {type} color
 * @returns {String}
 * @alias rgbString
 */
var srgb = rgbString;
/**
 * 
 * @param {type} color
 * @returns {Array&lt;Number&gt;|undefined}
 */
function rgbArray(color) {
    return toRgb(color, true);
}
/**
 * 
 * @param {type} color
 * @returns {Array&lt;Number&gt;|undefined|RegExp|type|toRgb.c|Array|toRgb.m|String}
 */
var argb = rgbArray;
/**
 * 
 * @param {type} color
 * @returns {Array&lt;Number&gt;|undefined|RegExp|type|toRgb.c|Array|toRgb.m|String}
 */
var arrayRgb = rgbArray;
/**
 * 
 * @param {type} c
 * @param {Number} opacity
 * @param {Boolean} [array=false]
 * @returns {String|Array&lt;Number&gt;}
 */
function toRgba(c, opacity, array) {
    if (arguments.length > 1) {
        if (typeof opacity === 'boolean') {
            var v = opacity;
            opacity = array;
            array = v;
        }        
    }
    var m;
    if (typeof opacity === 'string' && opacity) {
        m = parseInt(opacity);
        if (!isNaN(m)) {
            throw new Error("Incorrect opacity: " + opacity);
        }
        opacity = m;
    }
    if (typeof opacity === 'number' && (opacity < 0 || opacity > 1)) {
        throw new Error("Incorrect opacity: " + opacity);
    }
    function alpha(o1) {
        if (typeof o1 === 'number') {
            if (o1 < 0 || o1 > 1) {
                throw new Error("Incorrect opacity: " + o1);
            }
            return o1;
        }
        var o;
        if (typeof o1 === 'string' && o1) {
            if (o1.endsWith('%')) {
                if (!isNaN(o = parseFloat(o1.substring(0, o1.length - 1)))) {
                    return o/100;
                }
            } else if (!isNaN(o = parseFloat(o1))) {
                return o;
            }
        }        
    } 
    function _opacity(o1, o2) {      
        return (o1 = alpha(o1)) === undefined ? alpha(o2)||0 : o1;
    }
    if (isArray(c)) {
        m = [ c[0]||0, c[1]||0, c[2]||0, _opacity(opacity, c[3]||0)];
    } else if (typeof c === 'string') {
        if ((c = COLOR_REGEX.exec(c)||COLOR_REGEX.exec(colorFromHtmlName(c)||""))) {
            //'#' : 1
            //hhh : 2
            //hhhhhh : 3
            //o : 4
            //'rgb' : 5
            //  -> r : 6
            //  -> g : 7
            //  -> b : 8
            //'rgba' : 9
            //  -> r : 10
            //  -> g : 11
            //  -> b : 12
            //  -> a : 13
            m = /* #hhh */(m = c[2]) ? [parseInt(m[0] + m[0], 16), parseInt(m[1] + m[1], 16), parseInt(m[2] +m[2], 16), _opacity(opacity)] :
                    /* #hhhhhh(?:hh)? */(m = c[3]) ? [parseInt(m.substring(0, 2), 16), parseInt(m.substring(2, 4), 16), parseInt(m.substring(4), 16), _opacity(opacity, c[4] ? parseInt(c[4], 16)/255 : 0)]: 
                    /* rgb */c[5] ? [c[6], c[7], c[8],_opacity(opacity) ] :
                    /* rgba */c[9]? [c[10], c[11], c[12], _opacity(opacity, c[13])]:
                    /* hsl */c[13] ? hslaToRgba([c[14]||c[17]||0, (c[15]||c[18]||0)+'%', (c[16]||c[19]||0)+'%', ,_opacity(opacity)], true) : 
                    /* hsla *//*m[20] ?*/ hslaToRgba([c[21]||c[25]||0, (c[22]||c[26]||0)+'%', (c[23]||c[27]||0)+'%', _opacity(opacity,c[24]||c[29])], true);
        }
    } else if (isPlainObject(c)) {
        m = [c.red||c.Red||c.r||c.R||0, c.green||c.Green||c.g||c.G||0, c.blue||c.Blue||c.b||c.B||0, _opacity(opacity, c.opacity||c.alpha||c.Opacity||c.Alpha||0)];
    }
    return m ? (array ? m : 'rgba(' + m.join(',') + ')'): undefined;
}

var rgba = toRgba;
/**
 * 
 * @param {Number|String|Array|Object} r
 * @param {type} g
 * @param {type} b
 * {Boolean} [array=false] Return the result as an array?
 * @returns {String}
 */
function rgbToHsl(r,g,b, array) {
    if (isArray(r)) {
        array = g;
        g = r[1]||0;
        b = r[2]||0;
        r = r[0];
    } else if (typeof r === 'string') {
        array = g;
        var rgb = r, v,
            sep = rgb.indexOf(",") > -1 ? "," : " ";
        rgb = rgb.substr(4).split(")")[0].split(sep);

        for (var i = 0, n = rgb.length; i < n; i++) {
          v = rgb[i];
          if (r.indexOf("%") > -1) 
            rgb[i] = Math.round(r.substr(0,r.length - 1)  * 255 / 100);
        }
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
    } else {
        g = r.green||r.g||r.Green||r.G||0; 
        b = r.blue||r.b||r.Blue||r.B||0; 
        r = r.red||r.r||r.Red||r.R||0;
    }
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    var cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    // Calculate hue
    // No difference
    if (delta === 0)
      h = 0;
    // Red is max
    else if (cmax === r)
      h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax === g)
      h = (b - r) / delta + 2;
    // Blue is max
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;
    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return array ? [h, s, l] : "hsl(" + h + "," + s + "%," + l + "%)";
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
function hslToRgb(h, s, l, array) {
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
        s = h.saturation||h.s||h.Saturation||h.S||0;
        l = h.luminence||h.l||h.Luminence||h.L||0;
        h = h.hue||h.h||h.Hue||h.H||0;
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
function hslaToRgba(h, s, l, a, array) {
    if (isArray(h)) {
        array = s;
        s = h[1]||0;
        l = h[2]||0;
        a = (h[3]||0);
        h = h[0];
    } else if (typeof h === 'string') {
        array = s;
        var sep = h.indexOf(",") > -1 ? "," : " ";
        h = h.substr(4).split(")")[0].split(sep);        
        s = h[1].substr(0,h[1].length - 1) / 100, //remove '%' in the s component
        l = h[2].substr(0,h[2].length - 1) / 100; //remove '%' in the l component
        a = (h[3]||0);
        h = h[0];
    } else {
        array = s;
        s = h.saturation||h.s||h.Saturation||h.S||0;
        l = h.luminence||h.l||h.Luminence||h.L||0;
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
 * @param {type} H
 * @param {type} array
 * @returns {Array|String}
 */
function hexToHsl(H, array) {
// Convert hex to RGB first
  var r = 0, g = 0, b = 0;
  if (H.length === 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length === 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  var cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta === 0)
    h = 0;
  else if (cmax === r)
    h = ((g - b) / delta) % 6;
  else if (cmax === g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0)
    h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return array ? [ h, s, l] : "hsl(" + h + "," + s + "%," + l + "%)";
}
/**
 * Converts hexadecimal color with alpha to HL color with alpha
 * @param {type} h
 * @param {type} array
 * @returns {String|Array|hexaToHsla.hsl|hexAToHsla.hsl}
 */
function hexAToHsla(h, array) {
  var r = 0, g = 0, b = 0, a = 1;

  if (h.length === 5) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
    a = "0x" + h[4] + h[4];
  } else if (h.length === 9) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
    a = "0x" + h[7] + h[8];
  }

  var hsl = rgbToHsl(r, g, b, true);
        
  hsl.push(a = (a / 255).toFixed(3));
                
  return array ? hsl : "hsla("+ hsl[0] + "," + hsl[1] + "%," + hsl[2] + "%," + a + ")";
}

var hexaToHsla = hexAToHsla;


/**
 * Converts the RGB colors to CMYK colors
 * @param {Object} rgb
 */
function rgbToCmyk(rgb) {
    function val(n1, n2) {
        var v = rgb[n1];
        if (v === undefined) v = rgb[n2];
        return v;
    }
    var r, g, b, c, m, y, k;

    r = val('r', 'red') / 255;
    g = val('g', 'green') / 255;
    b = val('b', 'blue') / 255;
 
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

    return {
      c: Math.round( c * 100 ),
      m: Math.round( m * 100 ),
      y: Math.round( y * 100 ),
      k: Math.round( k * 100 )
    };
  };

/**
 * Converts the CMYK colors to RGB colors
 * @param {Object} cmyk
 */
function cmykToRgb(cmyk) {
    var c = cmyk.c / 100;
    var m = cmyk.m / 100;
    var y = cmyk.y / 100;
    var k = cmyk.k / 100;

    var r = 1 - Math.min( 1, c * ( 1 - k ) + k );
    var g = 1 - Math.min( 1, m * ( 1 - k ) + k );
    var b = 1 - Math.min( 1, y * ( 1 - k ) + k );

    return {r: Math.round(r * 255), g : Math.round(g * 255), b: Math.round(b * 255)};
}