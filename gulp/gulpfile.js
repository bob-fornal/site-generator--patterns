const { series, src, dest }  = require('gulp');
const through = require('through2');
var rs = require('replacestream');

const fs = require('fs');
const path = require('path');

let templates = {};
let templateNames = [];

function copy(cb) {
  src('src/assets/**').pipe(dest('dist/assets/'));
  src('src/js/**').pipe(dest('dist/js/'));
  src('src/styles/**').pipe(dest('dist/styles/'));
  cb()
}

function getTemplates(cb) {
  const templatepath = 'src/templates/';
  const files = fs.readdirSync(templatepath);
  files.forEach(file => {
    templateNames.push(file);
    templates[file] = fs.readFileSync(path.join(templatepath, file), 'utf8');
  });
  cb();
}

function processHTMLFiles(cb) {
  src('src/*.html')
    .pipe(replaceTemplates())
    .pipe(dest('dist/'));
  cb();
}

function replaceTemplates() {
  return through.obj(function(file, encoding, callback) {
    if (file.isStream()) {
      file.contents = templateNames.reduce(function (contents, search) {
        return contents.pipe(rs(`<!-- TEMPLATE: ${ search } -->`, templates[search]));
      }, file.contents);
      return callback(null, file);
    }
    if (file.isBuffer()) {
      var result = templateNames.reduce(function (contents, search) {
        return contents
          .split(`<!-- TEMPLATE: ${ search } -->`)
          .join(templates[search]);
      }, String(file.contents));
      file.contents = Buffer.from(result);
      return callback(null, file);
    }
  })
}

exports.default = series(getTemplates, copy, processHTMLFiles);
