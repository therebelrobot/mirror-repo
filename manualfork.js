var fs = require('fs')
var ChildProcess = require('child_process')
var path = require('path')
var GitHubApi = require('github')
var gh
var Breeze = require('breeze')
var pkg = require('./package.json')

var ManualFork = {
  fork: function (opts) {
    return new Promise(function (resolve, reject) {
      /*
      opts: {
      username, // if same for both
      token, // if same for both
      host, // if same for both
      account, // if same for both
      repo, // if same for both
      source: {
      username,
      token,
      host,
      account,
      repo,
      },
      target: {
      username,
      token,
      host,
      account,
      repo,
        },
      tempFolder,
      ghOpts: {},
      create
      }
      */

      // build sane objects
      if (opts.username) {
        opts.source.username = opts.source.username || opts.username
        opts.target.username = opts.target.username || opts.username
      }
      if (opts.token) {
        opts.source.token = opts.source.token || opts.token
        opts.target.token = opts.target.token || opts.token
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
      gh = new GitHubApi({
        // required
        version: opts.target.apiVersion,
        // optional
        protocol: opts.target.apiProtocol,
        host: opts.target.api, // should be api.github.com for GitHub
        pathPrefix: opts.target.apiPrefix, // for some GHEs; none for GitHub
        // timeout: 5000,
        headers: {
          'user-agent': 'manualfork v' + pkg.version // GitHub is happy with a unique user agent
        }
      })
      var flow = new Breeze()
      if (opts.create) {
        flow.then(function (next) {
          next(createTarget({
            username: opts.username,
            token: opts.token,
            target: opts.target,
            ghOpts: opts.ghOpts
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
    gitExec: gitExec,
    toolsJoin: toolsJoin,
    deleteFolderRecursive: deleteFolderRecursive,
    deleteFolderRecursiveAsync: deleteFolderRecursiveAsync
  }
}

module.exports = ManualFork

function createTarget (opts) {
  return new Promise(function (resolve, reject) {
    gh.authenticate({
      type: 'token',
      token: opts.target.token
    })
    var msg = {
      name: opts.target.repo
    }
    if (opts.target.username !== opts.target.account) {
      msg.org = opts.target.account
      gh.repos.createFromOrg(msg, createCallback)
    } else {
      gh.repos.create(msg, createCallback)
    }
    function createCallback (err, data) {
      if (err) reject(err)
      resolve(data)
    }
  })
}

function cloneSource (opts) {
  return new Promise(function (resolve, reject) {
    var gitOpts = {}
    gitOpts.cwd = opts.tempFolder
    var rightNow = new Date()
    var tmpFolderName = opts.tempFolder + '/' + opts.source.account + '-' + opts.source.repo + '-' + rightNow.getTime()
    var path = buildUrl(opts.source.username, opts.source.token, opts.source.host, opts.source.account, opts.source.repo)
    // 'git clone https://username:token@source.host/source.account/source.repo.git tempFolder'
    var gitCommands = ['clone', '--bare', path, tmpFolderName]
    gitExec(gitCommands, gitOpts, function (err, data) {
      if (err) reject(err)
      resolve({results: data, tmpPath: tmpFolderName})
    })
  })
}
function pushTarget (opts) {
  return new Promise(function (resolve, reject) {
    var gitOpts = {}
    gitOpts.cwd = opts.tmpPath
    var path = buildUrl(opts.target.username, opts.target.token, opts.target.host, opts.target.account, opts.target.repo)
    // 'git push -u https://target.username:target.token@target.host/target.account/target.repo.git'
    var gitCommands = ['push', '--mirror', path]
    gitExec(gitCommands, gitOpts, function (err, data) {
      if (err) reject(err)
      resolve({results: data, tmpPath: opts.tmpPath})
    })
  })
}
function cleanTemp (opts) {
  return new Promise(function (resolve, reject) {
    // delete the temp folder
    // attempt at sync
    deleteFolderRecursive(opts.tmpPath)
    if (opts.tmpCreated) {
      deleteFolderRecursive(opts.tempFolder)
    }
    resolve()

  // //attempt at async
  // deleteFolderRecursiveAsync(opts.tmpPath, function (err,data){
  //   if(err) reject(err)
  //   resolve(data)
  // })
  })
}

function buildUrl (username, token, host, account, repo) {
  return 'https://' + username + ':' + token + '@' + host + '/' + account + '/' + repo + '.git'
}

// Internal helper to talk to the git subprocess
// From creationix/node-git https://github.com/creationix/node-git/blob/master/lib/git-fs.js#L187
// example commands: ["log", "-z", "--summary", version, "--", path]

function gitExec (commands, opts, callback) {
  if (!opts.encoding) {
    opts.encoding = 'utf8'
  }
  // commands = gitCommands.concat(commands)
  var options = {
    cwd: opts.cwd
  }
  var child = ChildProcess.spawn('git', commands, options)
  var stdout = []
  var stderr = []
  child.stdout.addListener('data', function (text) {
    stdout[stdout.length] = text
  })
  child.stderr.addListener('data', function (text) {
    stderr[stderr.length] = text
  })
  var exitCode
  child.addListener('exit', function (code) {
    exitCode = code
  })
  child.addListener('close', function () {
    if (exitCode > 0) {
      var err = new Error('git ' + commands.join(' ') + '\n' + toolsJoin(stderr, 'utf8'))
      callback(err)
      return
    }
    callback(null, toolsJoin(stdout, opts.encoding))
  })
  child.stdin.end()
}
// Also from creationix/node-git https://github.com/creationix/node-git/blob/master/lib/tools.js#L2
function toolsJoin (arr, encoding) {
  var result
  var index = 0
  var length
  length = arr.reduce(function (l, b) {
    return l + b.length
  }, 0)
  result = new Buffer(length)
  arr.forEach(function (b) {
    b.copy(result, index)
    index += b.length
  })
  if (encoding) {
    return result.toString(encoding)
  }
  return result
}

// helper function for removing a folder. http://www.geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
function deleteFolderRecursive (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}
function deleteFolderRecursiveAsync (path, callback) {
  fs.readdir(path, function (err, files) {
    if (err) {
      // Pass the error on to callback
      callback(err, [])
      return
    }
    var wait = files.length
    var count = 0
    var folderDone = function (err) {
      count++
      // If we cleaned out all the files, continue
      if (count >= wait || err) {
        fs.rmdir(path, callback)
      }
    }
    // Empty directory to bail early
    if (!wait) {
      folderDone()
      return
    }

    // Remove one or more trailing slash to keep from doubling up
    path = path.replace(/\/+$/, '')
    files.forEach(function (file) {
      var curPath = path + '/' + file
      fs.lstat(curPath, function (err, stats) {
        if (err) {
          callback(err, [])
          return
        }
        if (stats.isDirectory()) {
          deleteFolderRecursiveAsync(curPath, folderDone)
        } else {
          fs.unlink(curPath, folderDone)
        }
      })
    })
  })
}
