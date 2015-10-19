# manualfork
[![NPM](https://nodei.co/npm/manualfork.png?downloads=true)](https://nodei.co/npm/manualfork/)
[![NPM](https://nodei.co/npm-dl/manualfork.png?months=3&height=2)](https://nodei.co/npm/manualfork/)

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Dependency Status](https://david-dm.org/therebelrobot/manualfork.svg)](https://david-dm.org/therebelrobot/manualfork)

A node utility to manually clone Github repositories. *with bonus CLI!*

 Github, by design, restricts the number of times you can fork a repo into a single account. Even then, after forking, you are bound to the upstream in your repo page, which if you are doing an iterative work can sometimes be a hinderance to marketing. There are [hacks](https://adrianshort.org/create-multiple-forks-of-a-github-repo/) and [workarounds](http://therebelrobot.com/tech/2015/10/16/a-simple-method-to-fork-repos-more-than-once.html) for this, but **manualfork** allows you to manually clone a repo with a single command.

## Installation

```bash
npm i -g manualfork
```

Or if you want to use it in a program:

```bash
npm i manualfork
```

## Usage

To use manualfork, you'll need to generate a Github Personal Access Token, [found here](https://github.com/settings/tokens). You should only grant this token the permissions it needs, which is ***repo***. (If you discover it needs other permissions besides that, lemme know)

### CLI

```bash
manualfork account/repo to other-account/other-repo -u username -t token
```

If you add your username and token to your environment under the variables `GITHUB_USER` and `GITHUB_TOKEN`, the command below will do the same thing:

```bash
manualfork account/repo to other-account/other-repo
```

If you want to create the new repo from scratch, just add the flag `--create` or `-c`

```
Usage:
  manualfork [OPTIONS] [ARGS]

Options:
  -u, --user [STRING]    Your Github Username (Default is username-from-environment)
  -t, --token [STRING]   Your Github Access Token (Default is token-from-environment)
  -b, --branch [STRING]  branches to pull from:to (e.g. master:develop)  (Default is master:master)
  -f, --force BOOL       force push target branch
  -c, --create BOOL      create target repo on Github
  -k, --no-color         Omit color from output
      --debug            Show debug information
  -v, --version          Display the current version
  -h, --help             Display help and usage details
```

### API

```
var manualfork = require('manualfork')
var manualforkOpts = {
  username: username,
  token: token,
  host: 'github.com',
  source: source,
  target: target,
  create: true
}
manualfork.fork(manualforkOpts)
  .then(function (data) {
    console.log('manualfork was successful!')
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
