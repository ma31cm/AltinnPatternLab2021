'use strict';

const fs = require('fs');
const path = require('path');
const Concat = require('concat-with-sourcemaps');
const buildConfig = require('./buildconfig.json');

const dest = './test';
const maps = './test/maps';

if (!fs.existsSync(dest)){
    fs.mkdirSync(dest);
}
if (!fs.existsSync(maps)){
    fs.mkdirSync(maps);
}

buildConfig.production.forEach(function(element) {
    if(element.javascript) {
        element.javascript.forEach(function(bundle) {

            let concat = new Concat(true, bundle.filename, '\n');
            bundle.files.forEach(function(file) {
                try {
                    const data = fs.readFileSync(file, 'utf8');
                    concat.add(path.basename(file), data);
                } catch (err) {
                    console.error(err);
                }
            });
            concat.add(null, '//# sourceMappingURL=maps/' + bundle.filename + '.map');

            fs.writeFile('test/' + bundle.filename, concat.content, (err) => {
                if (err) throw err;
            });
            fs.writeFile('test/maps/' + bundle.filename + ".map", concat.sourceMap, (err) => {
                if (err) throw err;
            });
        });
    }
});