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

_log('Building', srcPath(day));

const makeConfig = (config) => {
  return Object.assign(config, {
    entry: `${srcPath(day)}`,
    output: Object.assign(config.output, {
      filename: `${destFile(day)}`,
      path: path.resolve(process.cwd(), 'dist'),
    })
  });  
};

const compiler = webpack(makeConfig(baseConfig));

const afterEmit = () => {
  try {
    chmod(absDestPath(day), 755);
    _log(SEP);
    execSync(`node ${absDestPath(day)}`, {
      stdio: "inherit",
    });
    _log(SEP);
    _log(`${day} execution complete.`);
  } catch (e) {
    _error(`${day} execution failed.`, e);
  }
};

compiler.hooks.shouldEmit.tap('ShouldEmitPlugin', (compilation) => {
  return !compilation.getStats().hasErrors();
});

compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => afterEmit());

const handler = (err, stats) => {
  if (err) {
    _error(err);
    return;
  }

  _log(stats.toString({
    colors: true
  }));

  if (!process.env.WATCH) {
    compiler.close((closeErr) => {
      if (closeErr) {
        _error('Compiler closed with error', closeErr);
        return;
      }
    });
  }
};

const watchOptions = {
    ignored: ['**/*.js', '**/scripts', '**/node_modules'],
};

if (process.env.WATCH) {
  compiler.watch(watchOptions, handler) ;
} else {
  compiler.run(handler);
}
