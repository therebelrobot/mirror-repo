# mirror-repo
[![NPM](https://nodei.co/npm/mirror-repo.png?downloads=true)](https://nodei.co/npm/mirror-repo/)
[![NPM](https://nodei.co/npm-dl/mirror-repo.png?months=3&height=2)](https://nodei.co/npm/mirror-repo/)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Dependency Status](https://david-dm.org/therebelrobot/mirror.svg)](https://david-dm.org/therebelrobot/mirror)

A node utility to manually clone Github repositories.

 Github, by design, restricts the number of times you can fork a repo into a single account. Even then, after forking, you are bound to the upstream in your repo page, which if you are doing an iterative work can sometimes be a hinderance to marketing. There are [hacks](https://adrianshort.org/create-multiple-forks-of-a-github-repo/) and [workarounds](https://help.github.com/articles/duplicating-a-repository/) for this, but **mirror** allows you to manually clone a repo with a single command.

## Installation

```bash
npm i mirror-repo
```

## Usage

To use mirror, you'll need to generate a Github Personal Access Token, [found here](https://github.com/settings/tokens). You should only grant this token the permissions it needs, which is ***repo***. (If you discover it needs other permissions besides that, lemme know)

### API

```
var mirror = require('mirror-repo')
var mirrorOpts = {
  username: username,
  token: token,
  host: 'github.com',
  source: {
    account: 'other-user',
    repo: 'other-repo'
  },
  target: {
    account: 'your-user',
    repo: 'your-repo'
  },
  create: true
}
mirror.repo(mirrorOpts)
  .then(function (data) {
    console.log('mirror was successful!')
  })
  .catch(function (err) {
    console..error(err)
  })
```
## Contributing

### What is needed

Moar tests

## License

ISC
