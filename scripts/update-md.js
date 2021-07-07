#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = "./source/common/_patterns/";

const getAllFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.charAt(0) === '_' && path.extname(file) === '.mustache') {
                arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
            }
        }
    })

    return arrayOfFiles;
};

let allFiles = [];
allFiles = getAllFiles(rootDir, allFiles);
//console.log(allFiles);

allFiles.forEach(function (file) {
  const mdfile = path.dirname(file) + '\\' + path.basename(file, '.mustache') + '.md';
  let newFileContents = '---\nhidden: true \n\n---';
  let needsUpdate = true;
  if (fs.existsSync(mdfile)) {
      const data = fs.readFileSync(mdfile, 'utf8');
      if (data.includes('hidden')) {
          needsUpdate = false;
          console.log('not updating ' + mdfile);
      } else {
          const position = data.indexOf('\n') + 1;
          newFileContents = [data.slice(0, position), 'hidden: true\n', data.slice(position)].join('');
      }
  }
  if (needsUpdate) {
      fs.writeFileSync(mdfile, newFileContents);
      console.log( mdfile + ' updated');
  }
});
