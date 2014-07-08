# gulp-extend [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> A [gulp](https://github.com/wearefractal/gulp) plugin to [extend](https://npmjs.org/package/node.extend) (merge) json contents

## Usage

First, install `gulp-extend` as a development dependency:

```shell
npm install  gulp-extend --save-dev
```

Then, add it to your `gulpfile.js`:

**Extend the contents of json files**

```javascript
var extend = require('gulp-extend');

gulp.src('./src/*.en.json')
	.pipe(extend('text.en.json'))
	.pipe(gulp.dest('./dist'));
```

**Extend the contents of a json file and then [wrap](https://github.com/adamayres/gulp-wrap) them in a code block**

```javascript
var extend = require('gulp-extend');
var wrap = require('gulp-wrap');

gulp.src('./src/*.json')
    .pipe(extend('text.en.js') //use .js extension since we plan to wrap
    .pipe(wrap('angular.module(\'text\', []).value(<%= contents %>);'))
    .pipe(gulp.dest("./dist"));
```

## API

### extend(fileName[, deep [, jsonSpace]])

#### fileName
Type: `String`

The output filename

#### deep

Type: `Boolean`  
Default: `true`

If the extend should be deep.

#### jsonSpace

Type: `String` or `Number`  
Default: `undefined`

JSON.stringify's space attribute for pretty-printing the resulting JSON.  
See [MDN docs on JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) for more information.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-extend
[npm-image]: https://badge.fury.io/js/gulp-extend.png

[travis-url]: http://travis-ci.org/adamayres/gulp-extend
[travis-image]: https://secure.travis-ci.org/adamayres/gulp-extend.png?branch=master

[depstat-url]: https://david-dm.org/adamayres/gulp-extend
[depstat-image]: https://david-dm.org/adamayres/gulp-extend.png
