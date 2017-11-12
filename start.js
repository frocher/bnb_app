const commandLineArgs = require('command-line-args');
const proxy = require('express-http-proxy');

const optionDefinitions = [
  { name: 'dev', alias: 'd', type: Boolean }
];

const options = commandLineArgs(optionDefinitions);

if (options.dev) {
  launchPolyserve();
}
else {
  launchPrplServer();
}

function launchPolyserve() {
  const spawn = require('child_process').spawn;

  const apiPath = process.env.API || 'http://localhost:3000/';
  const options = [
    'serve',
    '--proxy-path=api',
    `--proxy-target=${apiPath}`];
  const prc = spawn('polymer', options);

  prc.stdout.setEncoding('utf8');
  prc.stdout.on('data', function (data) {
      const str = data.toString()
      const lines = str.split(/(\r?\n)/g);
      console.log(lines.join(""));
  });

  prc.on('close', function (code) {
      console.log('process exit code ' + code);
  });
}

function launchPrplServer() {
  const fs = require('fs');
  const express = require('express');
  const logger = require('morgan');
  const compression = require('compression');
  const prpl = require('prpl-server');

  const app = express();
  app.disable('x-powered-by');

  app.use(compression());
  app.use(logger('dev'));

  const apiPath = process.env.API || 'localhost:3000';
  app.use('/api', proxy(apiPath));
  app.use('/auth', proxy(`${apiPath}/auth/`));
  app.use('/omniauth', proxy(`${apiPath}/omniauth`));

  let config = JSON.parse(fs.readFileSync('build/polymer.json', 'utf8'));
  app.get('/*', prpl.makeHandler('build', config));

  const port = normalizePort(process.env.PORT || '8080');
  app.listen(port);
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
