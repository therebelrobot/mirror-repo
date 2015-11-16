# mirror
[![NPM](https://nodei.co/npm/mirror.png?downloads=true)](https://nodei.co/npm/mirror/)
[![NPM](https://nodei.co/npm-dl/mirror.png?months=3&height=2)](https://nodei.co/npm/mirror/)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Dependency Status](https://david-dm.org/therebelrobot/mirror.svg)](https://david-dm.org/therebelrobot/mirror)

A node utility to manually clone Github repositories. *with bonus CLI!*

 Github, by design, restricts the number of times you can fork a repo into a single account. Even then, after forking, you are bound to the upstream in your repo page, which if you are doing an iterative work can sometimes be a hinderance to marketing. There are [hacks](https://adrianshort.org/create-multiple-forks-of-a-github-repo/) and [workarounds](https://help.github.com/articles/duplicating-a-repository/) for this, but **mirror** allows you to manually clone a repo with a single command.

## Installation

```bash
npm i -g mirror
```

Or if you want to use it in a program:

```bash
npm i mirror
```

## Usage

To use mirror, you'll need to generate a Github Personal Access Token, [found here](https://github.com/settings/tokens). You should only grant this token the permissions it needs, which is ***repo***. (If you discover it needs other permissions besides that, lemme know)

### CLI

```bash
mirror account/repo to other-account/other-repo -u username -t token
```

If you add your username and token to your environment under the variables `GITHUB_USER` and `GITHUB_TOKEN`, the command below will do the same thing:

```bash
mirror account/repo to other-account/other-repo
```

If you want to create the new repo from scratch, just add the flag `--create` or `-c`

```
Usage:
  mirror [OPTIONS] [ARGS]

Options:
  -u, --user [STRING]    Your Github Username (Default is username-from-environment)
  -t, --token [STRING]   Your Github Access Token (Default is token-from-environment)
  -f, --force BOOL       force push target branch
  -c, --create BOOL      create target repo on Github
  -k, --no-color         Omit color from output
      --debug            Show debug information
  -v, --version          Display the current version
  -h, --help             Display help and usage details
```

### API

```
var mirror = require('mirror')
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
mirror.fork(mirrorOpts)
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
