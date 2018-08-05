const commandLineArgs = require('command-line-args');
const childProcess = require('child_process');

function launchPolyserve(isDev) {
  const spawn = childProcess.spawn;

  const apiPath = process.env.API || 'http://localhost:3000/';
  const options = [
    'serve',
    '--hostname=0.0.0.0',
    '--compile=never',
    '--proxy-path=api',
    `--proxy-target=${apiPath}`];
  if (!isDev) {
    options.push('--root=build/esm-bundled');
  }
  const prc = spawn('polymer', options);

  prc.stdout.setEncoding('utf8');
  prc.stdout.on('data', (data) => {
    const str = data.toString();
    const lines = str.split(/(\r?\n)/g);
    console.log(lines.join(''));
  });

  prc.on('close', (code) => {
    console.log(`process exit code ${code}`);
  });
}

const optionDefinitions = [
  { name: 'dev', alias: 'd', type: Boolean },
];

const options = commandLineArgs(optionDefinitions);

launchPolyserve(options.dev);
