'use strict';

var extend = require('../');
var fs = require('fs');
var es = require('event-stream');
var should = require('should');
var gutil = require('gulp-util');
var path = require('path');
require('mocha');

describe('gulp-extend', function () {

  var expectedFile = new gutil.File({
    path: 'test/expected/text1.json',
    cwd: 'test/',
    base: 'test/expected',
    contents: fs.readFileSync('test/expected/merged.json')
  });

  it('should extend file contents via buffer', function (done) {

    var srcFile1 = new gutil.File({
      path: 'test/fixtures/text1.json',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/text1.json')
    });

    var srcFile2 = new gutil.File({
      path: 'test/fixtures/text1.json',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/text2.json')
    });

    var stream = extend('output.json');

    stream.on('error', function(err) {
      should.exist(err);
      done(err);
    });

    stream.on('data', function (newFile) {
      should.exist(newFile);
      should.exist(newFile.contents);

      var newFilePath = path.resolve(newFile.path);
      var expectedFilePath = path.resolve('test/fixtures/output.json');
      newFilePath.should.equal(expectedFilePath);

      newFile.relative.should.equal('output.json');
      String(newFile.contents).should.equal('{"foo":{"bar":true,"other":"HELLO"},"baz":false,"bah":"BYE"}');
      Buffer.isBuffer(newFile.contents).should.equal(true);
      done();
    });

    stream.write(srcFile1);
    stream.write(srcFile2);
    stream.end();
  });

  it('should allow a shallow extend of file contents via buffer', function (done) {

    var srcFile1 = new gutil.File({
      path: 'test/fixtures/text1.json',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/text1.json')
    });

    var srcFile2 = new gutil.File({
      path: 'test/fixtures/text1.json',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/text2.json')
    });

    var stream = extend('output.json', false);

    stream.on('error', function(err) {
      should.exist(err);
      done(err);
    });

    stream.on('data', function (newFile) {
      should.exist(newFile);
      should.exist(newFile.contents);

      var newFilePath = path.resolve(newFile.path);
      var expectedFilePath = path.resolve('test/fixtures/output.json');
      newFilePath.should.equal(expectedFilePath);

      newFile.relative.should.equal('output.json');
      String(newFile.contents).should.equal('{"foo":{"other":"HELLO"},"baz":false,"bah":"BYE"}');
      Buffer.isBuffer(newFile.contents).should.equal(true);
      done();
    });

    stream.write(srcFile1);
    stream.write(srcFile2);
    stream.end();
  });

  it('should error on stream', function (done) {

    var srcFile = new gutil.File({
      path: 'test/fixtures/text1.json',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.createReadStream('test/fixtures/text1.json')
    });

    var stream = extend('World');

    stream.on('error', function(err) {
      err.message.should.equal('gulp-extend: Streaming not supported');
      should.exist(err);
      done();
    });

    stream.on('data', function (newFile) {
      newFile.contents.pipe(es.wait(function(err, data) {
        done(err);
      }));
    });

    stream.write(srcFile);
    stream.end();
  });

  it('should error when no fileName is provided', function () {
    (function(){
      extend();
    }).should.throw('gulp-extend: Missing fileName parameter');
  });

  it('should pass json space parameter', function () {
    var src1 = new gutil.File({
      contents: fs.readFileSync('test/fixtures/text1.json')
    });

    var src2 = new gutil.File({
      contents: fs.readFileSync('test/fixtures/text2.json')
    });

    var extendStream = extend('result.json', true, 4);
    extendStream.pipe(es.through(function(file) {
      var result = file.contents.toString(),
        expected = fs.readFileSync('test/expected/merged-with-spaces.json').toString();

      result.should.equal(expected);
    }));

    extendStream.write(src1);
    extendStream.write(src2);
    extendStream.end();
  });
});
