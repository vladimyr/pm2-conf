'use strict';

const { format } = require('util');
const { name } = require('./package.json');
const { pkg } = require('read-pkg-up').sync();
const dotenv = require('dotenv');
const kleur = require('kleur');
const path = require('path');

const colorMap = createColorLookup(kleur);
const rePM2ConfigVar = /^PM2_CONFIG_/i;

const logInfo = (msg, ...args) => log(kleur.cyan, msg, ...args);
const logError = (msg, ...args) => log(kleur.red, msg, ...args);

logInfo('Reading %s', path.resolve(process.cwd(), '.env'));
const { error } = dotenv.config();
if (error) {
  logError('Error:', error.message);
  if (error.code !== 'ENOENT') console.error(error.stack);
  process.exit(1);
}

module.exports = (options = {}) => {
  const envConfig = readEnvConfig();
  const config = Object.assign({ name: pkg.name }, pkg.pm2, envConfig, options);
  return [config];
};

function readEnvConfig(env = process.env) {
  return Object.entries(env).reduce((config, [key, value]) => {
    if (!rePM2ConfigVar.test(key)) return config;
    key = key.toLowerCase().replace(rePM2ConfigVar, '');
    if (key.startsWith('env')) return config;
    return Object.assign(config, { [key]: value });
  }, {});
}

function log(colorFn, msg, ...args) {
  const color = colorMap.get(colorFn);
  const prefix = kleur.inverse()[color]().bold(` ${name} `);
  return console.error(prefix, format(msg, ...args));
}

function createColorLookup(colors) {
  return Object.entries(colors).reduce((acc, [color, colorFn]) => {
    acc.set(colorFn, color);
    return acc;
  }, new Map());
}
