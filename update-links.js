#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = "./source/altinn/_patterns/";

const getAllFiles = function(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (path.extname(file) === '.json') {
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
    let data = fs.readFileSync(file, 'utf8');
    if (data.includes('/patterns/')) {
        const start = data.indexOf('/patterns/');
        const end = data.indexOf('.html', start) + 5;
        const oldlink = data.substr(start, end - start);
        console.log('oldlink: ' + oldlink);

        const lastpart = oldlink.substr(oldlink.lastIndexOf('/'), oldlink.length - 1);
        const numbers = lastpart.match(/\d+/g);
        const folder = lastpart.substr(lastpart.indexOf(numbers[0]) + 3, lastpart.indexOf(numbers[1]) - lastpart.indexOf(numbers[0]) - 3);
        const filename = lastpart.substr(lastpart.indexOf(numbers[2]) + 3, lastpart.indexOf('.') - lastpart.indexOf(numbers[2]) - 3);
        const newlink = 'link.' + folder + filename;
        console.log('newlink:' + newlink);
        data = data.replace(oldlink, newlink);
        fs.writeFileSync(file, data);
    };
});
