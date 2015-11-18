var fs = require('fs')
var path = require('path')
var GitHubApi = require('github')
var Breeze = require('breeze')
var pkg = require('./package.json')

var createTarget = require('./helpers/create-target')
var cloneSource = require('./helpers/clone-source')
var pushTarget = require('./helpers/push-target')
var cleanTemp = require('./helpers/clean-temp')
var buildUrl = require('./helpers/build-url')
var gitExec = require('./helpers/git-exec')

var mirror = {
  repo: function (opts) {
    return new Promise(function (resolve, reject) {
      // build sane objects
      if (opts.username) {
        opts.source.username = opts.source.username || opts.username
        opts.target.username = opts.target.username || opts.username
      }
      if (opts.token) {
        opts.source.token = opts.source.token || opts.token
        opts.target.token = opts.target.token || opts.token
      }
      if (opts.source.oauth) {
        opts.source.token = opts.source.oauth
        opts.source.oauth = true
      }
      if (opts.target.oauth) {
        opts.target.token = opts.target.oauth
        opts.target.oauth = true
      }
      if (opts.oauth) {
        opts.source.token = opts.source.token || opts.oauth
        opts.source.oauth = true
        opts.target.token = opts.target.token || opts.oauth
        opts.target.oauth = true
      }
      opts.tmpCreated = false
      opts.source.host = opts.source.host || opts.host || 'github.com'
      opts.target.host = opts.target.host || opts.host || 'github.com'
      opts.target.api = opts.target.api || opts.api || 'api.github.com'
      opts.target.apiVersion = opts.target.apiVersion || opts.apiVersion || '3.0.0'
      opts.target.apiPrefix = opts.target.apiPrefix || opts.apiPrefix || '/'
      opts.target.apiProtocol = opts.target.apiProtocol || opts.apiProtocol || 'https'
      if (opts.account) {
        opts.source.account = opts.source.account || opts.account
        opts.target.account = opts.target.account || opts.account
      }
      if (opts.repo) {
        opts.source.repo = opts.source.repo || opts.repo
        opts.target.repo = opts.target.repo || opts.repo
      }
      opts.tempFolder = opts.tempFolder ? path.resolve(process.cwd(), opts.tempFolder) : path.resolve(__dirname, './tmp')
      try {
        var folderStats = fs.statSync(opts.tempFolder)
        if (!folderStats.isDirectory()) {
          reject('Temporary path is not a directory.')
        }
      } catch (e) {
        opts.tmpCreated = true
        fs.mkdirSync(opts.tempFolder)
      }

      // create target on Github
      var gh = new GitHubApi({
        // required
        version: opts.target.apiVersion,
        // optional
        protocol: opts.target.apiProtocol,
        host: opts.target.api, // should be api.github.com for GitHub
        pathPrefix: opts.target.apiPrefix, // for some GHEs; none for GitHub
        // timeout: 5000,
        headers: {
          'user-agent': 'mirror v' + pkg.version // GitHub is happy with a unique user agent
        }
      })
      var flow = new Breeze()
      if (opts.create) {
        flow.then(function (next) {
          next(createTarget({
            username: opts.username,
            token: opts.token,
            target: opts.target,
            ghOpts: opts.ghOpts,
            gh:gh
          }))
        })
      }
      // clone repo from source to a temp folder
      flow.then(function (next, data) {
        next(cloneSource({
          source: opts.source,
          tempFolder: opts.tempFolder
        }))
      })
      // push temp folder to target
      flow.then(function (next, data) {
        next(pushTarget({
          source: opts.source,
          target: opts.target,
          tmpPath: data.tmpPath
        }))
      })
      // clean up temp
      flow.then(function (next, data) {
        next(cleanTemp({
          tmpCreated: opts.tmpCreated,
          tempFolder: opts.tempFolder,
          tmpPath: opts.tmpPath
        }))
      })
      // exit gracefully
      flow.then(function (next, data) {
        resolve()
      })
      flow.catch(function (error) {
        cleanTemp({
          tmpCreated: opts.tmpCreated,
          tempFolder: opts.tempFolder,
          tmpPath: opts.tmpPath
        }).then(function () {
          reject(error)
        })
      })
    })
  },
  _internal: { // for testing
    createTarget: createTarget,
    cloneSource: cloneSource,
    pushTarget: pushTarget,
    cleanTemp: cleanTemp,
    buildUrl: buildUrl,
    gitExec: gitExec
  }
}

module.exports = mirror
