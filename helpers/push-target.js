var buildUrl = require('./build-url')
var gitExec = require('./git-exec')

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

module.exports = pushTarget
