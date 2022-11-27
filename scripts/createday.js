const path = require('path');
const fs = require('fs');
const chmod = require('chmod');

const _log = (...all) => console.log('--', ...all);
const _error = (...all) => console.error('--', ...all);

let [, , dayIn] = process.argv;
if (!dayIn) {
  if (!process.env.TODAY) {
    _error('Specify the day you wish to create e.g. npm run create-day 05');
    return;
  }
  dayIn = '' + new Date().getDate();
}

const day = dayIn.padStart(2, '0');

const absSrcPath = (d) => `${process.cwd()}/src/${d}.ts`;

try {
  if (fs.existsSync(absSrcPath(day))) {
    _error('You asked me to create day', day, 'but', absSrcPath(day), 'already exists.');
    return;
  }
} catch (err) {
  _error('You asked me to create day', day, 'but attempting to access', absSrcPath(day), 'caused a bad thing', err);
}

const templatePath = `${process.cwd()}/scripts/day.template`;
let content;
try {
  content = fs.readFileSync(templatePath).toString();
} catch(e) {
  _error(`Failed to read template content ${templatePath}`);
  return;
}

content = content.replaceAll(/\|XX\|/g, day);

try {
  fs.writeFileSync(absSrcPath(day), content);
} catch(e) {
  _error(`Failed to write template content to file ${absSrcPath(day)}`);
  return;
}

chmod(absSrcPath(day), 755);

_log(`Day created ${absSrcPath(day)}`);
