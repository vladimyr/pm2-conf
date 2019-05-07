# pm2-conf 
[![build status](https://badgen.net/travis/vladimyr/pm2-conf/master)](https://travis-ci.com/vladimyr/pm2-conf) [![install size](https://badgen.net/packagephobia/install/{{name})](https://packagephobia.now.sh/result?p={{name}) [![npm package version](https://badgen.net/npm/v/pm2-conf)](https://npm.im/pm2-conf) [![github license](https://badgen.net/github/license/vladimyr/pm2-conf)](https://github.com/vladimyr/pm2-conf/blob/master/LICENSE) [![js semistandard style](https://badgen.net/badge/code%20style/semistandard/pink)](https://github.com/Flet/semistandard)

> Build [PM2](https://github.com/Unitech/pm2) ecosystem config

## Install
```
$ npm i vladimyr/pm2-conf
```

## Usage

Modify your `ecosystem.config.js`:
```js
module.exports = require('pm2-conf')({
  // `name` is determined from `package.json`'s `name` property
  script: require.resolve('./server') 
});
```
