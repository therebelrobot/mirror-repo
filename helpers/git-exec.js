var ChildProcess = require('child_process')

// Internal helper to talk to the git subprocess
// From creationix/node-git https://github.com/creationix/node-git/blob/master/lib/git-fs.js#L187
// example commands: ["log", "-z", "--summary", version, "--", path]

function gitExec (commands, opts, callback) {
  if (!opts.encoding) {
    opts.encoding = 'utf8'
  }
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

module.exports = gitExec

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
