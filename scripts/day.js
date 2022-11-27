const webpack = require('webpack');
const baseConfig = require('./_webpack.config');
const path = require('path');
const fs = require('fs');
const { execSync } = require("child_process");
const chmod = require('chmod');

const SEP = '--------------------';
const _log = (...all) => console.log('--', ...all);
const _error = (...all) => console.error('--', ...all);

console.clear();

let [, , dayIn] = process.argv;
if (!dayIn) {
  if (!process.env.TODAY) {
    _error('Specify the day you wish to run e.g. npm run day 05');
    return;
  }
  dayIn = '' + new Date().getDate();
}

const day = dayIn.padStart(2, '0');

const absSrcPath = (d) => `${process.cwd()}/src/${d}.ts`;
const absDestPath = (d) => `${process.cwd()}/dist/${d}.js`;
const srcPath = (d) => `./src/${d}.ts`;
const destFile = (d) => `${d}.js`;

try {
  if (!fs.existsSync(absSrcPath(day))) {
    _error('You asked me to run day', day, 'but', absSrcPath(day), 'does not exist.');
    return;
  }
} catch (err) {
  _error('You asked me to run day', day, 'but accessing', absSrcPath(day), 'caused a bad thing', err);
}

_log('Running day', day, ', file', srcPath(day));

const makeConfig = (config) => {
  return Object.assign(config, {
    entry: `${srcPath(day)}`,
    output: Object.assign(config.output, {
      filename: `${destFile(day)}`,
      path: path.resolve(process.cwd(), 'dist'),
    })
  });
};

_log('Configuring compiler for', day, ', file', srcPath(day));
const compiler = webpack(makeConfig(baseConfig));

_log('Running compiler for', day, ', file', srcPath(day));

const handler = (err, stats) => {
  if (err) {
    _error(err);
    return;
  }

  _log(stats.toString({
    colors: true
  }));

  compiler.close((closeErr) => {
    _log('Compiler closed. Running day bundle', destFile(day));

    try {
      chmod(absDestPath(day), 500);

      _log(SEP);
      execSync(`node ${absDestPath(day)}`, {
        stdio: "inherit",
      });
      _log(SEP);
      
      _log(`${day} run execution complete.`);
    } catch (e) {
      _error(`${day} run execution failed.`, e);
    }
  });
};

const watchOptions = {
    ignored: ['**/*.js', '**/scripts', '**/node_modules'],
};

if (process.env.WATCH) {
  compiler.watch(watchOptions, handler) ;
} else {
  compiler.run(handler);
}
