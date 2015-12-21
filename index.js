var helpers   = require('postcss-message-helpers');
var webcolors = require('webcolors');

var DEFAULTS = webcolors.mrmrs;

// All props that use the <color> data type
// https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#See_also
var PROPS = [
  'color',
  'background',
  'background-color',
  'border',
  'border-color',
  'outline',
  'outline-color',
  'text-shadow',
  'box-shadow',
  'fill'
];

// CSS color keywords to replace
var KEYWORDS = [
  'aqua',
  'cornsilk',
  'darkseagreen',
  'cornflowerblue',
  'mediumspringgreen',
  'darksalmon',
  'lavenderblush',
  'floralwhite',
  'darkcyan',
  'lime',
  'gray',
  'lightcyan',
  'midnightblue',
  'darkgreen',
  'pink',
  'dodgerblue',
  'powderblue',
  'gold',
  'white',
  'olivedrab',
  'deeppink',
  'darkorange',
  'beige',
  'lightsalmon',
  'mintcream',
  'gainsboro',
  'purple',
  'navajowhite',
  'lightgreen',
  'mediumseagreen',
  'bisque',
  'navy',
  'snow',
  'lightpink',
  'orangered',
  'yellow',
  'brown',
  'olive',
  'thistle',
  'slateblue',
  'orchid',
  'cadetblue',
  'lightgrey',
  'fuchsia',
  'blueviolet',
  'lightskyblue',
  'ghostwhite',
  'mediumblue',
  'mediumaquamarine',
  'yellowgreen',
  'blanchedalmond',
  'mediumvioletred',
  'coral',
  'greenyellow',
  'darkslategray',
  'maroon',
  'moccasin',
  'darkslategrey',
  'deepskyblue',
  'mediumorchid',
  'turquoise',
  'lightblue',
  'darkgoldenrod',
  'lightslategray',
  'lightcoral',
  'aliceblue',
  'plum',
  'paleturquoise',
  'red',
  'linen',
  'darkolivegreen',
  'mediumpurple',
  'papayawhip',
  'lightsteelblue',
  'whitesmoke',
  'aquamarine',
  'lightseagreen',
  'salmon',
  'wheat',
  'darkkhaki',
  'tomato',
  'khaki',
  'violet',
  'darkorchid',
  'mediumslateblue',
  'darkgray',
  'forestgreen',
  'green',
  'darkviolet',
  'palevioletred',
  'darkslateblue',
  'lightgoldenrodyellow',
  'lightyellow',
  'seashell',
  'magenta',
  'darkblue',
  'lavender',
  'palegreen',
  'rosybrown',
  'cyan',
  'skyblue',
  'lightgray',
  'seagreen',
  'tan',
  'teal',
  'slategray',
  'peachpuff',
  'blue',
  'indianred',
  'goldenrod',
  'ivory',
  'firebrick',
  'mediumturquoise',
  'chocolate',
  'springgreen',
  'chartreuse',
  'grey',
  'saddlebrown',
  'hotpink',
  'dimgray',
  'orange',
  'darkmagenta',
  'sienna',
  'honeydew',
  'lawngreen',
  'lightslategrey',
  'peru',
  'slategrey',
  'burlywood',
  'lemonchiffon',
  'antiquewhite',
  'rebeccapurple',
  'royalblue',
  'crimson',
  'silver',
  'palegoldenrod',
  'darkred',
  'limegreen',
  'steelblue',
  'oldlace',
  'black',
  'darkturquoise',
  'sandybrown',
  'indigo',
  'darkgrey',
  'dimgrey',
  'azure',
  'mistyrose'
];

var KEYWORD_REGEX = new RegExp('\\b(' + KEYWORDS.join('|') + ')\\b');


module.exports = function plugin (opts) {
  opts = opts || {};
  opts.palette = opts.palette || DEFAULTS;

  if (typeof opts.palette === 'string') {
    if (webcolors.hasOwnProperty(opts.palette)) {
      opts.palette = webcolors[opts.palette];
    } else {
      throw new Error('Unknown webcolors palette: '' + opts.palette + ''');
    }
  }

  var palette    = opts.palette;
  var transforms = [];

  // For each color keyword, generate a [RegExp, 'replacement'] pair,
  // i.e. the arguments to String.prototype.replace
  KEYWORDS.forEach(function (keyword) {
    if (palette.hasOwnProperty(keyword) && palette[keyword]) {
      transforms.push([
        new RegExp('\\b(' + keyword + ')(\\s*([^(]|$))', 'gi'),
        palette[keyword] + '$2'
      ]);
    }
  });

  return function processor (css) {
    css.eachDecl(function transformDecl (decl) {
      // Check if the decl is of a color-related property and make sure
      // it has a value containing a replaceable color
      if (PROPS.indexOf(decl.prop) === -1 ||
          !decl.value ||
          !KEYWORD_REGEX.test(decl.value)) {
        return;
      }
      // Transform!
      decl.value = helpers.try(function transformValue () {
        return transforms.reduce(function (value, args) {
          return value.replace.apply(value, args);
        }, decl.value);
      }, decl.source);
    });
  };
};
