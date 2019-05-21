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

/**
 * Builds pm2 ecosystem configuration
 * @alias buildConfig
 * @param {StartOptions} [options={}] app start options
 * @return {array<StartOptions>} pm2 configuration
 * @example
 * const buildConfig = require('pm2-conf');
 * buildConfig({ name: 'my-app', script: require.resolve('./server') });
 * //=> pm2 ecosystem configuration
 */
module.exports = (options = {}) => {
  const envConfig = readEnvConfig();
  const config = Object.assign({ name: pkg.name }, pkg.pm2, envConfig, options);
  return [config];
};

/**
 * @name StartOptions
 * @typedef {import('pm2').StartOptions} StartOptions
 * @see https://github.com/Unitech/pm2/blob/3.5.0/types/index.d.ts#L294-L407
 */

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
