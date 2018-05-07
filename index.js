#!/usr/bin/env node

const program = require('commander');
const util = require('util');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const matrix = require('./lib/matrix');
const package = require('./package.json');

program
  .version(package.version);

program
  .command('generate <yamlFile>')
  .description('Generate the html for coverage matrix')
  .action(function (yamlFile, cmd, options) {
    try {
      const acc = new matrix(yamlFile);
      const fullACC = acc.getFullMatrix();
      const template = fs.readFileSync(path.join(__dirname, 'lib/templates/table.hbs'), 'utf8');
      const compiledTemplate = handlebars.compile(template);
      fs.writeFileSync('output.html', compiledTemplate({body: fullACC, attributes: acc.getMatrix().attributes}), 'utf8');
      console.log('Covereye report generate at output.html. Type `open output.html` to open it.');
    } catch (e) {
      console.log(e);
    }
  });

program.parse(process.argv);

if (!program.args.length) program.help();

