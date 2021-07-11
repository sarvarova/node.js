const program = require('commander');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const arrayUniq = require('array-uniq');

program
  .version('1.0.0')
  .option('-o, --outputdir [name]', 'Directory with sorted files witn name [output]', 'output')
  .option('-i, --inputdir [name]', 'Directory for sorting files with name [input]', 'input')
  .parse(process.argv);

console.log(program.outputdir);
console.log(program.inputdir);

const inputDir = './' + program.inputdir;
const outputDir = './' + program.outputdir;
let dirNames = [];

// если папка существует - очистим, если нет, то создадим
const createNewDir = (directoryName) => { 
  if (fs.existsSync(outputDir)) {
    console.log('Folder exist');
    fse.removeSync(directoryName);

    fs.mkdir(directoryName, (err) => {
      if (err) {
        console.log('Error');
      }
      console.log('Folder is empty');
    }); 
  } else {
    fs.mkdir(directoryName, (err) => {
      if (err) {
        console.log('Error');
      }
      console.log('Folder created');
    });
  }
};

// 
const readDir = (inputDir, level) => {
  const files = fs.readdirSync(inputDir);

  files.forEach((item) => {
    let localBase = path.join(inputDir, item);
    let state = fs.statSync(localBase);
    if (state.isDirectory()) {
      readDir(localBase, level + 1);
    } else {
      dirNames.push(item[0]);
    }
  });
};

//
const createDir = (directoriesNames) => {
  let uniqLetter = arrayUniq(directoriesNames);
  uniqLetter.forEach((item, i, arr) => {
    fs.mkdirSync(path.join(outputDir, item));
  });
};

// Copying files
const copyFiles = (inputDir, outputDir) => {
  const files = fs.readdirSync(inputDir);

  files.forEach((item) => {
    let localBase = path.join(inputDir, item);
    let state = fs.statSync(localBase);
    if (state.isDirectory()) {
      copyFiles(localBase, outputDir);
    } else {
      //fs.writeFileSync(outputDir + '/' + item[0] + '/' + item, fs.readFileSync(localBase));
      fs.writeFileSync(path.join(outputDir, item[0], item), fs.readFileSync(localBase));
    }
  });
};

createNewDir(outputDir);
readDir(inputDir, 0);
createDir(dirNames);
copyFiles(inputDir, outputDir);