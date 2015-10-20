var buildUrl = require('./build-url')
var gitExec = require('./git-exec')

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

module.exports = cloneSource
