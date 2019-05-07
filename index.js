'use strict';

const { format } = require('util');
const dotenv = require('dotenv');
const kleur = require('kleur');
const path = require('path');
const pkg = require('read-pkg-up').sync();

const PREFIX = '[PM2]';
const rePM2ConfigVar = /^PM2_CONFIG_/i;

const logInfo = (msg, ...args) => console.error(kleur.green(PREFIX), format(msg, ...args));
const logError = (msg, ...args) => console.error(kleur.red(`${PREFIX}[ERROR]`), format(msg, ...args));

logInfo('Reading %s', path.resolve(process.cwd(), '.env'));
const { error } = dotenv.config();
if (error) {
  logError('Error:', error.message);
  if (error.code !== 'ENOENT') console.error(error.stack);
  process.exit(1);
}

module.exports = (options = {}) => {
  const config = readAppConfig();
  const startOptions = Object.assign({ name: pkg.name }, config, options);
  return [startOptions];
};

function readAppConfig(env = process.env) {
  return Object.entries(env).reduce((config, [key, value]) => {
    if (!rePM2ConfigVar.test(key)) return config;
    key = key.toLowerCase().replace(rePM2ConfigVar, '');
    if (key.startsWith('env')) return config;
    return Object.assign(config, { [key]: value });
  }, {});
}
